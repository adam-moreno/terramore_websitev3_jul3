# Terramore Website

A modern Next.js website for Terramore, featuring a comprehensive business platform with workshops, courses, and solutions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd terramore-website

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
terramore-website/
├── app/                    # Next.js 15 App Router
│   ├── about/             # About page
│   ├── careers/           # Careers page
│   ├── courses/           # Course pages (scaling, offers, leads)
│   ├── partner/           # Partner page
│   ├── privacy/           # Privacy policy
│   ├── resources/         # Resources page
│   ├── solutions/         # Solutions page
│   ├── terms/             # Terms of service
│   ├── workshops/         # Workshops page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── schedule-popup.tsx # Schedule popup component
│   └── theme-provider.tsx # Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── images/           # Image assets
└── styles/               # Additional styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Package Manager**: pnpm

## 🎨 Design System

The project uses a comprehensive design system built with:
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for accessible, customizable components
- **Radix UI** primitives for robust component foundations
- **Custom color palette** with blue/slate theme

## 📱 Features

### Core Features
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Navigation**: Multi-level navigation with dropdown menus
- **Schedule Popup**: Interactive scheduling component
- **Course Management**: Structured course pages with clear navigation
- **Workshop Integration**: Dedicated workshop pages and scheduling

### Pages
- **Homepage**: Hero section with call-to-action
- **Workshops**: AI Marketing Workshop information
- **Courses**: Three-tier course structure (Foundation, Make It Real, Build to Grow)
- **Solutions**: Business solutions and services
- **About**: Company information and team
- **Partner**: Partnership opportunities
- **Resources**: Educational content and materials

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

## 🚀 Deployment

The project is configured for deployment on Vercel with automatic deployments from the main branch.

### Environment Variables
Create a `.env.local` file for local development:
```env
# Add any required environment variables here
```

## 📝 Documentation

This project follows a component-driven development approach with:
- Reusable UI components in `/components/ui/`
- Custom business components in `/components/`
- Page-specific logic in `/app/` directory
- Utility functions in `/lib/`

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Implement responsive design for all components
4. Test on multiple devices and browsers
5. Update documentation for new features

## 📄 License

This project is proprietary to Terramore.

---

**Built with Next.js 15 and modern web technologies**
