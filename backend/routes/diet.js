const express = require('express');
const router = express.Router();
const DietLog = require('../models/DietLog');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/diet
// @desc    Add diet log entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const dietLog = await DietLog.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      dietLog
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding diet log', 
      error: error.message 
    });
  }
});

// @route   GET /api/diet
// @desc    Get diet logs for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    const query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const dietLogs = await DietLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      dietLogs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching diet logs', 
      error: error.message 
    });
  }
});

// @route   GET /api/diet/analysis
// @desc    Get diet analysis and recommendations
// @access  Private
router.get('/analysis', protect, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const dietLogs = await DietLog.find({
      user: req.user.id,
      date: { $gte: startDate }
    });

    // Analyze diet patterns
    const analysis = analyzeDiet(dietLogs);
    const recommendations = generateDietRecommendations(analysis);

    res.json({
      success: true,
      analysis,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error analyzing diet', 
      error: error.message 
    });
  }
});

// @route   GET /api/diet/meal-recommendations
// @desc    Get personalized meal recommendations based on health conditions
// @access  Private
router.get('/meal-recommendations', protect, async (req, res) => {
  try {
    const { mealType } = req.query; // breakfast, lunch, dinner, snack
    
    // Get user's health conditions
    const user = await User.findById(req.user.id);
    const conditions = user.existingConditions || [];
    
    // Generate meal recommendations
    const recommendations = generateMealRecommendations(mealType || 'general', conditions);
    
    res.json({
      success: true,
      mealType: mealType || 'general',
      conditions: conditions.map(c => c.name),
      recommendations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating meal recommendations', 
      error: error.message 
    });
  }
});

// @route   PUT /api/diet/:id
// @desc    Update diet log
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let dietLog = await DietLog.findById(req.params.id);

    if (!dietLog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Diet log not found' 
      });
    }

    // Check ownership
    if (dietLog.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    dietLog = await DietLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      dietLog
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating diet log', 
      error: error.message 
    });
  }
});

// Helper function to analyze diet
function analyzeDiet(dietLogs) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalWater = 0;
  const vitamins = new Set();
  const mealCounts = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };

  dietLogs.forEach(log => {
    totalWater += log.waterIntake || 0;
    
    log.meals.forEach(meal => {
      mealCounts[meal.type]++;
      totalCalories += meal.calories || 0;
      
      if (meal.nutrients) {
        totalProtein += meal.nutrients.protein || 0;
        totalCarbs += meal.nutrients.carbs || 0;
        totalFats += meal.nutrients.fats || 0;
        
        if (meal.nutrients.vitamins) {
          meal.nutrients.vitamins.forEach(v => vitamins.add(v));
        }
      }
    });
  });

  const days = dietLogs.length || 1;

  return {
    averageDailyCalories: Math.round(totalCalories / days),
    averageDailyProtein: Math.round(totalProtein / days),
    averageDailyCarbs: Math.round(totalCarbs / days),
    averageDailyFats: Math.round(totalFats / days),
    averageDailyWater: Math.round(totalWater / days),
    vitaminsConsumed: Array.from(vitamins),
    mealFrequency: mealCounts,
    daysAnalyzed: days
  };
}

// Helper function to generate recommendations
function generateDietRecommendations(analysis) {
  const recommendations = [];

  // Calorie recommendations
  if (analysis.averageDailyCalories < 1500) {
    recommendations.push({
      type: 'warning',
      category: 'Calories',
      message: 'Your calorie intake is below recommended levels. Consider eating more nutrient-dense foods.',
      icon: '🍽️'
    });
  } else if (analysis.averageDailyCalories > 2500) {
    recommendations.push({
      type: 'caution',
      category: 'Calories',
      message: 'Your calorie intake is above average. Consider portion control if weight management is a goal.',
      icon: '⚖️'
    });
  }

  // Protein recommendations
  if (analysis.averageDailyProtein < 50) {
    recommendations.push({
      type: 'info',
      category: 'Protein',
      message: 'Increase protein intake with lean meats, fish, eggs, legumes, or dairy products.',
      icon: '🥩'
    });
  }

  // Water recommendations
  if (analysis.averageDailyWater < 2000) {
    recommendations.push({
      type: 'warning',
      category: 'Hydration',
      message: 'Drink more water! Aim for at least 2-3 liters daily for optimal health.',
      icon: '💧'
    });
  }

  // Vitamin recommendations
  const essentialVitamins = ['Vitamin C', 'Vitamin D', 'Vitamin B12', 'Iron', 'Calcium'];
  const missingVitamins = essentialVitamins.filter(v => !analysis.vitaminsConsumed.includes(v));
  
  if (missingVitamins.length > 0) {
    recommendations.push({
      type: 'info',
      category: 'Vitamins',
      message: `Consider foods rich in: ${missingVitamins.join(', ')}. These are essential for immune function.`,
      icon: '💊'
    });
  }

  // Meal frequency recommendations
  if (analysis.mealFrequency.breakfast < analysis.daysAnalyzed * 0.7) {
    recommendations.push({
      type: 'caution',
      category: 'Meals',
      message: 'Don\'t skip breakfast! It kickstarts your metabolism and provides energy for the day.',
      icon: '🥞'
    });
  }

  // General healthy eating tips
  recommendations.push({
    type: 'success',
    category: 'General',
    message: 'Include colorful fruits and vegetables in every meal for a variety of nutrients.',
    icon: '🥗'
  });

  recommendations.push({
    type: 'success',
    category: 'Immune Boost',
    message: 'Foods rich in Vitamin C (citrus, berries), Zinc (nuts, seeds), and Vitamin D (fatty fish) boost immunity.',
    icon: '🛡️'
  });

  return recommendations;
}

