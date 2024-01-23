const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Number,
  },
  endTime: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['Out patient', 'Home visit', 'Remote', 'In patient'],
  },
  notes: {
    type: String,
  },
  amount: {
    type: Number,
    enum: [250, 350, 500, 1000],
    required: [true, 'An appointment must have a fees'],
  },
  problem: {
    type: String,
    required: [true, 'Please enter the problem you have'],
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled', 'Pending'],
    default: 'Upcoming',
  },
  notification: {
    type: [
      {
        type: String,
        enum: ['App', 'Email', 'SMS'],
      },
    ],
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
