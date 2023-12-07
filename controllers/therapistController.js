const Appointment = require('../models/appointmentModel');
const Therapist = require('../models/therapistModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

exports.getAllTherapists = catchAsync(async (req, res) => {
  const therapists = await Therapist.find();

  res.status(200).json({
    status: 'success',
    results: therapists.length,
    data: {
      therapists,
    },
  });
});

exports.getTherapist = catchAsync(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      therapist,
    },
  });
});

exports.createTherapist = catchAsync(async (req, res) => {
  const newTherapist = await Therapist.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      therapist: newTherapist,
    },
  });
});

exports.updateTherapist = catchAsync(async (req, res) => {
  const therapist = await Therapist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!therapist) {
    return next(new AppError('No therapist found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      therapist,
    },
  });
});

exports.deleteTherapist = catchAsync(async (req, res) => {
  const therapist = await Therapist.findByIdAndDelete(req.params.id);

  if (!therapist) {
    return next(new AppError('No therapist found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    therapist: null,
  });
});

// Addon methods
exports.getAllAppointmentsForTherpist = catchAsync(async (req, res) => {
  const therapistId = req.params.id;

  // Server side pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Server side filtering
  const { status, type, dateRange, sortBy, sortOrder } = req.query;
  let filters = {
    therapist: therapistId,
    type: type || 'Home visit',
    status: status || 'Upcoming',
  };

  if (dateRange === 'last7days') {
    filters.date = {
      $gte: moment().subtract(7, 'days').toDate(),
      $lte: moment().toDate(),
    };
  } else if (dateRange === 'today') {
    filters.date = {
      $gte: moment().startOf('day').toDate(),
      $lte: moment().endOf('day').toDate(),
    };
  } else if (dateRange === 'tomorrow') {
    filters.date = {
      $gte: moment().add(1, 'days').startOf('day').toDate(),
      $lte: moment().add(1, 'days').endOf('day').toDate(),
    };
  }

  // Server side sorting
  const sortOptions = {};
  if (sortOrder && sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    // Default sort by date in desc
    sortOptions.date = -1;
  }

  const appointments = await Appointment.find(filters)
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
