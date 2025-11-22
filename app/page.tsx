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

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')

  useEffect(() => {
    // Set initial theme and language
    document.documentElement.classList.add('dark-theme')
    document.documentElement.setAttribute('data-lang', 'ar')
    document.documentElement.setAttribute('dir', 'rtl')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.remove('dark-theme', 'light-theme')
    document.documentElement.classList.add(`${newTheme}-theme`)
  }

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
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
    </>
  )
}
