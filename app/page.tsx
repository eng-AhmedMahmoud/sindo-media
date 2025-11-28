'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Clients from '@/components/Clients'
import Projects from '@/components/Projects'
import Team from '@/components/Team'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import LoadingScreen from '@/components/LoadingScreen'
import QuoteModal from '@/components/QuoteModal'

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem('sindo-theme') as 'dark' | 'light' | null
    const savedLanguage = localStorage.getItem('sindo-language') as 'ar' | 'en' | null

    const initialTheme = savedTheme || 'dark'
    const initialLanguage = savedLanguage || 'ar'

    setTheme(initialTheme)
    setLanguage(initialLanguage)

    // Apply initial theme
    document.documentElement.classList.remove('dark-theme', 'light-theme')
    document.documentElement.classList.add(`${initialTheme}-theme`)

    // Apply initial language
    document.documentElement.setAttribute('data-lang', initialLanguage)
    document.documentElement.setAttribute('lang', initialLanguage)
    document.documentElement.setAttribute('dir', initialLanguage === 'ar' ? 'rtl' : 'ltr')

    // Auto-open quote modal after loading screen (3 seconds delay)
    const timer = setTimeout(() => {
      setIsQuoteModalOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('sindo-theme', newTheme)
    document.documentElement.classList.remove('dark-theme', 'light-theme')
    document.documentElement.classList.add(`${newTheme}-theme`)
  }

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
    localStorage.setItem('sindo-language', newLang)
    document.documentElement.setAttribute('data-lang', newLang)
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  return (
    <>
      <LoadingScreen />
      <main className="main-wrapper">
        <Navbar
          theme={theme}
          language={language}
          onThemeToggle={toggleTheme}
          onLanguageToggle={toggleLanguage}
          onQuoteRequest={() => setIsQuoteModalOpen(true)}
        />
        <Hero language={language} />
        <Services language={language} />
        <Clients language={language} />
        <Projects language={language} />
        <Team language={language} />
        <Contact language={language} />
        <Footer language={language} />
        <WhatsAppButton />
        <ScrollToTop />
      </main>
      <QuoteModal
        language={language}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  )
}
