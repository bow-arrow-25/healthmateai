const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');

// @route   GET /api/medicines
// @desc    Get all medicines for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user.id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      medicines
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching medicines', 
      error: error.message 
    });
  }
});

// @route   POST /api/medicines
// @desc    Add a new medicine
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const medicineData = {
      ...req.body,
      user: req.user.id
    };

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      medicine
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding medicine', 
      error: error.message 
    });
  }
});

// @route   PUT /api/medicines/:id
// @desc    Update medicine
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false, 
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      medicine
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating medicine', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete medicine (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ 
        success: false, 
        message: 'Medicine not found' 
      });
    }

    // Check ownership
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    medicine.isActive = false;
    await medicine.save();

    res.json({
      success: true,
      message: 'Medicine removed'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting medicine', 
      error: error.message 
    });
  }
});

// Medicine database for suggestions
const medicineDatabase = {
  'hypertension': ['Lisinopril', 'Amlodipine', 'Losartan', 'Metoprolol', 'Hydrochlorothiazide'],
  'diabetes': ['Metformin', 'Glipizide', 'Insulin', 'Sitagliptin', 'Empagliflozin'],
  'asthma': ['Albuterol', 'Fluticasone', 'Montelukast', 'Budesonide', 'Salmeterol'],
  'anxiety': ['Sertraline', 'Escitalopram', 'Alprazolam', 'Buspirone', 'Lorazepam'],
  'depression': ['Fluoxetine', 'Sertraline', 'Escitalopram', 'Bupropion', 'Venlafaxine'],
  'arthritis': ['Ibuprofen', 'Naproxen', 'Celecoxib', 'Methotrexate', 'Prednisone'],
  'migraine': ['Sumatriptan', 'Rizatriptan', 'Propranolol', 'Topiramate', 'Amitriptyline'],
  'allergies': ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Diphenhydramine', 'Montelukast'],
  'gerd': ['Omeprazole', 'Pantoprazole', 'Ranitidine', 'Famotidine', 'Esomeprazole'],
  'thyroid': ['Levothyroxine', 'Liothyronine', 'Methimazole', 'Propylthiouracil']
};

// @route   GET /api/medicines/suggestions
// @desc    Get medicine suggestions based on condition
// @access  Public
router.get('/suggestions/:condition', (req, res) => {
  try {
    const condition = req.params.condition.toLowerCase();
    const suggestions = medicineDatabase[condition] || [];

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching suggestions', 
      error: error.message 
    });
  }
});

module.exports = router;
