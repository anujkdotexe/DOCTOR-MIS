import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import Doctors from './components/Doctors'
import Appointments from './components/Appointments'
import AdminDashboard from './components/AdminDashboard'

function ProtectedAdmin({ user, children }){
  if(!user) return <Navigate to="/auth?tab=login" replace />
  if(user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App(){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const u = localStorage.getItem('user')
    if(u) setUser(JSON.parse(u))
  },[])

  function logout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand-block">
          <h1><Link to="/"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36" focusable="false" aria-hidden="true"><path d="M18 4.5c5.5 0 9.5 4 9.5 9.5 0 2.5-.8 4.5-2.2 6.3l-7.3 7.4-7.3-7.4C9.3 18.5 8.5 16.5 8.5 14c0-5.5 4-9.5 9.5-9.5Z" fill="white" opacity=".16"/><path d="M18 8.5v19" stroke="white" strokeWidth="2.3" strokeLinecap="round"/><path d="M9.5 18h17" stroke="white" strokeWidth="2.3" strokeLinecap="round"/><path d="M18 32c7.7 0 14-6.3 14-14S25.7 4 18 4 4 10.3 4 18s6.3 14 14 14Z" fill="none" stroke="white" strokeWidth="1.7" opacity=".65"/></svg></span><span>Doctor MIS</span></Link></h1>
          <p className="muted brand-subtitle">Find doctors. Book faster. Manage smarter.</p>
        </div>
        <nav className="site-nav">
          <Link to="/doctors">Doctors</Link>
          <Link to="/appointments">Appointments</Link>
          {!user ? (
            <>
              <Link to="/auth?tab=login">Login</Link>
            </>
          ) : (
            <>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button type="button" className="nav-link ghost-link" onClick={logout}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Auth onAuthSuccess={setUser}/>} />
          <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
          <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />
          <Route path="/doctors" element={<Doctors/>} />
          <Route path="/appointments" element={<Appointments/>} />
          <Route path="/admin" element={<ProtectedAdmin user={user}><AdminDashboard/></ProtectedAdmin>} />
        </Routes>
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} Doctor MIS</footer>
    </div>
  )
}
