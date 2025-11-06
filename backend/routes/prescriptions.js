const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/prescriptions');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  }
});

// @route   POST /api/prescriptions/upload
// @desc    Upload and process prescription image
// @access  Private
router.post('/upload', protect, upload.single('prescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a file' 
      });
    }

    const imageUrl = `/uploads/prescriptions/${req.file.filename}`;
    const imagePath = req.file.path;

    // Perform OCR on the image with enhanced settings
    console.log('Processing prescription image with OCR...');
    console.log('Image path:', imagePath);
    
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/ '
    });
    
    console.log('OCR completed. Extracted text length:', text.length);
    console.log('First 500 characters:', text.substring(0, 500));

    // Extract medicine information using pattern matching
    const medicines = extractMedicinesFromText(text);

    // Extract other information
    const doctorName = extractDoctorName(text);
    const hospitalName = extractHospitalName(text);

    // Create prescription record
    const prescription = await Prescription.create({
      user: req.user.id,
      imageUrl,
      extractedText: text,
      medicines,
      doctorName,
      hospitalName,
      ...req.body
    });

    res.status(201).json({
      success: true,
      prescription,
      extractedText: text,
      medicines
    });
  } catch (error) {
    console.error('Prescription upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing prescription', 
      error: error.message 
    });
  }
});

// @route   GET /api/prescriptions
// @desc    Get all prescriptions for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching prescriptions', 
      error: error.message 
    });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    // Check ownership
    if (prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      prescription
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching prescription', 
      error: error.message 
    });
  }
});

// @route   POST /api/prescriptions/:id/add-medicines
// @desc    Add all medicines from prescription to medicine list at once with timestamp
// @access  Private
router.post('/:id/add-medicines', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    // Check ownership
    if (prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Skip if extraction failed
    if (prescription.medicines.length === 1 && prescription.medicines[0].name === 'Unable to extract') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add medicines - OCR extraction failed. Please add manually.'
      });
    }

    const currentTimestamp = new Date();
    const addedMedicines = [];

    // Prepare all medicines with same timestamp
    const medicinesToAdd = prescription.medicines.map(med => ({
      user: req.user.id,
      name: med.name,
      dosage: med.dosage,
      frequency: parseFrequency(med.frequency),
      prescriptionId: prescription._id,
      notes: `Added from prescription on ${currentTimestamp.toLocaleDateString()} at ${currentTimestamp.toLocaleTimeString()}`,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    }));

    // Bulk insert all medicines at once
    const medicines = await Medicine.insertMany(medicinesToAdd);
    
    res.json({
      success: true,
      message: `${medicines.length} medicine(s) added successfully`,
      medicines: medicines,
      addedAt: currentTimestamp,
      count: medicines.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding medicines', 
      error: error.message 
    });
  }
});

