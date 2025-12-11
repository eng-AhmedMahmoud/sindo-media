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

    // Wait for DOM to be fully ready
    const initCarousel = () => {
      const logoElements = track.querySelectorAll('.client-logo')

      if (logoElements.length === 0) {
        console.error('No logos found in carousel')
        return
      }

      const firstLogo = logoElements[0] as HTMLElement
      const logoWidth = firstLogo.offsetWidth || 180 // Fallback to default
      const gap = 32
      const totalWidth = logoWidth + gap

      const totalLogos = clients.length
      const setWidth = totalLogos * totalWidth
      const scrollSpeed = isRTL ? 1.5 : -1.5 // RTL: left-to-right, LTR: right-to-left

      // RTL: loop between -2*setWidth and -setWidth to avoid empty space near 0
      // LTR: loop between 0 and -setWidth
      positionRef.current = isRTL ? -setWidth * 2 : 0
      track.style.transform = `translateX(${positionRef.current}px)`

      // Force track to have explicit width
      const totalTrackWidth = logoElements.length * totalWidth
      track.style.width = `${totalTrackWidth}px`

      console.log('Carousel initialized:', {
        logoWidth,
        totalLogos,
        setWidth,
        totalWidth,
        scrollSpeed,
        initialPosition: positionRef.current,
        totalTrackWidth,
        isRTL,
        logoElementsCount: logoElements.length
      })

      // Verify position is applied
      const verifyTimeout = setTimeout(() => {
        const computedTransform = getComputedStyle(track).transform
        console.log('Transform after 500ms:', computedTransform, 'Expected position:', positionRef.current)
      }, 500)

      const scroll = () => {
        if (isPausedRef.current) {
          animationFrameRef.current = requestAnimationFrame(scroll)
          return
        }

        positionRef.current += scrollSpeed

        // Seamless loop - never get close to 0 in RTL to avoid empty space
        if (isRTL) {
          // Scrolling right from -2*setWidth to -setWidth (showing Set3 → Set2)
          if (positionRef.current >= -setWidth) {
            positionRef.current = -setWidth * 2
          }
        } else {
          // Scrolling left from 0 to -setWidth (showing Set1 → Set2)
          if (positionRef.current <= -setWidth) {
            positionRef.current = 0
          }
        }

        track.style.transform = `translateX(${positionRef.current}px)`
        animationFrameRef.current = requestAnimationFrame(scroll)
      }

      animationFrameRef.current = requestAnimationFrame(scroll)
    }

    // Give DOM time to render
    const timeout = setTimeout(initCarousel, 100)

    return () => {
      clearTimeout(timeout)
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
            onClick={scrollToPrev}
            aria-label={isRTL ? "السابق" : "Previous"}
          >
            <i className={`fas fa-chevron-${isRTL ? 'right' : 'left'}`}></i>
          </button>

          <div
            className="clients-scroll-container"
            ref={containerRef}
            onMouseEnter={() => { isPausedRef.current = true }}
            onMouseLeave={() => { isPausedRef.current = false }}
            style={{ direction: 'ltr' }}
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
            onClick={scrollToNext}
            aria-label={isRTL ? "التالي" : "Next"}
          >
            <i className={`fas fa-chevron-${isRTL ? 'left' : 'right'}`}></i>
          </button>
        </div>
      </div>
    </section>
  )
}
