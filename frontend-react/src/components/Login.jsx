import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    const res = await loginUser({ email, password })
    if(res && res.success){
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/')
    } else {
      setError(res?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" name="email"/></label>
        <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" name="password"/></label>
        <div className="form-actions">
          <button className="btn" type="submit">Login</button>
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  )
}
