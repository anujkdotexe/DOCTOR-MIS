const express = require('express');
const db      = require('../config/db');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// ---------------------------------------------------------------
// GET /api/doctors
// Query params: name, specialization, city, hospital, min_rating, max_rating, experience, page, limit
// ---------------------------------------------------------------
router.get('/', async (req, res) => {
  const {
    name,
    specialization,
    city,
    hospital,
    min_rating,
    max_rating,
    experience,   // 'junior' | 'mid' | 'senior'
    page  = 1,
    limit = 12,
  } = req.query;

  const conditions = [];
  const params     = [];

  if (name) {
    conditions.push('(name LIKE ? OR hospital LIKE ?)');
    params.push(`%${name}%`, `%${name}%`);
  }
  if (specialization) {
    conditions.push('specialization = ?');
    params.push(specialization);
  }
  if (city) {
    conditions.push('city = ?');
    params.push(city);
  }
  if (hospital) {
    conditions.push('hospital LIKE ?');
    params.push(`%${hospital}%`);
  }
  if (min_rating) {
    conditions.push('rating >= ?');
    params.push(parseFloat(min_rating));
  }
  if (max_rating) {
    conditions.push('rating <= ?');
    params.push(parseFloat(max_rating));
  }
  if (experience === 'junior') {
    conditions.push('experience_years BETWEEN 0 AND 5');
  } else if (experience === 'mid') {
    conditions.push('experience_years BETWEEN 6 AND 15');
  } else if (experience === 'senior') {
    conditions.push('experience_years >= 16');
  }

  const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM doctors ${where}`,
      params
    );

    const [rows] = await db.query(
      `SELECT * FROM doctors ${where} ORDER BY rating DESC, experience_years DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success : true,
      total,
      page    : parseInt(page),
      limit   : parseInt(limit),
      pages   : Math.ceil(total / parseInt(limit)),
      data    : rows,
    });
  } catch (err) {
    console.error('GET /doctors error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// GET /api/doctors/meta  — distinct values for filter dropdowns
// ---------------------------------------------------------------
router.get('/meta', async (req, res) => {
  try {
    const [[specs], [cities], [hospitals]] = await Promise.all([
      db.query('SELECT DISTINCT specialization FROM doctors ORDER BY specialization'),
      db.query('SELECT DISTINCT city FROM doctors ORDER BY city'),
      db.query('SELECT DISTINCT hospital FROM doctors ORDER BY hospital'),
    ]);

    res.json({
      success       : true,
      specializations: specs.map(r => r.specialization),
      cities        : cities.map(r => r.city),
      hospitals     : hospitals.map(r => r.hospital),
    });
  } catch (err) {
    console.error('GET /doctors/meta error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// GET /api/doctors/:id
// ---------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GET /doctors/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// POST /api/doctors  — admin only
// ---------------------------------------------------------------
router.post('/', authenticate, adminOnly, async (req, res) => {
  const {
    name, specialization, city, hospital, rating = 4.0,
    experience_years = 0, photo_url, bio, phone, email,
    available_days, available_time, consultation_fee = 500,
  } = req.body;

  if (!name || !specialization || !city || !hospital) {
    return res.status(400).json({ success: false, message: 'name, specialization, city, and hospital are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO doctors
        (name, specialization, city, hospital, rating, experience_years, photo_url, bio, phone, email, available_days, available_time, consultation_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, specialization, city, hospital, rating, experience_years, photo_url, bio, phone, email, available_days, available_time, consultation_fee]
    );
    res.status(201).json({ success: true, message: 'Doctor added.', id: result.insertId });
  } catch (err) {
    console.error('POST /doctors error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// PUT /api/doctors/:id  — admin only
// ---------------------------------------------------------------
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const fields = [
    'name', 'specialization', 'city', 'hospital', 'rating',
    'experience_years', 'photo_url', 'bio', 'phone', 'email',
    'available_days', 'available_time', 'consultation_fee',
  ];

  const updates = [];
  const params  = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      params.push(req.body[f]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update.' });
  }

  params.push(req.params.id);

  try {
    const [result] = await db.query(
      `UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.json({ success: true, message: 'Doctor updated.' });
  } catch (err) {
    console.error('PUT /doctors/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---------------------------------------------------------------
// DELETE /api/doctors/:id  — admin only
// ---------------------------------------------------------------
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.json({ success: true, message: 'Doctor deleted.' });
  } catch (err) {
    console.error('DELETE /doctors/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
