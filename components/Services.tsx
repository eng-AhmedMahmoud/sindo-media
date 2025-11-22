'use client'

interface ServicesProps {
  language: 'ar' | 'en'
}

const translations = {
  ar: {
    title: 'خدماتنا',
    description: 'نسعى دائماً لتقديم الحلول وليس الخدمات فقط، لأن عملك يحتاج فريقاً وليس شركة تسويق تبيع الخدمات. كن مطمئناً أننا دائماً سنوصي بالأفضل لك',
    services: [
      {
        icon: 'fa-server',
        title: 'استضافة المواقع',
        description: 'تصميم المواقع والمتاجر الإلكترونية ضروري لجميع الأنشطة التجارية والخدمية، خاصة مع انتشار خدمات الإنترنت والاعتماد المتزايد عليها'
      },
      {
        icon: 'fa-mobile-alt',
        title: 'تطوير وبرمجة تطبيقات الجوال',
        description: 'أصبحت تطبيقات الهواتف الذكية لا غنى عنها في العصر التكنولوجي الحديث. نقدم خدمات تصميم وبرمجة تطبيقات تفوق التوقعات'
      },
      {
        icon: 'fa-search',
        title: 'تحسين محركات البحث (SEO)',
        description: 'تحسين المواقع لمحركات البحث من العوامل الحاسمة لنجاح موقع شركتك ونشاطك التجاري. للبقاء متقدماً على منافسيك بعدة خطوات'
      },
      {
        icon: 'fa-shopping-cart',
        title: 'تصميم المواقع والمتاجر الإلكترونية',
        description: 'نحن من أفضل الشركات في تصميم المواقع والمتاجر الإلكترونية، حيث نتصدر المجال بتصاميمنا المتنوعة التي ينفذها فريق متميز'
      },
      {
        icon: 'fa-share-alt',
        title: 'إدارة وسائل التواصل الاجتماعي',
        description: 'نحن دائماً الأفضل في التسويق الرقمي وإدارة وسائل التواصل، مع التركيز على الفهم الدقيق لسلوك العملاء المستهدفين وتحليل المنافسين'
      },
      {
        icon: 'fa-facebook',
        title: 'إعلانات فيسبوك',
        description: 'إعلانات فيسبوك من الأدوات القوية التي نقدمها، موفرين لأصحاب الأعمال حلولاً واستراتيجيات مخصصة للإعلان على فيسبوك'
      },
      {
        icon: 'fa-pen',
        title: 'كتابة المحتوى',
        description: 'كتابة المحتوى من الأدوات القوية التي تحتاجها لحملتك التسويقية، حيث تتيح لك تقديم نفسك للعملاء المحتملين بأفضل الكلمات التي تجذبهم'
      },
      {
        icon: 'fa-users-cog',
        title: 'نظام إدارة علاقات العملاء (CRM)',
        description: 'هدف نظام CRM يدور حول جذب العملاء المحتملين، وزيادة حجم المبيعات، وضمان رضا العملاء لتوفير أفضل تجربة تسوق ممكنة'
      },
      {
        icon: 'fa-camera',
        title: 'تصوير المنتجات',
        description: 'الصورة بألف كلمة، لذا فإن خدمة تصوير المنتجات ضرورية. في التسويق الرقمي، يمكن أن تؤدي الصورة إلى ألف زيارة بفضل عناصر الجذب القوية'
      },
      {
        icon: 'fa-palette',
        title: 'تصميم الهوية التجارية',
        description: 'تصميم الهوية التجارية من أهم الأدوات التي يحتاجها عملك للتميز بهوية فريدة تميزك عن منافسيك. الهوية التجارية هي ما يجلب الريادة لشركتك'
      },
      {
        icon: 'fa-video',
        title: 'إنتاج فيديوهات الموشن جرافيك',
        description: 'من خلال إنتاج فيديوهات الموشن جرافيك، يمكننا تحقيق التميز الكامل لعلامتك التجارية وشركتك، كونها من الأساليب غير التقليدية للتسويق'
      },
      {
        icon: 'fa-google',
        title: 'إعلانات جوجل',
        description: 'أصبحت إعلانات جوجل من أهم أدوات الإعلان للوصول إلى عملائك وجمهورك المستهدف بناءً على كلمات مفتاحية محددة'
      }
    ]
  },
  en: {
    title: 'Our Services',
    description: 'We strive to provide solutions, not just services, because your business needs a team, not just a marketing company that sells services. Rest assured that whatever you need, we will always recommend the best for you',
    services: [
      {
        icon: 'fa-server',
        title: 'Website Hosting',
        description: 'Designing websites and online stores is essential for all commercial and service activities, especially with the widespread availability of internet services and the increasing reliance on them'
      },
      {
        icon: 'fa-mobile-alt',
        title: 'Mobile App Development and Programming',
        description: 'Smartphone applications have become indispensable in the modern technological era. At First Markets, we offer design and programming services for applications that exceed expectations'
      },
      {
        icon: 'fa-search',
        title: 'Search Engine Optimization (SEO)',
        description: 'Optimizing websites for search engines and improving them are crucial factors for the success of your company\'s website and business activity. To stay ahead of your competitors by several steps'
      },
      {
        icon: 'fa-shopping-cart',
        title: 'Website and E-commerce Store Design',
        description: 'First is one of the best companies for website and e-commerce store design in Cairo, as it leads the field with its diverse website designs created by a distinguished team'
      },
      {
        icon: 'fa-share-alt',
        title: 'Social Media Management',
        description: 'We are always the best in digital marketing and social media management, focusing on a precise understanding of the behavior of target customers, as well as competitor analysis through in-depth and accurate studies'
      },
      {
        icon: 'fa-facebook',
        title: 'Facebook Ads',
        description: 'Facebook Ads is one of the powerful tools that First Markets offers, providing business owners and commercial activities with tailored solutions and strategies for Facebook advertising'
      },
      {
        icon: 'fa-pen',
        title: 'Content Writing',
        description: 'Content writing is one of the powerful tools you need for your marketing campaign, as it allows you to present yourself to potential clients with the best words and phrases that easily attract them to you'
      },
      {
        icon: 'fa-users-cog',
        title: 'Customer Relationship Management (CRM) System',
        description: 'The goal of a CRM (Customer Relationship Management) system revolves around attracting potential customers, increasing sales volume, and ensuring customer satisfaction to provide them with the best possible shopping experience'
      },
      {
        icon: 'fa-camera',
        title: 'Product Photography',
        description: 'They say a picture is worth a thousand words, so having a product photography service is essential. In digital marketing, a picture can lead to a thousand visits, thanks to its powerful attraction elements'
      },
      {
        icon: 'fa-palette',
        title: 'Designing commercial identities',
        description: 'Designing corporate identities is one of the most essential tools your business needs to stand out with a unique identity that sets you apart from your competitors. The corporate identity is what brings leadership to your company'
      },
      {
        icon: 'fa-video',
        title: 'Production of motion graphics videos',
        description: 'Through the production of motion graphics videos, we can achieve complete uniqueness for your brand and company, as it is one of the unconventional methods of marketing'
      },
      {
        icon: 'fa-google',
        title: 'Google Ads',
        description: 'Google Ads has become one of the most important advertising tools to reach your customers and target audience based on specific keywords'
      }
    ]
  }
}

export default function Services({ language }: ServicesProps) {
  const t = translations[language]

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t.title}</h2>
          <p className="section-description">{t.description}</p>
        </div>

        <div className="services-grid">
          {t.services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="service-icon">
                <i className={`fas ${service.icon}`}></i>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
