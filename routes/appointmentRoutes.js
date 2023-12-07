const express = require('express');

const appointmentController = require('./../controllers/appointmentController');

const router = express.Router();

// Routes
router
  .route('/')
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.createAppointment);
router
  .route('/:id')
  .get(appointmentController.getAppointment)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
