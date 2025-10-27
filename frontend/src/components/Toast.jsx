import React, { useEffect } from 'react'

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose && onClose(), duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!message) return null
  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default Toast
