'use client'

import Image from 'next/image'

interface ProjectsProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'مشاريعنا',
    description: 'عرض لأحدث أعمالنا وقصص نجاحنا',
    viewProject: 'زيارة الموقع'
  },
  en: {
    title: 'Our Projects',
    description: 'Showcase of our latest work and success stories',
    viewProject: 'Visit Website'
  }
}

const projects = [
  {
    id: 1,
    titleAr: 'زاد للعطور',
    titleEn: 'Zad Perfume',
    categoryAr: 'متجر إلكتروني',
    categoryEn: 'E-commerce Store',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    url: 'https://zadperfume.com/'
  },
  {
    id: 2,
    titleAr: 'مصنع الفريد',
    titleEn: 'Alfarid Rubber',
    categoryAr: 'موقع تعريفي',
    categoryEn: 'Corporate Website',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
    url: 'https://alfaridrubber.com/'
  },
  {
    id: 3,
    titleAr: 'آرم آرتس',
    titleEn: 'ARM ARTS',
    categoryAr: 'إنتاج فني',
    categoryEn: 'Production Company',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    url: 'https://www.armarts.com/'
  },
  {
    id: 4,
    titleAr: 'سيانا سبورت',
    titleEn: 'Syana Support',
    categoryAr: 'صيانة الأجهزة الكهربائية',
    categoryEn: 'Electric Devices Maintenance',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
    url: 'https://syanasupport.vercel.app/'
  },
  {
    id: 5,
    titleAr: 'درينكي',
    titleEn: 'Drinki',
    categoryAr: 'مقهى قهوة',
    categoryEn: 'Coffee Shop',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    url: 'https://drinki.vercel.app/'
  },
  {
    id: 6,
    titleAr: 'أكاديمية طبيب',
    titleEn: 'Tabib Academy',
    categoryAr: 'منصة تعليم طبي إلكتروني',
    categoryEn: 'Medical E-learning Platform',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    url: 'https://tabib-academy.vercel.app/'
  }
]

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
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="project-image">
                <Image
                  src={project.image}
                  alt={language === 'ar' ? project.titleAr : project.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="project-overlay">
                  <a
                    href={project.url}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.viewProject}
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">
                  {language === 'ar' ? project.titleAr : project.titleEn}
                </h3>
                <p className="project-category">
                  {language === 'ar' ? project.categoryAr : project.categoryEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
