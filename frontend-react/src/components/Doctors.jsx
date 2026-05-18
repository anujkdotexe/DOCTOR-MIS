import React, { useEffect, useState } from 'react'
import { fetchDoctors } from '../api'

export default function Doctors(){
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    fetchDoctors().then(res=>{
      if(!mounted) return
      if(res && res.success) setDoctors(res.data || [])
      setLoading(false)
    }).catch(()=>setLoading(false))
    return ()=> mounted = false
  },[])

  return (
    <div className="page">
      <h2>Doctors</h2>
      {loading ? <p>Loading…</p> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
          {doctors.map(d=> (
            <div key={d.id} className="card">
              <h4>{d.name}</h4>
              <p style={{margin:0}}>{d.specialization} — {d.city}</p>
              <p style={{color:'#666'}}>{d.hospital}</p>
              <p style={{fontWeight:600}}>Fee: ₹{d.consultation_fee ?? '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
