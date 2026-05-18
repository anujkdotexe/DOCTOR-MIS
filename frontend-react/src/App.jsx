import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Doctors from './components/Doctors'
import Appointments from './components/Appointments'
import AdminDashboard from './components/AdminDashboard'

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

  return (
    <div className="app-root">
      <header className="site-header">
        <h1><Link to="/">Doctor MIS</Link></h1>
        <nav>
          <Link to="/doctors">Doctors</Link>
          <Link to="/appointments">Appointments</Link>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <a onClick={logout} style={{cursor:'pointer',marginLeft:12}}>Logout</a>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/doctors" element={<Doctors/>} />
          <Route path="/appointments" element={<Appointments/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} Doctor MIS</footer>
    </div>
  )
}
