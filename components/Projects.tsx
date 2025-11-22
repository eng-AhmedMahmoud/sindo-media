'use client'

interface ProjectsProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'مشاريعنا',
    description: 'عرض لأحدث أعمالنا وقصص نجاحنا',
    projects: [
      { title: 'منصة تجارة إلكترونية', category: 'تطوير ويب' },
      { title: 'حملة علامة تجارية', category: 'تسويق' },
      { title: 'استراتيجية وسائل التواصل', category: 'وسائل التواصل' },
      { title: 'هوية مؤسسية', category: 'العلامة التجارية' },
      { title: 'إنتاج فيديو', category: 'إنتاج محتوى' },
      { title: 'تحسين SEO', category: 'تسويق رقمي' }
    ]
  },
  en: {
    title: 'Our Projects',
    description: 'Showcase of our latest work and success stories',
    projects: [
      { title: 'E-commerce Platform', category: 'Web Development' },
      { title: 'Brand Campaign', category: 'Marketing' },
      { title: 'Social Media Strategy', category: 'Social Media' },
      { title: 'Corporate Identity', category: 'Branding' },
      { title: 'Video Production', category: 'Content Creation' },
      { title: 'SEO Optimization', category: 'Digital Marketing' }
    ]
  }
}

export default function Projects({ language }: ProjectsProps) {
  const t = translations[language]

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="projects-grid">
          {t.projects.map((project, index) => (
            <div
              key={index}
              className="project-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="project-image">
                <div className="project-placeholder">
                  <i className="fas fa-image"></i>
                </div>
                <div className="project-overlay">
                  <a href="#" className="project-link">
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
