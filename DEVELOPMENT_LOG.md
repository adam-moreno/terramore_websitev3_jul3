# Development Log - Terramore Website

## Project Initialization - [Current Date]

### Initial State Assessment
- **Project Type**: Next.js 15 application with App Router
- **Package Manager**: pnpm (already configured)
- **Dependencies**: All major dependencies installed and up-to-date
- **Development Server**: Successfully running on localhost:3000

### Key Decisions Made

#### 1. Technology Stack Confirmation
- **Next.js 15**: Latest version with App Router for modern React development
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Shadcn/ui**: Component library built on Radix UI primitives
- **pnpm**: Fast, efficient package manager with disk space optimization

#### 2. Project Structure
- **App Router**: Using Next.js 15's new App Router for better performance and features
- **Component Organization**: 
  - `/components/ui/` for reusable UI components
  - `/components/` for business-specific components
  - `/hooks/` for custom React hooks
  - `/lib/` for utility functions
- **Page Organization**: Each route has its own directory under `/app/`

#### 3. Design System
- **Color Palette**: Blue/slate theme for professional appearance
- **Typography**: Clean, modern font stack
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Consistency**: All UI components follow Shadcn/ui patterns

### Current Features Implemented

#### Navigation System
- **Desktop Navigation**: Horizontal menu with dropdown for courses
- **Mobile Navigation**: Collapsible hamburger menu
- **Active States**: Hover effects and visual feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Core Pages Structure
- **Homepage**: Hero section with call-to-action
- **Workshops**: AI Marketing Workshop information
- **Courses**: Three-tier structure (Foundation, Make It Real, Build to Grow)
- **Solutions**: Business solutions and services
- **About**: Company information
- **Partner**: Partnership opportunities
- **Resources**: Educational content
- **Legal Pages**: Privacy, Terms, Careers

#### Interactive Components
- **Calendly Scheduler**: Integrated scheduling widget for appointments (replaced iClosed)
- **Floating Action Buttons**: Quick access to cookies and scheduling
- **Announcement Banner**: Promotional content display
- **Accordion Components**: Collapsible content sections

### Development Environment Setup

#### Dependencies Installed
- **React 19**: Latest React version with concurrent features
- **Next.js 15**: Latest Next.js with App Router
- **TypeScript 5**: Latest TypeScript for type safety
- **Tailwind CSS 3.4**: Latest Tailwind with all features
- **Radix UI**: Complete set of accessible UI primitives
- **Lucide React**: Modern icon library
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Date-fns**: Date manipulation utilities

#### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Performance Considerations

#### Optimization Strategies
- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic code splitting by Next.js
- **Bundle Analysis**: Available through Next.js build process
- **Caching**: Static generation where possible

#### SEO Optimization
- **Metadata**: Proper meta tags and descriptions
- **Semantic HTML**: Proper heading hierarchy and structure
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines

### Security Measures

#### Best Practices Implemented
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and security rules
- **Next.js Security**: Built-in security features
- **Environment Variables**: Secure configuration management

### Testing Strategy

## Scheduling Integration Update - [Current Date]

### Problem Statement
The iClosed scheduling integration was not working properly for the business. A replacement was needed that maintained the exact same look and feel while using a more reliable scheduling solution.

### Solution Implemented

#### 1. Calendly Integration
- **Replacement**: Replaced iClosed with Calendly integration
- **URL**: Using `https://calendly.com/adam-moreno/terramore-strategy-call`
- **Maintained**: Exact same UI/UX design and functionality
- **Components**: Created new Calendly components to replace iClosed components

#### 2. New Components Created
- **`CalendlyWidget`**: Replaces `IClosedWidget` with identical styling and behavior
- **`CalendlyPopup`**: Replaces `IClosedPopup` with identical styling and behavior
- **`useCalendlyPopup`**: Hook for managing Calendly popup state

#### 3. Updated Files
- **All Pages**: Updated imports and component usage across all pages
- **Main Pages**: Homepage, Solutions, Courses, Partner, About, etc.
- **Legal Pages**: Privacy, Terms, Disclosure, DMCA, etc.
- **Course Pages**: Scaling, Leads, Offers pages

#### 4. Features Maintained
- **Widget Functionality**: Same date selection, business day calculation
- **Popup Functionality**: Same modal behavior and styling
- **User Experience**: Identical interaction patterns and visual design
- **Integration**: Same iframe embedding with proper sandbox attributes

### Technical Implementation

#### Component Structure
```typescript
// CalendlyWidget - Identical to IClosedWidget
- Date selection with business day calculation
- Profile display with Adam Moreno photo
- Call-to-action buttons
- Embedded Calendly iframe

// CalendlyPopup - Identical to IClosedPopup  
- Modal overlay with backdrop
- Header with title and description
- Embedded Calendly iframe
- Close button functionality
```

#### Hook Implementation
```typescript
// useCalendlyPopup - Identical to useIClosedPopup
- State management for popup visibility
- Open/close functions
- Same interface as original hook
```

