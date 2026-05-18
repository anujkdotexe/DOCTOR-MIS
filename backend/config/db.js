const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host     : process.env.DB_HOST     || 'localhost',
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || 'root',
  password : process.env.DB_PASS     || '',
  database : process.env.DB_NAME     || 'doctor_mis',
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
  charset           : 'utf8mb4',
});

// Promisified pool for async/await
const db = pool.promise();

// Export a proxy that forwards `query` to the real DB if available,
// otherwise to a development mock. We perform the connection test async
// but keep the exported API synchronous for CommonJS require.
let liveDb = db

testConnectionAsync = async () => {
  try {
    await db.query('SELECT 1')
  } catch (err) {
    console.error('DB connection failed; using in-memory mock for development.', err.message)
    const mock = {
      query: async (sql, params) => {
        const s = (sql || '').toString().toLowerCase()
        if (s.includes('select count')) return [[{ total: 0 }], []]
        if (s.includes('select distinct specialization')) return [[{ specialization: 'General' }], []]
        if (s.includes('select distinct city')) return [[{ city: 'Unknown' }], []]
        if (s.includes('select distinct hospital')) return [[{ hospital: 'Unknown Hospital' }], []]
        if (s.includes('from doctors')) return [[ ], []]
        if (s.includes('from appointments')) return [[ ], []]
        if (s.trim().startsWith('insert')) return [{ insertId: 1 }]
        if (s.trim().startsWith('update') || s.trim().startsWith('delete')) return [{ affectedRows: 1 }]
        return [[ ], []]
      }
    }
    liveDb = mock
  }
}

// kick off async test but do not await here
testConnectionAsync()

function setMockData({ doctors = [], users = [], appointments = [] } = {}){
  liveDb = {
    query: async (sql, params) => {
      const s = (sql || '').toString().toLowerCase()
      if (s.includes('select count')) return [[{ total: doctors.length }], []]
      if (s.includes('select distinct specialization')) return [[...new Set(doctors.map(d=>d.specialization || 'General'))].map(s=>({ specialization: s })) , []]
      if (s.includes('select distinct city')) return [[...new Set(doctors.map(d=>d.city || 'Unknown'))].map(c=>({ city: c })) , []]
      if (s.includes('select distinct hospital')) return [[...new Set(doctors.map(d=>d.hospital || 'Unknown Hospital'))].map(h=>({ hospital: h })) , []]
      if (s.includes('from doctors')) {
        if (s.includes('where id =')){
          const id = params && params[0]
          const found = doctors.filter(d=>d.id == id)
          return [found, []]
        }
        return [doctors, []]
      }
      if (s.includes('from appointments')) return [appointments, []]
      if (s.includes('from users where email')){
        const email = params && params[0]
        const found = users.filter(u=>u.email === email).map(u=> ({ ...u }))
        return [found, []]
      }
      if (s.trim().startsWith('insert')){
        if (s.includes('into users')){
          const id = users.length + 1
          users.push({ id, name: params[0], email: params[1], password_hash: 'mock', role: params[3] || 'user' })
          return [{ insertId: id }]
        }
        if (s.includes('into doctors')){
          const id = doctors.length + 1
          const d = { id, name: params[0], specialization: params[1], city: params[2], hospital: params[3], consultation_fee: params[12] }
          doctors.push(d)
          return [{ insertId: id }]
        }
        if (s.includes('into appointments')){
          const id = appointments.length + 1
          appointments.push({ id, doctor_id: params[0], patient_name: params[1], patient_email: params[2], patient_phone: params[3], appointment_date: params[4], appointment_time: params[5], reason: params[6], status:'pending' })
          return [{ insertId: id }]
        }
        return [{ insertId: 1 }]
      }
      if (s.trim().startsWith('update') || s.trim().startsWith('delete')) return [{ affectedRows: 1 }]
      return [[ ], []]
    }
  }
}

module.exports = {
  query: (...args) => liveDb.query(...args),
  setMockData
}
