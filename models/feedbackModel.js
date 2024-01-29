const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: [true, 'Please provide doctor name'],
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Please provide patient name'],
  },
  stars: {
    type: Number,
    required: [true, 'Please give rating in stars'],
  },
  content: {
    type: String,
    required: [true, 'Please provide your feedback'],
    validate: {
      validator: function (value) {
        // Custom validator to check the word limit
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 40;
      },
      message: 'Feedback content should have a maximum of 30 words.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
},  {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
