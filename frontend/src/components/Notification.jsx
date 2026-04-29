// import { useState, useEffect } from 'react'
// import './Notification.css';

// const Notification = () => {
//   const [notification, setNotification] = useState(null)

//   useEffect(() => {
//     // Listen for custom notification events
//     const handleNotification = (event) => {
//       setNotification(event.detail)
//     }

//     window.addEventListener('showNotification', handleNotification)

//     return () => {
//       window.removeEventListener('showNotification', handleNotification)
//     }
//   }, [])

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null)
//       }, 5000)

//       return () => clearTimeout(timer)
//     }
//   }, [notification])

//   if (!notification) return null

//   return (
//     <div className={`global-notification notification-${notification.type}`}>
//       <div className="notification-content">
//         <span className="notification-message">{notification.message}</span>
//         <button 
//           className="notification-close"
//           onClick={() => setNotification(null)}
//         >
//           &times;
//         </button>
//       </div>
//     </div>
//   )
// }

// // Utility function to show notifications
// export const showNotification = (message, type = 'info') => {
//   const event = new CustomEvent('showNotification', {
//     detail: { message, type }
//   })
//   window.dispatchEvent(event)
// }

// export default Notification