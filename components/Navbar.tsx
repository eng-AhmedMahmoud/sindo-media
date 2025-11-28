'use client'

import { useEffect, useState } from 'react'

interface NavbarProps {
  theme: 'dark' | 'light'
  language: 'ar' | 'en'
  onThemeToggle: () => void
  onLanguageToggle: () => void
  onQuoteRequest: () => void
}

const translations = {
  ar: {
    home: 'الرئيسية',
    services: 'خدماتنا',
    clients: 'عملاؤنا',
    projects: 'مشاريعنا',
    team: 'فريقنا',
    contact: 'اتصل بنا',
    quote: 'طلب عرض سعر'
  },
  en: {
    home: 'Home',
    services: 'Services',
    clients: 'Clients',
    projects: 'Projects',
    team: 'Team',
    contact: 'Contact',
    quote: 'Request Quote'
  }
}

export default function Navbar({ theme, language, onThemeToggle, onLanguageToggle, onQuoteRequest }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleQuoteClick = () => {
    setIsMobileMenuOpen(false)
    onQuoteRequest()
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-text">Sindo Media</span>
            <span className="logo-subtitle">
              {language === 'ar' ? 'وكالة تسويق' : 'Marketing Agency'}
            </span>
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.home}</a>
            <a href="#services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.services}</a>
            <a href="#clients" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.clients}</a>
            <a href="#projects" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.projects}</a>
            <a href="#team" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.team}</a>
            <a href="#contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t.contact}</a>
          </div>

          <div className="nav-actions">
            <button className="quote-action-btn" onClick={handleQuoteClick}>
              <i className="fas fa-file-invoice"></i>
              <span>{t.quote}</span>
            </button>
            <button className="theme-toggle" onClick={onThemeToggle} aria-label="Toggle theme">
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button className="lang-toggle" onClick={onLanguageToggle} aria-label="Toggle language">
              <span className="lang-text">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <button
              className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
