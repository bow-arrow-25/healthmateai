const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, gender, existingConditions, allergies, bloodType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, gender, existingConditions, allergies, bloodType },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

// @route   POST /api/users/conditions
// @desc    Add existing condition
// @access  Private
router.post('/conditions', protect, async (req, res) => {
  try {
    const { name, diagnosedDate, severity } = req.body;

    const user = await User.findById(req.user.id);
    user.existingConditions.push({ name, diagnosedDate, severity });
    await user.save();

    res.json({
      success: true,
      conditions: user.existingConditions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding condition', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/users/conditions/:id
// @desc    Remove existing condition
// @access  Private
router.delete('/conditions/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.existingConditions = user.existingConditions.filter(
      condition => condition._id.toString() !== req.params.id
    );
    await user.save();

    res.json({
      success: true,
      conditions: user.existingConditions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error removing condition', 
      error: error.message 
    });
  }
});

// @route   PUT /api/users/health-metrics
// @desc    Update user health metrics (weight, height, BMI)
// @access  Private
router.put('/health-metrics', protect, async (req, res) => {
  try {
    const { weight, height } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user.healthMetrics) {
      user.healthMetrics = {};
    }

    if (weight) {
      user.healthMetrics.weight = weight;
    }
    
    if (height) {
      user.healthMetrics.height = height;
    }

    // Calculate BMI
    user.calculateBMI();
    await user.save();

    res.json({
      success: true,
      healthMetrics: user.healthMetrics
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating health metrics', 
      error: error.message 
    });
  }
});

// @route   PUT /api/users/location
// @desc    Update user location
// @access  Private
router.put('/location', protect, async (req, res) => {
  try {
    const { city, country, latitude, longitude, timezone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        location: { city, country, latitude, longitude, timezone }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      location: user.location
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating location', 
      error: error.message 
    });
  }
});

module.exports = router;
