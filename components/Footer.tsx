'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface FooterProps {
  language: 'ar' | 'en'
  theme: 'dark' | 'light'
}

const translations = {
  ar: {
    tagline: 'نحول العلامات التجارية إلى قصص نجاح رقمية',
    rights: 'جميع الحقوق محفوظة',
    companyInfo: 'معلومات الشركة',
    companyName: 'شركة سيندو ميديا',
    nationalId: 'الرقم الوطني الموحد',
    issueDate: 'تاريخ الإصدار',
    entityType: 'نوع الكيان',
    entityTypeValue: 'شركة ذات مسؤولية محدودة',
    companyAttributes: 'صفات الشركة',
    companyAttributesValue: 'شخص واحد',
    registryStatus: 'حالة السجل',
    registryStatusValue: 'نشط',
    certificates: 'الشهادات والتراخيص'
  },
  en: {
    tagline: 'Transforming brands into digital success stories',
    rights: 'All rights reserved',
    companyInfo: 'Company Information',
    companyName: 'Sindo Media Company',
    nationalId: 'Unified National Number',
    issueDate: 'Issue Date',
    entityType: 'Entity Type',
    entityTypeValue: 'Limited Liability Company',
    companyAttributes: 'Company Attributes',
    companyAttributesValue: 'Single Person',
    registryStatus: 'Registry Status',
    registryStatusValue: 'Active',
    certificates: 'Certificates & Licenses'
  }
}

export default function Footer({ language, theme }: FooterProps) {
  const t = translations[language]
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

  // Lock body scroll when modal is open and prevent layout shift
  useEffect(() => {
    if (previewImage) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [previewImage])

  const openPreview = (src: string, alt: string) => {
    setPreviewImage({ src, alt })
  }

  const closePreview = () => {
    setPreviewImage(null)
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-logo">
                <img
                  src={theme === 'dark' ? '/logo-desktop-dark.png' : '/logo-desktop-light.png'}
                  alt="Sindo Media"
                  className="footer-logo-img"
                />
                <p>{t.tagline}</p>
                <div className="footer-social">
                  <a href="https://www.facebook.com/profile.php?id=61583397677984" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="https://www.instagram.com/media_sindo70/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.tiktok.com/@sindomediaagency" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                    <i className="fab fa-tiktok"></i>
                  </a>
                </div>
              </div>

              <div className="footer-company-info">
                <h4>{t.companyInfo}</h4>
                <ul className="company-details">
                  <li>
                    <span className="detail-label">{t.nationalId}:</span>
                    <span className="detail-value" dir="ltr">7050705610</span>
                  </li>
                  <li>
                    <span className="detail-label">{t.issueDate}:</span>
                    <span className="detail-value" dir="ltr">13/07/2025</span>
                  </li>
                  <li>
                    <span className="detail-label">{t.entityType}:</span>
                    <span className="detail-value">{t.entityTypeValue}</span>
                  </li>
                  <li>
                    <span className="detail-label">{t.companyAttributes}:</span>
                    <span className="detail-value">{t.companyAttributesValue}</span>
                  </li>
                  <li>
                    <span className="detail-label">{t.registryStatus}:</span>
                    <span className="detail-value status-active">{t.registryStatusValue}</span>
                  </li>
                </ul>
              </div>

              <div className="footer-certificates">
                <h4>{t.certificates}</h4>
                <div className="certificates-images">
                  <button
                    className="certificate-link"
                    onClick={() => openPreview('/saudi-business-center.jpg', 'Saudi Business Center Certificate')}
                  >
                    <Image
                      src="/saudi-business-center.jpg"
                      alt="Saudi Business Center Certificate"
                      width={120}
                      height={160}
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="certificate-magnifier">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </button>
                  <button
                    className="certificate-link"
                    onClick={() => openPreview('/commercial-register.jpg', 'Commercial Register')}
                  >
                    <Image
                      src="/commercial-register.jpg"
                      alt="Commercial Register"
                      width={120}
                      height={160}
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="certificate-magnifier">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2024 Sindo Media. {t.rights}.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Certificate Preview Modal */}
      {previewImage && (
        <div className="certificate-preview-overlay" onClick={closePreview}>
          <button className="certificate-preview-close" onClick={closePreview}>
            <i className="fas fa-times"></i>
          </button>
          <div className="certificate-preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage.src} alt={previewImage.alt} className="certificate-preview-img" />
          </div>
        </div>
      )}
    </>
  )
}
