# Terramore Website Deployment Guide

## Overview
This guide will help you replace your existing terramore.io website with this new Next.js project using Vercel for deployment.

## Prerequisites
- GitHub repository connected to Vercel
- Supabase project set up with the required database tables
- Domain (terramore.io) configured in Vercel

## Step 1: Database Setup
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run both SQL queries from `SUPABASE_SETUP.md`:
   - Create `free_courses_signups` table
   - Create `partner_applications` table

## Step 2: Environment Variables Setup
In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 3: Vercel Deployment Configuration

### Option A: Update Existing Vercel Project
1. Go to your Vercel dashboard
2. Find your existing terramore.io project
3. Go to Settings → Git
4. Update the repository to point to: `adam-moreno/terramore_websitev3_jul3`
5. Set the root directory to: `/` (if needed)
6. Set the framework preset to: `Next.js`
7. Set the build command to: `npm run build` (or `pnpm build`)
8. Set the output directory to: `.next`
9. Set the install command to: `pnpm install`

### Option B: Create New Vercel Project
1. Go to Vercel dashboard
2. Click "New Project"
3. Import from GitHub: `adam-moreno/terramore_websitev3_jul3`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `/`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

## Step 4: Domain Configuration
1. In your Vercel project settings, go to "Domains"
2. Add your domain: `terramore.io`
3. Update your DNS records to point to Vercel's nameservers
4. If you have existing DNS records, you may need to:
   - Remove old A/CNAME records pointing to your previous hosting
   - Add Vercel's DNS records as provided in the domain setup

## Step 5: Build and Deploy
1. Vercel will automatically trigger a build when you push to the main branch
2. Monitor the build process in Vercel dashboard
3. Check for any build errors and fix them
4. Once deployed, test all functionality:
   - Homepage
   - Course signups
   - Partner application form
   - CCPA popup
   - All navigation links

## Step 6: Post-Deployment Checklist
- [ ] Verify all pages load correctly
- [ ] Test email signup forms
- [ ] Test partner application form
- [ ] Verify CCPA popup functionality
- [ ] Check mobile responsiveness
- [ ] Test all internal links
- [ ] Verify Supabase connections
- [ ] Check Google Analytics (if applicable)
- [ ] Test contact forms
- [ ] Verify SEO meta tags

## Step 7: Rollback Plan
If issues occur, you can:
1. Revert to previous deployment in Vercel dashboard
2. Or rollback to previous Git commit and redeploy

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Vercel build logs for missing dependencies
2. **Environment Variables**: Ensure all Supabase keys are correctly set
3. **Database Connection**: Verify Supabase project is active and tables exist
4. **Domain Issues**: Check DNS propagation (can take up to 48 hours)

### Performance Optimization:
- Images are set to `unoptimized: true` in next.config.mjs for compatibility
- Consider enabling Next.js Image Optimization for better performance
- Monitor Core Web Vitals in Vercel Analytics

## Monitoring
- Set up Vercel Analytics for performance monitoring
- Configure error tracking (Sentry recommended)
- Monitor Supabase usage and performance
- Set up uptime monitoring for terramore.io

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `pnpm dev`
4. Check Supabase dashboard for database issues 