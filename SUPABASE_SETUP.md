# Supabase Setup Guide for Free Courses Signup

## Overview
This guide will help you set up Supabase to handle the free courses signup functionality with email marketing consent.

## 1. Supabase Project Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `terramore-website` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Database Table Setup

### Create the `free_courses_signups` Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create the free_courses_signups table
CREATE TABLE free_courses_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  email_consent BOOLEAN NOT NULL DEFAULT false,
  signup_source VARCHAR(100) DEFAULT 'free_courses_banner',
  course_type VARCHAR(100),
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_free_courses_signups_email ON free_courses_signups(email);
CREATE INDEX idx_free_courses_signups_status ON free_courses_signups(status);
CREATE INDEX idx_free_courses_signups_signup_date ON free_courses_signups(signup_date);
CREATE INDEX idx_free_courses_signups_source ON free_courses_signups(signup_source);
CREATE INDEX idx_free_courses_signups_course_type ON free_courses_signups(course_type);

-- Enable Row Level Security (RLS)
ALTER TABLE free_courses_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for free courses signup" ON free_courses_signups
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for authenticated users only
CREATE POLICY "Allow reads for authenticated users" ON free_courses_signups
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_free_courses_signups_updated_at 
  BEFORE UPDATE ON free_courses_signups 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Create the `partner_applications` Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create the partner_applications table
CREATE TABLE partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  revenue VARCHAR(255) NOT NULL,
  team_size VARCHAR(255) NOT NULL,
  goal VARCHAR(255) NOT NULL,
  timeline VARCHAR(255) NOT NULL,
  budget VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending_review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_partner_applications_email ON partner_applications(email);
CREATE INDEX idx_partner_applications_status ON partner_applications(status);
CREATE INDEX idx_partner_applications_application_date ON partner_applications(application_date);
CREATE INDEX idx_partner_applications_location ON partner_applications(location);
CREATE INDEX idx_partner_applications_business_type ON partner_applications(business_type);

-- Enable Row Level Security (RLS)
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for partner applications" ON partner_applications
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for authenticated users only
CREATE POLICY "Allow reads for authenticated users" ON partner_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_partner_applications_updated_at 
  BEFORE UPDATE ON partner_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Environment Variables Setup

### Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### Add to Your Environment File
Create or update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Email Marketing Integration (Optional)

### Option A: Supabase Edge Functions for Email
Create an edge function to send welcome emails:

```typescript
// supabase/functions/send-welcome-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"

const client = new SmtpClient()

serve(async (req) => {
  try {
    const { email, firstName } = await req.json()
    
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 587,
      username: Deno.env.get("SMTP_USERNAME"),
      password: Deno.env.get("SMTP_PASSWORD"),
    })

    await client.send({
      from: "noreply@terramore.io",
      to: email,
      subject: "Welcome to Terramore FREE Courses! 🎉",
      content: `
        <h1>Welcome ${firstName}!</h1>
        <p>Thank you for signing up for our FREE course updates!</p>
        <p>We'll notify you as soon as new course content is available.</p>
        <p>Best regards,<br>The Terramore Team</p>
      `,
      html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Thank you for signing up for our FREE course updates!</p>
        <p>We'll notify you as soon as new course content is available.</p>
        <p>Best regards,<br>The Terramore Team</p>
      `,
    })

    await client.close()

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

### Option B: Third-party Email Service
Integrate with services like:
- **Resend** (recommended for Next.js)
- **SendGrid**
- **Mailgun**
- **ConvertKit** (for email marketing)

## 5. Signup Source Tracking

### Different Signup Sources
The system now tracks different signup sources:

1. **Free Courses Banner** (`free_courses_banner`)
   - Source: Main page banner popup
   - Table: `free_courses_signups`

2. **Course Pages** (`scaling_course_page`, `offers_course_page`, `leads_course_page`)
   - Source: Individual course page forms
   - Table: `free_courses_signups`
   - Includes course type tracking

3. **Partner Applications** (`partner_application`)
   - Source: Partner With Us page
   - Table: `partner_applications`
   - Comprehensive business information

### Query Examples
```sql
-- Get all signups by source
SELECT signup_source, COUNT(*) as count 
FROM free_courses_signups 
GROUP BY signup_source;

-- Get course-specific signups
SELECT course_type, COUNT(*) as count 
FROM free_courses_signups 
WHERE course_type IS NOT NULL 
GROUP BY course_type;

-- Get partner applications by location
SELECT location, COUNT(*) as count 
FROM partner_applications 
GROUP BY location;
```

## 6. Testing the Integration

### Test the API Endpoints
1. Start your development server: `pnpm dev`
2. Test the free courses banner popup
3. Test course page signup forms
4. Test partner application form
5. Check the Supabase dashboard to see if data is being saved
6. Verify email validation and duplicate prevention

### Test Data in Supabase
You can view your signups in the Supabase dashboard:
1. Go to **Table Editor**
2. Select the `free_courses_signups` table
3. View the data being inserted

## 6. Security Considerations

### Row Level Security (RLS)
The table is configured with RLS policies that:
- Allow anyone to insert new signups
- Only allow authenticated users to read data
- Protect sensitive information

### API Security
- The API route validates all input data
- Email format is verified
- Duplicate emails are prevented
- Error messages don't expose sensitive information

## 7. Monitoring and Analytics

### Supabase Dashboard
Monitor your signups through:
- **Table Editor**: View all signups
- **Logs**: Check API calls and errors
- **Analytics**: Track database performance

### Custom Analytics
You can create additional tables for:
- Signup source tracking
- Email open rates
- Course engagement metrics

## 8. Production Deployment

### Environment Variables
Ensure all environment variables are set in your production environment:
- Vercel: Add to project settings
- Netlify: Add to environment variables
- Other platforms: Follow their specific instructions

### Database Backups
Set up automatic backups in Supabase:
1. Go to **Settings** → **Database**
2. Configure backup schedule
3. Set up point-in-time recovery

## 9. Troubleshooting

### Common Issues
1. **Environment variables not loading**: Restart your development server
2. **CORS errors**: Check Supabase project settings
3. **Authentication errors**: Verify your API keys
4. **Database connection issues**: Check your project URL

### Debug Mode
Enable debug logging by adding to your API route:
```typescript
console.log('Request body:', body)
console.log('Supabase response:', data)
```

## 10. Next Steps

### Email Marketing Integration
1. Set up email templates
2. Configure email automation
3. Add unsubscribe functionality
4. Implement email analytics

### Advanced Features
1. Add signup source tracking
2. Implement A/B testing
3. Add lead scoring
4. Create email sequences

### Data Export
You can export signup data from Supabase:
1. Go to **Table Editor**
2. Select your table
3. Click **Export** → **CSV**

---

For additional support, refer to the [Supabase documentation](https://supabase.com/docs) or contact your development team. 