// Helper functions for text extraction
function extractMedicinesFromText(text) {
  const medicines = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  console.log('Extracted text lines:', lines);
  
  // Enhanced medicine patterns
  const patterns = [
    // Pattern 1: Medicine name followed by dosage (e.g., "Paracetamol 500mg")
    /([A-Z][a-zA-Z]{2,})\s*[-:]?\s*(\d+\s*(?:mg|ml|g|mcg|iu))/gi,
    // Pattern 2: Tab/Cap followed by medicine name (e.g., "Tab. Paracetamol 500mg")
    /(?:Tab|Cap|Syrup|Inj|Tablet|Capsule)[.\s]*([A-Z][a-zA-Z]{2,})\s*(\d+\s*(?:mg|ml|g|mcg|iu))?/gi,
    // Pattern 3: Medicine name with numbers (e.g., "Paracetamol500")
    /([A-Z][a-zA-Z]{2,})(\d+)/gi,
    // Pattern 4: Just medicine names (at least 4 chars, capitalized)
    /\b([A-Z][a-zA-Z]{3,}(?:\s+[A-Z][a-zA-Z]+)?)\b/g
  ];
  
  const medicineKeywords = ['tab', 'cap', 'syrup', 'tablet', 'capsule', 'mg', 'ml', 'injection', 'inj', 'drops', 'ointment', 'cream'];
  const skipWords = ['patient', 'doctor', 'hospital', 'clinic', 'date', 'prescription', 'name', 'age', 'address', 'phone', 'email', 'diagnosis', 'advice', 'follow', 'signature'];
  
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    
    // Check if line likely contains medicine info
    const hasMedicineKeyword = medicineKeywords.some(keyword => lowerLine.includes(keyword));
    const hasSkipWord = skipWords.some(word => lowerLine.includes(word));
    
    if (hasSkipWord) return;
    
    // Try each pattern
    for (const pattern of patterns) {
      const matches = [...line.matchAll(pattern)];
      
      matches.forEach(match => {
        let name = match[1]?.trim();
        let dosage = match[2]?.trim() || '';
        
        if (!name || name.length < 3) return;
        
        // Clean up the name
        name = name.replace(/[^\w\s]/g, '').trim();
        
        // Skip if it's a common word
        if (skipWords.includes(name.toLowerCase())) return;
        
        // Extract frequency and duration from the same line or next line
        let frequency = extractFrequency(line);
        let duration = extractDuration(line);
        
        // Check next line for additional info
        if (index + 1 < lines.length) {
          const nextLine = lines[index + 1];
          if (!frequency || frequency === 'As prescribed') {
            frequency = extractFrequency(nextLine);
          }
          if (!duration || duration === 'As prescribed') {
            duration = extractDuration(nextLine);
          }
        }
        
        // Add dosage unit if missing
        if (dosage && !dosage.match(/mg|ml|g|mcg|iu/i)) {
          dosage += 'mg';
        }
        
        // Check if medicine already exists
        const exists = medicines.find(m => 
          m.name.toLowerCase() === name.toLowerCase()
        );
        
        if (!exists) {
          medicines.push({
            name: name,
            dosage: dosage || 'As prescribed',
            frequency: frequency,
            duration: duration
          });
        }
      });
    }
  });
  
  // If no medicines found, try a more aggressive approach
  if (medicines.length === 0) {
    console.log('No medicines found with patterns, trying aggressive extraction...');
    
    lines.forEach(line => {
      // Look for any capitalized words that might be medicine names
      const words = line.split(/\s+/);
      words.forEach((word, idx) => {
        if (word.length >= 4 && /^[A-Z]/.test(word)) {
          const cleanWord = word.replace(/[^\w]/g, '');
          if (cleanWord.length >= 4 && !skipWords.includes(cleanWord.toLowerCase())) {
            // Check if next word is a dosage
            let dosage = 'As prescribed';
            if (idx + 1 < words.length) {
              const nextWord = words[idx + 1];
              if (nextWord.match(/\d+\s*(?:mg|ml|g|mcg)/i)) {
                dosage = nextWord;
              }
            }
            
            const exists = medicines.find(m => 
              m.name.toLowerCase() === cleanWord.toLowerCase()
            );
            
            if (!exists) {
              medicines.push({
                name: cleanWord,
                dosage: dosage,
                frequency: extractFrequency(line),
                duration: extractDuration(line)
              });
            }
          }
        }
      });
    });
  }
  
  console.log('Extracted medicines:', medicines);
  
  return medicines.length > 0 ? medicines : [{ 
    name: 'Unable to extract', 
    dosage: 'Please enter manually - OCR could not identify medicines',
    frequency: 'As prescribed',
    duration: 'As prescribed'
  }];
}

function extractFrequency(text) {
  if (text.match(/once.*day|1.*day|OD/i)) return 'Once daily';
  if (text.match(/twice.*day|2.*day|BD/i)) return 'Twice daily';
  if (text.match(/thrice.*day|3.*day|TDS/i)) return 'Thrice daily';
  if (text.match(/four.*day|4.*day|QID/i)) return 'Four times daily';
  return 'As prescribed';
}

function extractDuration(text) {
  const durationMatch = text.match(/(\d+)\s*(day|week|month)/i);
  return durationMatch ? `${durationMatch[1]} ${durationMatch[2]}s` : 'As prescribed';
}

function extractDoctorName(text) {
  const drPattern = /Dr\.?\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/;
  const match = text.match(drPattern);
  return match ? match[1] : 'Not specified';
}

function extractHospitalName(text) {
  const hospitalPattern = /(Hospital|Clinic|Medical Center|Healthcare)[\s\S]{0,50}/i;
  const match = text.match(hospitalPattern);
  return match ? match[0].trim() : 'Not specified';
}

function parseFrequency(freqText) {
  const freq = freqText.toLowerCase();
  if (freq.includes('once')) return 'once_daily';
  if (freq.includes('twice')) return 'twice_daily';
  if (freq.includes('thrice') || freq.includes('three')) return 'thrice_daily';
  return 'as_needed';
}

module.exports = router;
