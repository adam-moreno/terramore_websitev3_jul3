import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      businessName,
      industry,
      currentRevenue,
      businessStage,
      biggestChallenge,
      goals
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !businessName || !industry || !businessStage || !biggestChallenge || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to your database (e.g., Airtable, Notion, or your own DB)
    // 2. Send to your email marketing platform (e.g., ConvertKit, Mailchimp)
    // 3. Send a confirmation email to the user
    // 4. Send a notification to your team

    // For now, we'll just log the data and return success
    console.log('Roadmap Lead:', {
      firstName,
      lastName,
      email,
      businessName,
      industry,
      currentRevenue,
      businessStage,
      biggestChallenge,
      goals,
      timestamp: new Date().toISOString()
    })

    // TODO: Implement actual email sending
    // Example with a service like Resend, SendGrid, or your preferred email service:
    /*
    const emailData = {
      to: email,
      subject: `Your Custom Business Roadmap - ${businessName}`,
      html: `
        <h1>Your Custom Business Roadmap</h1>
        <p>Hi ${firstName},</p>
        <p>Thank you for requesting your custom business roadmap!</p>
        <p>We're generating your personalized 90-day growth plan based on your:</p>
        <ul>
          <li>Industry: ${industry}</li>
          <li>Business Stage: ${businessStage}</li>
          <li>Current Challenge: ${biggestChallenge}</li>
          <li>Goals: ${goals}</li>
        </ul>
        <p>You'll receive your complete roadmap within the next 24 hours.</p>
        <p>In the meantime, would you like to schedule a quick strategy call to discuss your roadmap?</p>
        <p>Best regards,<br>The Terramore Team</p>
      `
    }
    */

    return NextResponse.json(
      { 
        success: true, 
        message: 'Roadmap request received successfully',
        data: {
          firstName,
          lastName,
          email,
          businessName
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Roadmap API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 