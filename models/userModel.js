const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide the email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },

  passwordChangedAt: {
    type: Date,
  },

  isDoctor: {
    type: Boolean,
    default: true,
  },

  isOnboard: {
    type: Boolean,
    default: false,
  }, 

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: false,
    unique: true
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
    unique: true
  }

  // role: {
  //   name: {
  //     type: String,
  //     enum: ['doctor', 'patient'],
  //   },
  //   reference: {
  //     type: Object,
  //     required: false,
  //     unique: true,
  //   },
  // },
});

// Password update (encrypted version)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStampAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimeStampAt;
  }

  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
