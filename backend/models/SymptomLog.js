const mongoose = require('mongoose');

const symptomLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // Allow null for non-authenticated users
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate'
    }
  }],
  possibleConditions: [{
    name: String,
    probability: Number,
    description: String
  }],
  suggestedMedicines: [{
    name: String,
    type: String,
    dosage: String
  }],
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months']
    }
  },
  needsDoctorVisit: {
    type: Boolean,
    default: false
  },
  doctorVisitReason: String,
  isUrgent: {
    type: Boolean,
    default: false
  },
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    condition: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SymptomLog', symptomLogSchema);
