-- ============================================================
--  Doctor MIS — Database Schema
--  Run this first, then seed.sql, then mock_data.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS doctor_mis
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE doctor_mis;

-- ------------------------------------------------------------
--  1. USERS (patients + admins)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)   NOT NULL,
  email         VARCHAR(180)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)   NOT NULL,
  role          ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  2. DOCTORS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id               INT            AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(120)   NOT NULL,
  specialization   VARCHAR(80)    NOT NULL,
  city             VARCHAR(80)    NOT NULL,
  hospital         VARCHAR(150)   NOT NULL,
  rating           DECIMAL(2,1)   NOT NULL DEFAULT 4.0,
  experience_years TINYINT        NOT NULL DEFAULT 0,
  photo_url        VARCHAR(300)   DEFAULT NULL,
  bio              TEXT           DEFAULT NULL,
  phone            VARCHAR(20)    DEFAULT NULL,
  email            VARCHAR(180)   DEFAULT NULL,
  available_days   VARCHAR(100)   DEFAULT 'Mon-Sat',
  available_time   VARCHAR(60)    DEFAULT '09:00 AM - 05:00 PM',
  consultation_fee SMALLINT       DEFAULT 500,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_specialization (specialization),
  INDEX idx_city            (city),
  INDEX idx_rating          (rating),
  INDEX idx_experience      (experience_years),
  FULLTEXT ft_name_hospital (name, hospital)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  3. APPOINTMENTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id               INT          AUTO_INCREMENT PRIMARY KEY,
  doctor_id        INT          NOT NULL,
  patient_name     VARCHAR(120) NOT NULL,
  patient_email    VARCHAR(180) NOT NULL,
  patient_phone    VARCHAR(20)  NOT NULL,
  appointment_date DATE         NOT NULL,
  appointment_time VARCHAR(20)  NOT NULL,
  reason           TEXT         DEFAULT NULL,
  status           ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_doctor   (doctor_id),
  INDEX idx_status   (status),
  INDEX idx_date     (appointment_date)
) ENGINE=InnoDB;
