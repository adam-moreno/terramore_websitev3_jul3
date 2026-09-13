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

---

## Foundation Video Loading & Preload – March 14, 2026

### Problem
- “This video couldn’t be loaded” on some modules (e.g. Module 1); .mov has limited support outside Safari.
- ~1 minute from click to video rendering due to large file sizes and no preloading.

### Changes
1. **Preload adjacent modules**  
   Hidden `<video preload="auto">` elements for the next and previous module URLs. When the user switches module, the browser may serve from cache so playback starts faster. Preload runs in the background; no refs or play() on these elements.
2. **Error message**  
   Updated to: “This video couldn’t be loaded. .mov works best in Safari; try another browser or check your connection.”
3. **No crossOrigin**  
   `crossOrigin="anonymous"` was not added; it can break playback if R2 does not send CORS headers.

### Notes for team
- Long buffering is largely due to large .mov file sizes. For faster load: ensure R2 (or CDN) supports **Range requests**; consider providing **H.264 MP4** for broader support and smaller size.
- If Module 1 (or others) still fail, verify the URL and that the object exists in R2; consider MP4 fallbacks via `<source type="video/mp4" src="..." />` if available.

---

## Foundation Captions (WebVTT) – March 19, 2026

### Approach
- Generate captions locally with **Whisper** and upload `.vtt` files to R2 alongside the `.mov` videos.
- In the course player, attach captions using HTML5 `<track kind="captions" ...>` on the `<video>` element.

### Convention
- Use the same basename for captions, swapping extension:
  - `Foundations_Portrait_Mar1426_Module1.mov` → `Foundations_Portrait_Mar1426_Module1.vtt`
  - `Foundations_Portrait_Mar1426_Bonus.mov` → `Foundations_Portrait_Mar1426_Bonus.vtt`

### Implementation
- `app/courses/foundation/page.tsx` now derives the caption URL automatically by replacing `.mov` with `.vtt` for the selected module and renders an English captions track when applicable.

---

## Homepage Hero Redesign (Odyssey-inspired) – August 2, 2026

