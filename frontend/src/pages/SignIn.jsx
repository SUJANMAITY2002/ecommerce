import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showNotification } from '../components/Notification'
import { getLoginFormErrors } from '../utils/validation'

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { signIn, isLoading } = useAuth() 
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

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
    <div className="auth-container">
      <div className="auth-wrapper">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">@</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" disabled={isLoading} className="auth-submit-btn">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
