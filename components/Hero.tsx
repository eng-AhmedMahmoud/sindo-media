'use client'

import { useEffect, useRef } from 'react'

interface HeroProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title1: 'حوّل علامتك التجارية',
    title2: 'إلى نجاح رقمي',
    description: 'نقدم حلول تسويقية مبتكرة تدفع النمو وتحقق نتائج استثنائية لأعمالك.',
    getStarted: 'ابدأ الآن',
    ourServices: 'خدماتنا',
    happyClients: 'عميل سعيد',
    projectsDone: 'مشروع منجز',
    yearsExperience: 'سنة خبرة'
  },
  en: {
    title1: 'Transform Your Brand',
    title2: 'Into Digital Success',
    description: 'We create innovative marketing solutions that drive growth and deliver exceptional results for your business.',
    getStarted: 'Get Started',
    ourServices: 'Our Services',
    happyClients: 'Happy Clients',
    projectsDone: 'Projects Done',
    yearsExperience: 'Years Experience'
  }
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language]
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number')
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-count') || '0')
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          stat.textContent = target.toString()
          clearInterval(timer)
        } else {
          stat.textContent = Math.floor(current).toString()
        }
      }, 30)
    })
  }

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">{t.title1}</span>
            <span className="title-line gradient-text">{t.title2}</span>
          </h1>
          <p className="hero-description">{t.description}</p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">
              <span>{t.getStarted}</span>
              <i className={`fas ${language === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
            </a>
            <a href="#services" className="btn btn-secondary">
              <span>{t.ourServices}</span>
            </a>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat">
              <h3 className="stat-number" data-count="500">0</h3>
              <p className="stat-label">{t.happyClients}</p>
            </div>
            <div className="stat">
              <h3 className="stat-number" data-count="1200">0</h3>
              <p className="stat-label">{t.projectsDone}</p>
            </div>
            <div className="stat">
              <h3 className="stat-number" data-count="15">0</h3>
              <p className="stat-label">{t.yearsExperience}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse"></div>
      </div>
    </section>
  )
}
