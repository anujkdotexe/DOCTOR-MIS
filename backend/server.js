require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter         = require('./routes/auth');
const doctorsRouter      = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
// dev routes removed for production readiness

const app  = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------
app.use(cors({
  origin: '*',   // In production restrict to your Netlify URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------
// Routes
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Doctor Search API is running 🟢', version: '1.0.0' });
});

app.use('/api/auth',         authRouter);
app.use('/api/doctors',      doctorsRouter);
app.use('/api/appointments', appointmentsRouter);

// ---------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ---------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ---------------------------------------------------------------
// Start server
// ---------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n  🏥  Doctor Search API`);
  console.log(`  ➜  Local: http://localhost:${PORT}\n`);
});
