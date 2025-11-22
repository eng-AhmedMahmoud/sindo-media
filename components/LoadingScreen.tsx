'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 seconds minimum loading time

    // Also listen for window load event
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {/* Animated Logo */}
        <div className="loading-logo">
          <div className="logo-circle">
            <div className="logo-inner">
              <span className="logo-letter">S</span>
            </div>
          </div>
          <div className="loading-spinner"></div>
        </div>

        {/* Brand Name */}
        <h1 className="loading-title">
          <span className="title-main">Sindo Media</span>
          <span className="title-sub">سيندو ميديا</span>
        </h1>

        {/* Loading Bar */}
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>

        {/* Loading Text */}
        <p className="loading-text">Loading your experience...</p>
      </div>

      {/* Animated Background */}
      <div className="loading-bg">
        <div className="loading-shape loading-shape-1"></div>
        <div className="loading-shape loading-shape-2"></div>
        <div className="loading-shape loading-shape-3"></div>
      </div>
    </div>
  )
}
