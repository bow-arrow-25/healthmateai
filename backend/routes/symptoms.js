const express = require('express');
const router = express.Router();
const axios = require('axios');
const SymptomLog = require('../models/SymptomLog');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Symptom database with conditions and medicines
const symptomDatabase = {
  headache: {
    conditions: [
      { name: 'Migraine', probability: 0.7, description: 'Severe headache often with nausea' },
      { name: 'Tension Headache', probability: 0.8, description: 'Mild to moderate headache' },
      { name: 'Hypertension', probability: 0.4, description: 'High blood pressure' }
    ],
    medicines: [
      { name: 'Ibuprofen', type: 'OTC', dosage: '400mg' },
      { name: 'Paracetamol', type: 'OTC', dosage: '500mg' }
    ]
  },
  fever: {
    conditions: [
      { name: 'Viral Infection', probability: 0.8, description: 'Common cold or flu' },
      { name: 'Bacterial Infection', probability: 0.5, description: 'May require antibiotics' }
    ],
    medicines: [
      { name: 'Paracetamol', type: 'OTC', dosage: '500mg' },
      { name: 'Ibuprofen', type: 'OTC', dosage: '400mg' }
    ]
  },
  cough: {
    conditions: [
      { name: 'Common Cold', probability: 0.7, description: 'Viral upper respiratory infection' },
      { name: 'Bronchitis', probability: 0.5, description: 'Inflammation of bronchial tubes' },
      { name: 'Asthma', probability: 0.3, description: 'Chronic respiratory condition' }
    ],
    medicines: [
      { name: 'Dextromethorphan', type: 'OTC', dosage: '15mg' },
      { name: 'Honey and Lemon', type: 'Natural', dosage: 'As needed' }
    ]
  },
  'sore throat': {
    conditions: [
      { name: 'Pharyngitis', probability: 0.8, description: 'Throat inflammation' },
      { name: 'Strep Throat', probability: 0.4, description: 'Bacterial throat infection' }
    ],
    medicines: [
      { name: 'Throat Lozenges', type: 'OTC', dosage: 'As needed' },
      { name: 'Warm Salt Water Gargle', type: 'Natural', dosage: '3-4 times daily' }
    ]
  },
  nausea: {
    conditions: [
      { name: 'Gastritis', probability: 0.6, description: 'Stomach inflammation' },
      { name: 'Food Poisoning', probability: 0.5, description: 'Foodborne illness' }
    ],
    medicines: [
      { name: 'Ondansetron', type: 'Prescription', dosage: '4mg' },
      { name: 'Ginger Tea', type: 'Natural', dosage: 'As needed' }
    ]
  },
  fatigue: {
    conditions: [
      { name: 'Anemia', probability: 0.5, description: 'Low iron levels' },
      { name: 'Thyroid Disorder', probability: 0.4, description: 'Thyroid dysfunction' },
      { name: 'Sleep Deprivation', probability: 0.7, description: 'Lack of adequate sleep' }
    ],
    medicines: [
      { name: 'Iron Supplements', type: 'OTC', dosage: '65mg' },
      { name: 'Vitamin B12', type: 'OTC', dosage: '1000mcg' }
    ]
  },
  'chest pain': {
    conditions: [
      { name: 'Angina', probability: 0.6, description: 'Heart-related chest pain - SEEK IMMEDIATE MEDICAL ATTENTION' },
      { name: 'Acid Reflux', probability: 0.5, description: 'GERD' },
      { name: 'Muscle Strain', probability: 0.4, description: 'Muscular pain' }
    ],
    medicines: [
      { name: 'Aspirin', type: 'OTC', dosage: '325mg (if cardiac)' },
      { name: 'Antacids', type: 'OTC', dosage: 'As directed' }
    ],
    urgent: true
  },
  dizziness: {
    conditions: [
      { name: 'Vertigo', probability: 0.6, description: 'Inner ear problem' },
      { name: 'Low Blood Pressure', probability: 0.5, description: 'Hypotension' },
      { name: 'Dehydration', probability: 0.7, description: 'Lack of fluids' }
    ],
    medicines: [
      { name: 'Oral Rehydration Solution', type: 'OTC', dosage: 'As needed' },
      { name: 'Meclizine', type: 'OTC', dosage: '25mg' }
    ]
  },
  'abdominal pain': {
    conditions: [
      { name: 'Gastritis', probability: 0.6, description: 'Stomach inflammation' },
      { name: 'IBS', probability: 0.5, description: 'Irritable Bowel Syndrome' },
      { name: 'Appendicitis', probability: 0.2, description: 'Requires immediate medical attention' }
    ],
    medicines: [
      { name: 'Antacids', type: 'OTC', dosage: 'As directed' },
      { name: 'Probiotics', type: 'OTC', dosage: 'Daily' }
    ]
  },
  rash: {
    conditions: [
      { name: 'Allergic Reaction', probability: 0.7, description: 'Skin allergy' },
      { name: 'Eczema', probability: 0.5, description: 'Chronic skin condition' },
      { name: 'Contact Dermatitis', probability: 0.6, description: 'Skin irritation' }
    ],
    medicines: [
      { name: 'Antihistamine', type: 'OTC', dosage: '10mg' },
      { name: 'Hydrocortisone Cream', type: 'OTC', dosage: 'Apply twice daily' }
    ]
  }
};

