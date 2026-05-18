import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDoctors, fetchDoctor } from '../api'
import DoctorCard from './DoctorCard'
import SearchBar from './SearchBar'

export default function Doctors(){
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    let mounted = true
    fetchDoctors().then(res=>{
      if(!mounted) return
      if(res && res.success){ setDoctors(res.data || []); setFiltered(res.data || []) }
      setLoading(false)
    }).catch(()=>setLoading(false))
    return ()=> mounted = false
  },[])

  const cityOptions = Array.from(new Set(doctors.map(d => d.city).filter(Boolean))).sort()

  function onSearch(val){
    const ql = (val ?? q).toLowerCase()
    const cityMatch = city.toLowerCase()
    setFiltered(doctors.filter(d=> {
      const matchesText = (d.name||'').toLowerCase().includes(ql) || (d.hospital||'').toLowerCase().includes(ql) || (d.specialization||'').toLowerCase().includes(ql)
      const matchesCity = !cityMatch || (d.city||'').toLowerCase() === cityMatch
      return matchesText && matchesCity
    }))
  }

  useEffect(()=>{ onSearch(q) }, [city])

  return (
    <div className="container">
      <div className="section-head">
        <span className="eyebrow">Doctors</span>
        <h2>Search by name, hospital, specialty, or city</h2>
      </div>
      <SearchBar value={q} city={city} cityOptions={cityOptions} onChange={(v)=>{ setQ(v); onSearch(v) }} onCityChange={setCity} onSearch={()=>onSearch()} />
      {loading ? <p>Loading…</p> : (
        <div className="grid" style={{marginTop:16}}>
          {filtered.map(d=> <DoctorCard key={d.id} doctor={d} onClick={setSelected} onBook={(doctor)=>navigate(`/appointments?doctor=${doctor.id}`)} />)}
        </div>
      )}

      {selected && (
        <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setSelected(null)}>
          <div className="card" style={{width:560}} onClick={e=>e.stopPropagation()}>
            <h3>{selected.name}</h3>
            <div className="muted">{selected.specialization} — {selected.city}</div>
            <p style={{marginTop:12}}>{selected.bio || 'Experienced doctor.'}</p>
            <div style={{textAlign:'right'}}><button className="btn primary" onClick={()=> navigate(`/appointments?doctor=${selected.id}`)}>Book Appointment</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
