const Appointment = require('../models/appointmentModel');
const Therapist = require('../models/therapistModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

exports.getAllTherapists = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtering
  const { specialization, sortBy, sortOrder } = req.query;
  let filters = {
    specialization: specialization,
  };

  let sortOptions = {};
  if (sortOrder && sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    // Default sort by date in desc
    sortOptions.date = -1;
  }

  const therapists = await Therapist.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

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
  const {
    status,
    type,
    dateRange = 'Month',
    sortBy,
    sortOrder,
    patientId,
  } = req.query;
  let filters = {
    therapist: therapistId,
    type: type || 'Home visit',
  };

  if (dateRange === 'Week') {
    filters.date = {
      $gte: moment().subtract(7, 'days').toDate(),
      $lte: moment().toDate(),
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

exports.getAllPatientsForTherapist = catchAsync(async (req, res) => {
  const therapistId = req.params.id;

  // Server side pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5000;
  const skip = (page - 1) * limit;

  // Server side filtering
  const { status, type, dateRange = 'Year', sortBy, sortOrder, customDate } = req.query;
  let filters = {
    therapist: therapistId,
  };

  if (customDate) {
    const selectedDate = moment(customDate).startOf('day');
    filters.date = {
      $gte: selectedDate.toDate(),
      $lte: selectedDate.endOf('day').toDate(),
    };
  } else if (dateRange === 'Month') {
    filters.date = {
      $gte: moment().startOf('month').toDate(),
      $lte: moment().endOf('month').toDate(),
    };
  } else if (dateRange === 'Today') {
    filters.date = {
      $gte: moment().startOf('day').toDate(),
      $lte: moment().endOf('day').toDate(),
    };
  } else if (dateRange === 'Year') {
    filters.date = {
      $gte: moment().startOf('year').toDate(),
      $lte: moment().endOf('year').toDate(),
    };
  } else if (dateRange === 'Week') {
    filters.date = {
      $gte: moment().subtract(7, 'days').toDate(),
      $lte: moment().toDate(),
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

  const uniqueIDSet = new Set();
  const uniquePatients = [];

  appointments.forEach((appointment) => {
    const patient = appointment.patient;
    const patientID = patient._id;
    const date = moment(appointment.date);

    if (!uniqueIDSet.has(patientID)) {
      // Add to set
      uniqueIDSet.add(patientID);

      // Add to unique array with the problem field
      uniquePatients.push({
        patient: {
          ...patient.toObject(),
          problem: appointment.problem,
          activeTill: date,
        },
      });
    }
  });

  res.status(200).json({
    status: 'success',
    results: uniquePatients.length,
    data: {
      uniquePatients,
    },
  });
});

exports.getPatientStartDate = catchAsync(async (req, res) => {
  const therapistId = req.params.id;
  const { patientId } = req.query;

  let filters = {
    therapist: therapistId,
    patient: patientId,
  };

  // Fetch appointments from the database
  const appointments = await Appointment.find(filters).populate('patient');

  // Sort appointments based on date in ascending order
  appointments.sort(
    (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
  );

  // Get the earliest appointment (first element after sorting)
  const earliestAppointment = appointments[0];

  res.status(200).json({
    status: 'success',
    data: {
      earliestAppointment,
    },
  });
});

exports.getLiveAppointmentForTherapist = catchAsync(async (req, res) => {
  const therapistId = req.params.id;
  
  const currentDate = moment().startOf('day');
  const currentHour = moment().hour();

  let filters = {
    therapist: therapistId,
    date: {
      $gte: currentDate.toDate(),
      $lte: moment().endOf('day').toDate(),
    },
    startTime: currentHour,
  };

  const appointments = await Appointment.find(filters);

  res.status(200).json({
    status: 'success',
    data: {
      appointments,
    },
  });
});