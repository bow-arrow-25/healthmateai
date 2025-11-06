const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  quantityUnit: {
    type: String,
    enum: ['tablets', 'capsules', 'ml', 'mg', 'pieces'],
    default: 'tablets'
  },
  frequency: {
    type: String,
    enum: [
      'morning', 'afternoon', 'evening', 'night',
      'before_breakfast', 'after_breakfast',
      'before_lunch', 'after_lunch',
      'before_dinner', 'after_dinner',
      'once_daily', 'twice_daily', 'thrice_daily', 
      'as_needed', 'custom'
    ],
    default: 'once_daily'
  },
  customFrequency: String,
  timings: [String], // e.g., ['08:00', '20:00']
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  purpose: String,
  sideEffects: [String],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);
