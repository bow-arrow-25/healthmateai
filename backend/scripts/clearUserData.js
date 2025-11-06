const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Medicine = require('../models/Medicine');
const SymptomLog = require('../models/SymptomLog');
const DietLog = require('../models/DietLog');
const Prescription = require('../models/Prescription');

async function clearUserData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections except users
    console.log('\n🗑️  Clearing user data...\n');

    const medicinesDeleted = await Medicine.deleteMany({});
    console.log(`✅ Deleted ${medicinesDeleted.deletedCount} medicines`);

    const symptomLogsDeleted = await SymptomLog.deleteMany({});
    console.log(`✅ Deleted ${symptomLogsDeleted.deletedCount} symptom logs`);

    const dietLogsDeleted = await DietLog.deleteMany({});
    console.log(`✅ Deleted ${dietLogsDeleted.deletedCount} diet logs`);

    const prescriptionsDeleted = await Prescription.deleteMany({});
    console.log(`✅ Deleted ${prescriptionsDeleted.deletedCount} prescriptions`);

    console.log('\n✨ All user data cleared successfully!');
    console.log('👤 User accounts and login information preserved.');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

// Run the script
clearUserData();
