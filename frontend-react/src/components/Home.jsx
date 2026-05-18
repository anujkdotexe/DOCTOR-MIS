import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDoctors } from '../api'
import DoctorCard from './DoctorCard'

export default function Home(){
  const [doctors, setDoctors] = useState([])

  useEffect(()=>{ fetchDoctors().then(r=> r && r.success && setDoctors((r.data||[]).slice(0,6))) },[])

  return (
    <section>
      <div className="hero">
        <div className="hero-inner container">
          <div className="hero-copy">
            <h2>Find trusted doctors near you</h2>
            <p>Search specialties, check availability and book appointments in a few clicks.</p>
            <div className="hero-actions">
              <Link className="btn" to="/doctors">Explore Doctors</Link>
              <Link className="btn secondary" to="/appointments">Book Appointment</Link>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{background:'rgba(255,255,255,0.08)',padding:16,borderRadius:12}}>
              <h3 style={{color:'#fff',marginTop:0}}>Featured doctors</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {doctors.map(d=> <DoctorCard key={d.id} doctor={d} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section style={{marginTop:24}}>
          <h3>Why Doctor MIS?</h3>
          <div className="features">
            <div className="card"><h4>Reliable</h4><p className="muted">Verified doctors and clinic details.</p></div>
            <div className="card"><h4>Fast Booking</h4><p className="muted">Book appointments in under a minute.</p></div>
            <div className="card"><h4>Admin Tools</h4><p className="muted">Manage doctors and appointments with ease.</p></div>
          </div>
        </section>
      </div>
    </section>
  )
}
