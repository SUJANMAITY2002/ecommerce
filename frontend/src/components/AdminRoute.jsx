import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { currentUser, isLoggedIn } = useAuth()
  
  // Check if user is logged in and is admin
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true
  
  if (!isLoggedIn()) {
    return <Navigate to="/signin" />
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />
  }
  
  return children
}

export default AdminRoute