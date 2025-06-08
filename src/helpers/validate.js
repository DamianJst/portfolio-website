// Simple validation helper
export const validateField = (field, value) => {
    const validators = {
      name: (val) => val.length > 3,
      email: (val) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val),
      phoneNumber: (val) => val === '' || /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(val),
      message: (val) => val.length > 3,
    }
  
    return validators[field] ? validators[field](value) : true
  }
  
  export const validateForm = (formData) => {
    const errors = {}
    let isValid = true
  
    Object.keys(formData).forEach(field => {
      // Skip optional fields if empty
      if (field === 'phoneNumber' && formData[field] === '') return
      
      const fieldValid = validateField(field, formData[field])
      if (!fieldValid) {
        errors[field] = true
        isValid = false
      }
    })
  
    return { isValid, errors }
  }