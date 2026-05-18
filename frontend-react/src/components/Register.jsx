import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    const res = await registerUser({ name, email, password })
    if(res && res.success){
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/')
    } else {
      setError(res?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} type="text" name="name"/></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" name="email"/></label>
        <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" name="password"/></label>
        <div className="form-actions">
          <button className="btn" type="submit">Create Account</button>
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  )
}
