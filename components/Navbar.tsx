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
    quote: 'طلب عرض سعر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    switchLang: 'English'
  },
  en: {
    home: 'Home',
    services: 'Services',
    clients: 'Clients',
    projects: 'Projects',
    team: 'Team',
    contact: 'Contact',
    quote: 'Request Quote',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    switchLang: 'العربية'
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleQuoteClick = () => {
    setIsMobileMenuOpen(false)
    onQuoteRequest()
  }

  const handleThemeToggle = () => {
    onThemeToggle()
  }

  const handleLanguageToggle = () => {
    onLanguageToggle()
  }

  const navLinks = [
    { href: '#home', label: t.home },
    { href: '#services', label: t.services },
    { href: '#clients', label: t.clients },
    { href: '#projects', label: t.projects },
    { href: '#team', label: t.team },
    { href: '#contact', label: t.contact },
  ]

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <a href="#home" className="logo">
              {/* Desktop logos */}
              <img
                src={theme === 'dark' ? '/logo-desktop-dark.png' : '/logo-desktop-light.png'}
                alt="Sindo Media"
                className="logo-desktop"
              />
              {/* Mobile logos */}
              <img
                src={theme === 'dark' ? '/logo-mobile-dark.png' : '/logo-mobile-light.png'}
                alt="Sindo Media"
                className="logo-mobile"
              />
            </a>

            {/* Desktop nav links */}
            <div className="nav-links desktop-only">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
              ))}
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

      {/* Fullscreen Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Nav Links */}
          <div className="mobile-nav-links">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