// Helper function to generate meal recommendations based on health conditions
function generateMealRecommendations(mealType, conditions) {
  const conditionNames = conditions.map(c => c.name.toLowerCase());
  
  // Meal database with health-specific recommendations
  const mealDatabase = {
    breakfast: {
      general: [
        { name: 'Oatmeal with Berries', description: 'High fiber, antioxidants', calories: 300, benefits: 'Heart health, sustained energy' },
        { name: 'Greek Yogurt with Nuts', description: 'Protein-rich, probiotics', calories: 250, benefits: 'Gut health, muscle building' },
        { name: 'Whole Grain Toast with Avocado', description: 'Healthy fats, fiber', calories: 280, benefits: 'Brain health, satiety' },
        { name: 'Scrambled Eggs with Spinach', description: 'Protein, iron, vitamins', calories: 220, benefits: 'Energy, immune support' },
        { name: 'Smoothie Bowl', description: 'Fruits, seeds, protein', calories: 320, benefits: 'Vitamins, minerals, energy' }
      ],
      diabetes: [
        { name: 'Steel-Cut Oats with Cinnamon', description: 'Low GI, blood sugar control', calories: 280, benefits: 'Stable blood sugar' },
        { name: 'Egg White Omelet with Vegetables', description: 'Low carb, high protein', calories: 200, benefits: 'Blood sugar management' },
        { name: 'Chia Seed Pudding', description: 'Fiber-rich, omega-3', calories: 240, benefits: 'Slow digestion, stable energy' }
      ],
      hypertension: [
        { name: 'Banana Oatmeal (Low Sodium)', description: 'Potassium-rich', calories: 290, benefits: 'Blood pressure control' },
        { name: 'Unsalted Nuts with Fruit', description: 'Heart-healthy fats', calories: 260, benefits: 'Cardiovascular health' },
        { name: 'Whole Grain Cereal with Almond Milk', description: 'Low sodium, fiber', calories: 250, benefits: 'Heart health' }
      ],
      asthma: [
        { name: 'Vitamin C Smoothie', description: 'Citrus, berries, spinach', calories: 270, benefits: 'Lung health, anti-inflammatory' },
        { name: 'Omega-3 Rich Breakfast', description: 'Walnuts, flaxseeds, yogurt', calories: 300, benefits: 'Reduces inflammation' }
      ]
    },
    lunch: {
      general: [
        { name: 'Grilled Chicken Salad', description: 'Lean protein, vegetables', calories: 400, benefits: 'Muscle health, vitamins' },
        { name: 'Quinoa Buddha Bowl', description: 'Complete protein, veggies', calories: 450, benefits: 'Energy, nutrients' },
        { name: 'Lentil Soup with Whole Grain Bread', description: 'Fiber, protein', calories: 380, benefits: 'Digestive health' },
        { name: 'Grilled Fish with Brown Rice', description: 'Omega-3, complex carbs', calories: 420, benefits: 'Brain health, energy' },
        { name: 'Vegetable Stir-Fry with Tofu', description: 'Plant protein, vitamins', calories: 390, benefits: 'Balanced nutrition' }
      ],
      diabetes: [
        { name: 'Grilled Chicken with Cauliflower Rice', description: 'Low carb, high protein', calories: 350, benefits: 'Blood sugar control' },
        { name: 'Salmon with Steamed Vegetables', description: 'Omega-3, low GI', calories: 380, benefits: 'Heart and blood sugar health' },
        { name: 'Chickpea Salad', description: 'Fiber-rich, protein', calories: 340, benefits: 'Stable blood sugar' }
      ],
      hypertension: [
        { name: 'Baked Fish with Sweet Potato', description: 'Low sodium, potassium', calories: 400, benefits: 'Blood pressure control' },
        { name: 'Spinach and Lentil Curry (Low Salt)', description: 'Iron, fiber, magnesium', calories: 370, benefits: 'Heart health' },
        { name: 'Turkey Wrap with Vegetables', description: 'Lean protein, low sodium', calories: 360, benefits: 'Cardiovascular health' }
      ],
      asthma: [
        { name: 'Turmeric Chicken with Vegetables', description: 'Anti-inflammatory spices', calories: 410, benefits: 'Reduces airway inflammation' },
        { name: 'Salmon with Leafy Greens', description: 'Omega-3, antioxidants', calories: 430, benefits: 'Lung health' }
      ]
    },
    dinner: {
      general: [
        { name: 'Baked Salmon with Vegetables', description: 'Omega-3, vitamins', calories: 450, benefits: 'Heart and brain health' },
        { name: 'Chicken Breast with Quinoa', description: 'Lean protein, complete protein', calories: 480, benefits: 'Muscle recovery' },
        { name: 'Vegetable Curry with Brown Rice', description: 'Fiber, spices, nutrients', calories: 420, benefits: 'Digestive health' },
        { name: 'Turkey Meatballs with Zucchini Noodles', description: 'Low carb, protein', calories: 390, benefits: 'Weight management' },
        { name: 'Grilled Tofu with Stir-Fried Vegetables', description: 'Plant protein, antioxidants', calories: 370, benefits: 'Balanced nutrition' }
      ],
      diabetes: [
        { name: 'Grilled Chicken with Broccoli', description: 'Low carb, high fiber', calories: 380, benefits: 'Blood sugar management' },
        { name: 'Baked Fish with Green Beans', description: 'Lean protein, low GI', calories: 360, benefits: 'Stable glucose levels' },
        { name: 'Egg Curry with Cauliflower', description: 'Protein-rich, low carb', calories: 340, benefits: 'Blood sugar control' }
      ],
      hypertension: [
        { name: 'Herb-Crusted Chicken (No Salt)', description: 'Lean protein, herbs', calories: 400, benefits: 'Blood pressure friendly' },
        { name: 'Baked Cod with Asparagus', description: 'Low sodium, potassium', calories: 370, benefits: 'Heart health' },
        { name: 'Vegetable Soup with Beans', description: 'Fiber, low sodium', calories: 350, benefits: 'Cardiovascular health' }
      ],
      asthma: [
        { name: 'Ginger Garlic Chicken with Vegetables', description: 'Anti-inflammatory', calories: 420, benefits: 'Respiratory health' },
        { name: 'Mackerel with Roasted Vegetables', description: 'Omega-3, vitamins', calories: 440, benefits: 'Reduces inflammation' }
      ]
    },
    snack: {
      general: [
        { name: 'Apple with Almond Butter', description: 'Fiber, healthy fats', calories: 180, benefits: 'Sustained energy' },
        { name: 'Carrot Sticks with Hummus', description: 'Fiber, protein', calories: 150, benefits: 'Satiety, vitamins' },
        { name: 'Mixed Nuts', description: 'Healthy fats, protein', calories: 170, benefits: 'Brain health' },
        { name: 'Greek Yogurt', description: 'Protein, probiotics', calories: 120, benefits: 'Gut health' },
        { name: 'Fruit Smoothie', description: 'Vitamins, minerals', calories: 200, benefits: 'Hydration, energy' }
      ],
      diabetes: [
        { name: 'Cucumber Slices with Cheese', description: 'Low carb, protein', calories: 100, benefits: 'Blood sugar friendly' },
        { name: 'Hard-Boiled Eggs', description: 'Protein-rich, filling', calories: 140, benefits: 'Stable blood sugar' },
        { name: 'Celery with Peanut Butter', description: 'Low GI, protein', calories: 130, benefits: 'Sustained energy' }
      ],
      hypertension: [
        { name: 'Unsalted Almonds', description: 'Heart-healthy fats', calories: 160, benefits: 'Blood pressure control' },
        { name: 'Banana', description: 'Potassium-rich', calories: 105, benefits: 'Lowers blood pressure' },
        { name: 'Dark Chocolate (70%+)', description: 'Antioxidants, low sugar', calories: 150, benefits: 'Heart health' }
      ],
      asthma: [
        { name: 'Orange Slices', description: 'Vitamin C', calories: 80, benefits: 'Immune support' },
        { name: 'Walnuts', description: 'Omega-3, anti-inflammatory', calories: 185, benefits: 'Lung health' }
      ]
    }
  };
  
  // Get appropriate meal category
  const meals = mealDatabase[mealType] || mealDatabase.general;
  let recommendations = [];
  
  // Check for specific conditions
  const hasCondition = (condition) => conditionNames.some(c => c.includes(condition));
  
  if (hasCondition('diabetes') && meals.diabetes) {
    recommendations = [...meals.diabetes];
  } else if (hasCondition('hypertension') || hasCondition('blood pressure') && meals.hypertension) {
    recommendations = [...meals.hypertension];
  } else if (hasCondition('asthma') && meals.asthma) {
    recommendations = [...meals.asthma];
  }
  
  // Always include general recommendations
  recommendations = [...recommendations, ...meals.general];
  
  // Remove duplicates and limit to 8 recommendations
  const uniqueRecommendations = recommendations
    .filter((meal, index, self) => 
      index === self.findIndex(m => m.name === meal.name)
    )
    .slice(0, 8);
  
  return {
    meals: uniqueRecommendations,
    healthTips: generateHealthTips(conditionNames, mealType),
    avoidFoods: generateAvoidFoods(conditionNames)
  };
}

