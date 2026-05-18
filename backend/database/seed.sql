-- ============================================================
--  Doctor MIS — Seed + Mock Data
--  Run AFTER schema.sql
--  Contains: 3 users, 55 doctors, 12 appointments
-- ============================================================

USE doctor_mis;

-- ============================================================
--  USERS  (passwords are bcrypt hash of "Password@123")
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User',     'admin@docfind.com',   '$2a$10$uhOtyhK9wO2gRqKM7gFvvei80Ayi24ZeTt/u1AmBN.wmS4TA75RP.', 'admin'),
('Rahul Sharma',   'rahul@example.com',   '$2a$10$uhOtyhK9wO2gRqKM7gFvvei80Ayi24ZeTt/u1AmBN.wmS4TA75RP.', 'user'),
('Priya Nair',     'priya@example.com',   '$2a$10$uhOtyhK9wO2gRqKM7gFvvei80Ayi24ZeTt/u1AmBN.wmS4TA75RP.', 'user');

-- ============================================================
--  DOCTORS — 55 records
--  Covers: 12 specializations × 10 cities × 5 hospital chains
--  Ratings: 3.0 – 5.0 (every 0.5 step represented)
--  Experience: 0 – 30 yrs (junior / mid / senior bands)
-- ============================================================
INSERT INTO doctors
  (name, specialization, city, hospital, rating, experience_years, photo_url, bio, phone, email, available_days, available_time, consultation_fee)
VALUES

-- === CARDIOLOGISTS ===
('Dr. Arvind Mehta',      'Cardiologist',         'Mumbai',    'Kokilaben Dhirubhai Ambani Hospital', 4.9, 22, 'https://randomuser.me/api/portraits/men/11.jpg',  'Senior interventional cardiologist specialising in complex coronary procedures.',         '+91-98201-11001', 'arvind.mehta@kokilaben.com',     'Mon-Fri', '09:00 AM - 04:00 PM', 1200),
('Dr. Sunita Rao',        'Cardiologist',         'Bangalore', 'Manipal Hospital',                    4.7, 17, 'https://randomuser.me/api/portraits/women/12.jpg', 'Expert in non-invasive cardiology and echocardiography.',                                '+91-80-2222-0001', 'sunita.rao@manipal.com',          'Mon-Sat', '10:00 AM - 06:00 PM', 1000),
('Dr. Kiran Joshi',       'Cardiologist',         'Delhi',     'Fortis Escorts Heart Institute',      4.8, 25, 'https://randomuser.me/api/portraits/men/13.jpg',  'Pioneer in minimally invasive cardiac surgery with 5000+ surgeries.',                    '+91-11-4713-5000', 'kiran.joshi@fortis.com',          'Mon-Fri', '08:00 AM - 03:00 PM', 1500),
('Dr. Meena Pillai',      'Cardiologist',         'Chennai',   'Apollo Hospitals',                    3.5, 4,  'https://randomuser.me/api/portraits/women/14.jpg', 'Young cardiologist with special interest in preventive cardiology and lipid disorders.',  '+91-44-2829-0200', 'meena.pillai@apollo.com',         'Tue-Sun', '11:00 AM - 07:00 PM', 600),
('Dr. Rohit Bansal',      'Cardiologist',         'Hyderabad', 'Yashoda Hospitals',                   4.2, 11, 'https://randomuser.me/api/portraits/men/15.jpg',  'Experienced cardiologist focusing on heart failure management.',                          '+91-40-4567-8900', 'rohit.bansal@yashoda.com',        'Mon-Sat', '09:00 AM - 05:00 PM', 800),

