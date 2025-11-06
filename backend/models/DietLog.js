const mongoose = require('mongoose');

const dietLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    items: [String],
    calories: Number,
    nutrients: {
      protein: Number,
      carbs: Number,
      fats: Number,
      vitamins: [String]
    },
    time: String
  }],
  waterIntake: {
    type: Number, // in ml
    default: 0
  },
  notes: String
});

module.exports = mongoose.model('DietLog', dietLogSchema);
