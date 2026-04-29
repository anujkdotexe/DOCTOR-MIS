const express = require('express');
const db      = require('../config/db');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// ---------------------------------------------------------------
// POST /api/appointments  — any user (no auth required)
// ---------------------------------------------------------------
router.post('/', async (req, res) => {
  const { doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason } = req.body;

  if (!doctor_id || !patient_name || !patient_email || !patient_phone || !appointment_date || !appointment_time) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Verify doctor exists
    const [docs] = await db.query('SELECT id, name FROM doctors WHERE id = ?', [doctor_id]);
    if (docs.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const [result] = await db.query(
      `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason || null]
    );

    res.status(201).json({
      success    : true,
      message    : `Appointment booked with ${docs[0].name}.`,
      id         : result.insertId,
      doctor_name: docs[0].name,
    });
  } catch (err) {
    console.error('POST /appointments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// GET /api/appointments  — admin only
// Query params: status, doctor_id, date, page, limit
// ---------------------------------------------------------------
router.get('/', authenticate, adminOnly, async (req, res) => {
  const { status, doctor_id, date, page = 1, limit = 20 } = req.query;

  const conditions = [];
  const params     = [];

  if (status)    { conditions.push('a.status = ?');        params.push(status); }
  if (doctor_id) { conditions.push('a.doctor_id = ?');     params.push(doctor_id); }
  if (date)      { conditions.push('a.appointment_date = ?'); params.push(date); }

  const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM appointments a ${where}`,
      params
    );

    const [rows] = await db.query(
      `SELECT a.*, d.name AS doctor_name, d.specialization, d.city
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       ${where}
       ORDER BY a.appointment_date DESC, a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)), data: rows });
  } catch (err) {
    console.error('GET /appointments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// PATCH /api/appointments/:id/status  — admin only
// ---------------------------------------------------------------
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'status must be pending | confirmed | cancelled.' });
  }

  try {
    const [result] = await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.json({ success: true, message: `Appointment status updated to ${status}.` });
  } catch (err) {
    console.error('PATCH /appointments/:id/status error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
