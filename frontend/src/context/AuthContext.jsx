import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

const ADMIN_EMAILS = [
  'admin@example.com',
  'admin@test.com',
  'sujan@admin.com',
]

const isAdminEmail = (email) =>
  ADMIN_EMAILS.includes(email.trim().toLowerCase())

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ FIX: Use Render URL as default for production.
  // Set VITE_API_URL in your Netlify environment variables to override.
  const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-0tq5.onrender.com'

  useEffect(() => {
    try {
      const saved = localStorage.getItem('loggedInUser')
      if (saved) setCurrentUser(JSON.parse(saved))
    } catch (_) {
      localStorage.removeItem('loggedInUser')
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // ✅ FIX: Guard against HTML error pages (500/404 return HTML, not JSON)
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        return { success: false, message: `Server error (${res.status}). Please try again later.` }
      }

      const data = await res.json()
      if (data.success) {
        const adminStatus = isAdminEmail(email)
        const userData = {
          id: data._id || data.id || email,
          name: data.name,
          email: data.email || email,
          isAdmin: adminStatus,
          role: adminStatus ? 'admin' : 'user',
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('loggedInUser', JSON.stringify(userData))
        setCurrentUser(userData)
        return { success: true, message: data.message }
      }
      return { success: false, message: data.message || 'Login failed' }
    } catch (err) {
      console.error('SignIn error:', err)
      return { success: false, message: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  const signUp = useCallback(async ({ name, email, password }) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      // ✅ FIX: Guard against HTML error pages
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        return { success: false, message: `Server error (${res.status}). Please try again later.` }
      }

      const data = await res.json()
      if (data.success) {
        return await signIn(email, password)
      }
      return { success: false, message: data.message || 'Sign up failed' }
    } catch (err) {
      console.error('SignUp error:', err)
      return { success: false, message: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }, [signIn, API_URL])

  const signOut = useCallback(() => {
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setCurrentUser(null)
  }, [])

  const isLoggedIn = useCallback(() => !!currentUser, [currentUser])

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      signIn,
      signUp,
      signOut,
      isLoggedIn,
      getAuthHeader,
    }}>
      {children}
    </AuthContext.Provider>
  )
}