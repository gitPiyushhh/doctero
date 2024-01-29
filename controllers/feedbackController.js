const catchAsync = require('../utils/catchAsync');
const Feedback = require('../models/feedbackModel');
const Therapist = require('../models/therapistModel');

exports.getAllFeedbacks = catchAsync(async (req, res) => {
  const therapistId = req.params.id;

  // Sorting
  let sortOptions = {};
  sortOptions.updatedAt = -1;

  // Filtering
  const filters = {
    therapist: therapistId
  }

  const feedbacks = await Feedback.find(filters).populate('patient').sort(sortOptions);

  res.status(200).json({
    status: 'success',
    results: feedbacks.length,
    data: {
      feedbacks,
    },
  });
});

exports.createFeedback = catchAsync(async (req, res) => {
  const { therapist, patient, stars, content } = req.body;

  const feedbackObj = {
    therapist: therapist,
    patient: patient,
    date: new Date(),
    stars: stars,
    content: content,
  };

  const feedback = await Feedback.create(feedbackObj);

  await Therapist.findByIdAndUpdate(
    therapist,
    { $push: { feedbacks: feedback._id } },
    { new: true },
  );

  res.status(201).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});
