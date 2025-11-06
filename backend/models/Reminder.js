const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  scheduledTime: {
    type: String,
    required: true // Format: 'HH:MM'
  },
  taken: {
    type: Boolean,
    default: false
  },
  takenAt: Date,
  skipped: {
    type: Boolean,
    default: false
  },
  skipReason: String,
  date: {
    type: Date,
    default: Date.now
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);
