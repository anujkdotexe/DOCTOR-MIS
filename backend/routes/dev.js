const express = require('express')
const db = require('../config/db')

const router = express.Router()

// Dev-only seed endpoint to populate in-memory mock when real DB is unavailable
if (process.env.NODE_ENV === 'production') {
  // noop — do not expose in production
} else {
  router.post('/seed', async (req, res) => {
    const { doctors = [], users = [], appointments = [] } = req.body || {}
    if (!db.setMockData) return res.status(500).json({ success:false, message: 'Mocking not available.' })
    db.setMockData({ doctors, users, appointments })
    res.json({ success: true, message: 'Seeded mock data.' })
  })

  router.get('/debug', async (req, res) => {
    try {
      const r = await db.query('SELECT COUNT(*) AS total FROM doctors')
      res.json({ success:true, raw: r })
    } catch (err) {
      res.status(500).json({ success:false, error: err.message })
    }
  })
}

module.exports = router
