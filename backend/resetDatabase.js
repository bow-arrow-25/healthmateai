const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const SymptomLog = require('./models/SymptomLog');
const Prescription = require('./models/Prescription');
const DietLog = require('./models/DietLog');
const Reminder = require('./models/Reminder');

const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    await User.deleteMany({});
    console.log('🗑️  Cleared Users collection');

    await Medicine.deleteMany({});
    console.log('🗑️  Cleared Medicines collection');

    await SymptomLog.deleteMany({});
    console.log('🗑️  Cleared SymptomLogs collection');

    await Prescription.deleteMany({});
    console.log('🗑️  Cleared Prescriptions collection');

    await DietLog.deleteMany({});
    console.log('🗑️  Cleared DietLogs collection');

    await Reminder.deleteMany({});
    console.log('🗑️  Cleared Reminders collection');

    console.log('\n✅ All data cleared successfully!');

    // Create a single default user
    const defaultUser = {
      name: 'Admin User',
      email: 'admin@healthmate.com',
      password: 'Admin@123',
      age: 30,
      gender: 'other'
    };

    const user = await User.create(defaultUser);
    
    console.log('\n✅ Default user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@healthmate.com');
    console.log('🔑 Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login with these credentials.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
