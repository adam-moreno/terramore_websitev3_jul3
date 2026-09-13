import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { getServerSupabase, supabaseTableUrl } from '@/lib/supabase-server'
import { confirmLeadToUser, notifyAdminOfLead } from '@/lib/notify'
import { enrollLead } from '@/lib/nurture/enroll'

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

    // Validate required fields. The Talk form asks for the job, a name, and an email.
    // The other fields are optional and arrive as "Not shared" or "Not asked".
    if (!goal || !name || !email) {
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

    const cleanEmail = String(email).trim().toLowerCase()
    const cleanName = String(name).trim()
    const cleanPhone = phone ? String(phone).trim() : null
    const note = message ? String(message) : null
    const businessName = note?.match(/^Business:\s*(.+)$/m)?.[1]?.trim() || null
    const website = note?.match(/^Site:\s*(.+)$/m)?.[1]?.trim() || null

    const lead = {
      kind: 'talk' as const,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      business: businessName,
      website,
      details: {
        Job: String(goal),
        'Business type': businessType && businessType !== 'Not shared' ? String(businessType) : null,
        Revenue: revenue && revenue !== 'Not shared' ? String(revenue) : null,
        Note: note?.split('\n').filter((line) => !/^(Business|Site):/.test(line)).join(' ').trim() || null,
      },
      rowId: null as string | null,
      tableUrl: supabaseTableUrl('partner_applications'),
    }

    const supabase = getServerSupabase()
    if (!supabase) {
      // Keys missing. Do not lose the lead: log it and still send the alerts.
      console.warn('Talk request (no Supabase):', { name: cleanName, email: cleanEmail, goal, businessName, website })
      after(async () => {
        await Promise.all([notifyAdminOfLead(lead), confirmLeadToUser(lead)])
        await enrollLead({
          email: cleanEmail,
          name: cleanName,
          source: 'talk',
          businessType: businessType && businessType !== 'Not shared' ? String(businessType) : null,
          job: String(goal),
          businessName,
          website,
        })
      })
      return NextResponse.json({ success: true, message: 'Request received' }, { status: 201 })
    }

    // Check if email already exists in partner applications
    const { data: existingApplication } = await supabase
      .from('partner_applications')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (existingApplication) {
      // The form treats 409 as sent. Still tell Adam they came back.
      after(async () => {
        await notifyAdminOfLead({ ...lead, rowId: String(existingApplication.id), details: { ...lead.details, Repeat: 'yes' } })
      })
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
          location: location || 'Not asked',
          business_type: businessType || 'Not shared',
          revenue: revenue || 'Not shared',
          team_size: teamSize || 'Not asked',
          goal,
          timeline: timeline || 'Not asked',
          budget: budget || 'Not asked',
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: note,
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

    lead.rowId = data?.[0]?.id ? String(data[0].id) : null

    // Slack + email copy to Adam, confirmation email and optional SMS to the requester.
    // Runs after the response; failures are logged and never reach the form.
    after(async () => {
      await Promise.all([notifyAdminOfLead(lead), confirmLeadToUser(lead)])
      await enrollLead({
        email: cleanEmail,
        name: cleanName,
        source: 'talk',
        businessType: businessType && businessType !== 'Not shared' ? String(businessType) : null,
        job: String(goal),
        businessName,
        website,
      })
    })

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
