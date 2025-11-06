const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Medicine = require('../models/Medicine');
const { protect } = require('../middleware/auth');

// @route   GET /api/reminders
// @desc    Get all reminders for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user.id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const reminders = await Reminder.find(query)
      .populate('medicine')
      .sort({ scheduledTime: 1 });

    res.json({
      success: true,
      reminders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reminders', 
      error: error.message 
    });
  }
});

// @route   POST /api/reminders/generate
// @desc    Generate reminders for all active medicines
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Get all active medicines for user
    const medicines = await Medicine.find({ 
      user: req.user.id, 
      isActive: true,
      reminderEnabled: true 
    });

    const reminders = [];

    for (const medicine of medicines) {
      // Check if reminders already exist for this date
      const existingReminders = await Reminder.find({
        user: req.user.id,
        medicine: medicine._id,
        date: {
          $gte: targetDate,
          $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (existingReminders.length === 0 && medicine.timings && medicine.timings.length > 0) {
        // Create reminders for each timing
        for (const timing of medicine.timings) {
          const reminder = await Reminder.create({
            user: req.user.id,
            medicine: medicine._id,
            scheduledTime: timing,
            date: targetDate
          });
          reminders.push(reminder);
        }
      }
    }

    res.json({
      success: true,
      message: `Generated ${reminders.length} reminders`,
      reminders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating reminders', 
      error: error.message 
    });
  }
});

// @route   PUT /api/reminders/:id/taken
// @desc    Mark reminder as taken
// @access  Private
router.put('/:id/taken', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    // Check ownership
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    reminder.taken = true;
    reminder.takenAt = new Date();
    reminder.skipped = false;
    await reminder.save();

    res.json({
      success: true,
      reminder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating reminder', 
      error: error.message 
    });
  }
});

// @route   PUT /api/reminders/:id/skip
// @desc    Mark reminder as skipped
// @access  Private
router.put('/:id/skip', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    // Check ownership
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    reminder.skipped = true;
    reminder.skipReason = reason;
    reminder.taken = false;
    await reminder.save();

    res.json({
      success: true,
      reminder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating reminder', 
      error: error.message 
    });
  }
});

// @route   GET /api/reminders/stats
// @desc    Get reminder statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user.id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalReminders = await Reminder.countDocuments(query);
    const takenReminders = await Reminder.countDocuments({ ...query, taken: true });
    const skippedReminders = await Reminder.countDocuments({ ...query, skipped: true });
    const missedReminders = totalReminders - takenReminders - skippedReminders;

    const adherenceRate = totalReminders > 0 
      ? ((takenReminders / totalReminders) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      stats: {
        total: totalReminders,
        taken: takenReminders,
        skipped: skippedReminders,
        missed: missedReminders,
        adherenceRate: parseFloat(adherenceRate)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching stats', 
      error: error.message 
    });
  }
});

module.exports = router;
