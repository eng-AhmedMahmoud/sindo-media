'use client'

interface FooterProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    tagline: 'نحول العلامات التجارية إلى قصص نجاح رقمية',
    rights: 'جميع الحقوق محفوظة'
  },
  en: {
    tagline: 'Transforming brands into digital success stories',
    rights: 'All rights reserved'
  }
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">Sindo Media</span>
            <p>{t.tagline}</p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Sindo Media. {t.rights}.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
