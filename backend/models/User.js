const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  existingConditions: [{
    name: String,
    diagnosedDate: Date,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  allergies: [String],
  bloodType: String,
  healthMetrics: {
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs', 'pounds'],
        default: 'kg'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'm', 'ft', 'inches'],
        default: 'cm'
      }
    },
    bmi: Number,
    bmiCategory: {
      type: String,
      enum: ['Underweight', 'Normal weight', 'Overweight', 'Obese']
    },
    lastUpdated: Date
  },
  location: {
    city: String,
    country: String,
    latitude: Number,
    longitude: Number,
    timezone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate and update BMI
userSchema.methods.calculateBMI = function() {
  if (!this.healthMetrics || !this.healthMetrics.weight || !this.healthMetrics.height) {
    return null;
  }

  let weightInKg = this.healthMetrics.weight.value;
  let heightInMeters = this.healthMetrics.height.value;

  // Convert weight to kg
  if (this.healthMetrics.weight.unit === 'lbs' || this.healthMetrics.weight.unit === 'pounds') {
    weightInKg = weightInKg * 0.453592;
  }

  // Convert height to meters
  if (this.healthMetrics.height.unit === 'cm') {
    heightInMeters = heightInMeters / 100;
  } else if (this.healthMetrics.height.unit === 'ft') {
    heightInMeters = heightInMeters * 0.3048;
  } else if (this.healthMetrics.height.unit === 'inches') {
    heightInMeters = heightInMeters * 0.0254;
  }

  const bmi = weightInKg / (heightInMeters * heightInMeters);
  this.healthMetrics.bmi = parseFloat(bmi.toFixed(1));

  // Determine category
  if (bmi < 18.5) {
    this.healthMetrics.bmiCategory = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    this.healthMetrics.bmiCategory = 'Normal weight';
  } else if (bmi >= 25 && bmi < 30) {
    this.healthMetrics.bmiCategory = 'Overweight';
  } else {
    this.healthMetrics.bmiCategory = 'Obese';
  }

  this.healthMetrics.lastUpdated = new Date();
  return this.healthMetrics.bmi;
};

module.exports = mongoose.model('User', userSchema);
