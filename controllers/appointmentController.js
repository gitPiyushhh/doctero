const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const catchAsync = require('../utils/catchAsync');

const twilio = require('twilio');
const { sendSMS } = require('../utils/sendMessage');

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
  const createdAppointment = await Appointment.create(req.body);

  /*
    Sending notifications
  */
  const newAppointment = await Appointment.find(createdAppointment._id);
  const patient = await Patient.findById(createdAppointment.patient);

  console.log(patient)

  const { date, startTime, name, doctorPhone, doctorName } = req.body;

  const myPhoneNumber = '6392745946';

  // Message to doctor
  const doctorMessage = `New appointment scheduled for ${date} at ${startTime > 12 ? `${startTime % 12} pm` : `${startTime} am`} with patient ${name}`;
  const resDoctorMessage = await sendSMS(doctorPhone, doctorMessage);

  // Message to patient
  // const patientMessage = `Your appointment with Dr. ${doctorName} is scheduled for ${date} at ${startTime}`;
  // await sendSMS(
  //   patient.contact.phone,
  //   patientMessage,
  // );

  // Send to self
  const selfMessage = `Someone created a new appointment from your app`;
  await sendSMS(myPhoneNumber, selfMessage);

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
