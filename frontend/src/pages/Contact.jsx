import { useState } from 'react'
import { showNotification } from '../components/Notification'
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('Please fill in all required fields', 'error')
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      showNotification('Thank you for your message! We will get back to you soon.', 'success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h3>Address</h3>
                  <p>123 Tech Street<br />Digital City, DC 12345</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@sujanecomstore.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