### Benefits of Change
- **Reliability**: Calendly is a more established and reliable platform
- **Consistency**: Maintains exact same user experience
- **Maintainability**: Easier to manage and update
- **Integration**: Better compatibility with modern web standards

### Files Modified
- `components/calendly-widget.tsx` (new)
- `components/calendly-popup.tsx` (new) 
- `hooks/use-calendly-popup.tsx` (new)
- All page files updated to use new components
- All import statements updated across the codebase

### Testing Considerations
- **Visual Testing**: Ensured identical appearance and behavior
- **Functionality Testing**: Verified all scheduling flows work correctly
- **Cross-browser Testing**: Confirmed compatibility across browsers
- **Mobile Testing**: Verified responsive behavior on mobile devices

---

## Local Dev Setup & Production Parity - March 14, 2026

### Initialization Steps
1. **Prerequisites**: Node.js 18+, pnpm (recommended).
2. **Install dependencies**: From project root run `pnpm install`. If you see `ERR_PNPM_EPERM` when downloading packages, run with full network/permissions (e.g. outside sandbox or with `pnpm install` in a normal terminal).
3. **Start dev server**: `pnpm dev` — app runs at [http://localhost:3000](http://localhost:3000).
4. **Production build**: `pnpm build` then `pnpm start` to run the production build locally.

### What the Production Version Looks Like (Local Dev)
- **Homepage** (`/`): Terramore marketing site with hero, flash cards, founder carousel, Calendly/schedule popups, roadmap modal, Do Not Sell and Free Courses popups, FAQs, footer. Metadata points to production URL `https://terramore.io`.
- **Routes**: About, Careers, Courses (foundation, make-it-real, build-to-grow), Disclosure, DMCA, Partner, Privacy, Resources, Solutions, Terms, Workshops.
- **Integrations**: Google Analytics (via `GoogleAnalytics` in root layout), Calendly, Cloudinary images. No `.env` files in repo; add `.env.local` if you need Supabase or other env vars (see SUPABASE_SETUP.md if using Supabase).
- **Config**: `next.config.mjs` has `images.unoptimized: true`, ESLint/TypeScript ignore during builds. Same codebase serves both dev and production; production is typically deployed (e.g. Vercel) from this repo.

### Decisions This Session
- Confirmed pnpm as package manager and Next.js 15 App Router structure.
- Documented that local `pnpm dev` mirrors production behavior; only environment variables and deployment platform differ.

---

## Course URL & Foundation Video Spec – March 14, 2026

### URL changes
- **The Foundation**: `/courses/scaling` → `/courses/foundation` (new route, old URL redirects).
- **Make It Real**: `/courses/offers` → `/courses/make-it-real` (new route, old URL redirects).
- **Build to Grow**: `/courses/leads` → `/courses/build-to-grow` (new route, old URL redirects).

### Implementation
- **New pages**: `app/courses/foundation/page.tsx`, `app/courses/make-it-real/page.tsx`, `app/courses/build-to-grow/page.tsx`. Old pages (`scaling`, `offers`, `leads`) removed.
- **Redirects** in `next.config.mjs`: permanent 308 redirects from old paths to new paths.
- **Internal links**: All nav, footer, and in-page links updated across the site (home, about, careers, workshops, resources, disclosure, partner, terms, solutions, dmca, privacy) to use the new course paths.
- **Sitemap & llms.txt**: Updated to list new course URLs.

### Foundation course – video embeds
- **Source**: R2 bucket `https://pub-ebfd3500fb2e4d449346ae4c5c507e84.r2.dev/`.
- **Videos**: 12 modules (Module 0–10 + Bonus) using filenames `Foundations_Portrait_Mar1426_Module0.mov` … `Module10.mov` and `Foundations_Portrait_Mar1426_Bonus.mov`.
- **Embed**: Native `<video src="..." controls />` per module; module list shows title only (no duration).
- **Titles**: Module 0 — Introduction; Module 1 … Module 10; Bonus (per spec; content-specific titles can be updated later).

### API — Option B (course_type / signup_source)
- **Decision:** Use new course slugs in the API so URL, course name, and stored value match (per handoff spec Option B).
- **Values sent:** When the signup form is submitted on each course page, we send:
  - `/courses/foundation` → `courseType: 'foundation'`, `signupSource: 'foundation'`
  - `/courses/make-it-real` → `courseType: 'make-it-real'`, `signupSource: 'make-it-real'`
  - `/courses/build-to-grow` → `courseType: 'build-to-grow'`, `signupSource: 'build-to-grow'`
- **Implementation:** All three course pages now submit their forms to `POST /api/course-signup` with the above values. No API route code changes; the API already accepts and stores whatever `courseType` and `signupSource` are sent. TerraIQ dashboard can display these as-is; optional label mapping and backfill for legacy `scaling`/`offers`/`leads` are documented in the TerraIQ repo checklist.