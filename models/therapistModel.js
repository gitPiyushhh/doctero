const mongoose = require('mongoose');
const validator = require('validator');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A doctor must have a name'],
  },
  image: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'A doctor must have an address'],
  },
  state: {
    type: String,
    required: [true, 'A doctor must have an state'],
  },
  city: {
    type: String,
    required: [true, 'A doctor must have an state'],
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'A patient must have an mobile number'],
    // unique: true,
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
    required: [true, 'PLease tell how much experience you have, 0 for fresher']
  },
  education: {
    type: String,
  },
  operationalTime: {
    startTime: {
      type: Number,
      required: [true, 'Please provide us the time you start working']
    },
    closeTime: {
      type: Number,
      required: [true, 'Please provide us the time you end working']
    }
  },
  fees: {
    type: Number,
    required: [true, "Please tell us your consultation fees"]
  },
  billing: {
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: false,
        unique: true,
      },
    ],
  },
  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;
