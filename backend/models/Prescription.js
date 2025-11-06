const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: String,
  hospitalName: String,
  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: String,
  extractedText: String,
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  diagnosis: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
