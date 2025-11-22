'use client'

interface ClientsProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'عملاؤنا',
    description: 'موثوق به من قبل العلامات التجارية الرائدة حول العالم'
  },
  en: {
    title: 'Our Clients',
    description: 'Trusted by leading brands around the world'
  }
}

const clients = [
  { icon: 'fa-building', name: 'Client 1' },
  { icon: 'fa-store', name: 'Client 2' },
  { icon: 'fa-shopping-bag', name: 'Client 3' },
  { icon: 'fa-utensils', name: 'Client 4' },
  { icon: 'fa-heartbeat', name: 'Client 5' },
  { icon: 'fa-graduation-cap', name: 'Client 6' }
]

export default function Clients({ language }: ClientsProps) {
  const t = translations[language]

  return (
    <section id="clients" className="clients">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="clients-logos">
          {clients.map((client, index) => (
            <div
              key={index}
              className="client-logo"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="logo-placeholder">
                <i className={`fas ${client.icon}`}></i>
                <span>{client.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
