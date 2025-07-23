import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, emailConsent, signupSource = 'free_courses_banner' } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !emailConsent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('free_courses_signups')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Insert new signup
    const { data, error } = await supabase
      .from('free_courses_signups')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          company: company || null,
          email_consent: emailConsent,
          signup_source: signupSource,
          signup_date: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save signup' },
        { status: 500 }
      )
    }

    // TODO: Send welcome email (integrate with your email service)
    // await sendWelcomeEmail(email, firstName)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully signed up for free course updates',
        data: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 