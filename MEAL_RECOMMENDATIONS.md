# Personalized Meal Recommendations Feature 🍽️

## ✅ Feature Implemented:

The Diet page now provides **personalized meal recommendations** based on the user's health conditions (Diabetes, Hypertension, Asthma, etc.).

## 🎯 What Was Added:

### 1. **Backend API Route** ✅
**Route**: `GET /api/diet/meal-recommendations?mealType=breakfast`

**Features:**
- Fetches user's existing health conditions
- Generates personalized meal recommendations
- Provides health tips specific to conditions
- Lists foods to avoid

### 2. **Comprehensive Meal Database** ✅

#### Meal Types:
- 🥞 **Breakfast** - 5+ options per condition
- 🍱 **Lunch** - 5+ options per condition
- 🍽️ **Dinner** - 5+ options per condition
- 🍎 **Snacks** - 5+ options per condition

#### Health Conditions Supported:
- **Diabetes** - Low GI, blood sugar control
- **Hypertension** - Low sodium, potassium-rich
- **Asthma** - Anti-inflammatory, omega-3
- **General** - Balanced nutrition

### 3. **Meal Information** ✅

Each meal includes:
- **Name**: e.g., "Oatmeal with Berries"
- **Description**: "High fiber, antioxidants"
- **Calories**: e.g., 300 cal
- **Benefits**: "Heart health, sustained energy"

### 4. **Health Tips** ✅

Condition-specific tips:
- 🩺 Diabetes: "Choose low glycemic index foods"
- 🧂 Hypertension: "Limit sodium to <2,300mg/day"
- 🫁 Asthma: "Include anti-inflammatory foods"
- 💧 General: "Stay hydrated - 8 glasses daily"

### 5. **Foods to Avoid** ✅

Warns about:
- 🍰 Diabetes: Sugary drinks, refined carbs
- 🧂 Hypertension: Processed foods, high sodium
- 🌭 Asthma: Processed meats, dairy (if sensitive)

## 📊 Example Recommendations:

### For Diabetes + Breakfast:
```javascript
{
  meals: [
    {
      name: "Steel-Cut Oats with Cinnamon",
      description: "Low GI, blood sugar control",
      calories: 280,
      benefits: "Stable blood sugar"
    },
    {
      name: "Egg White Omelet with Vegetables",
      description: "Low carb, high protein",
      calories: 200,
      benefits: "Blood sugar management"
    }
  ],
  healthTips: [
    {
      icon: "🩺",
      tip: "Choose low glycemic index foods",
      category: "Diabetes"
    }
  ],
  avoidFoods: [
    {
      food: "Sugary drinks and desserts",
      reason: "Causes rapid blood sugar spikes",
      icon: "🍰"
    }
  ]
}
```

### For Hypertension + Lunch:
```javascript
{
  meals: [
    {
      name: "Baked Fish with Sweet Potato",
      description: "Low sodium, potassium",
      calories: 400,
      benefits: "Blood pressure control"
    },
    {
      name: "Spinach and Lentil Curry (Low Salt)",
      description: "Iron, fiber, magnesium",
      calories: 370,
      benefits: "Heart health"
    }
  ],
  healthTips: [
    {
      icon: "🧂",
      tip: "Limit sodium intake to less than 2,300mg per day",
      category: "Hypertension"
    }
  ],
  avoidFoods: [
    {
      food: "Processed and salty foods",
      reason: "High sodium raises blood pressure",
      icon: "🧂"
    }
  ]
}
```

## 🎨 Frontend UI:

### Meal Type Selector:
- 4 buttons: Breakfast, Lunch, Dinner, Snack
- Active button highlighted with gradient
- Click to load recommendations

### Meal Cards Grid:
- 3-column responsive grid
- Each card shows:
  - Meal name (bold)
  - Description
  - Calories
  - Health benefits
- Hover effect with shadow

### Health Tips Section:
- Blue background
- Icon + tip text
- Category label

### Foods to Avoid Section:
- Red/warning background
- Icon + food name
- Reason for avoidance

