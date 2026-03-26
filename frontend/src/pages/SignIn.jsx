import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showNotification } from '../components/Notification'
import { getLoginFormErrors } from '../utils/validation'

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState({})
  const { signIn, isLoading } = useAuth()
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
    const validationErrors = getLoginFormErrors(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    try {
      const result = await signIn(formData.email, formData.password)
      if (result.success) {
        showNotification(result.message || 'Login successful!', 'success')
        navigate('/')
      } else {
        showNotification(result.message || 'Login failed', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showNotification('Network error. Please try again.', 'error')
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
          width: 480px;
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
          max-width: 360px;
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
          margin-bottom: 2.5rem;
          animation: fadeSlideIn 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .form-field {
          margin-bottom: 1.25rem;
          animation: fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .form-field:nth-child(1) { animation-delay: 0.25s; }
        .form-field:nth-child(2) { animation-delay: 0.35s; }

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
          font-size: 0.75rem;
          color: rgba(248, 113, 113, 0.85);
          margin-top: 0.45rem;
          font-weight: 400;
        }
        .field-error::before {
          content: '⚠';
          font-size: 0.7rem;
        }

        .submit-btn {
          width: 100%;
          margin-top: 0.75rem;
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
          animation: fadeSlideIn 0.8s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
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
          margin: 1.75rem 0;
          animation: fadeSlideIn 0.8s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
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
          animation: fadeSlideIn 0.8s 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
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
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-visual">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-visual-grid" />
          <div className="auth-visual-content">
            <div className="auth-monogram">W</div>
            <p className="auth-tagline">Welcome back</p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-form-inner">
            <h1 className="auth-heading">Sign In</h1>
            <p className="auth-subheading">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit}>
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
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? (
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-switch-text">
              New here?{' '}
              <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignIn