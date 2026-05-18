import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api'

function getInitialMode(search){
  const params = new URLSearchParams(search)
  return params.get('tab') === 'register' ? 'register' : 'login'
}

export default function Auth(){
  const location = useLocation()
  const navigate = useNavigate()
  const initialMode = useMemo(()=> getInitialMode(location.search), [location.search])
  const [mode, setMode] = useState(initialMode)
  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [registerForm, setRegisterForm] = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(()=>{
    setMode(initialMode)
  }, [initialMode])

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const res = await loginUser(loginForm)
    setLoading(false)
    if(res?.success){
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate(res.user?.role === 'admin' ? '/admin' : '/')
      return
    }
    setError(res?.message || 'Login failed')
  }

  async function handleRegister(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const res = await registerUser(registerForm)
    setLoading(false)
    if(res?.success){
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      setSuccess('Account created successfully.')
      navigate(res.user?.role === 'admin' ? '/admin' : '/')
      return
    }
    setError(res?.message || 'Registration failed')
  }

  const onTab = (next)=>{
    setMode(next)
    setError('')
    setSuccess('')
    navigate(`/auth?tab=${next}`, { replace: true })
  }

  return (
    <div className="auth-shell container">
      <section className="auth-hero card">
        <span className="eyebrow">Welcome back</span>
        <h2>Book care, manage access, and keep everything in one place.</h2>
        <p className="muted">Use a single secure page to sign in or create your account. The design stays simple, polished, and mobile-friendly.</p>
        <div className="auth-highlights">
          <div><strong>Fast</strong><span>Quick sign in</span></div>
          <div><strong>Safe</strong><span>JWT auth flow</span></div>
          <div><strong>Clean</strong><span>Tabbed layout</span></div>
        </div>
      </section>

      <section className="auth-card auth-panel">
        <div className="auth-tabs" role="tablist" aria-label="Authentication modes">
          <button type="button" className={mode === 'login' ? 'tab active' : 'tab'} onClick={()=>onTab('login')} role="tab" aria-selected={mode === 'login'}>Login</button>
          <button type="button" className={mode === 'register' ? 'tab active' : 'tab'} onClick={()=>onTab('register')} role="tab" aria-selected={mode === 'register'}>Register</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form" aria-label="Login form">
            <label>Email
              <input required value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email:e.target.value})} type="email" autoComplete="email" placeholder="doctor@clinic.com" />
            </label>
            <label>Password
              <input required value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} type="password" autoComplete="current-password" placeholder="••••••••" />
            </label>
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
            <p className="muted helper">New here? Switch to Register to create an account.</p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form" aria-label="Register form">
            <label>Name
              <input required value={registerForm.name} onChange={e=>setRegisterForm({...registerForm, name:e.target.value})} type="text" autoComplete="name" placeholder="Your full name" />
            </label>
            <label>Email
              <input required value={registerForm.email} onChange={e=>setRegisterForm({...registerForm, email:e.target.value})} type="email" autoComplete="email" placeholder="name@example.com" />
            </label>
            <label>Password
              <input required minLength={6} value={registerForm.password} onChange={e=>setRegisterForm({...registerForm, password:e.target.value})} type="password" autoComplete="new-password" placeholder="At least 6 characters" />
            </label>
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
            <p className="muted helper">Already have an account? Switch back to Login.</p>
          </form>
        )}

        {error && <p className="form-alert error" role="alert">{error}</p>}
        {success && <p className="form-alert success" role="status">{success}</p>}
      </section>
    </div>
  )
}