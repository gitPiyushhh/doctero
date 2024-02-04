const mongoose = require('mongoose');
const validator = require('validator');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'A patient must have a name'],
  },
  gender: String,
  age: Number,
  problems: {
    type: [String]
  },
  dob: {
    String
  },
  weight : Number,
  height: Number,
  bloodGroup: String,
  rating: {
    type: Number, // If present then golden star else grey
  },
  photo: {
    type: String, // If present then user pic else default pic
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'A patient must have an mobile number'],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, 'any', { strictMode: false });
        },
        message: 'Invalid phone number format',
      },
    },
    address: {
      type: String,
      required: [true, 'A patient must have an address'],
    },
    city: {
      type: String,
      required: [true, 'A patient must have a city'],
    },
    state: {
      type: String,
      required: [true, 'A patient must have a state'],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      cordinates: [Number],
    },
  },
  numberOfAppointments: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  amountRemaining: {
    type: Number,
    default: 0,
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
  zone: {
    type: String,
    required: [false, 'A patient must have a zone'],
    required: [false, 'A patient must have a zone'],
    enum: ['Lalbangla', 'Mallroad', 'Kalyanpur', 'Civil lines'], // Adjust as per city
  },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
