# Sindo Media - Marketing Agency Landing Page

A stunning, modern landing page for Sindo Media marketing agency built with Next.js 16 and Turbopack, featuring a beautiful green theme, dark/light mode, and bilingual support (Arabic/English).

## Features

### Design
- **Green Color Theme**: Eye-catching green gradient design throughout
- **Dark & Light Modes**: Toggle between dark and light themes (dark is default)
- **Bilingual Support**: Arabic (default) and English with RTL support
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Modern Animations**: Smooth fade-ins, floating shapes, and interactive elements

### Sections
1. **Hero Section**: Captivating introduction with animated stats counter
2. **Services**: Showcase of 6 key marketing services with icons
3. **Clients**: Display of client logos in a grid layout
4. **Projects**: Portfolio of completed projects with overlay effects
5. **Team**: Team member profiles with social links
6. **Contact**: Contact form with email, phone, address information

### Interactive Elements
- **WhatsApp Button**: Fixed button for quick contact (bottom left/right)
- **Scroll to Top**: Appears when scrolling down
- **Theme Toggle**: Switch between dark and light modes
- **Language Toggle**: Switch between Arabic and English
- **Smooth Scrolling**: Navigate sections smoothly

## Technology Stack

- **Next.js 16**: Latest React framework with App Router
- **Turbopack**: Ultra-fast bundler for development
- **TypeScript**: Type-safe development
- **React 19**: Latest React version
- **CSS3**: Custom styling with CSS variables
- **Font Awesome**: Icon library
- **Google Fonts**: Cairo font for Arabic/English support

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory
   ```bash
   cd sindo-media
   ```

2. Install dependencies (if not already installed)
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Customization

### Colors
Edit the CSS variables in `app/globals.css` to change the green theme colors:
```css
:root {
  --primary-green: #10b981;
  --primary-green-dark: #059669;
  --primary-green-light: #34d399;
  /* ... */
}
```

### WhatsApp Number
Update the WhatsApp number in `components/WhatsAppButton.tsx`:
```tsx
href="https://wa.me/966541393169"  // Replace with your number
```

### Content
- **Translations**: Edit translation objects in each component file
- **Team Members**: Modify the team array in `components/Team.tsx`
- **Services**: Update services in `components/Services.tsx`
- **Projects**: Change projects in `components/Projects.tsx`

### Contact Information
Update contact details in `components/Contact.tsx`:
- Address
- Phone number
- Email address
- Social media links

## Project Structure

```
sindo-media/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and theme
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── Services.tsx        # Services section
│   ├── Clients.tsx         # Clients section
│   ├── Projects.tsx        # Projects section
│   ├── Team.tsx            # Team section
│   ├── Contact.tsx         # Contact form
│   ├── Footer.tsx          # Footer
│   ├── WhatsAppButton.tsx  # WhatsApp floating button
│   └── ScrollToTop.tsx     # Scroll to top button
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies

```

## Features Breakdown

### Theme System
- Automatic dark mode on load
- Smooth transitions between themes
- Theme-aware components
- CSS variables for easy customization

### Language System
- RTL/LTR automatic switching
- Translation objects in components
- Cairo font for both languages
- Direction-aware styling

### Animations
- Fade-in effects on scroll
- Floating background shapes
- Hover animations on cards
- Smooth page transitions
- Animated stat counters

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Collapsible mobile menu
- Optimized touch interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Turbopack for fast development
- React 19 optimizations
- Next.js automatic code splitting
- Optimized images and fonts
- Minimal JavaScript bundle

## License

This project is created for Sindo Media.

## Support

For questions or support, contact Sindo Media at:
- Email: contact@sindo-media.agency
- Phone: +966 54 139 3169
- WhatsApp: Click the button on the website

---

Built with ❤️ using Next.js 16
