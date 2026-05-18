const mysql = require('mysql2');
require('dotenv').config();

function now(){
  return new Date().toISOString();
}

function seedData(){
  const passwordHash = '$2a$10$uhOtyhK9wO2gRqKM7gFvvei80Ayi24ZeTt/u1AmBN.wmS4TA75RP.';

  const users = [
    { id: 1, name: 'Admin User', email: 'admin@docfind.com', password_hash: passwordHash, role: 'admin', created_at: now() },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', password_hash: passwordHash, role: 'user', created_at: now() },
    { id: 3, name: 'Priya Nair', email: 'priya@example.com', password_hash: passwordHash, role: 'user', created_at: now() },
  ];

  const doctors = [
    { id: 1, name: 'Dr. Arvind Mehta', specialization: 'Cardiologist', city: 'Mumbai', hospital: 'Kokilaben Dhirubhai Ambani Hospital', rating: 4.9, experience_years: 22, photo_url: 'https://randomuser.me/api/portraits/men/11.jpg', bio: 'Senior interventional cardiologist specialising in complex coronary procedures.', phone: '+91-98201-11001', email: 'arvind.mehta@kokilaben.com', available_days: 'Mon-Fri', available_time: '09:00 AM - 04:00 PM', consultation_fee: 1200, created_at: now() },
    { id: 2, name: 'Dr. Sunita Rao', specialization: 'Cardiologist', city: 'Bangalore', hospital: 'Manipal Hospital', rating: 4.7, experience_years: 17, photo_url: 'https://randomuser.me/api/portraits/women/12.jpg', bio: 'Expert in non-invasive cardiology and echocardiography.', phone: '+91-80-2222-0001', email: 'sunita.rao@manipal.com', available_days: 'Mon-Sat', available_time: '10:00 AM - 06:00 PM', consultation_fee: 1000, created_at: now() },
    { id: 3, name: 'Dr. Kiran Joshi', specialization: 'Cardiologist', city: 'Delhi', hospital: 'Fortis Escorts Heart Institute', rating: 4.8, experience_years: 25, photo_url: 'https://randomuser.me/api/portraits/men/13.jpg', bio: 'Pioneer in minimally invasive cardiac surgery with 5000+ surgeries.', phone: '+91-11-4713-5000', email: 'kiran.joshi@fortis.com', available_days: 'Mon-Fri', available_time: '08:00 AM - 03:00 PM', consultation_fee: 1500, created_at: now() },
    { id: 4, name: 'Dr. Meena Pillai', specialization: 'Cardiologist', city: 'Chennai', hospital: 'Apollo Hospitals', rating: 3.5, experience_years: 4, photo_url: 'https://randomuser.me/api/portraits/women/14.jpg', bio: 'Young cardiologist with special interest in preventive cardiology and lipid disorders.', phone: '+91-44-2829-0200', email: 'meena.pillai@apollo.com', available_days: 'Tue-Sun', available_time: '11:00 AM - 07:00 PM', consultation_fee: 600, created_at: now() },
    { id: 5, name: 'Dr. Rohit Bansal', specialization: 'Cardiologist', city: 'Hyderabad', hospital: 'Yashoda Hospitals', rating: 4.2, experience_years: 11, photo_url: 'https://randomuser.me/api/portraits/men/15.jpg', bio: 'Experienced cardiologist focusing on heart failure management.', phone: '+91-40-4567-8900', email: 'rohit.bansal@yashoda.com', available_days: 'Mon-Sat', available_time: '09:00 AM - 05:00 PM', consultation_fee: 800, created_at: now() },
    { id: 6, name: 'Dr. Pooja Kapoor', specialization: 'Dermatologist', city: 'Mumbai', hospital: 'Hinduja Hospital', rating: 4.6, experience_years: 13, photo_url: 'https://randomuser.me/api/portraits/women/21.jpg', bio: 'Cosmetic and medical dermatologist — acne, pigmentation, and hair loss specialist.', phone: '+91-22-2445-2222', email: 'pooja.kapoor@hinduja.com', available_days: 'Mon-Sat', available_time: '10:00 AM - 06:00 PM', consultation_fee: 700, created_at: now() },
    { id: 7, name: 'Dr. Anil Verma', specialization: 'Dermatologist', city: 'Delhi', hospital: 'Max Healthcare', rating: 4.4, experience_years: 9, photo_url: 'https://randomuser.me/api/portraits/men/22.jpg', bio: 'Dermatologist with expertise in laser treatments and psoriasis management.', phone: '+91-11-2651-5050', email: 'anil.verma@maxhealthcare.com', available_days: 'Mon-Fri', available_time: '09:00 AM - 05:00 PM', consultation_fee: 800, created_at: now() },
    { id: 8, name: 'Dr. Lakshmi Iyer', specialization: 'Dermatologist', city: 'Chennai', hospital: 'Narayana Health', rating: 3.0, experience_years: 1, photo_url: 'https://randomuser.me/api/portraits/women/23.jpg', bio: 'Junior dermatologist trained at Chennai Medical College. Passionate about acne care.', phone: '+91-44-4567-1234', email: 'lakshmi.iyer@narayana.com', available_days: 'Mon-Fri', available_time: '11:00 AM - 05:00 PM', consultation_fee: 400, created_at: now() },
    { id: 9, name: 'Dr. Nisha Mathur', specialization: 'Pediatrician', city: 'Mumbai', hospital: 'Breach Candy Hospital', rating: 4.8, experience_years: 21, photo_url: 'https://randomuser.me/api/portraits/women/51.jpg', bio: 'Consultant pediatrician with special interest in neonatal care and developmental delays.', phone: '+91-22-2367-8888', email: 'nisha.mathur@breachcandy.com', available_days: 'Mon-Sat', available_time: '10:00 AM - 07:00 PM', consultation_fee: 900, created_at: now() },
    { id: 10, name: 'Dr. Suresh Iyer', specialization: 'Pediatrician', city: 'Chennai', hospital: 'Rainbow Children\'s Hospital', rating: 4.5, experience_years: 10, photo_url: 'https://randomuser.me/api/portraits/men/52.jpg', bio: 'Paediatric intensivist with expertise in managing critically ill children.', phone: '+91-44-6600-0900', email: 'suresh.iyer@rainbow.com', available_days: 'Mon-Fri', available_time: '09:00 AM - 05:00 PM', consultation_fee: 700, created_at: now() },
  ];

  const appointments = [
    { id: 1, doctor_id: 1, patient_name: 'Manish Tomar', patient_email: 'manish.tomar@gmail.com', patient_phone: '+91-98765-00001', appointment_date: '2026-05-20', appointment_time: '10:00 AM', reason: 'Chest pain and shortness of breath', status: 'confirmed', created_at: now() },
    { id: 2, doctor_id: 3, patient_name: 'Sheela Jain', patient_email: 'sheela.jain@gmail.com', patient_phone: '+91-98765-00002', appointment_date: '2026-05-21', appointment_time: '11:00 AM', reason: 'Routine cardiac check-up', status: 'pending', created_at: now() },
  ];

  return { users, doctors, appointments, nextUserId: 4, nextDoctorId: 11, nextAppointmentId: 3 };
}

