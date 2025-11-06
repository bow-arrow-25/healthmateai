const Reminder = require('../models/Reminder');
const Medicine = require('../models/Medicine');
const User = require('../models/User');

// This service would integrate with email/SMS services
// For now, it logs reminders that need to be sent

async function sendReminders() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Find reminders for current time that haven't been sent
    const reminders = await Reminder.find({
      scheduledTime: currentTime,
      notificationSent: false,
      taken: false,
      skipped: false,
      date: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lt: new Date(now.setHours(23, 59, 59, 999))
      }
    }).populate('medicine').populate('user');

    console.log(`Found ${reminders.length} reminders to send at ${currentTime}`);

    for (const reminder of reminders) {
      // Here you would integrate with email/SMS service
      // For example: sendEmail(reminder.user.email, reminder.medicine.name)
      
      console.log(`📧 Reminder: ${reminder.user.name} should take ${reminder.medicine.name} at ${currentTime}`);

      // Mark as notification sent
      reminder.notificationSent = true;
      await reminder.save();
    }

    return { success: true, count: reminders.length };
  } catch (error) {
    console.error('Error sending reminders:', error);
    return { success: false, error: error.message };
  }
}

// Generate daily reminders for all users
async function generateDailyReminders() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active medicines with reminders enabled
    const medicines = await Medicine.find({ 
      isActive: true,
      reminderEnabled: true 
    });

    let count = 0;

    for (const medicine of medicines) {
      // Check if reminders already exist for today
      const existingReminders = await Reminder.find({
        medicine: medicine._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (existingReminders.length === 0 && medicine.timings && medicine.timings.length > 0) {
        // Create reminders for each timing
        for (const timing of medicine.timings) {
          await Reminder.create({
            user: medicine.user,
            medicine: medicine._id,
            scheduledTime: timing,
            date: today
          });
          count++;
        }
      }
    }

    console.log(`✅ Generated ${count} reminders for today`);
    return { success: true, count };
  } catch (error) {
    console.error('Error generating daily reminders:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendReminders,
  generateDailyReminders
};