// @route   POST /api/symptoms/check
// @desc    Check symptoms (public or authenticated)
// @access  Public/Private
router.post('/check', async (req, res) => {
  try {
    const { symptoms, duration } = req.body;
    const userId = req.headers.authorization ? req.user?.id : null;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide symptoms' 
      });
    }

    let conditionScores = {};
    let allMedicines = [];
    let isUrgent = false;

    // Analyze each symptom
    symptoms.forEach(symptom => {
      const symptomKey = symptom.name.toLowerCase();
      const symptomData = symptomDatabase[symptomKey];

      if (symptomData) {
        // Check if urgent
        if (symptomData.urgent) {
          isUrgent = true;
        }

        // Aggregate condition probabilities
        symptomData.conditions.forEach(condition => {
          if (!conditionScores[condition.name]) {
            conditionScores[condition.name] = {
              ...condition,
              score: 0
            };
          }
          conditionScores[condition.name].score += condition.probability * (symptom.severity === 'severe' ? 1.5 : 1);
        });

        // Collect medicines
        allMedicines = [...allMedicines, ...symptomData.medicines];
      }
    });

    // Sort conditions by score
    const possibleConditions = Object.values(conditionScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Remove duplicate medicines
    const uniqueMedicines = Array.from(
      new Map(allMedicines.map(med => [med.name, med])).values()
    );

    // Check if user needs doctor visit
    let needsDoctorVisit = false;
    let doctorVisitReason = '';

    if (isUrgent) {
      needsDoctorVisit = true;
      doctorVisitReason = 'Urgent symptoms detected. Please seek immediate medical attention.';
    } else if (duration && duration.value >= 7 && duration.unit === 'days') {
      needsDoctorVisit = true;
      doctorVisitReason = 'Symptoms persisting for more than a week. Please consult a doctor.';
    } else if (possibleConditions[0]?.score > 1.5) {
      needsDoctorVisit = true;
      doctorVisitReason = 'Multiple severe symptoms detected. Medical consultation recommended.';
    }

    // Check user's existing conditions if authenticated
    let contextualAdvice = '';
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.existingConditions.length > 0) {
        const relatedConditions = user.existingConditions.filter(ec =>
          possibleConditions.some(pc => pc.name.toLowerCase().includes(ec.name.toLowerCase()))
        );
        if (relatedConditions.length > 0) {
          contextualAdvice = `⚠️ These symptoms may be related to your existing condition(s): ${relatedConditions.map(c => c.name).join(', ')}. Please follow your doctor's care plan and monitor closely.`;
        }
      }
    }

    // Save symptom log (for both authenticated and non-authenticated users)
    try {
      await SymptomLog.create({
        user: userId || null, // Save with user ID if available, null otherwise
        symptoms,
        possibleConditions,
        suggestedMedicines: uniqueMedicines,
        duration,
        needsDoctorVisit,
        doctorVisitReason,
        isUrgent
      });
    } catch (logError) {
      console.error('Error saving symptom log:', logError.message);
      // Don't fail the request if logging fails
    }

    // Add general health advice based on symptoms
    if (!contextualAdvice) {
      if (needsDoctorVisit) {
        contextualAdvice = '🏥 Based on your symptoms, we recommend consulting a healthcare professional for proper diagnosis and treatment.';
      } else {
        contextualAdvice = '💡 Monitor your symptoms. If they worsen or persist, please consult a doctor. Stay hydrated and get adequate rest.';
      }
    }

    res.json({
      success: true,
      possibleConditions,
      suggestedMedicines: uniqueMedicines,
      needsDoctorVisit,
      doctorVisitReason,
      contextualAdvice,
      isUrgent
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking symptoms', 
      error: error.message 
    });
  }
});

// @route   GET /api/symptoms/history
// @desc    Get symptom history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const logs = await SymptomLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(50);

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching history', 
      error: error.message 
    });
  }
});

// @route   GET /api/symptoms/suggestions
// @desc    Get symptom suggestions for autocomplete
// @access  Public
router.get('/suggestions', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.json({ success: true, suggestions: [] });
  }

  const suggestions = Object.keys(symptomDatabase)
    .filter(symptom => symptom.toLowerCase().includes(query.toLowerCase()))
    .map(symptom => ({
      name: symptom,
      displayName: symptom.charAt(0).toUpperCase() + symptom.slice(1)
    }));

  res.json({
    success: true,
    suggestions
  });
});

module.exports = router;
