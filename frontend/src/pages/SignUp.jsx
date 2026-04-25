import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showNotification } from '../components/Notification'
import './auth-shared.css'

/* ─── Validators ──────────────────────────────────────────── */
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required'
    if (v.trim().length < 3) return 'Name must be at least 3 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Name can only contain letters, spaces, hyphens'
    return ''
  },
  email: (v) => {
    if (!v) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email (e.g. you@gmail.com)'
    const knownDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','protonmail.com']
    const domain = v.split('@')[1]?.toLowerCase()
    if (domain && !knownDomains.includes(domain) && !domain.includes('.')) return 'Email domain looks invalid'
    return ''
  },
  phone: (v) => {
    if (!v) return 'Phone number is required'
    const digits = v.replace(/\D/g, '')
    if (digits.length < 10) return 'Phone must be at least 10 digits'
    if (digits.length > 13) return 'Phone number is too long'
    if (!/^[6-9]/.test(digits) && digits.length === 10) return 'Enter a valid Indian mobile number'
    return ''
  },
  password: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 6) return 'At least 6 characters required'
    return ''
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Please confirm your password'
    if (v !== form.password) return 'Passwords do not match'
    return ''
  },
}

const getStrength = (pwd) => {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 6)  score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 4)
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', '#f87171', '#fb923c', '#facc15', '#4ade80']

/* ─── Fake OTP send (replace with real API call) ─────────── */
const fakeSendOtp = () =>
  new Promise((res) => setTimeout(() => res({ success: true, otp: '123456' }), 1200))