-- === DERMATOLOGISTS ===
('Dr. Pooja Kapoor',      'Dermatologist',        'Mumbai',    'Hinduja Hospital',                    4.6, 13, 'https://randomuser.me/api/portraits/women/21.jpg', 'Cosmetic and medical dermatologist — acne, pigmentation, and hair loss specialist.',     '+91-22-2445-2222', 'pooja.kapoor@hinduja.com',        'Mon-Sat', '10:00 AM - 06:00 PM', 700),
('Dr. Anil Verma',        'Dermatologist',        'Delhi',     'Max Healthcare',                      4.4, 9,  'https://randomuser.me/api/portraits/men/22.jpg',  'Dermatologist with expertise in laser treatments and psoriasis management.',              '+91-11-2651-5050', 'anil.verma@maxhealthcare.com',    'Mon-Fri', '09:00 AM - 05:00 PM', 800),
('Dr. Lakshmi Iyer',      'Dermatologist',        'Chennai',   'Narayana Health',                     3.0, 1,  'https://randomuser.me/api/portraits/women/23.jpg', 'Junior dermatologist trained at Chennai Medical College. Passionate about acne care.',   '+91-44-4567-1234', 'lakshmi.iyer@narayana.com',       'Mon-Fri', '11:00 AM - 05:00 PM', 400),
('Dr. Rajesh Goyal',      'Dermatologist',        'Jaipur',    'Fortis Hospital Jaipur',              4.1, 7,  'https://randomuser.me/api/portraits/men/24.jpg',  'Known for dermoscopy and skin biopsy expertise.',                                        '+91-141-254-0000', 'rajesh.goyal@fortis.com',         'Mon-Sat', '09:00 AM - 02:00 PM', 600),
('Dr. Sunita Agarwal',    'Dermatologist',        'Pune',      'Ruby Hall Clinic',                    4.8, 20, 'https://randomuser.me/api/portraits/women/25.jpg', 'Senior dermatologist and Mohs surgery specialist.',                                       '+91-20-6645-5555', 'sunita.agarwal@rubyhall.com',     'Tue-Sat', '10:00 AM - 03:00 PM', 1100),

-- === NEUROLOGISTS ===
('Dr. Prakash Nambiar',   'Neurologist',          'Mumbai',    'Kokilaben Dhirubhai Ambani Hospital', 4.9, 28, 'https://randomuser.me/api/portraits/men/31.jpg',  'Renowned neurologist specialising in stroke management and movement disorders.',         '+91-22-3066-0000', 'prakash.nambiar@kokilaben.com',   'Mon-Thu', '09:00 AM - 01:00 PM', 1800),
('Dr. Deepa Krishnan',    'Neurologist',          'Bangalore', 'Apollo Hospitals Bangalore',          4.5, 14, 'https://randomuser.me/api/portraits/women/32.jpg', 'Expert in epilepsy, headache disorders, and neuro-rehabilitation.',                      '+91-80-2630-4050', 'deepa.krishnan@apollo.com',       'Mon-Sat', '10:00 AM - 06:00 PM', 900),
('Dr. Vikram Singh',      'Neurologist',          'Delhi',     'AIIMS Delhi',                         5.0, 30, 'https://randomuser.me/api/portraits/men/33.jpg',  'Professor and Head of Neurology at AIIMS. Pioneering research in Parkinson\'s disease.',  '+91-11-2658-8500', 'vikram.singh@aiims.ac.in',        'Mon-Fri', '08:00 AM - 12:00 PM', 0),
('Dr. Ananya Das',        'Neurologist',          'Kolkata',   'AMRI Hospitals',                      3.8, 5,  'https://randomuser.me/api/portraits/women/34.jpg', 'Neurologist with special interest in dementia and cognitive disorders.',                  '+91-33-4084-5000', 'ananya.das@amri.com',             'Mon-Sat', '11:00 AM - 07:00 PM', 700),
('Dr. Sanjay Kulkarni',   'Neurologist',          'Pune',      'Deenanath Mangeshkar Hospital',       4.3, 12, 'https://randomuser.me/api/portraits/men/35.jpg',  'Clinical neurologist experienced in managing head injuries and spinal conditions.',      '+91-20-4015-1000', 'sanjay.kulkarni@dmhospital.com',  'Tue-Sat', '09:00 AM - 05:00 PM', 850),

