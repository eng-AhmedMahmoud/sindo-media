'use client'

import { useEffect, useRef, useState } from 'react'

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
    yearsExperience: 'سنة خبرة',
    playVideo: 'تشغيل الفيديو',
    pauseVideo: 'إيقاف الفيديو',
    playMusic: 'تشغيل الموسيقى',
    pauseMusic: 'إيقاف الموسيقى'
  },
  en: {
    title1: 'Transform Your Brand',
    title2: 'Into Digital Success',
    description: 'We create innovative marketing solutions that drive growth and deliver exceptional results for your business.',
    getStarted: 'Get Started',
    ourServices: 'Our Services',
    happyClients: 'Happy Clients',
    projectsDone: 'Projects Done',
    yearsExperience: 'Years Experience',
    playVideo: 'Play Video',
    pauseVideo: 'Pause Video',
    playMusic: 'Play Music',
    pauseMusic: 'Pause Music'
  }
}

export default function Hero({ language }: HeroProps) {
  const t = translations[language]
  const statsRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
        setIsMusicPlaying(false)
      } else {
        audioRef.current.play()
        setIsMusicPlaying(true)
      }
    }
  }

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
          stat.textContent = '+' + target.toString()
          clearInterval(timer)
        } else {
          stat.textContent = '+' + Math.floor(current).toString()
        }
      }, 30)
    })
  }

  return (
    <section id="home" className="hero">
      <div className="hero-video-bg">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
      </div>

      <audio ref={audioRef} loop>
        <source src="/hero-music.mp3" type="audio/mpeg" />
      </audio>

      <div className="music-controls">
        <button
          className={`music-btn ${isMusicPlaying ? 'active' : ''}`}
          onClick={toggleMusic}
          aria-label={isMusicPlaying ? t.pauseMusic : t.playMusic}
          title={isMusicPlaying ? t.pauseMusic : t.playMusic}
        >
          <i className={`fas ${isMusicPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
        </button>
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
              <h3 className="stat-number" data-count="450">+0</h3>
              <p className="stat-label">{t.happyClients}</p>
            </div>
            <div className="stat">
              <h3 className="stat-number" data-count="650">+0</h3>
              <p className="stat-label">{t.projectsDone}</p>
            </div>
            <div className="stat">
              <h3 className="stat-number" data-count="10">+0</h3>
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
