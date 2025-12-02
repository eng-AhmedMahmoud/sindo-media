'use client'

import { FormEvent, useState } from 'react'

interface ContactProps {
  language: 'ar' | 'en'
  addToast: (type: 'success' | 'error', message: string) => void
}

const translations = {
  ar: {
    title: 'اتصل بنا',
    description: 'دعنا نناقش كيف يمكننا مساعدة عملك على النمو',
    address: 'العنوان',
    addressText: 'الرياض - حي القدس',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    name: 'اسمك',
    emailLabel: 'بريدك الإلكتروني',
    project: 'طلب المشروع',
    send: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    success: 'تم إرسال رسالتك بنجاح!',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    trustedPartners: 'شركاء موثوقون'
  },
  en: {
    title: 'Contact Us',
    description: "Let's discuss how we can help grow your business",
    address: 'Address',
    addressText: 'Ar Riyadh - Alquds Neighborhood',
    phone: 'Phone',
    email: 'Email',
    name: 'Your Name',
    emailLabel: 'Your Email',
    project: 'Project Request',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Your message has been sent successfully!',
    error: 'An error occurred. Please try again.',
    trustedPartners: 'Trusted Partners'
  }
}

export default function Contact({ language, addToast }: ContactProps) {
  const t = translations[language]
  const [formState, setFormState] = useState({ name: '', email: '', project: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        addToast('success', t.success)
        setFormState({ name: '', email: '', project: '' })
      } else {
        addToast('error', t.error)
      }
    } catch {
      addToast('error', t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-details">
                <h4>{t.address}</h4>
                <p>{t.addressText}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-details">
                <h4>{t.phone}</h4>
                <p dir="ltr">+966 54 139 3169</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-details">
                <h4>{t.email}</h4>
                <p>contact@sindo-media.agency</p>
              </div>
            </div>

            <div className="contact-social">
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

            <div className="partner-badges">
              <p className="partner-title">{t.trustedPartners}</p>
              <div className="partner-logos">
                <img
                  src="/partners-badge.png"
                  alt="Google Premier Partner & Facebook Marketing Partner"
                  className="partners-image"
                />
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
              <label className="form-label">{t.name}</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder=" "
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
              <label className="form-label">{t.emailLabel}</label>
            </div>

            <div className="form-group">
              <textarea
                className="form-input"
                rows={5}
                placeholder=" "
                required
                value={formState.project}
                onChange={(e) => setFormState({ ...formState, project: e.target.value })}
              ></textarea>
              <label className="form-label">{t.project}</label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              <span>{isSubmitting ? t.sending : t.send}</span>
              <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