-- === ORTHOPEDIC SURGEONS ===
('Dr. Harish Menon',      'Orthopedic Surgeon',   'Hyderabad', 'Care Hospitals',                      4.7, 19, 'https://randomuser.me/api/portraits/men/41.jpg',  'Joint replacement and sports medicine specialist with 1000+ knee replacements.',         '+91-40-3041-5000', 'harish.menon@carehospitals.com',  'Mon-Fri', '09:00 AM - 04:00 PM', 1000),
('Dr. Geeta Bhatia',      'Orthopedic Surgeon',   'Delhi',     'Max Healthcare',                      4.0, 8,  'https://randomuser.me/api/portraits/women/42.jpg', 'Orthopaedic surgeon specialising in spine surgery and scoliosis correction.',            '+91-11-4055-4055', 'geeta.bhatia@maxhealthcare.com',  'Mon-Sat', '10:00 AM - 06:00 PM', 900),
('Dr. Rahul Patil',       'Orthopedic Surgeon',   'Mumbai',    'Hinduja Hospital',                    3.5, 3,  'https://randomuser.me/api/portraits/men/43.jpg',  'Junior orthopaedic surgeon with focus on fracture management and trauma care.',          '+91-22-2445-2223', 'rahul.patil@hinduja.com',         'Mon-Sat', '09:00 AM - 05:00 PM', 500),
('Dr. Preethi Subramaniam','Orthopedic Surgeon',  'Chennai',   'Apollo Hospitals',                    4.6, 15, 'https://randomuser.me/api/portraits/women/44.jpg','Shoulder and upper limb specialist. Pioneered arthroscopic techniques in Chennai.',      '+91-44-2829-3333', 'preethi.subramaniam@apollo.com',  'Mon-Fri', '08:00 AM - 02:00 PM', 1100),
('Dr. Arun Kumar',        'Orthopedic Surgeon',   'Chandigarh','Fortis Hospital Mohali',              4.4, 16, 'https://randomuser.me/api/portraits/men/45.jpg',  'Expert in paediatric orthopaedics and limb deformity correction.',                       '+91-172-692-2300', 'arun.kumar@fortis.com',           'Tue-Sat', '10:00 AM - 04:00 PM', 800),

-- === PEDIATRICIANS ===
('Dr. Nisha Mathur',      'Pediatrician',         'Mumbai',    'Breach Candy Hospital',               4.8, 21, 'https://randomuser.me/api/portraits/women/51.jpg', 'Consultant pediatrician with special interest in neonatal care and developmental delays.', '+91-22-2367-8888', 'nisha.mathur@breachcandy.com',   'Mon-Sat', '10:00 AM - 07:00 PM', 900),
('Dr. Suresh Iyer',       'Pediatrician',         'Chennai',   'Rainbow Children\'s Hospital',        4.5, 10, 'https://randomuser.me/api/portraits/men/52.jpg',  'Paediatric intensivist with expertise in managing critically ill children.',             '+91-44-6600-0900', 'suresh.iyer@rainbow.com',         'Mon-Fri', '09:00 AM - 05:00 PM', 700),
('Dr. Kavitha Reddy',     'Pediatrician',         'Hyderabad', 'Rainbow Children\'s Hospital',        4.9, 18, 'https://randomuser.me/api/portraits/women/53.jpg','Senior pediatrician — vaccination, nutrition, and childhood asthma specialist.',         '+91-40-4444-5555', 'kavitha.reddy@rainbow.com',       'Mon-Sat', '08:00 AM - 02:00 PM', 1000),
('Dr. Amit Sharma',       'Pediatrician',         'Delhi',     'Narayana Superspeciality',            3.8, 2,  'https://randomuser.me/api/portraits/men/54.jpg',  'Junior pediatrician with interest in paediatric allergy and immunology.',                 '+91-11-4797-6036', 'amit.sharma@narayana.com',        'Mon-Fri', '11:00 AM - 07:00 PM', 500),
('Dr. Smita Desai',       'Pediatrician',         'Pune',      'Jehangir Hospital',                   4.2, 9,  'https://randomuser.me/api/portraits/women/55.jpg', 'Friendly pediatrician known for child-friendly approach and detailed vaccination counselling.', '+91-20-6681-7777', 'smita.desai@jehangir.com',     'Tue-Sat', '10:00 AM - 05:00 PM', 650),