## 📁 Files Modified:

### Backend:
1. **backend/routes/diet.js**
   - Added `/meal-recommendations` route
   - Added `generateMealRecommendations()` function
   - Added `generateHealthTips()` function
   - Added `generateAvoidFoods()` function
   - Comprehensive meal database (100+ meals)

### Frontend:
2. **frontend/src/pages/Diet.js**
   - Added meal recommendations state
   - Added `fetchMealRecommendations()` function
   - Added meal type selector UI
   - Added meal cards grid
   - Added health tips display
   - Added foods to avoid display

## 🚀 How to Use:

### 1. Add Health Conditions:
```
1. Go to Profile page
2. Add existing conditions (e.g., Diabetes, Hypertension)
3. Save profile
```

### 2. Get Meal Recommendations:
```
1. Go to Diet page
2. See "Personalized Meal Recommendations" section
3. Click meal type button (Breakfast/Lunch/Dinner/Snack)
4. View personalized meal suggestions
5. See health tips and foods to avoid
```

### 3. Example Flow:
```
User Profile: Diabetes + Hypertension
↓
Clicks "Breakfast"
↓
Gets:
- Low GI breakfast options
- Low sodium options
- Health tips for both conditions
- Foods to avoid for both conditions
```

## 💡 Smart Features:

### 1. **Condition Detection**:
- Automatically detects user's health conditions
- Prioritizes condition-specific meals
- Falls back to general recommendations

### 2. **Multiple Conditions**:
- Handles users with multiple conditions
- Combines recommendations intelligently
- Provides tips for all conditions

### 3. **No Duplicates**:
- Filters duplicate meals
- Limits to 8 recommendations
- Shows most relevant options first

### 4. **Responsive Design**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

## 🔧 Technical Details:

### API Request:
```javascript
GET /api/diet/meal-recommendations?mealType=breakfast

Headers: {
  Authorization: Bearer <token>
}
```

### API Response:
```javascript
{
  success: true,
  mealType: "breakfast",
  conditions: ["Diabetes", "Hypertension"],
  recommendations: {
    meals: [...],
    healthTips: [...],
    avoidFoods: [...]
  }
}
```

### Meal Database Structure:
```javascript
{
  breakfast: {
    general: [...],
    diabetes: [...],
    hypertension: [...],
    asthma: [...]
  },
  lunch: { ... },
  dinner: { ... },
  snack: { ... }
}
```

## 📊 Meal Categories:

### Breakfast (20+ options):
- Oatmeal variations
- Egg dishes
- Smoothies
- Whole grain options
- Yogurt bowls

### Lunch (20+ options):
- Salads
- Grain bowls
- Soups
- Fish dishes
- Vegetarian options

### Dinner (20+ options):
- Lean proteins
- Vegetable dishes
- Low-carb options
- Heart-healthy meals
- Anti-inflammatory options

### Snacks (15+ options):
- Fruits
- Nuts
- Yogurt
- Vegetables with dips
- Healthy treats

## 🎯 Health Benefits:

### For Diabetes:
- ✅ Low glycemic index meals
- ✅ Blood sugar control
- ✅ Fiber-rich options
- ✅ Protein-focused meals

### For Hypertension:
- ✅ Low sodium options
- ✅ Potassium-rich foods
- ✅ Heart-healthy fats
- ✅ DASH diet principles

### For Asthma:
- ✅ Anti-inflammatory foods
- ✅ Omega-3 rich meals
- ✅ Vitamin C sources
- ✅ Lung health support

### General Health:
- ✅ Balanced nutrition
- ✅ Variety of nutrients
- ✅ Adequate hydration
- ✅ Immune support

## ✨ Result:

**Users now get personalized meal recommendations based on their health conditions!**

- ✅ Condition-specific meals
- ✅ Health tips
- ✅ Foods to avoid
- ✅ Calorie information
- ✅ Health benefits
- ✅ Beautiful UI
- ✅ Responsive design

**The Diet page is now a complete nutrition assistant!** 🎉
