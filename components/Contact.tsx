'use client'

import { FormEvent, useState } from 'react'

interface ContactProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'اتصل بنا',
    description: 'دعنا نناقش كيف يمكننا مساعدة عملك على النمو',
    address: 'العنوان',
    addressText: '123 شارع التسويق، الحي التجاري',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    name: 'اسمك',
    emailLabel: 'بريدك الإلكتروني',
    project: 'طلب المشروع',
    send: 'إرسال الرسالة',
    success: 'تم إرسال رسالتك بنجاح!',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
  },
  en: {
    title: 'Contact Us',
    description: "Let's discuss how we can help grow your business",
    address: 'Address',
    addressText: '123 Marketing Street, Business District',
    phone: 'Phone',
    email: 'Email',
    name: 'Your Name',
    emailLabel: 'Your Email',
    project: 'Project Request',
    send: 'Send Message',
    success: 'Your message has been sent successfully!',
    error: 'An error occurred. Please try again.'
  }
}

export default function Contact({ language }: ContactProps) {
  const t = translations[language]
  const [formState, setFormState] = useState({ name: '', email: '', project: '' })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    setTimeout(() => {
      setMessage({ type: 'success', text: t.success })
      setFormState({ name: '', email: '', project: '' })
      setTimeout(() => setMessage(null), 5000)
    }, 1000)
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
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {message && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}

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

            <button type="submit" className="btn btn-primary btn-block">
              <span>{t.send}</span>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
