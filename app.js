const express = require('express');
const morgan = require('morgan');

const appointmentRouter = require('./routes/appointmentRoutes');
const patientRouter = require('./routes/patientRoutes');
const authRouter = require('./routes/authRoutes')
const therapistRouter = require('./routes/therapistRoutes');
const AppError = require('./utils/appError');
const globalAppError = require('./controllers/errorController')

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handlers
app.use('/api/v1/appointments', appointmentRouter); // Route mounting
app.use('/api/v1/patients', patientRouter); 
app.use('/api/v1/therapists', therapistRouter); 
app.use('/api/v1/auth', authRouter); 

// Undefined api access
app.all('*', (req, res, next) => {
  next(new AppError(`Caan't find ${req.originalUrl} on this server!`, 404))
})

// Middleware call for global erro handler
app.use(globalAppError)

module.exports = app;