-- === GYNECOLOGISTS ===
('Dr. Rekha Pillai',      'Gynecologist',         'Mumbai',    'Lilavati Hospital',                   4.7, 20, 'https://randomuser.me/api/portraits/women/61.jpg', 'Expert in high-risk pregnancies and minimally invasive gynaecological surgeries.',       '+91-22-2675-1000', 'rekha.pillai@lilavati.com',       'Mon-Sat', '10:00 AM - 05:00 PM', 1000),
('Dr. Usha Namboodiri',   'Gynecologist',         'Bangalore', 'Fortis La Femme',                     4.4, 16, 'https://randomuser.me/api/portraits/women/62.jpg', 'Consultant obstetrician with expertise in IVF and reproductive medicine.',               '+91-80-4998-4998', 'usha.namboodiri@fortis.com',      'Mon-Fri', '09:00 AM - 04:00 PM', 900),
('Dr. Anita Chaudhary',   'Gynecologist',         'Delhi',     'Max Super Speciality Hospital',       5.0, 27, 'https://randomuser.me/api/portraits/women/63.jpg', 'Top-rated gynecologist in Delhi with 3000+ normal and C-section deliveries.',            '+91-11-2651-5050', 'anita.chaudhary@maxhospital.com', 'Mon-Thu', '08:00 AM - 01:00 PM', 1500),
('Dr. Poornima Nair',     'Gynecologist',         'Chennai',   'Sri Ramachandra Hospital',            3.7, 4,  'https://randomuser.me/api/portraits/women/64.jpg', 'Junior gynaecologist with interest in adolescent health and PCOS management.',           '+91-44-4592-8600', 'poornima.nair@sriramachandra.com','Tue-Sat', '11:00 AM - 06:00 PM', 550),
('Dr. Salma Khan',        'Gynecologist',         'Kolkata',   'AMRI Hospitals Salt Lake',            4.6, 14, 'https://randomuser.me/api/portraits/women/65.jpg', 'Gynaecologic oncologist and laparoscopic surgeon. Expert in ovarian cyst management.',  '+91-33-6606-3800', 'salma.khan@amri.com',             'Mon-Sat', '10:00 AM - 05:00 PM', 800),

-- === PSYCHIATRISTS ===
('Dr. Mohan Tripathi',    'Psychiatrist',         'Delhi',     'NIMHANS Delhi Centre',                4.6, 18, 'https://randomuser.me/api/portraits/men/71.jpg',  'Senior psychiatrist specialising in depression, anxiety, and OCD.',                      '+91-11-2461-0000', 'mohan.tripathi@nimhans.com',      'Mon-Fri', '10:00 AM - 04:00 PM', 800),
('Dr. Divya Menon',       'Psychiatrist',         'Bangalore', 'Cadabams Hospitals',                  4.3, 7,  'https://randomuser.me/api/portraits/women/72.jpg', 'Child and adolescent psychiatrist with expertise in ADHD and autism spectrum disorders.', '+91-80-6111-1900', 'divya.menon@cadabams.com',        'Mon-Sat', '11:00 AM - 07:00 PM', 700),
('Dr. Arjun Malhotra',    'Psychiatrist',         'Mumbai',    'Nanavati Max Hospital',               4.0, 6,  'https://randomuser.me/api/portraits/men/73.jpg',  'Psychiatrist focused on addiction medicine and de-addiction therapy.',                    '+91-22-2626-7500', 'arjun.malhotra@nanavati.com',     'Mon-Fri', '09:00 AM - 05:00 PM', 750),
('Dr. Neha Batra',        'Psychiatrist',         'Chandigarh','PGI Chandigarh',                      4.8, 22, 'https://randomuser.me/api/portraits/women/74.jpg', 'Professor of Psychiatry at PGI. Expert in schizophrenia and bipolar disorder.',          '+91-172-274-6018', 'neha.batra@pgi.edu.in',           'Mon-Wed', '09:00 AM - 12:00 PM', 0),

