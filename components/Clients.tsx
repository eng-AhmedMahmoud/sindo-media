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
  const [isPaused, setIsPaused] = useState(false)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToNext = () => {
    const track = trackRef.current
    if (!track) return

    const logoWidth = 180 + 32 // logo width + gap
    const currentTransform = getComputedStyle(track).transform
    const matrix = new DOMMatrix(currentTransform)
    const currentX = matrix.m41

    track.style.animation = 'none'
    track.style.transform = `translateX(${currentX - logoWidth}px)`

    setTimeout(() => {
      track.style.animation = ''
    }, 10)
  }

  const scrollToPrev = () => {
    const track = trackRef.current
    if (!track) return

    const logoWidth = 180 + 32 // logo width + gap
    const currentTransform = getComputedStyle(track).transform
    const matrix = new DOMMatrix(currentTransform)
    const currentX = matrix.m41

    track.style.animation = 'none'
    track.style.transform = `translateX(${currentX + logoWidth}px)`

    setTimeout(() => {
      track.style.animation = ''
    }, 10)
  }

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
            aria-label="Previous client"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            className="clients-scroll-container"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`clients-scroll-track ${isPaused ? 'paused' : ''}`} ref={trackRef}>
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
            aria-label="Next client"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
