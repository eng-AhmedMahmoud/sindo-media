'use client'

import { useState, useEffect } from 'react'

interface QuoteModalProps {
  language: 'ar' | 'en'
  isOpen: boolean
  onClose: () => void
  addToast: (type: 'success' | 'error', message: string) => void
}

const translations = {
  ar: {
    title: 'طلب عرض سعر',
    subtitle: 'حقق أرباح أفضل بنفس الميزانية أو أقل',
    description: 'أنت في أمان، فريقنا جاهز دائماً للإجابة على استفساراتكم، اتصل بنا في اي وقت باستخدام إحدى وسائل الاتصال المتوفرة.',
    fullName: 'الاسم',
    phoneNumber: 'رقم الموبايل',
    phoneLabel: 'رقم التليفون بكود الدولة',
    companyName: 'اسم الشركة أو النشاط',
    chooseService: 'اختار الخدمه المطلوبة',
    requirement: 'نبذة عن المطلوب (اختياري)',
    send: 'إرسال',
    services: [
      'تصميم وتطوير المواقع',
      'إدارة وسائل التواصل الاجتماعي',
      'تحسين محركات البحث (SEO)',
      'إعلانات مدفوعة',
      'إنتاج المحتوى',
      'التسويق عبر البريد الإلكتروني',
      'استشارات تسويقية',
      'خدمات أخرى'
    ]
  },
  en: {
    title: 'Request for a price quote',
    subtitle: 'Achieve better profits within the same budget or less.',
    description: 'You are in safe hands; our team is always ready to answer your inquiries. Contact us anytime using one of the available communication methods.',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    phoneLabel: 'Phone Number with country code',
    companyName: 'Company Name',
    chooseService: 'Choose the required service',
    requirement: 'About the Requirement (Optional)',
    send: 'Send',
    services: [
      'Website Design & Development',
      'Social Media Management',
      'SEO Optimization',
      'Paid Advertising',
      'Content Production',
      'Email Marketing',
      'Marketing Consultation',
      'Other Services'
    ]
  }
}

export default function QuoteModal({ language, isOpen, onClose, addToast }: QuoteModalProps) {
  const t = translations[language]
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    countryCode: '+966',
    companyName: '',
    service: '',
    requirement: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addToast('success', language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Your request has been sent successfully!')
        setFormData({
          fullName: '',
          phoneNumber: '',
          countryCode: '+966',
          companyName: '',
          service: '',
          requirement: ''
        })
        onClose()
      } else {
        addToast('error', language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.')
      }
    } catch {
      addToast('error', language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="quote-modal-overlay" onClick={onClose}>
      <div className="quote-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="quote-modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>

        <div className="quote-modal-header">
          <h2 className="quote-modal-title">{t.title}</h2>
          <p className="quote-modal-subtitle">{t.subtitle}</p>
          <p className="quote-modal-description">{t.description}</p>
        </div>

        <form className="quote-modal-form" onSubmit={handleSubmit}>
          <div className="quote-form-group">
            <input
              type="text"
              name="fullName"
              className="quote-form-input"
              placeholder={t.fullName}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="quote-form-group">
            <label className="quote-form-label-orange">{t.phoneLabel}</label>
            <div className="quote-phone-input-wrapper">
              <select
                name="countryCode"
                className="quote-country-code"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="+966">🇸🇦 +966</option>
                <option value="+20">🇪🇬 +20</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+965">🇰🇼 +965</option>
                <option value="+974">🇶🇦 +974</option>
                <option value="+973">🇧🇭 +973</option>
                <option value="+968">🇴🇲 +968</option>
                <option value="+962">🇯🇴 +962</option>
                <option value="+961">🇱🇧 +961</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                className="quote-form-input quote-phone-input"
                placeholder={t.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="quote-form-group">
            <input
              type="text"
              name="companyName"
              className="quote-form-input"
              placeholder={t.companyName}
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="quote-form-group">
            <label className="quote-form-label-orange">{t.chooseService}</label>
            <select
              name="service"
              className="quote-form-select"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              {t.services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="quote-form-group">
            <textarea
              name="requirement"
              className="quote-form-textarea"
              placeholder={t.requirement}
              value={formData.requirement}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            className="quote-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><i className="fas fa-spinner fa-spin"></i> {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</>
            ) : (
              t.send
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
