const mongoose = require('mongoose');
const validator = reuqire('validatator');

const invoiceSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: false,
    unique: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
    unique: true,
  },
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String, // Paid, Unpaid, etc.
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;