const express = require('express');

const patientController = require('./../controllers/patientController');

const router = express.Router();

// Patient routes
router
  .route('/')
  .get(patientController.getAllPatients)
  .post(patientController.createPatient);

router
  .route('/:id')
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(patientController.deletePatient);

router.route('/appointments/:id').get(patientController.getAllAppointmentsForPatient);
router.route('/liveAppointment/:id/:hour').get(patientController.getLiveAppointmentForPatient);

module.exports = router;