const mock = seedData();
const realDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'doctor_mis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
}).promise();

function clone(value){
  return JSON.parse(JSON.stringify(value));
}

function normalize(sql){
  return String(sql || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function filterDoctors(sql, params){
  const normalized = normalize(sql);
  const hasTextSearch = normalized.includes('(name like ? or hospital like ?)');
  const hasSpecialization = normalized.includes('specialization = ?');
  const hasCity = normalized.includes('city = ?');
  const hasHospital = normalized.includes('hospital like ?');
  const hasMinRating = normalized.includes('rating >= ?');
  const hasMaxRating = normalized.includes('rating <= ?');
  const hasJunior = normalized.includes('experience_years between 0 and 5');
  const hasMid = normalized.includes('experience_years between 6 and 15');
  const hasSenior = normalized.includes('experience_years >= 16');
  let index = 0;

  return mock.doctors.filter(doctor => {
    if (hasTextSearch) {
      const nameSearch = String(params[index++] || '').replace(/%/g, '').toLowerCase();
      const hospitalSearch = String(params[index++] || '').replace(/%/g, '').toLowerCase();
      if (!(doctor.name.toLowerCase().includes(nameSearch) || doctor.hospital.toLowerCase().includes(hospitalSearch))) return false;
    }
    if (hasSpecialization && doctor.specialization !== params[index++]) return false;
    if (hasCity && doctor.city !== params[index++]) return false;
    if (hasHospital && !doctor.hospital.toLowerCase().includes(String(params[index++] || '').replace(/%/g, '').toLowerCase())) return false;
    if (hasMinRating && !(doctor.rating >= Number(params[index++]))) return false;
    if (hasMaxRating && !(doctor.rating <= Number(params[index++]))) return false;
    if (hasJunior && !(doctor.experience_years >= 0 && doctor.experience_years <= 5)) return false;
    if (hasMid && !(doctor.experience_years >= 6 && doctor.experience_years <= 15)) return false;
    if (hasSenior && !(doctor.experience_years >= 16)) return false;
    return true;
  });
}

function filterAppointments(params){
  const [status, doctorId, date] = params;
  return mock.appointments.filter(appointment => {
    if (status !== undefined && appointment.status !== status) return false;
    if (doctorId !== undefined && String(appointment.doctor_id) !== String(doctorId)) return false;
    if (date !== undefined && appointment.appointment_date !== date) return false;
    return true;
  });
}

function handleMockQuery(sql, params = []){
  const normalized = normalize(sql);

  if (normalized === 'select 1 as ok') {
    return [[{ ok: 1 }]];
  }

  if (normalized.includes('select count(*) as total from doctors')) {
    return [[{ total: filterDoctors(sql, params).length }]];
  }

  if (normalized.includes('select distinct specialization from doctors')) {
    return [Array.from(new Set(mock.doctors.map(d => d.specialization))).sort().map(specialization => ({ specialization }))];
  }

  if (normalized.includes('select distinct city from doctors')) {
    return [Array.from(new Set(mock.doctors.map(d => d.city))).sort().map(city => ({ city }))];
  }

  if (normalized.includes('select distinct hospital from doctors')) {
    return [Array.from(new Set(mock.doctors.map(d => d.hospital))).sort().map(hospital => ({ hospital }))];
  }

  if (normalized.includes('from doctors where id = ?')) {
    const doctor = mock.doctors.find(item => String(item.id) === String(params[0]));
    if (!doctor) return [[]];
    if (normalized.startsWith('select id, name')) {
      return [[{ id: doctor.id, name: doctor.name }]];
    }
    return [[clone(doctor)]];
  }

  if (normalized.startsWith('select * from doctors')) {
    const rows = filterDoctors(sql, params).sort((a, b) => b.rating - a.rating || b.experience_years - a.experience_years);
    return [clone(rows)];
  }

  if (normalized.startsWith('insert into doctors')) {
    const [name, specialization, city, hospital, rating = 4.0, experience_years = 0, photo_url = null, bio = null, phone = null, email = null, available_days = 'Mon-Sat', available_time = '09:00 AM - 05:00 PM', consultation_fee = 500] = params;
    const row = { id: mock.nextDoctorId++, name, specialization, city, hospital, rating, experience_years, photo_url, bio, phone, email, available_days, available_time, consultation_fee, created_at: now() };
    mock.doctors.unshift(row);
    return [{ insertId: row.id, affectedRows: 1 }];
  }

  if (normalized.startsWith('update doctors set')) {
    const id = params[params.length - 1];
    const doctor = mock.doctors.find(item => String(item.id) === String(id));
    if (!doctor) return [{ affectedRows: 0 }];
    const setClause = String(sql).slice(String(sql).toLowerCase().indexOf('set') + 3, String(sql).toLowerCase().indexOf('where')).split(',').map(item => item.trim());
    setClause.forEach((assignment, index) => {
      doctor[assignment.split('=')[0].trim()] = params[index];
    });
    return [{ affectedRows: 1 }];
  }

  if (normalized.startsWith('delete from doctors where id = ?')) {
    const index = mock.doctors.findIndex(item => String(item.id) === String(params[0]));
    if (index === -1) return [{ affectedRows: 0 }];
    mock.doctors.splice(index, 1);
    return [{ affectedRows: 1 }];
  }

  if (normalized === 'select id from users where email = ?') {
    return [mock.users.filter(user => user.email === params[0]).map(user => ({ id: user.id }))];
  }

  if (normalized.startsWith('select * from users where email = ?')) {
    return [mock.users.filter(user => user.email === params[0]).map(clone)];
  }

  if (normalized.startsWith('insert into users')) {
    const [name, email, password_hash, role] = params;
    const row = { id: mock.nextUserId++, name, email, password_hash, role, created_at: now() };
    mock.users.push(row);
    return [{ insertId: row.id, affectedRows: 1 }];
  }

  if (normalized.startsWith('update users set')) {
    const email = params[params.length - 1];
    const user = mock.users.find(item => item.email === email);
    if (!user) return [{ affectedRows: 0 }];
    user.name = params[0];
    user.password_hash = params[1];
    user.role = params[2];
    return [{ affectedRows: 1 }];
  }

  if (normalized.includes('select count(*) as total from appointments')) {
    return [[{ total: filterAppointments(params).length }]];
  }

  if (normalized.includes('select a.*, d.name as doctor_name')) {
    const rows = filterAppointments(params).map(appointment => {
      const doctor = mock.doctors.find(item => String(item.id) === String(appointment.doctor_id));
      return clone({ ...appointment, doctor_name: doctor?.name || null, specialization: doctor?.specialization || null, city: doctor?.city || null });
    });
    rows.sort((a, b) => String(b.appointment_date).localeCompare(String(a.appointment_date)) || String(b.created_at).localeCompare(String(a.created_at)));
    return [rows];
  }

  if (normalized.startsWith('insert into appointments')) {
    const [doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason = null] = params;
    const doctor = mock.doctors.find(item => String(item.id) === String(doctor_id));
    const row = { id: mock.nextAppointmentId++, doctor_id: Number(doctor_id), patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status: 'pending', created_at: now() };
    mock.appointments.unshift(row);
    return [{ insertId: row.id, affectedRows: 1, doctor_name: doctor?.name || null }];
  }

  if (normalized.startsWith('update appointments set status = ? where id = ?')) {
    const [status, id] = params;
    const appointment = mock.appointments.find(item => String(item.id) === String(id));
    if (!appointment) return [{ affectedRows: 0 }];
    appointment.status = status;
    return [{ affectedRows: 1 }];
  }

  return null;
}

const fallbackCodes = new Set(['ER_ACCESS_DENIED_ERROR', 'ECONNREFUSED', 'ER_BAD_DB_ERROR', 'ER_HOST_NOT_PRIVILEGED']);
let useMock = false;

const db = {
  mock: false,
  async query(sql, params = []){
    if (useMock) {
      return handleMockQuery(sql, params);
    }

    try {
      return await realDb.query(sql, params);
    } catch (err) {
      if (fallbackCodes.has(err.code) || /access denied/i.test(err.message || '') || /connect/i.test(err.message || '')) {
        useMock = true;
        db.mock = true;
        return handleMockQuery(sql, params);
      }
      throw err;
    }
  },
};

module.exports = db;