// Generate health tips based on conditions
function generateHealthTips(conditions, mealType) {
  const tips = [];
  
  if (conditions.some(c => c.includes('diabetes'))) {
    tips.push({
      icon: '🩺',
      tip: 'Choose low glycemic index foods to maintain stable blood sugar levels',
      category: 'Diabetes'
    });
    tips.push({
      icon: '🥗',
      tip: 'Include fiber-rich foods to slow down sugar absorption',
      category: 'Diabetes'
    });
  }
  
  if (conditions.some(c => c.includes('hypertension') || c.includes('blood pressure'))) {
    tips.push({
      icon: '🧂',
      tip: 'Limit sodium intake to less than 2,300mg per day',
      category: 'Hypertension'
    });
    tips.push({
      icon: '🍌',
      tip: 'Eat potassium-rich foods like bananas, spinach, and sweet potatoes',
      category: 'Hypertension'
    });
  }
  
  if (conditions.some(c => c.includes('asthma'))) {
    tips.push({
      icon: '🫁',
      tip: 'Include anti-inflammatory foods like fatty fish, nuts, and leafy greens',
      category: 'Asthma'
    });
    tips.push({
      icon: '🍊',
      tip: 'Boost Vitamin C intake with citrus fruits and berries',
      category: 'Asthma'
    });
  }
  
  // General tips
  tips.push({
    icon: '💧',
    tip: 'Stay hydrated - drink at least 8 glasses of water daily',
    category: 'General'
  });
  
  tips.push({
    icon: '🥦',
    tip: 'Fill half your plate with colorful vegetables',
    category: 'General'
  });
  
  return tips;
}

// Generate foods to avoid based on conditions
function generateAvoidFoods(conditions) {
  const avoidList = [];
  
  if (conditions.some(c => c.includes('diabetes'))) {
    avoidList.push({
      food: 'Sugary drinks and desserts',
      reason: 'Causes rapid blood sugar spikes',
      icon: '🍰'
    });
    avoidList.push({
      food: 'White bread and refined carbs',
      reason: 'High glycemic index',
      icon: '🍞'
    });
  }
  
  if (conditions.some(c => c.includes('hypertension') || c.includes('blood pressure'))) {
    avoidList.push({
      food: 'Processed and salty foods',
      reason: 'High sodium content raises blood pressure',
      icon: '🧂'
    });
    avoidList.push({
      food: 'Canned soups and frozen meals',
      reason: 'Hidden sodium',
      icon: '🥫'
    });
  }
  
  if (conditions.some(c => c.includes('asthma'))) {
    avoidList.push({
      food: 'Processed meats',
      reason: 'May trigger inflammation',
      icon: '🌭'
    });
    avoidList.push({
      food: 'Dairy (if sensitive)',
      reason: 'Can increase mucus production',
      icon: '🥛'
    });
  }
  
  return avoidList;
}

module.exports = router;
