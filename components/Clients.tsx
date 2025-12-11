'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

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

        // Highlight logos within 150px of center
        if (distance < 150) {
          logo.classList.add('center-logo')
        } else {
          logo.classList.remove('center-logo')
        }
      })
    }

    // Update on animation frame for smooth transitions
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

        <div className="clients-scroll-container" ref={containerRef}>
          <div className="clients-scroll-track" ref={trackRef}>
            {/* First set of logos */}
            {clients.map((client, index) => (
              <div
                key={`client-1-${index}`}
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
            ))}
            {/* Duplicate set for seamless loop */}
            {clients.map((client, index) => (
              <div
                key={`client-2-${index}`}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
