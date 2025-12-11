'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface ClientsProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'عملاؤنا',
    description: 'موثوق به من قبل العلامات التجارية الرائدة حول العالم'
  },
  en: {
    title: 'Our Clients',
    description: 'Trusted by leading brands around the world'
  }
}

const clients = [
  { image: '/clients/client-1.jpg', name: 'Client 1' },
  { image: '/clients/client-2.jpg', name: 'Client 2' },
  { image: '/clients/client-3.jpg', name: 'Client 3' },
  { image: '/clients/client-4.jpg', name: 'Client 4' },
  { image: '/clients/client-5.jpg', name: 'Client 5' },
  { image: '/clients/client-6.jpg', name: 'Client 6' },
  { image: '/clients/client-7.jpg', name: 'Client 7' },
  { image: '/clients/client-8.jpg', name: 'Client 8' },
  { image: '/clients/client-9.jpg', name: 'Client 9' },
  { image: '/clients/client-10.jpg', name: 'Client 10' },
  { image: '/clients/client-11.jpg', name: 'Client 11' },
  { image: '/clients/client-12.jpg', name: 'Client 12' },
  { image: '/clients/client-13.jpg', name: 'Client 13' },
  { image: '/clients/foodbox.png', name: 'FoodBox' },
  { image: '/clients/rumana.png', name: 'Rumana' },
]

export default function Clients({ language }: ClientsProps) {
  const t = translations[language]
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)
  const positionRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const isRTL = language === 'ar'

  const scrollToNext = () => {
    const track = trackRef.current
    if (!track) return

    const logoElements = track.querySelectorAll('.client-logo')
    if (logoElements.length === 0) return

    const firstLogo = logoElements[0] as HTMLElement
    const totalWidth = firstLogo.offsetWidth + 32
    const newX = positionRef.current - totalWidth

    // Pause auto-scroll
    isPausedRef.current = true

    // Add smooth transition
    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    track.style.transform = `translateX(${newX}px)`
    positionRef.current = newX

    // Resume auto-scroll after transition
    setTimeout(() => {
      if (track) track.style.transition = ''
      isPausedRef.current = false
    }, 500)
  }

  const scrollToPrev = () => {
    const track = trackRef.current
    if (!track) return

    const logoElements = track.querySelectorAll('.client-logo')
    if (logoElements.length === 0) return

    const firstLogo = logoElements[0] as HTMLElement
    const totalWidth = firstLogo.offsetWidth + 32
    const newX = positionRef.current + totalWidth

    // Pause auto-scroll
    isPausedRef.current = true

    // Add smooth transition
    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    track.style.transform = `translateX(${newX}px)`
    positionRef.current = newX

    // Resume auto-scroll after transition
    setTimeout(() => {
      if (track) track.style.transition = ''
      isPausedRef.current = false
    }, 500)
  }

  // Auto-scroll functionality
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Calculate actual logo width from DOM
    const logoElements = track.querySelectorAll('.client-logo')
    if (logoElements.length === 0) return

    const firstLogo = logoElements[0] as HTMLElement
    const logoWidth = firstLogo.offsetWidth
    const gap = 32 // var(--spacing-xl)
    const totalWidth = logoWidth + gap

    const totalLogos = clients.length
    const setWidth = totalLogos * totalWidth
    const scrollSpeed = isRTL ? 1.5 : -1.5 // Increased speed, reverse for RTL

    // Start from middle set to ensure logos are always visible
    positionRef.current = -setWidth
    track.style.transform = `translateX(${positionRef.current}px)`

    console.log('Carousel initialized:', {
      logoWidth,
      totalLogos,
      setWidth,
      initialPosition: positionRef.current,
      isRTL
    })

    const scroll = () => {
      if (isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(scroll)
        return
      }

      positionRef.current += scrollSpeed

      // Reset to middle set when we've scrolled through one complete set
      if (isRTL) {
        if (positionRef.current >= 0) {
          positionRef.current = -setWidth
        }
      } else {
        if (positionRef.current <= -setWidth * 2) {
          positionRef.current = -setWidth
        }
      }

      track.style.transform = `translateX(${positionRef.current}px)`
      animationFrameRef.current = requestAnimationFrame(scroll)
    }

    animationFrameRef.current = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRTL])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const updateCenterLogo = () => {
      const logos = track.querySelectorAll('.client-logo')
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      logos.forEach((logo) => {
        const logoRect = logo.getBoundingClientRect()
        const logoCenter = logoRect.left + logoRect.width / 2
        const distance = Math.abs(containerCenter - logoCenter)

        if (distance < 150) {
          logo.classList.add('center-logo')
        } else {
          logo.classList.remove('center-logo')
        }
      })
    }

    let animationFrameId: number
    const animate = () => {
      updateCenterLogo()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section id="clients" className="clients">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="clients-carousel-wrapper">
          <button
            className="carousel-nav carousel-nav-left"
            onClick={isRTL ? scrollToNext : scrollToPrev}
            aria-label={isRTL ? "التالي" : "Previous client"}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            className="clients-scroll-container"
            ref={containerRef}
            onMouseEnter={() => { isPausedRef.current = true }}
            onMouseLeave={() => { isPausedRef.current = false }}
          >
            <div className="clients-scroll-track" ref={trackRef}>
              {/* Triple the logos for seamless infinite loop */}
              {[...Array(3)].map((_, setIndex) => (
                clients.map((client, index) => (
                  <div
                    key={`client-${setIndex}-${index}`}
                    className="client-logo"
                  >
                    <div className="logo-placeholder">
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>

          <button
            className="carousel-nav carousel-nav-right"
            onClick={isRTL ? scrollToPrev : scrollToNext}
            aria-label={isRTL ? "السابق" : "Next client"}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
