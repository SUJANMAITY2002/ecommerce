import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showNotification } from '../components/Notification'
import { getSignupFormErrors } from '../utils/validation'

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFocus = (name) => setFocused(prev => ({ ...prev, [name]: true }))
  const handleBlur = (name) => setFocused(prev => ({ ...prev, [name]: false }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = getSignupFormErrors(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        })
      })
      const result = await response.json()

      if (result.success) {
        showNotification(result.message || 'Account created successfully!', 'success')
        navigate('/signin')
      } else {
        if (response.status === 409) {
          showNotification('This email is already registered. Please sign in.', 'error')
        } else {
          showNotification(result.message || 'Signup failed', 'error')
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .auth-page {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .auth-visual {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .auth-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(192, 132, 252, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 70% 70%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(15, 15, 30, 1) 40%, #0a0a0f 100%);
        }

        .auth-visual-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%);
        }

        .auth-visual-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 3rem;
        }

        .auth-monogram {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(5rem, 12vw, 9rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1;
          background: linear-gradient(135deg, #e2d9f3 0%, #c084fc 40%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          animation: fadeSlideIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          animation: fadeSlideIn 1.2s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .auth-orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.15), transparent 70%);
          top: -100px; left: -100px;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .auth-orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%);
          bottom: -80px; right: -80px;
          animation: orbFloat 10s 2s ease-in-out infinite reverse;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }

        .auth-panel {
          width: 500px;
          flex-shrink: 0;
          background: rgba(12, 12, 20, 0.95);
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
          animation: panelSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes panelSlide {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .auth-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(192, 132, 252, 0.4), transparent);
        }

        .auth-form-inner {
          width: 100%;
          max-width: 380px;
        }

        .auth-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 300;
          color: #f0ebff;
          letter-spacing: -0.01em;
          margin-bottom: 0.35rem;
          animation: fadeSlideIn 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-subheading {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          letter-spacing: 0.01em;
          margin-bottom: 2rem;
          animation: fadeSlideIn 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9rem;
        }

        .form-field {
          margin-bottom: 1.1rem;
          animation: fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .form-field:nth-child(1) { animation-delay: 0.25s; }
        .form-field:nth-child(2) { animation-delay: 0.32s; }
        .form-field:nth-child(3) { animation-delay: 0.39s; }
        .form-field:nth-child(4) { animation-delay: 0.46s; }

        .field-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }
        .field-label.focused { color: rgba(192, 132, 252, 0.8); }

        .field-input-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.85rem 1.1rem;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          color: #f0ebff;
          outline: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.18); }

        .field-input:focus {
          background: rgba(192, 132, 252, 0.06);
          border-color: rgba(192, 132, 252, 0.45);
          box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .field-input.has-error {
          border-color: rgba(248, 113, 113, 0.5);
          background: rgba(248, 113, 113, 0.04);
        }

        .field-error {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.73rem;
          color: rgba(248, 113, 113, 0.85);
          margin-top: 0.4rem;
          font-weight: 400;
        }
        .field-error::before {
          content: '⚠';
          font-size: 0.68rem;
        }

        .password-strength {
          margin-top: 0.5rem;
          display: flex;
          gap: 3px;
        }
        .strength-bar {
          height: 2px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s;
        }
        .strength-bar.active-weak { background: #f87171; }
        .strength-bar.active-medium { background: #fb923c; }
        .strength-bar.active-strong { background: #4ade80; }

        .submit-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.95rem 1.5rem;
          background: linear-gradient(135deg, #9f67f5 0%, #7c3aed 60%, #6366f1 100%);
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35);
          animation: fadeSlideIn 0.8s 0.52s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.5);
        }
        .submit-btn:hover:not(:disabled)::before { opacity: 1; }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-dots {
          display: inline-flex;
          gap: 3px;
          align-items: center;
        }
        .loading-dots span {
          width: 4px; height: 4px;
          background: white;
          border-radius: 50%;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
          animation: fadeSlideIn 0.8s 0.58s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .auth-divider span {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .auth-switch-text {
          text-align: center;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.3);
          animation: fadeSlideIn 0.8s 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-switch-text a {
          color: rgba(192, 132, 252, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .auth-switch-text a:hover { color: #c084fc; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .auth-page { flex-direction: column; }
          .auth-visual { min-height: 220px; flex: none; }
          .auth-monogram { font-size: 4rem; }
          .auth-panel {
            width: 100%;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 2rem 1.5rem;
          }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-visual">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-visual-grid" />
          <div className="auth-visual-content">
            <div className="auth-monogram">W</div>
            <p className="auth-tagline">Join us today</p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-form-inner">
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-subheading">Fill in your details to get started</p>

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label
                  htmlFor="name"
                  className={`field-label${focused.name ? ' focused' : ''}`}
                >
                  Full Name
                </label>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    placeholder="Jane Smith"
                    className={`field-input${errors.name ? ' has-error' : ''}`}
                  />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label
                  htmlFor="email"
                  className={`field-label${focused.email ? ' focused' : ''}`}
                >
                  Email Address
                </label>
                <div className="field-input-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@example.com"
                    className={`field-input${errors.email ? ' has-error' : ''}`}
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label
                  htmlFor="password"
                  className={`field-label${focused.password ? ' focused' : ''}`}
                >
                  Password
                </label>
                <div className="field-input-wrap">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    className={`field-input${errors.password ? ' has-error' : ''}`}
                  />
                </div>
                {formData.password && (
                  <div className="password-strength">
                    {[...Array(3)].map((_, i) => {
                      const len = formData.password.length
                      const cls = len < 6 ? 'active-weak' : len < 10 ? 'active-medium' : 'active-strong'
                      return (
                        <div
                          key={i}
                          className={`strength-bar${(len > 0 && i === 0) || (len >= 6 && i <= 1) || (len >= 10 && i <= 2) ? ` ${cls}` : ''}`}
                        />
                      )
                    })}
                  </div>
                )}
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-field">
                <label
                  htmlFor="confirmPassword"
                  className={`field-label${focused.confirmPassword ? ' focused' : ''}`}
                >
                  Confirm Password
                </label>
                <div className="field-input-wrap">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="••••••••"
                    className={`field-input${errors.confirmPassword ? ' has-error' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? (
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp