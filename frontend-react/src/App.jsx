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
          <h1><Link to="/">Doctor MIS</Link></h1>
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
          <Route path="/auth" element={<Auth/>} />
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
