import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './auth-shared.css'

export default function SignUp() {
  const { signUp, isLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'At least 6 characters required'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const result = await signUp({ name: form.name, email: form.email, password: form.password })
    if (result.success) {
      navigate('/')
    } else {
      setServerError(result.message || 'Sign up failed')
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card auth-card--wide">

        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#7c3aed" />
              <path d="M10 28L20 12L30 28H24L20 21L16 28H10Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="auth-brand__name">Sujan Store</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join us and start shopping today</p>

        {serverError && (
          <div className="auth-server-error">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="auth-form-grid">

            {/* Name */}
            <div className={`auth-field auth-field--full ${errors.name ? 'auth-field--error' : ''}`}>
              <label htmlFor="su-name" className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  id="su-name" type="text" name="name"
                  placeholder="Jane Smith" value={form.name}
                  onChange={handleChange} className="auth-input"
                />
              </div>
              {errors.name && <p className="auth-err">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className={`auth-field auth-field--full ${errors.email ? 'auth-field--error' : ''}`}>
              <label htmlFor="su-email" className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  id="su-email" type="email" name="email"
                  placeholder="you@example.com" value={form.email}
                  onChange={handleChange} className="auth-input"
                />
              </div>
              {errors.email && <p className="auth-err">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
              <label htmlFor="su-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  id="su-password" type={showPwd ? 'text' : 'password'} name="password"
                  placeholder="Min 6 characters" value={form.password}
                  onChange={handleChange} className="auth-input"
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

            {/* Confirm Password */}
            <div className={`auth-field ${errors.confirmPassword ? 'auth-field--error' : ''}`}>
              <label htmlFor="su-confirm" className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  id="su-confirm" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  placeholder="Repeat password" value={form.confirmPassword}
                  onChange={handleChange} className="auth-input"
                />
                <button type="button" className="auth-toggle-btn" onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm
                    ? <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    : <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                  }
                </button>
              </div>
              {errors.confirmPassword && <p className="auth-err">{errors.confirmPassword}</p>}
            </div>

          </div>

          <button type="submit" disabled={isLoading} className="auth-submit">
            {isLoading
              ? <span className="auth-dots"><span /><span /><span /></span>
              : <>Create Account <span className="auth-submit-arrow">→</span></>
            }
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/signin" className="auth-switch-link">Sign in</Link>
        </p>

      </div>
    </div>
  )
}