-- === GENERAL PHYSICIANS ===
('Dr. Sunil Kumar',       'General Physician',    'Mumbai',    'Bombay Hospital',                     4.2, 15, 'https://randomuser.me/api/portraits/men/81.jpg',  'Family physician providing comprehensive primary care for all age groups.',              '+91-22-2206-7676', 'sunil.kumar@bombayhospital.com',  'Mon-Sat', '09:00 AM - 07:00 PM', 400),
('Dr. Meera Pillai',      'General Physician',    'Hyderabad', 'Yashoda Hospitals Secunderabad',      3.9, 6,  'https://randomuser.me/api/portraits/women/82.jpg', 'General physician with special interest in diabetes and hypertension management.',       '+91-40-4567-7777', 'meera.pillai@yashoda.com',        'Mon-Fri', '10:00 AM - 06:00 PM', 350),
('Dr. Raj Kumar',         'General Physician',    'Delhi',     'Sir Ganga Ram Hospital',              4.5, 20, 'https://randomuser.me/api/portraits/men/83.jpg',  'Experienced physician known for thorough clinical evaluation and empathetic care.',      '+91-11-2575-0000', 'raj.kumar@sgrh.com',              'Mon-Sat', '08:00 AM - 02:00 PM', 600),
('Dr. Priya Das',         'General Physician',    'Kolkata',   'Belle Vue Clinic',                    3.0, 0,  'https://randomuser.me/api/portraits/women/84.jpg', 'Newly registered physician providing general consultations and wellness checks.',        '+91-33-2287-2321', 'priya.das@bellevue.com',          'Mon-Fri', '02:00 PM - 07:00 PM', 300),

-- === ENT SPECIALISTS ===
('Dr. Vignesh Rajan',     'ENT Specialist',       'Chennai',   'Apollo Hospitals',                    4.7, 17, 'https://randomuser.me/api/portraits/men/91.jpg',  'ENT surgeon specialising in cochlear implants and endoscopic sinus surgery.',            '+91-44-2829-4000', 'vignesh.rajan@apollo.com',        'Mon-Fri', '09:00 AM - 04:00 PM', 900),
('Dr. Prabhavathi M.',    'ENT Specialist',        'Bangalore','Narayana Multispeciality Hospital',   4.0, 8,  'https://randomuser.me/api/portraits/women/92.jpg', 'ENT specialist focusing on paediatric ENT disorders and allergy rhinitis.',             '+91-80-7122-2222', 'prabhavathi.m@narayana.com',      'Tue-Sat', '10:00 AM - 05:00 PM', 650),
('Dr. Ashok Tiwari',      'ENT Specialist',       'Mumbai',    'Wockhardt Hospital',                  3.6, 5,  'https://randomuser.me/api/portraits/men/93.jpg',  'ENT physician experienced in thyroid and salivary gland surgeries.',                     '+91-22-6177-4000', 'ashok.tiwari@wockhardt.com',      'Mon-Sat', '11:00 AM - 06:00 PM', 550),
('Dr. Gitanjali Bose',    'ENT Specialist',       'Kolkata',   'Peerless Hospital',                   4.4, 13, 'https://randomuser.me/api/portraits/women/94.jpg', 'Senior ENT consultant with expertise in otology and hearing rehabilitation.',            '+91-33-4011-1222', 'gitanjali.bose@peerless.com',     'Mon-Fri', '09:00 AM - 03:00 PM', 700),