/* ─── Component ───────────────────────────────────────────── */
export default function SignUp() {
  const navigate = useNavigate()
  const otpRefs = useRef([])

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})
  const [showPwd, setShowPwd]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* OTP state */
  const [otpStep, setOtpStep]     = useState(null)   // null | 'email' | 'phone'
  const [otpCode, setOtpCode]     = useState(['','','','','',''])
  const [otpSent, setOtpSent]     = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerified, setOtpVerified] = useState({ email: false, phone: false })
  const [countdown, setCountdown] = useState(0)
  const [devOtp, setDevOtp]       = useState('')      // dev preview only

  /* countdown timer */
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  /* ── Field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target
    // auto-format phone
    let formatted = value
    if (name === 'phone') {
      formatted = value.replace(/[^\d+\s\-()]/g, '')
    }
    const next = { ...form, [name]: formatted }
    setForm(next)
    if (touched[name]) {
      const err = name === 'confirmPassword'
        ? validators.confirmPassword(formatted, next)
        : validators[name]?.(formatted) || ''
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
    // reset verification if field changes
    if (name === 'email' && otpVerified.email) setOtpVerified((p) => ({ ...p, email: false }))
    if (name === 'phone' && otpVerified.phone) setOtpVerified((p) => ({ ...p, phone: false }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = name === 'confirmPassword'
      ? validators.confirmPassword(form[name], form)
      : validators[name]?.(form[name]) || ''
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  /* ── Send OTP ── */
  const sendOtp = async (type) => {
    // validate the field first
    const field = type === 'email' ? form.email : form.phone
    const err = type === 'email' ? validators.email(field) : validators.phone(field)
    if (err) {
      setTouched((p) => ({ ...p, [type === 'email' ? 'email' : 'phone']: true }))
      setErrors((p) => ({ ...p, [type === 'email' ? 'email' : 'phone']: err }))
      return
    }
    setOtpSending(true)
    setOtpStep(type)
    setOtpCode(['','','','','',''])
    setOtpSent(false)
    try {
      const res = await fakeSendOtp()
      if (res.success) {
        setOtpSent(true)
        setCountdown(60)
        setDevOtp(res.otp) // dev only
        showNotification(`OTP sent to your ${type}!`, 'success')
      }
    } finally {
      setOtpSending(false)
    }
  }

  /* ── OTP input ── */
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otpCode]
    next[i] = val
    setOtpCode(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otpCode[i] && i > 0) otpRefs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtpCode(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  /* ── Verify OTP ── */
  const verifyOtp = () => {
    const entered = otpCode.join('')
    if (entered.length < 6) { showNotification('Enter the 6-digit OTP', 'error'); return }
    // In production: call API to verify
    if (entered === devOtp) {
      setOtpVerified((p) => ({ ...p, [otpStep]: true }))
      setOtpStep(null)
      showNotification(`${otpStep === 'email' ? 'Email' : 'Phone'} verified! ✓`, 'success')
    } else {
      showNotification('Incorrect OTP. Please try again.', 'error')
    }
  }

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]))
    setTouched(allTouched)
    const errs = {
      name:            validators.name(form.name),
      email:           validators.email(form.email),
      phone:           validators.phone(form.phone),
      password:        validators.password(form.password),
      confirmPassword: validators.confirmPassword(form.confirmPassword, form),
    }
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) {
      showNotification('Please fix the errors below.', 'error')
      return
    }
    if (!otpVerified.email) {
      showNotification('Please verify your email address.', 'error')
      return
    }
    if (!otpVerified.phone) {
      showNotification('Please verify your phone number.', 'error')
      return
    }

    setIsLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password, phone: form.phone }),
      })
      const result = await response.json()
      if (result.success) {
        showNotification('Account created successfully! 🎉', 'success')
        navigate('/signin')
      } else {
        if (response.status === 409) showNotification('This email is already registered.', 'error')
        else showNotification(result.message || 'Signup failed', 'error')
      }
    } catch {
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fieldState = (name) =>
    touched[name] && errors[name] ? 'error'
    : touched[name] && !errors[name] && form[name] ? 'success'
    : 'idle'

  const strength = getStrength(form.password)

  return (
    <div className="auth-root">
      {/* Animated BG */}
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__orb auth-bg__orb--3" />
        <div className="auth-bg__grid" />
      </div>

      {/* Card */}
      <div className="auth-card auth-card--wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="url(#bGrad2)" />
              <path d="M10 28L20 12L30 28H24L20 21L16 28H10Z" fill="white" fillOpacity="0.9" />
              <defs>
                <linearGradient id="bGrad2" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#9f67f5" /><stop offset="1" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-brand__name">Sujan Store</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join thousands of happy customers</p>

        {/* ── OTP Modal Overlay ── */}
        {otpStep && (
          <div className="otp-overlay">
            <div className="otp-modal">
              <button className="otp-close" onClick={() => setOtpStep(null)}>×</button>
              <div className="otp-icon">
                {otpStep === 'email'
                  ? <svg viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }
              </div>
              <h3 className="otp-title">Verify your {otpStep === 'email' ? 'email' : 'phone'}</h3>
              <p className="otp-desc">
                {otpSent
                  ? <>We sent a 6-digit code to <strong>{otpStep === 'email' ? form.email : form.phone}</strong></>
                  : 'Sending OTP…'
                }
              </p>
              {/* dev hint */}
              {devOtp && <p className="otp-dev-hint">🔧 Dev OTP: <strong>{devOtp}</strong></p>}

              {/* 6-box OTP input */}
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otpCode.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className={`otp-box${d ? ' otp-box--filled' : ''}`}
                  />
                ))}
              </div>

              <button
                className="otp-verify-btn"
                onClick={verifyOtp}
                disabled={otpCode.join('').length < 6}
              >
                Verify OTP
              </button>

              <div className="otp-resend">
                {countdown > 0
                  ? <span>Resend in <strong>{countdown}s</strong></span>
                  : <button onClick={() => sendOtp(otpStep)} disabled={otpSending} className="otp-resend-btn">
                      {otpSending ? 'Sending…' : 'Resend OTP'}
                    </button>
                }
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="auth-form-grid">

            {/* Full Name */}
            <div className={`auth-field auth-field--${fieldState('name')}`}>
              <label htmlFor="su-name" className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <input id="su-name" type="text" name="name" autoComplete="name"
                  placeholder="Jane Smith" value={form.name}
                  onChange={handleChange} onBlur={handleBlur} className="auth-input" />
                {fieldState('name') === 'success' && <span className="auth-input-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
              </div>
              {touched.name && errors.name && <p className="auth-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className={`auth-field auth-field--${fieldState('email')}`}>
              <label htmlFor="su-email" className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <input id="su-email" type="email" name="email" autoComplete="email"
                  placeholder="you@example.com" value={form.email}
                  onChange={handleChange} onBlur={handleBlur} className="auth-input" />
                {otpVerified.email
                  ? <span className="auth-verified-badge">✓ Verified</span>
                  : (
                    <button type="button" className="auth-verify-btn"
                      onClick={() => sendOtp('email')} disabled={otpSending || !!validators.email(form.email)}>
                      {otpSending && otpStep === 'email' ? '…' : 'Verify'}
                    </button>
                  )
                }
              </div>
              {touched.email && errors.email && <p className="auth-error">{errors.email}</p>}
              {!otpVerified.email && !errors.email && form.email && (
                <p className="auth-hint">📧 Verify your email to continue</p>
              )}
            </div>

            {/* Phone */}
            <div className={`auth-field auth-field--${fieldState('phone')}`}>
              <label htmlFor="su-phone" className="auth-label">Phone Number</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon auth-input-icon--prefix">+91</span>
                <input id="su-phone" type="tel" name="phone" autoComplete="tel"
                  placeholder="98765 43210" value={form.phone}
                  onChange={handleChange} onBlur={handleBlur}
                  className="auth-input auth-input--phone" maxLength={13} />
                {otpVerified.phone
                  ? <span className="auth-verified-badge">✓ Verified</span>
                  : (
                    <button type="button" className="auth-verify-btn"
                      onClick={() => sendOtp('phone')} disabled={otpSending || !!validators.phone(form.phone)}>
                      {otpSending && otpStep === 'phone' ? '…' : 'Verify'}
                    </button>
                  )
                }
              </div>
              {touched.phone && errors.phone && <p className="auth-error">{errors.phone}</p>}
              {!otpVerified.phone && !errors.phone && form.phone && (
                <p className="auth-hint">📱 Verify your phone number to continue</p>
              )}
            </div>

            {/* Password */}
            <div className={`auth-field auth-field--${fieldState('password')}`}>
              <label htmlFor="su-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <input id="su-password" type={showPwd ? 'text' : 'password'} name="password"
                  autoComplete="new-password" placeholder="Min 6 characters" value={form.password}
                  onChange={handleChange} onBlur={handleBlur} className="auth-input" />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(s => !s)}>
                  {showPwd
                    ? <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    : <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                  }
                </button>
              </div>
              {form.password && (
                <div className="pwd-strength">
                  <div className="pwd-bars">
                    {[1,2,3,4].map(n => (
                      <div key={n} className="pwd-bar"
                        style={{ background: strength >= n ? strengthColor[strength] : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <span className="pwd-label" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
              {touched.password && errors.password && <p className="auth-error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className={`auth-field auth-field--${fieldState('confirmPassword')} auth-field--full`}>
              <label htmlFor="su-confirm" className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input id="su-confirm" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  autoComplete="new-password" placeholder="Repeat password" value={form.confirmPassword}
                  onChange={handleChange} onBlur={handleBlur} className="auth-input" />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm
                    ? <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    : <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                  }
                </button>
                {fieldState('confirmPassword') === 'success' && (
                  <span className="auth-input-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="auth-error">{errors.confirmPassword}</p>
              )}
            </div>

          </div>{/* /grid */}

          {/* Verification status row */}
          <div className="verify-status-row">
            <div className={`verify-pill${otpVerified.email ? ' verify-pill--done' : ''}`}>
              <span>{otpVerified.email ? '✓' : '○'}</span> Email
            </div>
            <div className={`verify-pill${otpVerified.phone ? ' verify-pill--done' : ''}`}>
              <span>{otpVerified.phone ? '✓' : '○'}</span> Phone
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="auth-submit">
            {isLoading ? (
              <span className="auth-dots"><span /><span /><span /></span>
            ) : (
              <>Create Account <span className="auth-submit-arrow">→</span></>
            )}
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