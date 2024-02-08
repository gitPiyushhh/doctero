const { Op } = require('sequelize');
const moment = require('moment');

const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllPatients = catchAsync(async (req, res) => {
  const patients = await Patient.find();

  res.status(200).json({
    status: 'success',
    results: patients.length,
    data: {
      patients,
    },
  });
});

exports.getPatient = catchAsync(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.createPatient = catchAsync(async (req, res) => {
  const newPatient = await Patient.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

exports.updatePatient = catchAsync(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    return next(new AppError('No patient found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.deletePatient = catchAsync(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(new AppError('No patient found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    patient: null,
  });
});

// Addons methods
exports.getAllAppointmentsForPatient = catchAsync(async (req, res) => {
  const patientId = req.params.id;

  // Server side pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Server side filtering
  const { status, type, dateRange, sortBy, sortOrder } = req.query;
  let filters = {
    patient: patientId,
    type: type || 'Home visit',
    status: status || 'Upcoming',
  };

  if (dateRange === 'Week') {
    filters.date = {
      $gte: moment().subtract(7, 'days').toDate(),
      $lte: moment().endOf('day').toDate(),
    };
  } else if (dateRange === 'Today') {
    filters.date = {
      $gte: moment().startOf('day').toDate(),
      $lte: moment().endOf('day').toDate(),
    };
  } else if (dateRange === 'Tomorrow') {
    filters.date = {
      $gte: moment().add(1, 'days').startOf('day').toDate(),
      $lte: moment().add(1, 'days').endOf('day').toDate(),
    };
  } else if (dateRange === 'Month') {
    filters.date = {
      $gte: moment().startOf('month').toDate(),
      $lte: moment().endOf('month').toDate(),
    };
  }

  // Server side sorting
  let sortOptions = {};
  if (sortOrder && sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    // Default sort by date in desc
    sortOptions.date = -1;
  }

  const appointments = await Appointment.find(filters)
    .populate('therapist')
    .populate('patient')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getLiveAppointmentForPatient = catchAsync(async (req, res) => {
  const patientId = req.params.id;
  const currentHour = req.params.hour;
  
  const currentDate = moment().startOf('day');

  let filters = {
    patient: patientId,
    date: {
      $gte: currentDate.toDate(),
      $lte: moment().endOf('day').toDate(),
    },
    startTime: currentHour,
  };

  const appointments = await Appointment.find(filters).populate('patient');

  res.status(200).json({
    status: 'success',
    data: {
      appointments,
    },
  });
});