-- === OPHTHALMOLOGISTS ===
('Dr. Suresh Kumar',      'Ophthalmologist',      'Ahmedabad', 'Narayana Netralaya',                  4.8, 24, 'https://randomuser.me/api/portraits/men/101.jpg', 'Cornea specialist and LASIK surgeon with 10,000+ procedures.',                           '+91-79-2768-0000', 'suresh.kumar@narayana.com',       'Mon-Sat', '09:00 AM - 05:00 PM', 1000),
('Dr. Ananya Mehta',      'Ophthalmologist',      'Mumbai',    'LV Prasad Eye Institute',             4.6, 12, 'https://randomuser.me/api/portraits/women/102.jpg','Paediatric ophthalmologist and strabismus specialist.',                                  '+91-22-3987-0102', 'ananya.mehta@lvpei.org',          'Mon-Fri', '10:00 AM - 04:00 PM', 800),
('Dr. Shyam Sundar',      'Ophthalmologist',      'Delhi',     'Shroff\'s Charity Eye Hospital',      3.4, 2,  'https://randomuser.me/api/portraits/men/103.jpg', 'Junior ophthalmologist specialising in glaucoma assessments and cataract surgeries.',   '+91-11-2334-2800', 'shyam.sundar@scharity.org',       'Mon-Fri', '11:00 AM - 06:00 PM', 400),
('Dr. Kavita Nair',       'Ophthalmologist',      'Hyderabad', 'LV Prasad Eye Institute Hyderabad',   5.0, 29, 'https://randomuser.me/api/portraits/women/104.jpg','Director of retina services. World-recognised expert in macular degeneration research.', '+91-40-3061-2000', 'kavita.nair@lvpei.org',           'Mon-Thu', '09:00 AM - 01:00 PM', 1500),

-- === ONCOLOGISTS ===
('Dr. Nitin Kapoor',      'Oncologist',           'Mumbai',    'Tata Memorial Hospital',              5.0, 26, 'https://randomuser.me/api/portraits/men/111.jpg', 'Surgical oncologist with specialisation in GI cancers. Published 80+ research papers.',  '+91-22-2417-7000', 'nitin.kapoor@tata.org',           'Mon-Fri', '08:00 AM - 01:00 PM', 0),
('Dr. Rashmi Prabha',     'Oncologist',           'Bangalore', 'HCG Cancer Hospital',                 4.6, 15, 'https://randomuser.me/api/portraits/women/112.jpg','Medical oncologist specialising in breast and lung cancer chemotherapy protocols.',     '+91-80-4064-0550', 'rashmi.prabha@hcg.com',           'Mon-Sat', '10:00 AM - 05:00 PM', 1200),
('Dr. Anil Mishra',       'Oncologist',           'Delhi',     'AIIMS Delhi',                         4.9, 23, 'https://randomuser.me/api/portraits/men/113.jpg', 'Head of Medical Oncology. Expert in targeted therapy and immunotherapy.',                '+91-11-2658-8700', 'anil.mishra@aiims.ac.in',         'Mon-Wed', '08:00 AM - 11:00 AM', 0),
('Dr. Tanvi Shah',        'Oncologist',           'Ahmedabad', 'HCG Cancer Hospital Ahmedabad',       3.7, 4,  'https://randomuser.me/api/portraits/women/114.jpg','Young oncologist with focus on palliative care and pain management.',                    '+91-79-3041-3041', 'tanvi.shah@hcg.com',              'Mon-Fri', '11:00 AM - 06:00 PM', 700),

-- === ENDOCRINOLOGISTS ===
('Dr. Rajan Menon',       'Endocrinologist',      'Hyderabad', 'Apollo Hospitals Jubilee Hills',      4.5, 16, 'https://randomuser.me/api/portraits/men/121.jpg', 'Endocrinologist specialising in Type 1 & 2 diabetes, thyroid, and adrenal disorders.',  '+91-40-2360-7777', 'rajan.menon@apollo.com',          'Mon-Sat', '09:00 AM - 05:00 PM', 900),
('Dr. Leena Ghosh',       'Endocrinologist',      'Kolkata',   'Medica Superspecialty Hospital',      4.1, 9,  'https://randomuser.me/api/portraits/women/122.jpg','Diabetes and metabolic diseases specialist. Strong background in insulin therapy.',     '+91-33-6652-0000', 'leena.ghosh@medica.com',          'Mon-Fri', '10:00 AM - 04:00 PM', 750),
('Dr. Pratik Shah',       'Endocrinologist',      'Ahmedabad', 'Sterling Hospital',                   4.7, 18, 'https://randomuser.me/api/portraits/men/123.jpg', 'Expert in thyroid surgery counselling, PCOS, and childhood growth hormone disorders.',  '+91-79-4000-6000', 'pratik.shah@sterling.com',        'Mon-Sat', '09:00 AM - 02:00 PM', 850),

