'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/contact.module.scss'
import validate from '@/helpers/validate.js'

const ContactForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  // Simple validation
//   const validate = (field, value) => {
//     switch (field) {
//       case 'name':
//         return value.length > 3
//       case 'email':
//         return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
//       case 'phoneNumber':
//         return value === '' || /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
//       case 'message':
//         return value.length > 3
//       default:
//         return true
//     }
//   }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    // Skip validation for optional phone number if empty
    if (name === 'phoneNumber' && value === '') return
    
    const isValid = validate(name, value)
    setErrors(prev => ({ ...prev, [name]: !isValid }))
  }

  const validateAll = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach(field => {
      // Skip phone number validation if empty (it's optional)
      if (field === 'phoneNumber' && formData[field] === '') return
      
      const fieldValid = validate(field, formData[field])
      if (!fieldValid) {
        newErrors[field] = true
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateAll()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        // Clear form
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          message: ''
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success/error state
  if (status === 'success') {
    return (
      <div className={styles.statusContainer}>
        <h2 className={styles.statusHeading}>Thank You!</h2>
        <p className={styles.statusText}>Your message was sent successfully.</p>
        <button 
          className={styles.backButton}
          onClick={() => setStatus(null)}
        >
          <span className={styles.arrow}>←</span>
          Back
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.statusContainer}>
        <h2 className={styles.statusHeading}>Error!</h2>
        <p className={styles.statusText}>An unexpected error occurred.</p>
        <p className={styles.statusText}>Please try again later.</p>
        <button 
          className={styles.backButton}
          onClick={() => setStatus(null)}
        >
          <span className={styles.arrow}>←</span>
          Back
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Name"
          className={`${styles.input} ${errors.name ? styles.error : ''}`}
          required
        />
        {errors.name && (
          <span className={styles.errorMessage}>
            Please enter a valid name
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          required
        />
        {errors.email && (
          <span className={styles.errorMessage}>
            Please enter a valid email
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Phone Number (Optional)"
          className={`${styles.input} ${errors.phoneNumber ? styles.error : ''}`}
        />
        {errors.phoneNumber && (
          <span className={styles.errorMessage}>
            Please enter a valid phone number
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Message"
          rows={6}
          className={`${styles.input} ${styles.textarea} ${errors.message ? styles.error : ''}`}
          required
        />
        {errors.message && (
          <span className={styles.errorMessage}>
            Please enter a message
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
        <span className={styles.arrow}>→</span>
      </button>
    </form>
  )
}

export default ContactForm