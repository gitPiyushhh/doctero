const mongoose = require('mongoose');
const validator = require('validator');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A therapist must have a name'],
  },
  image: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'A therapist must have an address'],
  },
  aadharNumber: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: [true, 'A patient must have an mobile number'],
    unique: true,
    validate: {
        validator: function (v) {
            const phoneRegex = /^[6-9]\d{9}$/;
            return phoneRegex.test(v);
          },
      message: 'Invalid phone number format',
    },
  },
  email: {
    type: String,
    unique: true,
    validator: {
      validate: function (v) {
        return validator.isEmail(v);
      },
      message: 'Invalid email format',
    },
  },
  specialization: {
    type: String,
  },
  experience: {
    type: Number,
  },
  education: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;