-- === EDGE CASES ===
-- Two doctors with same last name in different cities
('Dr. Arjun Singh',       'Cardiologist',         'Jaipur',    'SMS Hospital',                        4.0, 10, 'https://randomuser.me/api/portraits/men/131.jpg', 'Cardiologist at SMS Hospital Jaipur with experience in rural cardiac care.',            '+91-141-251-0000', 'arjun.singh@smshospital.com',     'Mon-Sat', '09:00 AM - 05:00 PM', 400),
('Dr. Arjun Singh',       'General Physician',    'Chandigarh','Government Multi Speciality Hospital',3.5, 7,  'https://randomuser.me/api/portraits/men/132.jpg', 'General physician in Chandigarh. Same name — different city, different specialty.',     '+91-172-265-0000', 'arjun.singh2@gmsh.com',           'Mon-Fri', '08:00 AM - 12:00 PM', 200),
-- Two same specialty in same hospital
('Dr. Priyanka Gupta',    'Dermatologist',        'Pune',      'Ruby Hall Clinic',                    4.3, 6,  'https://randomuser.me/api/portraits/women/133.jpg','Dermatologist at Ruby Hall — same hospital as Dr. Sunita Agarwal.',                    '+91-20-6645-5556', 'priyanka.gupta@rubyhall.com',     'Mon-Sat', '02:00 PM - 07:00 PM', 600);


-- ============================================================
--  SAMPLE APPOINTMENTS
-- ============================================================
INSERT INTO appointments
  (doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status)
VALUES
(1,  'Manish Tomar',  'manish.tomar@gmail.com',  '+91-98765-00001', '2026-03-10', '10:00 AM', 'Chest pain and shortness of breath',            'confirmed'),
(1,  'Sheela Jain',   'sheela.jain@gmail.com',   '+91-98765-00002', '2026-03-11', '11:00 AM', 'Routine cardiac check-up',                      'pending'),
(3,  'Mohit Arora',   'mohit.arora@gmail.com',   '+91-98765-00003', '2026-03-12', '09:00 AM', 'ECG review post surgery',                       'confirmed'),
(7,  'Ritu Sharma',   'ritu.sharma@gmail.com',   '+91-98765-00004', '2026-03-09', '02:00 PM', 'Acne treatment consultation',                   'cancelled'),
(11, 'Nikhil Desai',  'nikhil.desai@gmail.com',  '+91-98765-00005', '2026-03-13', '10:30 AM', 'Frequent headaches and dizziness',              'pending'),
(16, 'Sunita Pandey', 'sunita.pandey@gmail.com', '+91-98765-00006', '2026-03-14', '09:00 AM', 'Knee pain and difficulty walking',              'confirmed'),
(21, 'Aryan Kapoor',  'aryan.kapoor@gmail.com',  '+91-98765-00007', '2026-03-08', '11:00 AM', 'Vaccination and growth check',                  'confirmed'),
(26, 'Farhana Sheikh','farhana@gmail.com',        '+91-98765-00008', '2026-03-15', '03:00 PM', 'Pregnancy follow-up at 28 weeks',               'pending'),
(32, 'Sameer Bose',   'sameer.bose@gmail.com',   '+91-98765-00009', '2026-03-16', '10:00 AM', 'Anxiety and sleep issues consultation',         'pending'),
(37, 'Lalita Reddy',  'lalita.reddy@gmail.com',  '+91-98765-00010', '2026-03-07', '01:00 PM', 'Cough, cold, and fever for 5 days',             'confirmed'),
(44, 'Vikrant Joshi', 'vikrant.joshi@gmail.com', '+91-98765-00011', '2026-03-10', '02:00 PM', 'Ear pain and hearing difficulty',               'cancelled'),
(47, 'Rekha Iyer',    'rekha.iyer@gmail.com',    '+91-98765-00012', '2026-03-12', '10:00 AM', 'Blurred vision and eye strain consultation',    'pending');
