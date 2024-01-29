const express = require('express');

const feedbackController = require('./../controllers/feedbackController');

const router = express.Router();

// Feedback routes
router
  .route('/')
  .post(feedbackController.createFeedback);

router
  .route('/:id')
  .get(feedbackController.getAllFeedbacks)
//   .patch(patientController.updatePatient)
//   .delete(patientController.deletePatient);

module.exports = router;
