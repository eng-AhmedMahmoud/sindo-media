'use client'

interface TeamProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'فريقنا',
    description: 'تعرف على الأشخاص الموهوبين وراء نجاحنا',
    team: [
      { name: 'محمد رمضان', role: 'المدير التنفيذي' },
      { name: 'مصطفى ميكا', role: 'مدير المحتوى' },
      { name: 'أحمد خليل', role: 'مدير التسويق' },
      { name: 'مهاب الحداد', role: 'مدير التصوير' }
    ]
  },
  en: {
    title: 'Our Team',
    description: 'Meet the talented people behind our success',
    team: [
      { name: 'Mohamed Ramadan', role: 'CEO' },
      { name: 'Mostafa Mika', role: 'Content Manager' },
      { name: 'Ahmed Khalil', role: 'Marketing Manager' },
      { name: 'Mohab Elhaddad', role: 'Director of Photography' }
    ]
  }
}

export default function Team({ language }: TeamProps) {
  const t = translations[language]

  return (
    <section id="team" className="team">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="team-grid">
          {t.team.map((member, index) => (
            <div
              key={index}
              className="team-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="team-image">
                <div className="team-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <div className="team-social">
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
