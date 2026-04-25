import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { showNotification } from '../components/Notification'
import './AdminProducts.css';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '',
    rating: 4.0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating)
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
      showNotification('Product updated successfully!', 'success')
      setEditingProduct(null)
    } else {
      addProduct(productData)
      showNotification('Product added successfully!', 'success')
    }

    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      stock: '',
      rating: 4.0
    })
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
      showNotification('Product deleted successfully!', 'success')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form-container">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearable">Wearable</option>
                    <option value="TV">TV</option>
                    <option value="Speaker">Speaker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({
                      name: '',
                      price: '',
                      category: '',
                      description: '',
                      image: '',
                      stock: '',
                      rating: 4.0
                    })
                  }}
                >
                  Cancel
                </button>
                <button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.image || '/images/placeholder.jpg'} 
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={product.stock < 10 ? 'low-stock' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts