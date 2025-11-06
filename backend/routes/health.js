const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SymptomLog = require('../models/SymptomLog');
const Medicine = require('../models/Medicine');
const DietLog = require('../models/DietLog');
const { protect } = require('../middleware/auth');

// @route   GET /api/health/dashboard
// @desc    Get comprehensive health dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get recent symptom logs
    const recentSymptoms = await SymptomLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    // Get active medicines
    const activeMedicines = await Medicine.find({ 
      user: req.user.id, 
      isActive: true 
    });

    // Get recent diet logs
    const recentDiet = await DietLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(7);

    // Calculate health score
    const healthScore = calculateHealthScore(user, recentSymptoms, activeMedicines, recentDiet);

    // Generate personalized insights
    const insights = generateHealthInsights(user, recentSymptoms, activeMedicines, recentDiet);

    res.json({
      success: true,
      dashboard: {
        user: {
          name: user.name,
          age: user.age,
          existingConditions: user.existingConditions,
          allergies: user.allergies
        },
        healthScore,
        recentSymptoms,
        activeMedicines,
        recentDiet,
        insights
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard', 
      error: error.message 
    });
  }
});

// @route   GET /api/health/insights
// @desc    Get personalized health insights
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get data from last 30 days
    const symptoms = await SymptomLog.find({ 
      user: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    const medicines = await Medicine.find({ 
      user: req.user.id, 
      isActive: true 
    });

    const dietLogs = await DietLog.find({ 
      user: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    const insights = generateHealthInsights(user, symptoms, medicines, dietLogs);

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating insights', 
      error: error.message 
    });
  }
});

// Helper function to calculate health score (0-100)
function calculateHealthScore(user, symptoms, medicines, dietLogs) {
  let score = 100;

  // Deduct points for existing conditions
  score -= user.existingConditions.length * 5;

  // Deduct points for recent symptoms
  const recentSevereSymptoms = symptoms.filter(s => 
    s.symptoms.some(sym => sym.severity === 'severe')
  ).length;
  score -= recentSevereSymptoms * 10;
  score -= (symptoms.length - recentSevereSymptoms) * 3;

  // Deduct points if not taking medicines regularly
  if (medicines.length > 0 && medicines.some(m => !m.reminderEnabled)) {
    score -= 5;
  }

  // Add points for good diet habits
  if (dietLogs.length >= 5) {
    score += 5;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

// Helper function to generate health insights
function generateHealthInsights(user, symptoms, medicines, dietLogs) {
  const insights = [];

  // Existing conditions insights
  if (user.existingConditions.length > 0) {
    const conditions = user.existingConditions.map(c => c.name).join(', ');
    insights.push({
      type: 'info',
      category: 'Chronic Conditions',
      title: 'Managing Your Conditions',
      message: `You have ${user.existingConditions.length} existing condition(s): ${conditions}. Regular monitoring and medication adherence are crucial.`,
      icon: '🏥',
      priority: 'high'
    });
  }

  // Symptom pattern analysis
  if (symptoms.length > 3) {
    const symptomNames = {};
    symptoms.forEach(log => {
      log.symptoms.forEach(s => {
        symptomNames[s.name] = (symptomNames[s.name] || 0) + 1;
      });
    });

    const recurring = Object.entries(symptomNames)
      .filter(([name, count]) => count >= 3)
      .map(([name]) => name);

    if (recurring.length > 0) {
      insights.push({
        type: 'warning',
        category: 'Symptoms',
        title: 'Recurring Symptoms Detected',
        message: `You've experienced ${recurring.join(', ')} multiple times recently. Consider consulting a doctor for persistent symptoms.`,
        icon: '⚠️',
        priority: 'high'
      });
    }
  }

  // Medicine adherence insights
  if (medicines.length > 0) {
    const withoutReminders = medicines.filter(m => !m.reminderEnabled).length;
    if (withoutReminders > 0) {
      insights.push({
        type: 'caution',
        category: 'Medications',
        title: 'Enable Medicine Reminders',
        message: `${withoutReminders} medicine(s) don't have reminders enabled. Enable reminders to improve adherence.`,
        icon: '💊',
        priority: 'medium'
      });
    }

    // Check for potential interactions with existing conditions
    user.existingConditions.forEach(condition => {
      if (condition.name.toLowerCase().includes('diabetes') && 
          medicines.some(m => m.name.toLowerCase().includes('steroid'))) {
        insights.push({
          type: 'warning',
          category: 'Drug Interaction',
          title: 'Potential Interaction Alert',
          message: 'Steroids can affect blood sugar levels. Monitor your glucose regularly and consult your doctor.',
          icon: '⚕️',
          priority: 'high'
        });
      }
    });
  }

  // Diet insights
  if (dietLogs.length > 0) {
    const avgWater = dietLogs.reduce((sum, log) => sum + (log.waterIntake || 0), 0) / dietLogs.length;
    
    if (avgWater < 2000) {
      insights.push({
        type: 'info',
        category: 'Hydration',
        title: 'Increase Water Intake',
        message: 'You\'re drinking less than the recommended 2 liters per day. Proper hydration supports overall health.',
        icon: '💧',
        priority: 'medium'
      });
    }
  } else {
    insights.push({
      type: 'info',
      category: 'Diet',
      title: 'Track Your Diet',
      message: 'Start logging your meals to get personalized nutrition recommendations and boost your immune system.',
      icon: '🥗',
      priority: 'low'
    });
  }

  // General wellness tips
  insights.push({
    type: 'success',
    category: 'Wellness',
    title: 'Boost Your Immunity',
    message: 'Include foods rich in Vitamin C (citrus fruits), Vitamin D (fatty fish, eggs), and Zinc (nuts, seeds) in your diet.',
    icon: '🛡️',
    priority: 'low'
  });

  insights.push({
    type: 'success',
    category: 'Lifestyle',
    title: 'Stay Active',
    message: 'Regular exercise (30 minutes daily) improves cardiovascular health and strengthens immunity.',
    icon: '🏃',
    priority: 'low'
  });

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

module.exports = router;