### Goal
Completely redo the homepage hero to resemble [odysseymovie.com](https://www.odysseymovie.com/): full-viewport cinematic feel, large centered brand title, accent tagline, ghost/outline CTA buttons, transparent nav overlay.

### Decisions
- **Background media:** AI video generation is not available in this environment. Instead, generated 4 cinematic AI stills (motivational / workout / growth / team celebration) and animated them with crossfade + Ken Burns zoom for a video-like feel.
- **Headline:** Large “TERRAMORE” title (movie-title treatment), with existing “Why Is Your Business Stuck?” as the accent tagline below.
- **Intro video:** Removed from the hero for a cleaner cinematic layout (was previously a side-by-side Loom embed).
- **Height:** Full viewport (`min-h-screen`) with nav overlaid transparently; nav gains a frosted dark background after scrolling past ~80px.

### Implementation
- New component: `components/hero-background.tsx` — cycles through 4 images every 7s with 2s opacity crossfade + `animate-hero-ken-burns` scale.
- Assets in `public/hero/` (`hero-bg-1` … `hero-bg-4`).
- Ken Burns keyframes added to `app/globals.css`.
- Homepage hero + nav updated in `app/page.tsx`.
- Primary CTA: “I’m Ready for Change” (Calendly). Secondary: “Start Free Course” → `/courses/foundation`.

---

## Hero Verticals Strip (Hawke-inspired) – August 6, 2026

### Goal
Mirror [hawkemedia.com](https://hawkemedia.com)’s client logo row under the hero CTA, but show **vertical names** with brand-lifestyle photos instead of client brand logos/names.

### Decisions
- Primary CTA renamed to **“Let’s Talk”** (opens Calendly), matching Hawke’s hero CTA language.
- Strip sits directly under the CTA group inside the cinematic hero — not a separate below-the-fold logos section.
- Six verticals: E-commerce, Fitness, Home Services, Professional Services, Tech & Startups, Creators.
- Each item is a compact photo tile + uppercase vertical label (no brand names).
- Mobile: horizontal snap-scroll row. Desktop: centered flex row.
- Staggered fade-in + subtle hover zoom for presence without clutter.

### Implementation
- New component: `components/hero-verticals.tsx`
- Assets in `public/hero/verticals/` (`vertical-ecommerce` … `vertical-creators`)
- `scrollbar-hide` utility added in `app/globals.css`
- Wired into homepage hero in `app/page.tsx`

### Update – August 6, 2026 (afternoon)
- Expanded strip to 10 verticals by adding: Skincare, Apparel, Loungewear, Construction.
- New assets: `vertical-skincare.png`, `vertical-apparel.png`, `vertical-loungewear.png`, `vertical-construction.png`.

---

## Hero Background: Business Verticals + Loop Video – August 6, 2026

### Goal
Replace inspirational “heavenly” / raised-hands hero backgrounds with business-oriented vertical imagery. Prefer gif-style motion when possible.

### Decisions
- Removed `hero-bg-1-triumph-sunrise.png` and `hero-bg-4-team-celebration.png` from the active rotation.
- First slide is a short muted looping MP4 (apparel boutique slow-zoom) — same feel as a GIF, but ~167KB vs multi-MB GIF.
- Also kept a lighter GIF sibling (`hero-bg-1-apparel-loop.gif`) for reference; hero uses the MP4 for performance.
- Second slide: e-commerce ops still. Fourth slide: business meeting still.
- Dropped workout energy from the rotation in favor of ecommerce ops (still more business than inspirational).
- Videos skip Ken Burns CSS (motion already in the loop); stills keep Ken Burns.

### Implementation
- Updated `components/hero-background.tsx` to support `{ type: "video" | "image" }` slides.
- New assets in `public/hero/`:
  - `hero-bg-1-apparel-loop.mp4`
  - `hero-bg-1-apparel-loop.gif`
  - `hero-bg-1-ecommerce-ops.png`
  - `hero-bg-4-business-meeting.png`

---

## Semrush-style Product Hero – August 24, 2026

### Goal
Rebuild only the homepage hero to match the [semrush.com](https://www.semrush.com/) first-screen pattern: a readable headline/CTA, then a product analytics visual that is mostly visible but clipped so the user scrolls a little to see it fully.

### Decisions
- Dropped the cinematic full-bleed photo banner and the Hawke photo-strip. Top of page is now copy + two CTAs only.
- Did not copy Semrush’s promotional top banner (event/promo strip).
- Light background + Terramore blue (`blue-600`) instead of Semrush purple.
- New `HeroAnalytics` product frame: browser chrome, sidebar, live campaign video, KPI tiles, and floating Traffic / Vertical mix / Conversion / Pipeline widgets.
- Visual well is shorter than the dashboard (about 420–540px clip vs ~720px content) with a white fade at the bottom — the “tease.”
- Nav restyled for a light hero: dark text, frosted white after scroll.

### Implementation
- New: `components/hero-analytics.tsx`
- Hero + nav in `app/page.tsx`
- Float / bar / sparkline / progress keyframes in `app/globals.css`

### Update – August 24, 2026 (afternoon)
- Product window now loads live `https://dashboard.terramore.io` (iframe) instead of the apparel lifestyle clip.
- Hero wash uses Semrush-like mint/lavender (`#f4f7f7`, `#ddeced`, `#c190ff`).
- Primary CTA is dark (`#111`), secondary is white — matching Semrush’s button treatment.
- Added infinite logo marquee (`components/hero-logo-marquee.tsx`) with platform/social marks (Google, Amazon, TikTok, Meta, Shopify, YouTube, Instagram, LinkedIn, Facebook, X, Pinterest, Reddit, Snapchat, WhatsApp, Spotify) — logos only, no names.
- A true Semrush-style *recorded* product video still needs Screen Studio / Tella / Loom of the dashboard; drop that MP4 in later if the iframe is blocked or too live.

---

## Lindy-style Hero – September 10, 2026

### Goal
Rebuild the homepage hero (and only the first-screen chrome) to match [lindy.ai](https://www.lindy.ai/): floating pill header, large centered headline with a gold accent, one blue “Try for free” CTA, floating integration marks, Slack-style product card.

### Wiring
- Header labels match Lindy: Solutions, Integrations, Pricing, Security, Enterprise, Resources, Log in, Try for free.
- Terramore destinations: `/solutions`, `/partner`, `/privacy`, courses under Resources, `dashboard.terramore.io` for Log in, `/courses/foundation` for Try for free.
- Calendly stays as “Or let’s talk” under the hero CTA.
- Product card channels are Terramore verticals (e-commerce, fitness, home services, apparel) instead of Lindy’s Slack channels.

### Removed from the hero
- Semrush mint/purple wash, logo marquee, dashboard iframe, hide-on-scroll header.

---

## Founder Calendar Avatar – September 10, 2026

### Problem
The Adam Moreno / Founder photo in the scheduling popup (`components/calendly-widget.tsx`) pointed at Cloudinary cloud `dx7id04uv`, which is disabled (`x-cld-error: cloud_name dx7id04uv is disabled`). The avatar rendered as a broken image on the white popup.

### Decision
Stop depending on that Cloudinary account for this avatar. Use a local illustrated cartoon of Adam in business formal (navy suit, white shirt, gold tie) at `public/founder/adam-moreno-cartoon.png`.

### Implementation
- New asset: `public/founder/adam-moreno-cartoon.png`
- `CalendlyWidget` and `IClosedWidget` both load `/founder/adam-moreno-cartoon.png`
- Homepage / About founder carousels still use the disabled Cloudinary URLs (separate from this popup fix)

---

## Header, inner pages, Möbius logos – September 10, 2026

### Header clicks
The pill header sat at `z-50` with the Calendly overlay, which auto-opened after 5.5s and ate every click. Solutions/Resources were also `<button>`s with no destination.

- `SiteHeader` now lives in root layout (`SiteChrome`) so it persists on every page
- Header is `z-[80]`; scheduling overlay is `z-40`
- Auto-open popup removed
- Menu labels are real links; dropdowns use a hover bridge (`pt-3`) so they stay open
- New routes: `/integrations`, `/pricing`, `/security`, `/enterprise`; `/resources` is no longer a placeholder

### Inner pages
Lindy cream (`#fbfaf7`), gold accent headlines, white cards. Solutions/partner heroes restyled; service grid and partner form kept. Legacy dark `nav.bg-slate-900` bars are hidden in CSS.

### Avatar
Popup photo regenerated from Adam’s real headshot with light cartoon stylization (`public/founder/adam-moreno-cartoon.png`).

### Hero logos
`HeroLogoMobius` walks Simple Icons (ads, commerce, CRM, email, analytics, creative) along an infinity path with a front/back opacity cycle.

---

## Homepage density, toolkit, channel analytics – September 10, 2026

### Width + header
Site-wide `page-shell` matches Lindy’s column: `min(1184px, 100% - 48px)`. Header, conversation card, toolkit, use cases, and Lindy inner pages share it, so left text inset equals the right tile’s outer inset. Toolkit/use-case tiles are ~49% of that column (~584px on desktop).

### Use cases + photos
A second sticky `01–05` block (`TerramoreUseCases`) covers e-commerce, fitness, home services, apparel, and professional firms. Toolkit tiles are product UI (logo grid, mix, funnel, meeting clip, files) like Lindy. Use-case tiles use real Unsplash photography in the same UI chrome — not the earlier AI product stills.

### Toolkit sticky stage
The right photo sits in a viewport-tall sticky slot (`sticky top-0` + `h-screen` + vertical center). 01–05 scroll on the left; the frame stays put and stacked images crossfade. Active step follows whichever item is nearest the vertical center of the viewport.

### Headline
Hero: **Unlock more from the business you already built.** Gold on the last line. Subcopy: Find what’s holding you back. Fix what’s broken. Build what moves you forward.

### Logos
Brand-colored Simple Icons on white tiles. Infinity path spans ~160vw so marks exit one side and re-enter on the other loop.

### Channel conversations
Each Slack-style channel is a named operator with a photo (Maya, Jordan, Priya, Luis) and a vertical-specific insight card: checkout funnel, paid mix/ROAS, speed-to-lead, creative CPA.

### Toolkit
Lindy-style `01–05` list (`TerramoreToolkit`) with a sticky photo/logo grid on the right that follows scroll: stack, channels, numbers, automations, playbooks.

## Conversation, toolkit, use cases – September 10, 2026

Removed the Möbius stroke. Logo tiles stay on the path but sit at ~8–20% opacity so the strip is hinted, not drawn.

Team replies use formal cartoon portraits (same style as Adam). `@Terramore` uses Slack mention colors: `#1264a3` on `rgba(242,199,68,0.42)`. Copy is short, spoken, no em dashes. Unfurls are compact. Professional shows a 90-day Gantt.

Toolkit subtitle and 01–05 copy simplified. Step 1 is a photo plus gold/blue/ink gradient with logo pills. Step 2 is a donut, not bars. Step 3 is a visit→ship leak path. Step 4 has no play button. Step 5 is a stacked Gantt.

Use cases no longer reuse the sticky 01–05. Lindy-style: eyebrow, pills, one photo plus a short Slack quote.

## Möbius path + capability unfurls – September 10, 2026

The infinity stroke now sits on its own layer (no copy hole) at ~14% ink so the figure-8 crossing is visible behind the headline — it reads as one Möbius strip, not two circles. Logos still use the radial hole. A top fade keeps both out of the fixed site header so nav words stay clear.

Channel replies dropped analytics. Each room is a capability unfurl: email tiles (Klaviyo-style), Google Drive assets, a Miami shoot brief, SMS flow, or a consult calendar.

## Hero conversation team + briefs – September 10, 2026

Terramore replies now match the client byline: **name, title, company**. First channel is Adam Moreno, Founder, Terramore. Other channels use Account Manager, Head of Sales, Lead Web Developer, Automation Expert, Growth Strategist. Added verticals from the existing set: professional, skincare, tech, creators, construction.

Replaced funnel/mix/spark charts with a **finding brief**: one sentence, two numbers, optional Scale/Pause rows, one next step. Same nested card in the thread, readable without reading a chart.

## Hero logo mask – September 10, 2026

Möbius path stays. A radial CSS mask punches a soft hole around `[data-hero-copy]` (headline, subcopy, CTA). Logos fade out as they enter the type and fade back in on the other side. Copy stays `z-20` and fully opaque. Hole size is measured with ResizeObserver so it tracks layout.

## Hero match to Lindy – September 10, 2026

Sampled from lindy.ai: page cream `#fcf9f8`, ink `#0f1e2e`, gold gradient `#f7b844 → #c68809` (background-clip text), button blue `#2a66ff` / hover `#2252cc`. Hero type is 72px / 700 / 1.05 / -0.02em; subcopy 20px / 500 / 30px; CTA is a 40px pill, not a tall oval. More space under the header (`pt-[13rem]`) and before the conversation card (`mt-24`). Card is taller and airier so it reads like Lindy’s Slack mock.

## Software tiles instead of people photos – September 10, 2026

Stock photos of people did not fit a software / consultancy site. Toolkit and use-case panels now use CSS/SVG product art: line-icon tiles, connected dashboard cards, flowcharts, a laptop with a flow plus code pane, file tiles, calendars, and email sequences.

- New `components/software-visuals.tsx` holds the shared illustrations. Brand wash is cream / pale blue / gold. No Unsplash people.
- Toolkit 01 is a scattered icon pack plus integration logos. 02 is connected spend tiles. 03 is a browser flowchart with the ship leak. 04 is a laptop flowchart (missed call → text → board). 05 stays a Gantt.
- Use-case left panels swap by pill: checkout path, booking calendar, SMS flow, Drive files, consult holds, refill emails.

Cartoon team portraits in the Slack conversation stay. Those are generated illustrations, not stock photos.

## Toolkit detail + Integrations page – September 10, 2026

Toolkit tiles now show the work, not vague labels.

- **01** Integration marks sit on a 6×6 grid with more top padding and gap. Light tilt only. No nudge, so none hide behind another. **See all integrations** stays a white pill.
- **02** Apps sit in labeled groups on the left. The right story card stays half the tile. Ads uses CPC. Site is Shopify + Stripe catching the same order: cart and checkout in Shopify, $86 paid in Stripe. No visitor portrait. Email keeps the three-channel list. The week total stays one size.
- **02** Starts on Ads when the tile comes into view, then walks Site, Email, Content. Content is automatic posting: one shoot posted to Instagram, YouTube, and TikTok, with logos and a Posted stamp on the stills. Less copy. Sticky visuals mount only while their step is active, so step 02 cannot keep looping in the background. Arriving always starts on Ads. Click a beat to hold it for four seconds, then the walk continues.
- **03** Recording is the main stage. A slim live tracker under it keeps every fact as the visit fills in: page, scroll, products, cart, user, card, checkout, paid, order, email. It does not drop the first line when Jordan Lee and Checkout Ready land. The loop ends on the full list.
- **04** Follow-up is one workflow, not a tree of equal cards. A Meta lead for Sam Reed ($2,400) arrives. Owner, sales, and VA light together. Then HubSpot, SMS, and Calendly move in parallel. The customer replies “2:15 works.” Sales sees it and the next action starts. The team row shows roles, not first names. The 5:4 frame is wider than it is tall, so the story uses full-width rows: headline, a horizontal lead bar, a 3-up team row, a 3-up moves row, then reply beside the next action. Headline is 18px. Next action stays inside the frame. No auto-scroll.
- **05** Audience intelligence. One clock only: Maya and Eli walk Notice you → On the site → The city → Ready. Facts match the step they are on. The purchase card stays dim until Ready, then Reach / Leads / Deals / Buys light next to Meta, Google, HubSpot, and sales. No Ideal customer row, no Website / Engagement / Intent / Behavior chips. No AudienceLab name. No performance claims. Roadmap is now step 06.

## Nav, Slack height, hero logos – September 11, 2026

The homepage is the product. Top nav now matches that, not a SaaS menu.

- Dropped Pricing, Security, and Enterprise from the bar. Those pages stay live so old links do not 404.
- **Solutions**: the six jobs (checkout, room, phone, drop, consults, get them back), plus How we work and Partner.
- **Integrations**: Ads, Store, Email and texts, Analytics. Groups on `/integrations` have matching ids.
- **Resources**: About, Questions, Talk with us. Courses and workshops are off the bar. The home course block is gone. Header CTA is Let’s talk → `/partner`.
- Slack card is taller (`min-h` 28rem / 36rem) so the thread has air.
- Hero Möbius logos are stronger (about 0.38–0.72 opacity, whiter tiles).
- About and Partner no longer draw a second dark nav. They sit under the shared header.

Helpful pages from this home page: Home, Solutions, Integrations, How we work (`/#how-we-work`), Use cases (`/#use-cases`), About, Partner, Questions (`/#faq`). Legal stays in the footer.

## Invite-only dashboard CTAs – September 11, 2026

Consulting launch: talk first, pay when work starts, Terra IQ is invite-only.

- Header **Log in** goes to `https://dashboard.terramore.io/sign-in` (not `/sign-up`). Label: Current clients.
- Public CTAs stay **Let’s talk** → `/partner` or **Or pick a time** (Calendly). No Try for free.
- Pricing is Talk / Start / Stay. Free course plan is gone.
- FAQ and Resources say the dashboard is for invited clients only.

## Slack card + faces – September 11, 2026

The Slack mock is capped at 972px, halfway from the old 760px cap to the 1184px header, and centered so the left and right inset match. Each channel uses a different person and a different photo style, mix of real photos and cartoons. Prompts name the service (email marketing, ads, SMS, site, 90-day plan, refill, same-day booking, film, chase estimates). Every Terramore reply is a short yes in different words, then the artifact. Team faces are new formal cartoons with different people, not copies of Adam. If a client photo fails, initials show so the row is never blank. The artifact tile is capped at 32rem so it stops between the reply text and the member photos. The channel list is 200px wide so names like e-commerce stay on one line. Every channel has its own icon.
- **06** Title is **You leave with a 90-day roadmap.** Rows are real work: WordPress → Shopify, past customer data, email/SMS for old leads, fix the path to buy, turn advertising back on, launch content. Bars overlap more and each row has its own color so the steps read as different work. Gantt bars animate in.

## Step 03 first-time buyer email – September 11, 2026

After the VLAIR visit pays, the tracker already had order confirmation. The Buy beat now keeps going: confirmation email, then a Mailchimp first-time buyer campaign, then an upsell for the Soft short they looked at ($68). Hovering Buy shows that end state. The list adds Campaign and Upsell so the interest on the home page is the reason for the offer.

## Discoverability + Audience jobs – September 11, 2026

Solutions / use cases now include two more jobs.

- **Discoverability:** Show up where people look. Multiple stores (Shopify, Amazon, Etsy), Google Maps, the site’s own SEO, and aggregators like Yelp. Visual lights each listing live.
- **Audience:** Talk to people who will buy. Reuses the Maya / Eli walk from toolkit step 05 so the job matches the work we already show: notice you, on the site, the city, ready.

## BCG-style capability pages – September 11, 2026

The earlier BCG pass was research only. Solutions was still the job pills. Capabilities now have their own pages.

BCG lists 20 capabilities. We kept the ones a growth team can run and dropped the giant-firm set: Business Resilience, Social Impact, People Strategy, Purpose, Climate, Corporate Finance, International, Manufacturing, M&A, Organization Strategy, Risk and Compliance.

**Hub:** `/solutions` is a capability grid, BCG-style. Title, deck, Learn more.

**Pages:** `/solutions/[slug]` uses BCG section headers: services offered, How We Help, Our Client Work, related capabilities. Offerings have child pages at `/solutions/[slug]/[offering]`. Headers match BCG (Marketing and Sales, Customer Insights, Digital, Technology, and Data, and so on). Body copy is Terramore: short, 6th grade, no em dashes.

**Ours on top of BCG:** Discoverability and Audience are first-class capabilities, not buried.

**Nav:** Solutions dropdown lists All capabilities, then every capability, then Jobs we take (`/#use-cases`). Two columns. Mobile lists the same. Homepage use-case pills stay for the jobs.

## Plain-language services – September 11, 2026

The All capabilities hub is gone. `/solutions` redirects to Get more sales. The Solutions menu lists each service, then Jobs we take.

Names are jobs a shop owner can say out loud: Get more sales, Save hours with AI, Know who buys, Make your tools talk, Charge the right price, Run a smoother week, Stop wasting money, Launch something new, Unstick the business, Get found, Reach the right people.

Each page leads with the impact in one line, then What we do, What you get, What this looks like. No BCG section titles. No “capabilities” in the nav.

## Solutions story pages (BCG format) – September 11, 2026

Get more sales was reading like a hub: a card grid of every offering. `/solutions` still redirects there, but the page is now one Marketing and Sales story, not a directory.

**Same chrome on every Solutions page (parent and offering):** eyebrow, H1, two story paragraphs, Let’s talk, then named service rows (title + deck, not cards), How We Help, Our Client Work, related rows, close CTA.

**Copy split:** nav stays the job names (Get more sales). Page H1 and section titles use the BCG capability names (Marketing and Sales, Artificial Intelligence, and so on). Body is still Terramore: short, 6th grade, no em dashes. Client work is checkout, first-time buyer / Soft short, missed-call texts. Not fake enterprise cases.

**Why:** BCG capability pages lead with a story and list services as named rows. We wanted that shape on every Solutions URL so Get more sales, Get found, and E-Commerce all feel like the same site.

## BCG visual format on Solutions – September 11, 2026

The last pass matched BCG section names but not the page. BCG capability pages (AI, Purpose, Customer Insights, Digital) use a large serif H1, a lead paragraph, a full-width rounded photo, a second paragraph, then service tiles with Learn more.

**Layout:** Every capability and offering page now uses that chrome. Source Serif 4 on H1/H2. Cream page. White rounded tiles. How We Help and Client Work are tiles too. Related-capability links are gone so we can fill pages first.

**Nav:** Job names (Get more sales, Save hours with AI) were too casual. The menu now uses business names a small owner already knows: Marketing and Sales, Artificial Intelligence, Customer Insights, Digital and Data, Pricing and Revenue, Operations, Cost Management, Innovation Strategy, Business Transformation, Discoverability, Audience.

**Copy:** Terramore, written for an owner who thinks in revenue, channels, and cash. No cute slang. No em dashes. Client work is still checkout, first-time buyer follow-up, missed-call booking.

**Hero images:** Still-life photographs per capability (no people, no logos), stored in `assets/capability-heroes/`. Offerings reuse the parent image.

## Integrations as business solutions – September 11, 2026

Integrations was one hub of logo pills. It now uses the same page chrome as Solutions.

**Header names** (what an owner already says): Email Marketing, Communications, Advertising, Ecommerce, Payments, Analytics, Scheduling. `/integrations` redirects to Email Marketing.

**Each category page:** serif H1, lead, photo, second paragraph, software tiles (logo + name + Learn more), How We Connect It, How It Becomes Revenue. Tool pages (Mailchimp, Shopify, Calendly) cover connect-to-what-you-have, introduce-if-missing, and how the path becomes an order or a booking.

**Why:** The stack is not a logo wall. It is how ads, the store, email, chat, pay, and the calendar share one customer so a click can become cash. We stay in the tools they pay for. We add the smallest missing piece. We do not start over.

## Homepage reviews, security, report, About – September 11, 2026

Owners needed two doors on every path: a meeting, or an email we can write to.

**Homepage order:** Hero (Let’s talk + Download a report + Or pick a time) → toolkit → Letters to Terramore review carousel (two-row marquee, Lindy shape) → CCPA / HIPAA security band → use cases → founder teaser → report band → FAQ → cream footer.

**Report:** `/report` collects name, email, site, and consent. `/api/report` stores the lead on the existing email list when Supabase is configured. Capabilities are not wired. After submit they see `/report/example`, a Northline Atelier sample (Soft Knit Set $84, Merino Cardigan $72). Names and numbers are changed from a live client file. The original client name is not on the page.

**About:** `/about` is now Adam Moreno, Kantar, Samba TV, solutions engineering, then Terramore. Initials, no Cloudinary photos.

**Advertising:** Already lives at `/integrations/advertising` and Marketing and Sales / Digital Marketing. FAQ, Resources, footer, and About point there.

**CTAs:** Header, Story pages, Lindy pages, FAQ, and footer all offer Let’s talk and Download a report.

## Free Digital Footprint report as a section, not a header button – September 11, 2026

The header and hero no longer lead with a Download a report button. People should read what is in the file first.

**Hero:** Let’s talk, Or pick a time, then a text line: Or get a free Digital Footprint report on your business. That line jumps to `#report`.

**`#report` section:** What is included (footprint, audience, wins, openings), how long (two to three business days), what they enter (name, email, site), and the form that sends the file to their inbox. `/report` reuses the same section.

**Header:** Let’s talk only. Resources still lists the free report as a page to read, not a second top button.

## Slack thread alignment + Nia photo – September 11, 2026

The hero Slack card was vertically centering the thread in a 36rem pane, so `# e-commerce` sat far above Nia Brooks. The thread now starts at the top of the pane, like Slack. Nia’s avatar is a clearer local headshot (`/founder/nia-brooks-headshot.png`) instead of a distant Unsplash crop.

## Homepage polish: steps, reviews, security, use cases – September 11, 2026

**Steps:** Gap after “leave you the plan” is half of what it was. Headers stay on one line and name the value: work inside current tools, connect every channel to revenue, find the leak, follow up the same day, reach people ready to buy, leave with a 90-day plan.

**Reviews:** One Lindy-style row. Photo, name, @handle, one-line quote, and a source mark (Google, Yelp, LinkedIn, G2).

**Security:** Three tiles in Lindy’s words (Compliant / Private / In your control) plus “See how we protect your data.”

**Use cases:** Names are outcomes now (recover checkout revenue, fill the appointment book, qualify inbound leads, launch a campaign, schedule more consults, drive repeat purchase). Visuals: the week book fills with names, a missed call becomes a qualifying site chat, a lookbook pans through a custom-home set with the client name removed, consults drop onto a partner calendar, refill emails float like the other job marks.

## Solutions cards reveal like BCG – September 11, 2026

BCG’s CMO Agenda / Digital Sales / E-Commerce cards keep the title on the photo, then spring a cream panel up to show the body. Solutions pages now do the same.

**Behavior:** Hover or click. Not a link. No Learn more. The photo stays, the title stays, and the copy appears inside the card. Clicking another card closes the first.

**Where:** Services, How we help, and Client work on every capability page, plus How we help on offering pages. Integration cards are unchanged so those still go to a tool page.

## Homepage hero, report popup, campaign calendar – September 11, 2026

**Logos:** The Möbius path is sized and centered on the headline, not on `160vw`. Each mark also gets `offset-path` from JS so a wide second monitor cannot send the path to a negative X. The track hugs the copy.

**Hero:** The copy fills the first screen. Slack sits in full under it, so only the top two channels peek at the fold. Scroll reveals the rest of the tile, then the toolkit. “Or pick a time” is gone. The report is no longer a skip link from the hero. Founder block is off the home page.

**Report:** The section is the file you get: four chapters (where you show up, who buys, what pays, where cash leaks) with a Northline sample line in each. The form opens in a popup after they choose “Send me the free report.”

**Launch a campaign:** A content calendar. Apparel, fitness, clinic, and home posts light up with a live date. No lookbook photos.

**Get found online:** Storefront marks are centered under a one-line story. Schedule more consults is removed. Integrations in the header stays open on click and closes on a second click or a click outside. Hover still opens and closes on leave. `/integrations` is a hub, and the footer Visit list all go to real pages.

## Site clarity audit – September 11, 2026

No code changed. Every public route was read as a first-time owner and graded 1 to 5 (plain words, purpose in five seconds, obvious next step). 41 sections, average 3.2, no 5s. The full table with next steps lives in the Cursor canvas `terramore-clarity-audit`.

**Why the audit, not edits:** The user asked for a grade and a plan first. The weakest items are structural (nav taxonomy, the `/partner` form, legacy pages) and should be decided before copy edits.

**Top findings:** the layout `<title>` still says “Free Courses & Consultations”; `/workshops`, `/courses/*`, and `/careers` contradict the site and sit in the sitemap at priority 0.9; the Solutions menu is twelve consulting nouns; `/partner` is an eight-step “Partner with Terramore.io” form with the old footer; `/pricing` and `/enterprise` are linked from nowhere; `/security`, `/pricing`, `/enterprise`, `/resources` have no footer; house words (leak, hold, the send, the list, Terra IQ) are never given a plain first use.


## Clarity audit: all eight fixes and the rerun – September 11, 2026

The eight "fix first" items from the audit are built. The same sweep (fetch every route from localhost:3000, strip to text, regrade with the same 1 to 5 rubric) was run again. 41 sections: average 3.2 → 4.5, seven 1s and 2s → zero, zero 5s → 22. The canvas `terramore-clarity-audit` now shows before and after per section.

**1. Legacy pages and tab title.** `app/workshops`, `app/courses/*`, `app/careers`, `components/free-courses-popup.tsx`, `hooks/use-free-courses-popup.tsx`, and the `course-signup` / `free-courses-signup` API routes are deleted. `next.config.mjs` redirects `/workshops` → `/partner`, `/courses` and `/courses/*` → `/`, `/careers` → `/about` (permanent). Sitemap drops them and adds `/pricing` and `/enterprise`; the courses priority bump is gone. `app/layout.tsx` metadata is "Terramore | A growth team for owners" with a real description and keywords. Per-page `metadata` added on `/partner`, `/pricing`, `/security`, `/enterprise`, `/resources`, `/report`, `/report/example`, `/about`, `/solutions`. `llms.txt` rewritten to match the site. The legal pages still carry their own old inline nav with course links; the redirects catch those, but the pages themselves were out of scope.

**2. /partner is "Talk with us".** New `components/talk-form.tsx`: three steps (what is stuck as a pick-one list of owner jobs, the business with site and optional type and revenue, name and email). Success state links to the Calendly page and the sample report. The page has a "What to expect" column (before, on, after the call), a direct calendar link, a pricing link, and `SiteFooter`. `app/api/partner-application/route.ts` now requires only `goal`, `name`, and `email`; the old fields are stored as "Not asked" / "Not shared" so the Supabase table shape did not change. Business name and site go into `message`. Duplicate email (409) is treated as sent, same as the report form.

**3. Hero.** Subline replaced with the descriptor (growth team, inside your store, ads, email; find the step where you lose sales; for owners with a shop, a service, or a list). A caption sits above the Slack tile: "How the work happens. You ask in your channel. We ship it in your tools." The hero copy block lost 2rem of min-height so Slack still peeks 156px at the fold on a 900px viewport.

**4. Solutions menu and hub.** `OWNER_JOBS` added to `lib/capabilities.ts` (six jobs, each pointing at the page that does it). `HeaderMenu` accepts `sections` with headings; Solutions shows "Pick the job" and "Every capability" side by side, with "See every job we take" and "All solutions" as strong links. Integrations menu ends with "All integrations"; Resources menu leads with Pricing and adds Start here. Mobile menu mirrors the grouping. `/solutions` is a real hub (jobs first, then all eleven capabilities) instead of a redirect.

**5. Pricing linked, cost answered.** FAQ cost answer names the three tiers and links `/pricing`; the report answer links the sample; all seven answers rewritten. Footer Visit list: Solutions (hub), Integrations, Pricing, report, About, Security, Questions, Larger teams, Start here, Talk with us. `/pricing` copy says what happens at each tier and when you pay, with a report link for people not ready to call. No dollar figures, on purpose.

**6. Four capability pages.** In `lib/capabilities.ts`: Digital, Technology, and Data opens with "Your ads, your store, your email, and your analytics should tell one story"; services are A 90-Day Plan, One View of Ads, Site, and Sales, Connect the Tools You Have, Score the Stack, Try New Tools Safely. Innovation Strategy and Delivery is now "Launch Something New" (Decide What to Launch, Ship It, Do It Again). Business Transformation is now "How We Work With You" (A Weekly Review, The First 90 Days, One Number We Are Moving). Artificial Intelligence opens with the 9 pm assistant and its services are An Assistant That Answers and Books, AI in the Daily Work, Rebuild the Path from Lead to Done, Rules for What It Can Say and See. Slugs unchanged so no URLs moved. Smaller renames: Marketing Function Excellence → A Cheaper Marketing Week, Supply Chain Management → Ship Dates You Can Hit, Schedule more consults → Fill the appointment book, Discoverability → Get Found, One clock → Four steps, no skipping.

**7. Proof.** All 24 client-work cards open with the kind of business (shapewear brand, plumbing, clinic, fitness studio, home goods shop). Review cards render `role` instead of the @handle and roles are now specific with a city. No numbers were invented; the audit asked for one per card and that needs real figures from the user.

**8. Jargon and About.** Plain first use everywhere the audit flagged: leak → the step where you lose sales, hold → a spot on the calendar, VA → your assistant, packet → the welcome files, pixel → tracking code, Business Manager → your ad account, the list → your email list, AOV → average order, SKU → next product, "Not Terra IQ" → "No login. No call." Security band uses the CCPA/HIPAA line. Use cases renamed (Answer every call and message, Reach people ready to buy). `StoryHero` has a `parent` prop; offering, capability, category, and tool pages show a "Part of …" link above the title. `/enterprise` lost its em dashes and is "Larger teams" in the footer. `/resources` is "Start here" with ten owner questions. `LindyPage` renders `SiteFooter`, so security, pricing, enterprise, and resources share the site footer. About leads with "Big brands pay a team to find out why people do not buy. Now you can have one," adds a "What that means for you" block, tells the resume once, and drops the stray Advertising line. Photo still needs a headshot.

**Still open (needs the user):** headshot for About; real numbers for client cards and reviews; dollar ranges on Pricing; Customer Insights and Pricing and Revenue openers; a neutral Integrations hub image; optional trim of the six-step section.

**Verification:** `tsc` clean outside pre-existing `components/ui` errors. Dev server restarted for the redirect change. All 22 public routes return 200 with the right `<title>`; legacy routes return 308. Talk form walked through all three steps in the browser (not submitted). Slack peek measured at 156px.

## Hero logos back, shorter subline, dark recorder, report animation – September 11, 2026

**Möbius logos.** They were rendering but invisible: the infinity path (about ±184px wide, ±84px tall) sat entirely inside the mask hole cut around the headline (±515 by ±208), so the mask hid every mark. The path now uses the whole track box (lobes reach `copyWidth + 2×reach` wide and `copyHeight + 150` tall) and the hole is a little smaller than the copy (0.42 × width, 0.46 × height), so about four fifths of each lobe is visible and marks fade only while passing behind the type. The mobile CSS caps on the track size were removed because they shifted the path off its box.

**Hero copy.** Subline is one line: "A growth team for owners. We find where you lose sales and fix it." The Slack caption is gone and the copy block min-height is back to `100svh - 10.75rem`.

**Blue background on the Vlair recorder.** `.software-visual-wash` was declared after `@tailwind utilities`, so its `background` shorthand beat the `bg-[#0a0a0a]` utility on the same element and painted the recorder blue (toolkit step 03 and the Recover checkout revenue use case). The wash rules now live in `@layer components`, and `Wash` skips the wash class whenever a `bg-` class is passed. The metrics HUD under the recording was never removed; it is visible again on black.

**Sticky visual height.** The right-hand box was `h-[min(36rem, 100vh - 10rem)]`, 576px tall on a 900px screen, which left a large gap under the integration logos and stretched every step. It is `aspect-[5/4]` now (capped at `100vh - 10rem`), matching the mobile cards, and the logo grid uses `content-evenly` so rows spread to the button.

**Report band.** The knit-set photo is replaced by `components/report-scan-visual.tsx`: five source chips (Site, Ads, Maps, Listings, Email) light up in turn while six findings appear one per second with a meter each: Discoverability (3 of 6 dots), Number of stores, Current highlights, Ad wins, Who buys, Where cash leaks. Values are Northline sample lines and say so. "What you get" copy stays under it.

## Report popup with three questions, shared across the site – September 11, 2026

**Why.** "Or get a free Digital Footprint report" sat too close to the "Let's talk" button and sent people to `/report`, a page that only restated the offer. The home page already had a nicer path: a popup with the form. Every report link now opens that same popup, and the popup warms the owner up before asking for an email.

**One component.** `components/report-popup.tsx` exports `ReportPopup` (`open`, `onClose`) and `ReportPopupLink` (a text button that opens it). The modal is a white `rounded-[1.75rem]` card on an `ink/60` backdrop at `z-[100]`, rendered through a portal to `body` so it is never nested inside a `<p>` and sits above the `z-[80]` header. Backdrop click and Escape close it; body scroll is locked while open. Header: "Free Digital Footprint report" eyebrow and "Three quick questions, then we read your business and send the file in two to three business days."

**Three softball questions, one at a time,** with a "1 of 3" counter and a progress bar. Each pick advances on its own after 750ms and shows one reassuring line:
1. Do you have a website or online store today? Yes / Not yet. "Good. That tells us where to look first."
2. Which is closest to your business? Online store / Local shop or service / Clinic or practice / Something else. "Got it. We read the footprint the way your customers find it."
3. Are you running any ads or sending emails right now? Yes, both / One of them / Not yet. "Thanks. Now we know where the first fix likely is."
Then "Last step. Where should the file go?" and the existing `ReportForm` (name, email, business name, website, consent). Success still goes to `/report/example?sent=1`.

**Storing the answers.** `ReportForm` takes an optional `answers` object and posts it with the lead. `app/api/report/route.ts` folds it into a short string like `site=yes; type=local; marketing=one` (letters, digits, `_`, `=` only; capped at 100 chars) and writes it to `course_type`, a `VARCHAR(100)` column on `free_courses_signups` that report leads never used. No schema change, and a lead with no answers inserts exactly as before (`course_type: null`).

**Where it is used.** `LindyPage` hero (security, pricing, enterprise, resources), `DualCtas` (about, story pages, FAQ, footer), `/partner` ("Not ready for a call?"), `/pricing` ("Not ready for a call?"), and `ReportBand` on the home page and `/report`, which lost its own inline modal and Escape handler in favor of the shared one. `ReportForm` gained a `plain` prop that drops its own card and header when it sits inside the popup. `/report` stays a page and stays in the menus.

**Spacing.** Lindy hero: the report link moved from `mt-3` to `mt-6`. `DualCtas`: stacked gap `gap-3` to `gap-5` (row gap on desktop is `gap-4`). Partner "Not ready" line: `mt-4` to `mt-7`.

**Verification.** `tsc` clean outside the pre-existing `components/ui` errors. Headless Chrome over CDP on `/pricing`, `/about`, `/partner`, and `/`: the link opens the popup, the three questions advance to the form with all five fields, Escape closes it and restores scroll, no console errors. The form was not submitted.

## Go-live pass: Supabase check, report pipeline, Slack and email alerts, legal pages – September 11, 2026

**What was asked.** Confirm both forms connect to Supabase, add an automatic Digital Footprint read that emails a PDF to the requester at low cost, make sure new bookings and new requests reach Adam, and list anything left before launch.

**Supabase: what could and could not be verified.** There is no `.env`, `.env.local`, or `.env.production` in this checkout and the running dev server has no Supabase variables, so the live project could not be introspected from here. What was verified instead: both routes insert exactly the columns defined in `SUPABASE_SETUP.md` and `supabase-website-migration.sql` (`free_courses_signups`: `first_name`, `last_name`, `email`, `company`, `email_consent`, `signup_source`, `course_type`, `signup_date`, `status`; `partner_applications`: `location`, `business_type`, `revenue`, `team_size`, `goal`, `timeline`, `budget`, `name`, `email`, `phone`, `message`, `application_date`, `status`). Types and nullability match. One real risk found: the newer migration file creates the tables in a `website` schema while both routes used the default `public` schema. New `lib/supabase-server.ts` gives both routes one client and reads `SUPABASE_SCHEMA` (default `public`; set `website` if that migration was the one you ran, and expose `website` under Project Settings → API). `GET /api/report/generate` with header `x-report-secret` now probes both tables and every column the routes use and reports which keys are present, so the check can be run against production in one call once the env is set.

**Report pipeline (`lib/report/*`, `app/api/report/route.ts`, `app/api/report/generate/route.ts`).** The Vlair report was produced in a different workspace; the transcripts here only reference the anonymised Northline sample, so the pipeline was designed fresh and kept cheap. On each report request the route saves the lead, returns 201, and then in `after()`: alerts Adam, confirms to the requester, and runs the pipeline. `footprint.ts` fetches the site HTML, robots.txt, and sitemap.xml with no paid API and records only observed facts: title, description, H1s, platform (Shopify, Woo, Wix, Squarespace, Webflow, WordPress), tracking pixels (Meta, GA, GTM, Google Ads, TikTok, Pinterest), email tools (Klaviyo, Mailchimp, HubSpot, Omnisend), social links, contact email and phone, cart or booking presence, visible prices. If `GOOGLE_PLACES_API_KEY` exists it adds one Places Text Search call (rating, review count, address, hours). Ad libraries are linked for a manual check, not scraped. `write.ts` sends those facts to the cheapest capable model for the key present (`OPENAI_API_KEY` → `gpt-4.1-mini`, `ANTHROPIC_API_KEY` → `claude-haiku-4-5`, override with `REPORT_MODEL`) with a system prompt that enforces the house voice (short sentences, no em dashes, never "tiles"), forbids invented facts, and requires "Not found" for anything not observed; a post-filter strips em dashes and the word "tiles" regardless. Output is the four chapters (Where you already show up; Who already looks, and who already buys; What already pays; Where cash is leaking) plus three 90-day moves. `pdf.ts` renders a Letter PDF with `pdf-lib` (new dependency, pure JS, no Chromium): ink cover, cream chapter pages with fact cards, closing page with the Calendly link and a plain-truth disclaimer. `pipeline.ts` emails the PDF to the requester with BCC to `adam.moreno@terramore.io`, stores the report text and status on the row, and posts a Slack line on sent, failed, or needs_keys. Estimated cost per report: about 4k input and 1.5k output tokens → roughly $0.004 on gpt-4.1-mini (about $0.01 on Haiku 4.5), plus about $0.03 if the Places call is on, plus email at Resend's free tier. Under five cents.

**Row columns.** `supabase/migrations/20260911_report_pipeline.sql` adds `business_name`, `website`, `report_status`, `report_text`, `report_error`, `report_sent_at` to `free_courses_signups`. Run it in the SQL Editor. Until it runs the code falls back: it logs a warning, and writes `needs_keys` or `failed` into the legacy `status` column so the row still says something went wrong. It never writes `sent` into `status`.

**Alerts and confirmations (`lib/notify.ts`).** Adam is told on Slack, not SMS. `notifyAdminOfLead` posts an Incoming Webhook message (`SLACK_WEBHOOK_URL`) with name, email, phone, business, site, the job or the three popup answers, the row id, and a link to the table in the Supabase dashboard; an email copy goes to `NOTIFY_EMAIL_TO` (default `adam.moreno@terramore.io`) when an email provider key exists. The requester gets `confirmLeadToUser`: an email ("We got it. The report lands in two to three business days." or "We got it. We read the site before we reply, usually within one business day.") and, only on the Talk form and only when they typed a phone, a short Twilio SMS. Email provider is whichever key exists: `RESEND_API_KEY`, `SENDGRID_API_KEY`, or `POSTMARK_SERVER_TOKEN`, sender `EMAIL_FROM`. Every channel is a logged no-op without its key and nothing here can fail a form submission; all of it runs in `after()`. `app/api/partner-application/route.ts` no longer throws a 500 when Supabase keys are missing; it logs the lead, sends the alerts, and returns 201 so a misconfigured deploy does not lose the request silently. The two `TODO` comments there are gone.

**Calendly.** `components/calendly-widget.tsx` lost the 2024 US holiday list, the fake weekday picker, and the three-second "finding the right person" spinner. It is now a small card with Adam's photo and the Calendly embed, so days, hours, and notice come from the account and cannot contradict it. `components/roadmap-modal.tsx` still has `calendly.com/your-calendar`, but nothing imports it (only its hook file exists), so it was left alone. Settings that live in Calendly, not in code, for the `terramore/30min` event type:
- Event type: one on one, duration 30 min, name "Talk with Terramore" or similar.
- Availability: a schedule in `America/Los_Angeles`, Monday to Sunday 7:00 am to 8:00 pm (drop days you do not want).
- Scheduling limits: minimum scheduling notice 2 hours; optional buffers and a daily cap.
- Notifications and workflows: email confirmation to invitee on; a workflow "Send text to host when a new event is scheduled" to Adam's cell (Calendly Standard or higher; verify the number in Calendly); host email notifications go to the account email, so the account or a workflow email step must point at `adam.moreno@terramore.io`.
- Invitee questions: keep name, email, and add "Website" so the site is known before the call.
- Confirmation page: redirect to `https://terramore.io/report/example` or leave Calendly's default.

**Legal pages.** `app/privacy`, `app/terms`, `app/disclosure`, `app/dmca` each carried a dark inline nav with a Courses menu linking to deleted `/courses/*` pages, a blue inline footer with "students" language, their own Schedule button and Calendly widget, and a 2025 LLC copyright. All four now render only their content and `SiteFooter`; the global `SiteHeader` comes from the root layout. Copyright lines read "Terramore.io, owned and operated by Adam Moreno, © 2026". Not changed: "Terramore.io, LLC" inside the policy prose and the "Last Updated February 4, 2025" dates, since those are legal statements to confirm, not layout. The pages are static again (no client hooks).

**Go-live checklist.**
1. Production env (Vercel → Settings → Environment Variables, Production scope): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SCHEMA`, `SLACK_WEBHOOK_URL`, one of `RESEND_API_KEY` / `SENDGRID_API_KEY` / `POSTMARK_SERVER_TOKEN`, `EMAIL_FROM`, `NOTIFY_EMAIL_TO`, `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, `REPORT_GENERATE_SECRET`, optional `GOOGLE_PLACES_API_KEY`, `REPORT_MODEL`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. Names are in `.env.example`. No `vercel.json` exists; defaults are fine.
2. Run `supabase/migrations/20260911_report_pipeline.sql`, then `curl -H "x-report-secret: …" https://terramore.io/api/report/generate` and confirm every probe is `ok: true` and `reportPipelineReady: true`.
3. Submit one real report request with your own email and check: Slack line, confirmation email, PDF within about a minute, row updated to `report_status = sent`.
4. Verify the sending domain at the email provider (SPF and DKIM) before the first send, or the PDF lands in spam.
5. Cloudinary assets load: OG image and favicon both return 200 `image/png` (checked with curl today). `metadataBase` is `https://terramore.io`.
6. `robots.ts` allows all, blocks `/api/`, points at the sitemap. `sitemap.ts` lists every public route including the legal pages and the generated solutions and integrations pages.
7. Redirects in `next.config.mjs` cover `/courses`, `/courses/*`, `/workshops`, `/careers`.
8. The live `terramore.io` still serves the old site (title "Consulting | Marketing | Free Courses"). Deploy this branch and purge any CDN cache.
9. `pnpm build` passed today (105 static pages, 4 API routes). `ignoreBuildErrors` still hides pre-existing `components/ui/*` type errors.
10. `components/roadmap-modal.tsx` is dead code with a placeholder Calendly URL; delete it when convenient.

**Files.** New: `lib/supabase-server.ts`, `lib/notify.ts`, `lib/report/footprint.ts`, `lib/report/write.ts`, `lib/report/pdf.ts`, `lib/report/pipeline.ts`, `app/api/report/generate/route.ts`, `supabase/migrations/20260911_report_pipeline.sql`, `.env.example`. Changed: `app/api/report/route.ts`, `app/api/partner-application/route.ts`, `components/calendly-widget.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/disclosure/page.tsx`, `app/dmca/page.tsx`, `package.json` (`pdf-lib`).

## Production deploy of the redesign – September 11, 2026

**What shipped.** Commit `7eabb56` on `main`, pushed to `origin` (`adam-moreno/terramore_websitev3_jul3`). It carried the whole redesign in one commit (136 files) plus the earlier local `54d36bb` checkpoint. Vercel project `terramore-website-final` (team Terramore IO) is git-connected to `main`, so the push built deployment `dpl_6qWd3hiWjaESbmsZNNF65cJ5UxHT` and promoted it to production. `https://www.terramore.io` now titles "Terramore | A growth team for owners"; the apex `terramore.io` 308s to `www` (Cloudflare in front of Vercel, unchanged).

**Image fix found in pre-flight.** `.gitignore` ignored the whole `public/` folder (a leftover Gatsby rule), and `git ls-files public` was empty, so nothing in `public/` had ever reached production; the old site used Cloudinary for everything. The redesign references `/founder/*`, `/reviews/*`, and `/vlair/*` by absolute path (`hero-analytics`, `calendly-widget`, `review-carousel`, `software-visuals`) and they would have 404'd. The rule is now `public/*` with `!public/founder/`, `!public/reviews/`, `!public/vlair/` (21 PNGs, 5.8 MB). `public/hero/` (34 MB of video and stills) stays ignored because nothing imports `hero-background` or `hero-verticals` any more. Capability and integration heroes import from `assets/` through `next/image` and are bundled under `/_next/static/media/`, so they needed nothing.

**Pre-flight.** No `.env`, `.env.local`, or `*.pem` staged; `.env.example` holds names and placeholders only; a regex pass over the staged diff found no key-shaped strings. `pnpm build` passed (105 static pages, 4 API routes). `pnpm lint` exits 1 on pre-existing errors in `components/ui/*`, `components/terramore-video*.tsx`, `components/software-visuals.tsx`, and three `no-explicit-any` hits in `lib/report/footprint.ts` and `lib/supabase-server.ts`; `eslint.ignoreDuringBuilds` is on, so none of that blocks a deploy. Not chased.

**Verified live after deploy.** 200 on `/`, `/partner`, `/pricing`, `/solutions`, `/integrations`, `/report`, `/report/example`, `/about`, `/security`, `/enterprise`, `/resources`, `/privacy`, `/terms`, `/sitemap.xml` (96 URLs), `/llms.txt`, `/robots.txt`. 308s: `/courses` and `/courses/foundation` → `/`, `/workshops` → `/partner`, `/careers` → `/about`. Images: `/founder/adam-moreno-cartoon.png`, `/founder/nia-brooks-headshot.png`, `/reviews/review-maya.png`, `/vlair/hero-campaign.png`, and the bundled `/_next/static/media/hero-marketing-and-sales.*.png` all 200 `image/png`; the Cloudinary OG image and favicon 200. `POST /api/partner-application` and `POST /api/report` with `{}` both return 400 with a validation message, not 500. No real form was submitted.

**Vercel environment (names only, all three scopes).** Present: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SITE_VERIFICAITON` (sic, 196 days old). Missing: `SUPABASE_SCHEMA` (defaults to `public`, fine if that is where the tables live), `SLACK_WEBHOOK_URL`, `RESEND_API_KEY` (or SendGrid/Postmark), `EMAIL_FROM`, `NOTIFY_EMAIL_TO`, `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`), `REPORT_GENERATE_SECRET`, `GOOGLE_PLACES_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. Effect today: leads save to Supabase, but no Slack line, no confirmation email or SMS, no report PDF; the `/api/report/generate` config probe is locked until `REPORT_GENERATE_SECRET` is set. Every channel is a logged no-op without its key, so forms still return 201.

**Project settings worth knowing.** Vercel builds with `npm install` / `npm run build` on Node 22 even though the repo uses pnpm; it has worked this way since February 2025 and worked again tonight, so it was left alone. The `.vercel/` link folder was not created in the repo; env names were read from a throwaway link in `/tmp` that was deleted afterwards.

**Next.** Add the missing env vars (Production scope at minimum), run `supabase/migrations/20260911_report_pipeline.sql`, then follow steps 2 to 4 of the go-live checklist above.

## Lead alerts through Hearth and the dashboard's Resend names – September 11, 2026

**Goal.** Send the marketing site's lead notifications through the existing "Hearth" Slack app (App ID `A0BQBDF5F8X`, workspace Terramore.io) and the Resend setup the Terra IQ dashboard already documents, reusing configuration rather than creating new apps or keys.

**What the dashboard and Hearth actually have (names only).** The Terra IQ repo (`terra-iq-1`) contains no Slack code; its Slack mentions are CRM design notes. Its Resend layer (`lib/email/resend.ts`) reads `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (sender), `RESEND_AUDIENCE_ID`, `RESEND_WEBHOOK_SECRET`; internal lead alerts use `LEAD_NOTIFICATION_EMAILS`. The Slack app lives in the separate Hearth repo (`~/Projects/hearth`, Vercel project `hearth`, `hearth.terramore.io`): an OAuth app with the single scope `incoming-webhook` (`src/lib/slack.ts`), env `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET`, storing each user's webhook URL encrypted in its own Postgres. There is no bot token, no `chat:write`, and no static webhook in any Vercel env. Vercel env names across `v0-internal-dashboard-for-terra-iq` (dashboard.terramore.io), `hearth`, and `terramore-website-final`: none of the three has `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SLACK_BOT_TOKEN`, or `SLACK_WEBHOOK_URL`. The dashboard's only email key is `BLUEPRINTS_WITH_BOB_SENDGRID_API_KEY` (Bob's SendGrid), so there was nothing to copy. The dashboard's `.env.local` holds only Clerk and Supabase names.

**Code (`lib/notify.ts`).** Slack has two modes, picked by `slackMode()`: `bot` when `SLACK_BOT_TOKEN` and `SLACK_LEADS_CHANNEL` are both set (`chat.postMessage` with blocks, `unfurl_links: false`, and a check of the JSON `ok` / `error` fields because Slack answers 200 on failure), else `webhook` when `SLACK_WEBHOOK_URL` is set, else `none` (logged no-op). Bot is preferred so the same code works if Hearth later gets `chat:write`; webhook is what Hearth can issue today. The sender is `FROM = RESEND_FROM_EMAIL || EMAIL_FROM || "Terramore <no-reply@terramore.io>"`, so the dashboard's variable name is honored first and one value serves both projects. `emailFromConfigured()` reports which name is in use. `lib/report/pipeline.ts` needed no change; it already sends through `sendEmail`.

**Probe (`app/api/report/generate/route.ts`).** `keys.slack` is now the mode string (`bot` / `webhook` / `none`) instead of a boolean, `keys.emailFrom` names the env var in use or `null`, `keys.email` still names the provider. New `GET ?test=slack` (same `x-report-secret` guard) posts "Terramore site connected to Hearth. Lead alerts will land here." and returns `{ slack, ok, channel, error? }`; 503 when Slack is unconfigured, 502 when the post fails.

**Vercel (`terramore-website-final`, Production).** Added `REPORT_GENERATE_SECRET` (generated with `openssl rand -hex 32`, piped over stdin, never printed; readable in Vercel → Settings → Environment Variables). Still missing: `SLACK_WEBHOOK_URL` (or `SLACK_BOT_TOKEN` + `SLACK_LEADS_CHANNEL`), `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFY_EMAIL_TO`, `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, optional `GOOGLE_PLACES_API_KEY` and Twilio. Nothing was set for OpenAI or Twilio. The `/tmp` Vercel links were deleted; no `.vercel/` folder was added to either repo.

**What Adam still has to click.** Slack: api.slack.com/apps/A0BQBDF5F8X → Incoming Webhooks → Add New Webhook to Workspace → pick the leads channel → copy the URL → Vercel `terramore-website-final` → `SLACK_WEBHOOK_URL` (Production). Or, for the bot path: OAuth & Permissions → Bot Token Scopes → add `chat:write` → reinstall to Terramore.io → copy the Bot User OAuth Token to `SLACK_BOT_TOKEN`, invite the bot to the channel, set `SLACK_LEADS_CHANNEL`. Resend: resend.com/api-keys → create or reuse a key → `RESEND_API_KEY`; set `RESEND_FROM_EMAIL` to an address on the verified `terramore.io` domain. Then redeploy and call `GET /api/report/generate?test=slack` with the secret.

## Mobile pass on the home page: hero logos, Slack channels, step visuals, use cases – September 11, 2026

**What was asked.** Adam tested the live home page on an iPhone (about 390px wide) and sent three screenshots: orbit logos floating over the headline, a Slack card stuck on the first channel with every channel reading like the same template, step visuals piling on top of each other, and a use-case row of seven wrapped pills with a clipped checkout mock. Fix mobile without changing desktop.

**Hero (`app/page.tsx`, `components/hero-logo-marquee.tsx`).** The Möbius orbit layer is now `hidden md:block`, so below 768px it does not render at all and nothing can sit over the type. In its place a slim marquee of the same `INTEGRATION_LOGOS` marks (white 36px chips, cream edge fades, the existing `hero-marquee` keyframes) runs under the "Let's talk" button, `md:hidden`. The unused `HeroLogoMarquee` was rewritten for this; it used to carry its own grey logo list and `#f4f7f7` fades that matched nothing on the page. The `<br />` in the headline is desktop only now, so the phone gets three natural lines instead of an orphaned "the". The ink and gold split is unchanged. Copy block min-height on phones is `calc(100svh - 14rem)` (desktop keeps `10.75rem`); on a 390x844 viewport the Slack card top lands at 620px, so it peeks in about 220px above the fold.

**Slack card (`components/hero-analytics.tsx`).** Root cause of "cannot switch channels": the card's grid column had `min-width: auto`, so the nine-pill row set the column's minimum width to roughly 1,200px and the whole card body overflowed the rounded frame (the header avatars were measured 557px past the right edge). The pill row was as wide as its content, so there was nothing to scroll. Fix: `grid-cols-[minmax(0,1fr)]` and `min-w-0` on the column. The pill row is now `overflow-x-auto snap-x snap-mandatory scroll-px-4 scrollbar-hide` with `shrink-0 snap-start` buttons (`role="tab"`), a right-edge white fade, and a small `useScrollRow` hook (`hooks/use-scroll-row.ts`) that centers the active pill by setting `scrollLeft` on the row rather than `scrollIntoView`, which would also scroll the page vertically. There is no auto-rotation, so nothing to pause. Content moved from a fixed prompt/reply/unfurl shape to a `messages` array so channels can differ in form. The first three now read differently on purpose: e-commerce is Nia asking a question with the one remaining `@Terramore` and Adam answering with the Klaviyo email card; fitness is Riley posting a proactive shoot-day update with a checklist (three done, one pending) and Caleb replying in one line; home-services is Farah asking if the after-5 text went out, Noah answering with a dark SMS log (missed call, text sent, book link opened), Farah closing it. No dollar results anywhere; only what was set up or is live. The other six channels keep their content, but four lost the `@Terramore` opener so the list does not read as copy and paste. Mobile card minimum height dropped from 28rem to 26rem so a two-message channel does not leave a large white gap.

**Step visuals (`components/software-visuals.tsx`, `components/sticky-showcase.tsx`).** Chosen approach: a mobile variant per visual rather than a scale-down wrapper, because shrinking a 480px composition to 350px puts 10px labels at 7px. The shared `Wash` frame is the switch: from `md` it is still `absolute inset-0` inside a fixed-aspect frame; below `md` it is `relative min-h-[26rem]` in normal flow, so each visual grows to its content and nothing can overlap or clip. Visuals that used fixed-height tricks were adjusted below `md`: `IntegrationTilesVisual` grid is in flow with 36px chips and tighter gaps; `ChannelValueVisual` hides the left source column, shows the active source's three app chips in one row, lets the detail card take its natural height, and turns the revenue strip into the switcher with "This week" on its own line; `LeakFlowVisual` (the Vlair recorder) gives the recorded screen a 15rem minimum and an `absolute inset-0` wrapper so percentage-positioned pages have a definite height to size against, plus `overflow-hidden` so the scrolled page no longer paints over the tab row (that one also fixed a latent desktop bug); the posting cards hide the platform name under the "Posted" stamp; `RefillSequenceVisual` stacks its three notes as rows; `DiscoverabilityVisual` goes to one column under 360px. `StickyShowcase` below `lg` now renders every visual (it used to mount only the one nearest the viewport center, so cards went blank as you scrolled), drops the 35% dimming on phones, and the title is `md:whitespace-nowrap` so long titles wrap at 320px. The sticky column stays `hidden lg:block`; phones get a plain vertical stack.

**Use cases (`components/terramore-use-cases.tsx`).** The pills are one horizontally scrolling row on phones (`overflow-x-auto snap-x snap-mandatory`, no wrap, hidden scrollbar), bleeding to the screen edge with `-mx-5 sm:-mx-6` so the cut-off pill and a cream right fade make it obviously scrollable; the same `useScrollRow` hook centers the tapped pill. From `md` the row is `flex-wrap justify-center` again, so desktop is unchanged. The selected visual uses the same in-flow `Wash`, so the checkout mock and the others fit the card width. The accordion option was passed over: with seven jobs it adds more taps and more vertical noise than a single row.

**Measurements.** Headless Chrome over CDP with `Emulation.setDeviceMetricsOverride` (mobile, DPR 3) at 320, 390, and 430 wide, plus 1024, 1280, and 1440 for desktop. The check gathers every text leaf and image, clips each rect by its overflow ancestors, and reports pairwise intersections over 2px and any element cut by a non-scrolling `overflow-hidden` ancestor. Results after the changes at all three phone widths: `scrollWidth === innerWidth`, no element wider than the viewport, zero overlaps and zero clips in the hero, Slack card (all nine channels tapped, active pill in view, nothing spilling past the card), the six step visuals sampled over 18 seconds of animation, and all seven use-case visuals sampled over 4 seconds each. Two remaining hits are by design: the review marquee (a continuously scrolling strip inside `overflow-hidden`) and a 2px transient between two booking cells while the `software-node-in` animation plays. Before the changes, 390px showed 39 hero overlaps, an 18-element spill in the Slack card, logos over the "See all integrations" link, and the Vlair text stacked at the top of a zero-height frame. Desktop at 1024 to 1440: steps and use cases have zero overlaps; the hero orbit still intersects the type geometrically, which is the intended masked pass-behind. `pnpm build` passed.

**Files.** Changed: `app/page.tsx`, `components/hero-analytics.tsx`, `components/hero-logo-marquee.tsx`, `components/software-visuals.tsx`, `components/sticky-showcase.tsx`, `components/terramore-use-cases.tsx`. New: `hooks/use-scroll-row.ts`.

## Self-hosted booking replaces Calendly – September 12, 2026

**Goal.** Book the free 30-minute call on our own pages, on Adam's Outlook calendar, with a Google Meet link, and drop every Calendly and iClosed embed. Two branches: `book-flow` here and `booking-api` in the Terra IQ repo. Neither is merged; both are draft PRs.

**Where the rules live.** Terra IQ owns availability and booking (`lib/booking/*` there): 30 minutes, 07:00 to 20:00 America/Los_Angeles, two hours notice, a 15-minute buffer after every call, days from `BOOKING_DAYS` (default all seven). Busy times come from the Outlook mailbox in `BOOKING_OWNER_EMAIL` through the Microsoft connection the dashboard already stores; the Gmail calendar is not read (hook marked in `lib/booking/outlook.ts`). A booking holds the row first (partial unique index on `owner_email, scheduled_start_utc` where status is scheduled), then creates the Outlook event with the lead as attendee (Graph sends the invite), asks the Meet REST API for an open space, and creates or links the lead the way the Calendly webhook did. If Meet is not connected the event gets a Teams link and the Slack alert says so. Cancel and reschedule use a signed `manageToken` (HMAC with `BOOKING_API_SECRET`).

**This repo.** New `lib/booking-api.ts` is the only place that knows `BOOKING_API_URL` (default `https://dashboard.terramore.io`) and `BOOKING_API_SECRET`; it never throws and reports `not_configured` when the secret is missing. Server routes `app/api/booking/availability` (GET), `app/api/booking` (POST), and `app/api/booking/manage` (GET details, POST cancel or reschedule) add the `x-booking-secret` header, so the browser never sees it. `components/booking-flow.tsx` is the three steps (day, time, details) plus the success card with the time in the visitor's zone, the Meet link, an "Add to calendar" `.ics` built in the browser (`lib/ics.ts`), and the manage link. `components/booking-popup.tsx` wraps it in the same portal shell as `report-popup.tsx` (`z-[100]`, Escape, backdrop, scroll lock) and exports `BookingLink`. Pages: `/book` (inline flow) and `/book/manage?token=` (`components/manage-booking.tsx`: move or cancel). Time zone is detected in the browser and sent as IANA; `lib/booking-format.ts` formats with `Intl`. Any upstream error, missing secret, or empty calendar shows "Booking is warming up. Send us a note instead" with a link to `/partner`; there is no blank state. A 409 from Terra IQ (slot just taken) reloads the days and asks for another time.

**Notifications (`lib/notify.ts`).** `notifyAdminOfBooking` posts to Slack with name, business, time in PT, and the Meet link (or the Teams note). `confirmBookingToUser` emails the lead the time in their zone, the join link, and the manage link, and texts when a phone was given. Both run in `after()` so the visitor sees the confirmation first. New `EMAIL_REPLY_TO` (default `adam.moreno@terramore.io`) is sent as Reply-To on Resend, SendGrid, and Postmark; `lib/report/pipeline.ts` passes it explicitly on the report email. `app/layout.tsx` now emits the Search Console tag from `GOOGLE_SITE_VERIFICATION` or the misspelled Vercel name `GOOGLE_SITE_VERIFICAITON`, whichever is set.

**Removed.** `components/calendly-widget.tsx`, `calendly-popup.tsx`, `iclosed-widget.tsx`, `iclosed-popup.tsx`, `schedule-popup.tsx`, `roadmap-modal.tsx`, and hooks `use-schedule-popup`, `use-calendly-popup`, `use-iclosed-popup`, `use-roadmap-modal` (all unused after this change). Every `calendly.com/terramore/30min` link is gone: the home page floating "Schedule" button now opens the booking popup, the Talk form success card and the partner page "Open the calendar" button open it too, the Talk confirmation email and the report email point to `terramore.io/book`, the report PDF closing page reads "Book: terramore.io/book", `llms.txt` and the sitemap list `/book`. What still says "Calendly" is the integrations catalog and copy about the tools clients already use (`lib/integrations.ts`, `about`, `resources`, `home-faq`, `software-visuals`, and the booking-tool regex in `lib/report/footprint.ts`); those are statements about client software, not our booking, so they were left alone.

**Env.** `.env.example` documents `BOOKING_API_URL`, `BOOKING_API_SECRET`, `EMAIL_REPLY_TO`, `GOOGLE_SITE_VERIFICATION`. The secret was generated with `openssl rand -hex 32` into `~/.terramore/booking-api-secret` (mode 600) and must be the same value on both Vercel projects; see the session report for what was set and what remains.
## Mobile rhythm: match lindy.ai spacing and stacking – September 12, 2026

**What was asked.** After the overlap fixes, Adam still found the phone version of the home page "squeezed together, spacing off". The brief: measure how lindy.ai lays out its home page on a phone and apply the same rhythm (section spacing, type scale, card treatment, one idea per screen) to ours, without changing desktop and without touching copy or assets.

**How lindy.ai was measured.** Headless Chrome over CDP (`--headless=new --remote-debugging-port=9333`), `Emulation.setDeviceMetricsOverride` 390x844 at DPR 3 with an iPhone Safari UA, a full scroll to trigger lazy content, then `getComputedStyle` and `getBoundingClientRect` over every section, heading, card, and CTA. Findings at 390px: page padding 17px (357px column); every section `padding: 49px 0`, so about 98px of clear space between sections; inside a section the container is a flex column with `gap: 49px` between the heading block and the first card; h2 -> subline 16 to 24px; h1 37px at line-height 1.05 and -0.02em; h2 41px at 1.05 and -0.02em, weight 700; card h3 24.5px at 1.1; body 16px at 1.5, weight 500; hero CTA 46px tall and auto width (not full width), radius 12px, 29px below the subline; cards are 12 to 24px radius with a 1px `rgb(231,231,231)` border, white or `rgb(252,251,248)` on the `#fcf9f8` page (the same cream we use), inner padding 20px 16px 18px on step cards and 20px on content cards, visuals inset 8px inside the card with their own radius; stack gaps 12px (channel and security cards) and 16px (steps, pricing). Group behaviour: the desktop sticky showcase collapses to one full-width card per step (number, title, body, visual) in a plain vertical stack; use cases are a wrapping row of pill chips over one stage card; testimonials are the only horizontal element, a 60s CSS marquee; there are no scroll-snap carousels and no sticky or scroll-jacking behaviour on the phone. Roughly one heading block or one card fills an 844px viewport. Spec saved as `/tmp/lindy-mobile-spec.md`.

**Where ours differed (390px, before).** Section padding was 64/64 in some sections and 80/80 in others, with the security band relying on the previous section's bottom padding. h2 sizes were 29.6px and 34.4px depending on the component, some bold and some semibold, all at line-height 1.5 (loose for a display size) and -0.04em. Step items were bare text with `py-10` on each `li` plus a `max-w-md` visual, so consecutive steps sat 250 to 270px apart with nothing framing them, and the visual was narrower than the text. Security cards used 32px padding and 20px gaps; the FAQ used 12px gaps; card radii were 28px on the hero, use case, and security cards, 24px on steps, 20px on the FAQ. The hero CTA was 40px tall. The hero headline read "thebusiness" on phones because the desktop-only `<br />` removed the space between the words. Use-case pills scrolled sideways behind a fade. Review quotes were truncated to one line.

**What changed (phones only, desktop pixel-identical).** `app/globals.css` now defines `--section-y: 3rem`, `--stack-gap: 1rem`, `--card-pad: 1.25rem`, `--card-radius: 1.5rem` and five `@layer components` classes that carry only the phone values: `.section-y`, `.stack-gap`, `.card-pad`, `.card-radius`, `.section-title` (36px, line-height 1.08, -0.02em, 700), `.section-lede` (16px at 1.5). Every use adds explicit `md:` utilities that restate the old desktop values (for example `section-y md:py-24`, `card-radius md:rounded-[28px]`, `section-title md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]`); Tailwind's utilities layer comes after the components layer, so the `md:` classes always win from 768px up. Adopted numbers: 48px section padding top and bottom (96px between sections, lindy's 49+49), 48px from heading block to first card, 16px between stacked cards, 24px card radius, 20px card padding, 16px inner-visual radius, h1 unchanged at 40px/1.05, h2 36px/1.08, card h3 24px/1.15, body 16px/1.5, primary CTAs 48px tall at auto width (lindy's are 46px and not full width, so ours stay pill-shaped and centered). `components/sticky-showcase.tsx`: below `md` each step is one white 24px-radius card with 20px padding containing the number, title, copy, and the visual inset with a 16px radius; the `ol` is a flex column with the 16px stack gap; from `md` up the list, `py-10`, and the `lg` sticky column are unchanged. `components/terramore-use-cases.tsx`: the job chips wrap into centered rows on all widths (lindy's pattern), the sideways scroller and fade are gone, chips are 41px tall on phones, and the selected visual sits inset 8px inside the card with a 16px radius above a 20px-padded text block; from `md` the two-column card is as before. `components/security-band.tsx`, `components/report-band.tsx`, `components/home-faq.tsx`, `components/review-carousel.tsx`, `components/home-founder.tsx`, `components/site-footer.tsx`, `components/hero-analytics.tsx`, `app/page.tsx`: same section, title, lede, radius, padding, and gap classes; review cards show the full quote on phones (`md:truncate` keeps one line on desktop) and the review marquee slows to 64s under 768px; the hero subline is 28px under the h1 and the CTA is 48px tall; the headline gets a `{" "}` before the desktop-only `<br />` so "the business" has its space.

**Verification.** Same CDP script at 320, 390, and 430: `scrollWidth === innerWidth` at all three, no element past the viewport edge outside the two marquees, no text clipped by an `overflow-hidden` ancestor. Measured: section padding 48/48 in every section, heading-block-to-first-card 48px (112px including the 16px lede gap and lede height in sections with a subline), stack gaps 15 to 16px, card padding 20px, card radius 24px, h2 36px/38.9px, hero CTA 111x48. Desktop check at 768, 1024, and 1280 against production: h1, h2, h3, CTA sizes and every section's top, height, padding, and card geometry are identical (the only difference at 768 was the report card's height, which changes with whichever chapter the 2.8s rotation has open). `pnpm build` passed. Before and after full-page captures at 390 are in `/tmp/before-390-full.png` and `/tmp/after-390-full.png`.

**Files.** Changed: `app/globals.css`, `app/page.tsx`, `components/hero-analytics.tsx`, `components/sticky-showcase.tsx`, `components/terramore-use-cases.tsx`, `components/review-carousel.tsx`, `components/security-band.tsx`, `components/report-band.tsx`, `components/home-faq.tsx`, `components/home-founder.tsx`, `components/site-footer.tsx`. Not touched: `components/software-visuals.tsx` (the visuals already size themselves in flow), `components/dual-ctas.tsx` and the booking files owned by the `book-flow` branch.

## About: formal founder headshot – September 12, 2026

**What was asked.** Replace the "AM" initials placeholder for the founder with a corporate, formal headshot of Adam, generated from his real photo so the likeness is his.

**Source and generation.** The original is the photo Adam attached in an earlier chat (`IMG_7190`, a candid in a grey blazer against a sequin backdrop). The illustrated `adam-moreno-cartoon.png` was already derived from it. Three photorealistic variations were generated with the original as the reference image and the same likeness brief (navy or charcoal jacket, white or light blue shirt, warm light grey studio backdrop, soft key light, shoulders up, direct gaze): navy jacket and white shirt with his full smile; charcoal jacket and light blue shirt with a soft closed smile; navy jacket, white shirt and a plain navy tie. All three kept his features. The first was chosen because it matches the original most closely (the wide genuine smile, brow shape, stubble and hair) while reading as corporate. Saved at 864x1152 PNG (216 KB) to `public/founder/adam-moreno-headshot.png` (served) and `assets/founder/adam-moreno-headshot.png` (source copy).

**Where it appears.** `app/about/page.tsx`: the founder block now renders the photo with `next/image` (rounded 1.75rem, `object-cover object-top`, 176x208 on phones and 224x256 from `md`, `priority` since it sits near the top of the page, alt "Adam Moreno, founder of Terramore"). `components/home-founder.tsx` used the same initials placeholder, not the cartoon, so it takes the same photo at 144x176 and 192x224. The cartoon stays where it is an illustrated avatar on purpose: the Slack card in `components/hero-analytics.tsx` and the booking widgets.

**Files.** Changed: `app/about/page.tsx`, `components/home-founder.tsx`, `DEVELOPMENT_LOG.md`. New: `public/founder/adam-moreno-headshot.png`, `assets/founder/adam-moreno-headshot.png`.

## Mobile: creative hero logos + constant-size rotating step visuals – September 12, 2026

**What was asked.** Two owner notes on the iPhone home page. First, the integration logos under the hero CTA rendered as a slim one-row marquee (`components/hero-logo-marquee.tsx`), which read as lame; replace it with a calmer, more creative mobile treatment inspired by lindy.ai, without ever letting logos sit over the hero headline or subline. Second, the step 02 visual (`ChannelValueVisual`) grew and shrank on phones as it auto-rotated through Ads, Site, Email, and Content, because the mobile frame sized itself to each state; make every rotating visual hold a constant height while it rotates, with no clipping at 320px and no desktop regression.

**How lindy.ai was studied.** Headless Chrome over CDP at 390x844 DPR 3 with an iPhone Safari UA (`Emulation.setDeviceMetricsOverride`, full scroll to trigger lazy content). On phones lindy presents its integrations not as a moving row but as a tidy grid of app-logo chips inside one soft, gently gradient card, anchored by a centered brand mark, with a short label and a "See all integrations" pill below. Their hero itself is calm: an ink and accent headline, one centered CTA, a small credential, and only a few very faint marks parked at the screen edges, never over the copy. Screenshots at `/tmp/lindy-390-top.png` and `/tmp/lindy-390-integrations.png`.

**Hero logos, the approach chosen and why.** A tidy 4x3 grid of the real integration marks in soft white chips inside one rounded card, with a short honest label and a gentle staggered fade and scale-in on scroll. This is the calmest of the options and the closest to how lindy actually treats integrations on a phone; a static grid with a one-time reveal has life without the perpetual, slightly desperate motion of a marquee, and it respects `prefers-reduced-motion` by rendering the finished state at once with no transform. It sits in flow well below the CTA in its own block, so the headline and subline keep clear space and are never overlapped. New `components/hero-integration-grid.tsx`: `max-w-[340px]` centered, label "Works with the tools you already use" at 13px ink/55, a 24px-radius card (`border-black/[0.06]`, `bg-white/70`, 20px padding), a `grid-cols-4 gap-4` of square 16px-radius white chips with a hairline ring, each holding one 24px `cdn.simpleicons.org` mark. A curated twelve marks from the real `INTEGRATION_LOGOS` set (Google, Meta, Shopify, Stripe, Mailchimp, HubSpot, Instagram, TikTok, YouTube, Google Ads, WhatsApp, Notion) keep it recognizable and uncrowded, distinct from the full-catalog grid in step 01. An `IntersectionObserver` at threshold 0.25 triggers the reveal; each chip transitions opacity and scale with an `index * 40ms` stagger. `app/page.tsx` swaps the old marquee import for `HeroIntegrationGrid` (still `md:hidden`, `mt-12`), and the desktop Mobius orbit (`components/hero-logo-mobius.tsx`, `hidden md:block`) is untouched. `components/hero-logo-marquee.tsx` was deleted.

**Constant-size rotating visuals, the approach per visual.** The shared `Wash` frame (`components/software-visuals.tsx`) took a `min-h-[26rem]` floor on phones and grew to fit each state, so any visual that reflowed while rotating changed height. `Wash` now takes an optional `frame` prop (default `min-h-[26rem] md:min-h-0`) so a visual can pin a fixed mobile height instead of a floor. Three fixes: (1) `ChannelValueVisual` (step 02) now renders all four source details stacked in one grid cell on phones (`grid`, children `col-start-1 row-start-1`, inactive `opacity-0 pointer-events-none aria-hidden`), so the frame is always as tall as the tallest state and only fades between them; desktop keeps a single `ChannelDetail beat={active}` under `hidden md:block` so it retains its per-switch entrance animation. Its top caption also got a reserved `min-h-[2.75rem]` box (reset at `md`) so a two-line wrap on a 320px phone does not change the height. (2) `ReportScanVisual` (report card, `components/report-band.tsx`) now keeps every finding in the layout and fades each in as it is read (`opacity` gated by the reveal step) instead of adding rows one by one, so the frame reserves the full-list height from the start. (3) `LeakFlowVisual` / the Vlair recorder (step 03 and the checkout use case) pins a fixed `h-[30rem]` mobile frame (`md:h-auto`), so the `flex-1` recorded-screen area absorbs the growth of the tracked-metrics HUD as the recording plays. The other rotating visuals (step 01 integrations, steps 04 to 06, use cases) already measured flat and were left alone.

**Verification.** Headless Chrome over CDP at 320, 390, and 430, sampling every rotating frame's bounding-box height 36 times over 18 seconds of animation. Before: step 02 varied 126px, the report card 237px, the Vlair recorder 25 to 42px at 390. After: every rotating frame measures 0px variance at all three widths (step 02 542px at 390 and 565px at 320, report 653px at 390, Vlair 480px), with `scrollHeight - clientHeight` of 0 on every frame, so nothing clips. The hero copy and the new grid do not overlap at any width (grid top sits 48px below the copy at 390 and 430, 48px at 320). `scrollWidth === innerWidth` at 320, 390, and 430. Reduced motion renders all twelve chips at opacity 1 with no transition. Desktop at 1280: the 36-mark Mobius orbit still surrounds the headline and the mobile grid is `display: none`. `pnpm build` passed. Screenshots: before at `/tmp/before-hero-390.png` (the old marquee, from production), after at `/tmp/after-hero-390.png` and `/tmp/after-hero-grid-390.png`, reduced motion at `/tmp/after-hero-grid-reduced-390.png`, desktop at `/tmp/after-desktop-1280.png`.

**Files.** New: `components/hero-integration-grid.tsx`. Changed: `app/page.tsx`, `components/software-visuals.tsx`, `components/report-scan-visual.tsx`. Removed: `components/hero-logo-marquee.tsx`.

## 2026-09-12 - Homepage mobile fixes: floating hero logos, step timing, header hierarchy, report CTA, cleanup

Eight concrete mobile-focused fixes to the home page (`app/page.tsx` and its components), verified with headless Chrome over CDP at 320/390/430 and spot-checked at 1280.

**1. Hero logos (mobile).** Removed the boxed 4x3 logo grid card (`components/hero-integration-grid.tsx`, deleted) and restored floating integration marks in the hero background, in the spirit of lindy.ai: a new `components/hero-floating-logos.tsx` renders eight small, semi-transparent (opacity ~0.28) marks scattered down the left and right edges/corners, behind the copy and well away from the centered text column, so the headline, subline, and CTA stay fully readable. They float subtly and stop entirely under `prefers-reduced-motion`. Rendered only below `md` (`md:hidden`); the desktop Mobius orbit (`hidden md:block`) is untouched.

**2. Step 02 (`ChannelValueVisual`).** It now always begins on the "Ads" state: an IntersectionObserver resets the rotation index to 0 whenever the visual enters the viewport and pauses the cycle while it is off screen. The per-state interval was doubled (4s to 8s) so a reader can follow. Each state now leads the reader with a guided caption, styled like steps 03/04: a small uppercase brand-blue label ("Step 1 of 4 · Ads") above the explanatory line. The constant-height treatment is intact (caption box reserves `min-h-[3.75rem]`).

**3. Reach-people-ready-to-buy (`AudienceIntelVisual`).** Slowed the walk animation (1.8s to 3s per step) and removed the excessive vertical gap between the "From first look to a buy" card and the "Then more people buy" card by switching the frame from `justify-between` to `justify-start gap-2.5`.

**4. Floating Schedule button (`app/page.tsx`).** The fixed booking button (now opens the self-hosted booking popup, post-Calendly) was tidied: consistent corner inset with safe-area support (`bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4`), `z-[70]` (below the header `z-[80]`, above content), and a slightly larger tap target (`h-10`). The action already opens the booking popup, so it was kept, not removed.

**5. Security link.** Removed the "See how we protect your data" link from `components/security-band.tsx`; the section now ends cleanly after the three promise cards.

**6. Use cases (`components/terramore-use-cases.tsx`).** Removed the "@Terramore ..." talking-to-the-client message block (quote + reply) from every use case and tightened the card so no empty box remains.

**7. Section header hierarchy.** Added a shared `.section-eyebrow` utility in `app/globals.css` (0.75rem, weight 600, 0.2em tracking, uppercase, muted ink/45) and applied it to every homepage section eyebrow (use cases, reviews, report), so the eyebrow reads clearly as a small label and the large bold `.section-title` headline is the dominant element. Copy unchanged. Sections without an eyebrow (steps, security, FAQ) already have a dominant headline.

**8. Report section CTA.** `components/dual-ctas.tsx` gained a `variant="report"` mode that renders a single, visually distinct gold button ("Get a free Digital Footprint report") which opens the report popup. Applied to the footer block headed "We find the step where you lose sales, fix it, and leave you a 90-day plan" (`components/site-footer.tsx`); the "Let's talk" button is gone there. All other `DualCtas` usages (FAQ, about, story pages) keep the default two-CTA layout, so nothing else is broken.

**Verification.** `scrollWidth === innerWidth` at 320, 390, 430, and 1280 (no horizontal overflow). Step 02 confirmed starting on "Ads" with the guided caption. Desktop 1280 hero orbit and section layouts not regressed. `pnpm build` passed. Screenshots: before `/tmp/before-hero-390.png`, `/tmp/before-full-390.png`; after `/tmp/after-hero-390.png`, `/tmp/after-step02c-390.png`, `/tmp/after-audience-390.png`, `/tmp/after-usecard-390.png`, `/tmp/after-report-390.png`, `/tmp/after-security-390.png`, `/tmp/after-footer-390.png`, `/tmp/after-desktop-hero.png`, `/tmp/after-desktop-footer.png`; lindy reference `/tmp/lindy-390.png`.

**Files.** New: `components/hero-floating-logos.tsx`. Changed: `app/page.tsx`, `app/globals.css`, `components/software-visuals.tsx`, `components/security-band.tsx`, `components/terramore-use-cases.tsx`, `components/review-carousel.tsx`, `components/report-band.tsx`, `components/dual-ctas.tsx`, `components/site-footer.tsx`. Removed: `components/hero-integration-grid.tsx`.

## Homepage report scan rebuilt to one finding per chapter – September 12, 2026

**Goal.** Replace the busy "What we read" scan in the homepage report band (`components/report-scan-visual.tsx`, also shown on `/report` through `ReportBand`) with a calmer visual that shows one finding at a time and stays in sync with the chapter list beside it.

**Findings, now four not six.** Dropped the source-chip row (Site/Ads/Maps/Listings/Email), every meter (dots and bars), and the accumulation logic. Cut the "Who buys / Women 32 to 46 / Soft Knit Set" line because it is a descriptor, not a stat. The remaining four each map to one chapter and reuse a sample value already in the Northline Atelier file: 01 Where you already show up = `3 of 6`; 02 Who already looks and buys = `18.2k` (the Instagram follower count from the sample report); 03 What already pays = `3.1x` (Meta return ads); 04 Where cash is leaking = `61%` (leave at shipping), shown in the warn tint. No new numbers were invented; the captions are plain-language one-liners drafted for the stats that lacked one, and each still names the fictional Northline Atelier so the sample framing is intact. No em dashes, and the word "tiles" is not used in any copy.

**Shared source of truth (`lib/report/chapters.ts`).** Both the band's right-column list and the scan now read one `CHAPTERS` array (chapter number, title, body, sample line, plus the scan's kicker, stat, caption, and tone). This removed the duplicate chapter constant that used to live in `report-band.tsx`.

**One rotation, driven by the scan.** The band used to run its own 2800ms timer for the highlighted chapter while the scan ran a separate one; the two drifted. Now `ReportBand` owns a single `active` index and passes it plus `setActive` to `ReportScanVisual`, which runs the only timer (3800ms auto-advance) and drives both sides. Clicking a chapter in the list or a progress dot sets the same index.

**New scan UX.** A single static "What we found" label replaces the animated "Reading… / Written by a person" status. Each finding is a small kicker, a large tone-aware hero stat (gold, warn tint for the leak), one caption, and a "Chapter 0X · Title" link to `/report/example#chapter-0X`. A row of real `<button>` progress dots (`aria-pressed`, `aria-label` "Show finding N of 4") selects a finding and pauses auto-advance; hover and focus pause it too. The sample-data disclosure caption stays at the bottom.

**Reduced motion.** Copied `usePrefersReducedMotion` from `components/software-visuals.tsx`. Under reduced motion there is no auto-advance and no crossfade; the first finding shows and the dots still allow manual navigation. CSS: removed the now-unused `report-meter-fill` keyframe and class (grep confirmed the scan was its only user) and added a `report-finding-in` fade, disabled inside a `prefers-reduced-motion: reduce` block.

**Anchors.** Added `id="chapter-01"` through `id="chapter-04"` with `scroll-mt-24` to the matching slides in `components/example-report.tsx` (footprint, audience, wins, openings) so the chapter links land in the right place under the fixed header.

**Files.** New: `lib/report/chapters.ts`. Changed: `components/report-scan-visual.tsx`, `components/report-band.tsx`, `components/example-report.tsx`, `app/globals.css`. `pnpm build` passed.

## Branded HTML transactional emails – September 12, 2026

**Goal.** The transactional emails from `lib/notify.ts` were plain text only, so raw long URLs (especially the booking manage link `https://terramore.io/book/manage?token=<hmac>`) showed in full and read like jargon. Adam wanted branded, mobile-safe HTML: a logo banner, key info in a clean format, and ugly URLs hidden behind buttons, while still degrading gracefully.

**Layout helper (`lib/email-template.ts`).** One small reusable shell built for email-client limits (Gmail, Outlook): a centered 600px table with all-inline CSS, no flex/grid, no external or head-only `<style>`, no SVG. `emailShell({ heading, bodyHtml, previewText })` renders a dark ink banner with the logo, a white content card, and a muted footer ("Terramore" + reply-to note). Helpers: `emailButton(label, href)` (a table-based brand-blue button whose href keeps the raw link and any token, but never shows the URL as text), `emailP`, `emailDetail` (labelled "Key: value" row), `emailSignoff`, and `esc` for HTML-escaping user input (names, notes).

**Logo.** Email clients do not reliably render SVG and the site logo is an `<img>` React component, not inline SVG. Rather than create a new PNG and fight the selective `public/*` gitignore, the banner reuses the same hosted white Terramore wordmark PNG the site already serves from Cloudinary (`res.cloudinary.com/dzzzkruux/.../vwxvqo.png`), a reliable absolute URL that renders on the dark banner. No new asset and no gitignore change were needed.

**Brand colors.** Read from `tailwind.config.ts`: banner ink `#0f1e2e`, page cream `#fcf9f8`, buttons brand blue `#2a66ff`, plus muted `#6b7280` and a soft border `#e6e2df`. The gold token (`#f7b844`) was left for future accents.

**Emails updated (`lib/notify.ts`).** All three now pass `html` alongside the unchanged `text` (multipart, graceful degradation):
- `confirmBookingToUser`: date/time in the lead's zone as a detail row, a "Join on Google Meet" button when `meetUrl` exists (otherwise the note that the calendar invite from adam.moreno@terramore.io carries the join link), the invite note, and a "Reschedule or cancel" button on the `manageUrl` token link.
- `notifyAdminOfLead` (email copy): lead details as clean labelled rows, the Supabase row note, and an "Open in Supabase" button when a table URL exists.
- `confirmLeadToUser`: branded version of the existing copy; report variant gets a "See a sample report" button to `/report/example`, talk variant gets a "Book a time" button to `/book`.

**Copy rules.** No em dashes, the word "tiles" is not used, and no business facts or numbers were invented; wording and voice match the existing text versions.

**Files.** New: `lib/email-template.ts`. Changed: `lib/notify.ts`. `pnpm build` passed.

## Sept 12, 2026 - Mobile hero and showcase polish (5 changes)

Five surgical, mobile-focused UI changes on the live homepage. No business facts or numbers were invented, no em dashes, and the word "tiles" is not used in any user-facing copy.

### 1. More floating hero logos
`components/hero-floating-logos.tsx`. The mobile-only faint brand marks behind the hero went from 8 to 21. Positions are now a hand-placed set of spots in the left and right side rails plus the top and bottom bands, deliberately avoiding the centered text column so the headline, subhead, and CTA stay fully readable. Logo sources are pulled from `INTEGRATION_LOGOS` (`lib/integrations.ts`), sizes vary between 30 and 42px, opacity stays at 0.28, and the gentle `hero-float` animation and reduced-motion opt-out are unchanged. The desktop Mobius orbit was not touched.

### 2. Floating "Schedule" button as a rounded rectangle
`app/page.tsx`. The fixed bottom-right booking button changed from `rounded-full` to `rounded-2xl` (and `h-10` to `h-11`) so it reads as a clean rounded rectangle with the calendar icon and the "Schedule" label, instead of a pill/circle on mobile. Fixed position, safe-area inset, shadow, and brand color are unchanged, so desktop is unaffected.

### 3. Tighter spacing before "See all integrations"
`components/software-visuals.tsx`, `IntegrationTilesVisual`. On phones the logo grid used `content-evenly` inside a tall min-height frame with the button absolutely pinned to the bottom, leaving dead space. The grid and button are now wrapped in a phone-only centered flex column (`absolute inset-0 flex flex-col justify-center gap-3`) so the button hugs the last row of logos. From `md` up the grid and button revert to their original absolute positions, so desktop is unchanged.

### 4. Step 2 channel visual: constant height + active highlight
`components/software-visuals.tsx`, `ChannelValueVisual` (the rotating Ads/Site/Email/Content visual). The detail card previously grew and shrank with each channel, making the card jump. It now holds a fixed `h-[17rem]` on phones (sized to the tallest channel state) with `md:h-auto` so desktop keeps its fixed aspect frame; the wrapping flex column dropped `flex-1` so the total height stays constant across the full rotation. For readability, the active channel now has an obvious brand badge above the app row on phones, and the bottom switcher's active item gets a brand ring and brand-colored label. Brand blue and gold accents were reused.

### 5. Slack card: typing indicator before the message
`components/hero-analytics.tsx` (the Slack showcase, `HeroAnalytics`). The member avatar, name, and role stay visible; a looping reveal now plays for the Terramore team reply: three animated typing dots appear first, then the typed message text, then the existing attachment/preview. The reveal resets when the channel changes and respects reduced motion (jumps straight to the finished message and attachment). New `slack-typing` keyframes were added to `app/globals.css` with a reduced-motion opt-out. The existing attachments and client messages were preserved.

**Branch note.** `main` was checked out in a leftover worktree at `/private/tmp/tm-main-wt` that also held an unrelated uncommitted `lib/notify.ts` edit. That edit was preserved in a named stash, the worktree was removed, and `main` was checked out in the primary repo before this work.

**Build.** `pnpm build` passed.

## Slack @mention on admin alerts

Recovered the preserved `tm-main-wt lib/notify.ts` stash (WIP from an interrupted task that was never committed/pushed). Its diff matched the intended spec exactly, so it was applied (not re-implemented) and the stash dropped after a clean apply. The change adds `const SLACK_MENTION = (process.env.SLACK_MENTION_USER_ID?.trim() || "U0BMKSTCBFD")` and, in the two admin functions only (`notifyAdminOfLead`, `notifyAdminOfBooking`), prepends `<@${SLACK_MENTION}> ` to the fallback `text` and unshifts a leading `section` mrkdwn block with the mention (guarded to skip when the constant is empty). Lead-facing/user confirmation messages were untouched. This makes admin Slack alerts push to Adam's phone in mentions-only channels. `pnpm build` passed. The unrelated `book-flow whitespace app/page.tsx` stash was left untouched.
