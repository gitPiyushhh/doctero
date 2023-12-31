const express = require('express');

const therapistController = require('./../controllers/therapistController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Therapist routes
router
  .route('/')
  .get(authController.protect, therapistController.getAllTherapists)
  .post(therapistController.createTherapist);

router
  .route('/:id')
  .get(therapistController.getTherapist)
  .patch(therapistController.updateTherapist)
  .delete(therapistController.deleteTherapist);

router.route('/appointments/:id').get(therapistController.getAllAppointmentsForTherpist)

module.exports = router;
