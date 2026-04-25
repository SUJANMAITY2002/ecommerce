import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Admin check function
export const checkAdminStatus = (email) => {
  const adminEmails = ['admin@example.com', 'admin@test.com', 'sujan@admin.com']
  return adminEmails.includes(email.toLowerCase())
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

  // FIX 1: On app load, restore user AND token from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null")
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      // FIX 2: Corrected route from /login to /signin (matches AuthRouter.js)
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const isAdmin = checkAdminStatus(email)

        const userData = {
          name: data.name,
          email: data.email,
          isAdmin: isAdmin,
          role: isAdmin ? 'admin' : 'user'
        }

        // FIX 3: Store the JWT token so protected routes can send it
        localStorage.setItem('token', data.token)
        localStorage.setItem('loggedInUser', JSON.stringify(userData))
        setCurrentUser(userData)

        window.dispatchEvent(new Event("userLoggedIn"))

        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  const signUp = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      const { name, email, password } = userData

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Auto sign in after successful signup
        const signInResult = await signIn(email, password)
        if (signInResult.success) {
          return { success: true, message: 'Account created and signed in successfully!' }
        }
        return { success: true, message: 'Account created successfully! Please sign in.' }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }, [signIn, API_URL])

  // FIX 4: signOut now also removes the token from localStorage
  const signOut = useCallback(() => {
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setCurrentUser(null)
  }, [])

  const isLoggedIn = useCallback(() => {
    return !!currentUser
  }, [currentUser])

  const checkAuth = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null")
    if (user && user !== currentUser) {
      setCurrentUser(user)
    }
  }, [currentUser])

  // FIX 5: Helper to get auth header — use this in every protected API call
  // Usage: fetch(url, { headers: getAuthHeader() })
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }, [])

  const value = {
    currentUser,
    isLoading,
    signIn,
    signUp,
    signOut,
    isLoggedIn,
    checkAuth,
    getAuthHeader,   // expose so any component can make authenticated requests
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}