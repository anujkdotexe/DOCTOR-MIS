import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="home-hero">
      <div className="hero-inner">
        <h2>Welcome to Doctor MIS</h2>
        <p>Your easy way to manage appointments, doctors and patients.</p>
        <div className="hero-actions">
          <Link className="btn" to="/register">Register</Link>
          <Link className="btn ghost" to="/appointments">View Appointments</Link>
        </div>
      </div>

      <section className="features">
        <div className="card">
          <h3>Find Doctors</h3>
          <p>Browse doctors by speciality and availability.</p>
        </div>
        <div className="card">
          <h3>Manage Appointments</h3>
          <p>Schedule and track patient visits easily.</p>
        </div>
        <div className="card">
          <h3>Admin Tools</h3>
          <p>Admin dashboard for managing staff and schedules.</p>
        </div>
      </section>
    </section>
  )
}
