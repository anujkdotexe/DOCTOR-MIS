import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DoctorCard({ doctor, onClick, onBook }){
  const navigate = useNavigate()
  const initials = (doctor.name || '').split(' ').slice(0,2).map(s=>s[0]).join('')
  return (
    <div className="card" onClick={()=>onClick && onClick(doctor)} style={{cursor: onClick ? 'pointer' : 'default'}} role="article" aria-label={`Doctor ${doctor.name}`} tabIndex={0}>
      <div className="doctor-row">
        <div className="doctor-avatar" style={{background:'linear-gradient(135deg,#7b61ff,#0066cc)'}} aria-hidden>{initials}</div>
        <div style={{flex:1}}>
          <h4>{doctor.name}</h4>
          <div className="meta">{doctor.specialization} — {doctor.city}</div>
        </div>
      </div>
      <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="text-sm muted">{doctor.hospital}</div>
          <div style={{fontWeight:700}}>₹{doctor.consultation_fee ?? '—'}</div>
        </div>
        <div>
          <button className="btn secondary" onClick={(e)=>{ e.stopPropagation(); if(onBook) onBook(doctor); else navigate('/appointments') }} aria-label={`Book appointment with ${doctor.name}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false"><path d="M7 11l5-5 5 5" stroke="#0066cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{marginLeft:8}}>Book</span>
          </button>
        </div>
      </div>
    </div>
  )
}
