const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const catchAsync = require('../utils/catchAsync');

// Route handlers
exports.getAllAppointments = catchAsync(async (req, res) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      appointment,
    },
  });
});

exports.createAppointment = catchAsync(async (req, res) => {
  const newAppointment = await Appointment.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      appointment: newAppointment,
    },
  });
});

exports.updateAppointment = catchAsync(async (req, res) => {
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: {
      appointment: updatedAppointment,
    },
  });
});

exports.deleteAppointment = catchAsync(async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      appointment: null,
    },
  });
});
