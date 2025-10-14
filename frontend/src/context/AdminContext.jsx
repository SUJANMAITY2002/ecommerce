import { createContext, useContext, useState, useEffect } from 'react'
import productsData from '../data/products.json'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  })

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = () => {
    try {
      // Load products from localStorage first, fallback to imported JSON
      const savedProducts = localStorage.getItem('adminProducts')
      const products = savedProducts ? JSON.parse(savedProducts) : productsData
      setProducts(products)

      // Load orders
      const ordersData = JSON.parse(localStorage.getItem('userOrders') || '[]')
      setOrders(ordersData)

      // Load users (simulated)
      const usersData = JSON.parse(localStorage.getItem('adminUsers') || '[]')
      setUsers(usersData)

      // Calculate stats
      calculateStats(ordersData, usersData, products)
    } catch (error) {
      console.error('Error loading admin data:', error)
      // Fallback to empty arrays if there's an error
      setProducts(productsData || [])
      setOrders([])
      setUsers([])
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: productsData?.length || 0
      })
    }
  }

  const calculateStats = (orders, users, products) => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    setStats({
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalUsers: users.length,
      totalProducts: products.length
    })
  }

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts))
    
    // Recalculate stats
    calculateStats(orders, users, updatedProducts)
    return newProduct
  }

  const updateProduct = (id, updatedProduct) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    )
    setProducts(updatedProducts)
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts))
    
    // Recalculate stats
    calculateStats(orders, users, updatedProducts)
  }

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts))
    
    // Recalculate stats
    calculateStats(orders, users, updatedProducts)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders))
    
    // Recalculate stats
    calculateStats(updatedOrders, users, products)
  }

  const value = {
    products,
    orders,
    users,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    loadAdminData
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}