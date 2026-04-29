import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// import { showNotification } from '../components/Notification'
import './auth-shared.css'

export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const result = await signIn(form.email, form.password)
    if (result.success) {
      showNotification('Welcome back!', 'success')
      navigate('/')
    } else {
      showNotification(result.message || 'Login failed', 'error')
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#7c3aed" />
              <path d="M10 28L20 12L30 28H24L20 21L16 28H10Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="auth-brand__name">Sujan Store</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} noValidate className="auth-form">

          {/* Email */}
          <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
            <label htmlFor="si-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="si-email" type="email" name="email"
                autoComplete="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className="auth-input"
              />
            </div>
            {errors.email && <p className="auth-err">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
            <div className="auth-label-row">
              <label htmlFor="si-password" className="auth-label">Password</label>
              <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="si-password" type={showPwd ? 'text' : 'password'} name="password"
                autoComplete="current-password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                className="auth-input"
              />
              <button type="button" className="auth-toggle-btn" onClick={() => setShowPwd(s => !s)}>
                {showPwd
                  ? <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="auth-err">{errors.password}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="auth-submit">
            {isLoading
              ? <span className="auth-dots"><span /><span /><span /></span>
              : <>Sign In <span className="auth-submit-arrow">→</span></>
            }
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-switch-link">Create one free</Link>
        </p>

      </div>
    </div>
  )
}
