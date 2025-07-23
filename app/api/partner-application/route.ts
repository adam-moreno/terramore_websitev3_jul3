import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      location,
      businessType,
      revenue,
      teamSize,
      goal,
      timeline,
      budget,
      name,
      email,
      phone,
      message
    } = body

    // Validate required fields
    if (!location || !businessType || !revenue || !teamSize || !goal || !timeline || !budget || !name || !email) {
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

    // Check if email already exists in partner applications
    const { data: existingApplication } = await supabase
      .from('partner_applications')
      .select('id')
      .eq('email', email)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    // Insert new partner application
    const { data, error } = await supabase
      .from('partner_applications')
      .insert([
        {
          location,
          business_type: businessType,
          revenue,
          team_size: teamSize,
          goal,
          timeline,
          budget,
          name,
          email,
          phone: phone || null,
          message: message || null,
          application_date: new Date().toISOString(),
          status: 'pending_review'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    // TODO: Send notification email to admin team
    // await sendPartnerApplicationNotification(data[0])

    // TODO: Send confirmation email to applicant
    // await sendPartnerApplicationConfirmation(email, name)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Partner application submitted successfully',
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