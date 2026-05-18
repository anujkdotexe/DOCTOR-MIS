import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchDoctors, bookAppointment } from '../api'

export default function Appointments(){
  const [searchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ doctor_id:'', patient_name:'', patient_email:'', patient_phone:'', appointment_date:'', appointment_time:'', reason:'' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const selectedDoctor = useMemo(()=> doctors.find(d => String(d.id) === String(form.doctor_id)), [doctors, form.doctor_id])

  useEffect(()=>{
    fetchDoctors().then(r=>{ if(r && r.success) setDoctors(r.data || []) })
  },[])

  useEffect(()=>{
    const doctorId = searchParams.get('doctor')
    if(doctorId) setForm(prev => ({ ...prev, doctor_id: doctorId }))
  }, [searchParams])

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const res = await bookAppointment(form)
    setLoading(false)
    if(res && res.success){
      setMsg({ type:'success', text: res.message })
      setForm({ doctor_id:'', patient_name:'', patient_email:'', patient_phone:'', appointment_date:'', appointment_time:'', reason:'' })
    } else {
      setMsg({ type:'error', text: res?.message || 'Booking failed' })
    }
  }

  return (
    <div className="page container">
        <div className="section-head">
        <span className="eyebrow">Appointments</span>
        <h2>Schedule a visit in a few clear steps</h2>
        <p className="muted">Pick a doctor, choose a time, and send the request with a clean booking form.</p>
      </div>

      <div className="appointment-layout">
        <form onSubmit={submit} className="appointment-form card">
          <div className="form-grid">
            <label>Doctor
              <select required value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})}>
                <option value="">— choose a doctor —</option>
                {doctors.map(d=> <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
              </select>
            </label>
            <label>Name<input required value={form.patient_name} onChange={e=>setForm({...form,patient_name:e.target.value})} placeholder="Full name" /></label>
            <label>Email<input required type="email" value={form.patient_email} onChange={e=>setForm({...form,patient_email:e.target.value})} placeholder="you@example.com" /></label>
            <label>Phone<input required value={form.patient_phone} onChange={e=>setForm({...form,patient_phone:e.target.value})} placeholder="Mobile number" /></label>
            <label>Date<input required type="date" value={form.appointment_date} onChange={e=>setForm({...form,appointment_date:e.target.value})} /></label>
            <label>Time<input required type="time" value={form.appointment_time} onChange={e=>setForm({...form,appointment_time:e.target.value})} /></label>
          </div>
          <label>Reason<textarea rows="4" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Tell us what you need help with" /></label>
          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Booking…' : 'Book Appointment'}</button>
          </div>
          {msg && <p className={`form-alert ${msg.type}`} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}
        </form>

        <aside className="appointment-side">
          <div className="card summary-card">
            <span className="eyebrow">Selected doctor</span>
            {selectedDoctor ? (
              <>
                <h3>{selectedDoctor.name}</h3>
                <p className="muted">{selectedDoctor.specialization} • {selectedDoctor.city}</p>
                <p>{selectedDoctor.hospital}</p>
              </>
            ) : (
              <p className="muted">Choose a doctor to preview the clinic and specialty here.</p>
            )}
          </div>

          <div className="card summary-card accent-card">
            <h3>Need help?</h3>
            <p>Use the Doctors page to compare ratings, hospitals, and availability before booking.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
