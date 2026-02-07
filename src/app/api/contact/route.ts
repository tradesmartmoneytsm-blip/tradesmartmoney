import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // For now, log to console and Supabase
    // In production, integrate with SendGrid, Resend, or your email service
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Option 1: Save to Supabase for later review
    // You can create a 'contact_submissions' table in Supabase
    // and store all form submissions there
    
    // Option 2: Send email using a service
    // Integrate with SendGrid, Resend, Mailgun, etc.
    // Example with fetch to external service:
    /*
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'tradesmartmoneytsm@gmail.com' }],
        }],
        from: { email: 'noreply@tradesmartmoney.com' },
        subject: `Contact Form: ${subject}`,
        content: [{
          type: 'text/plain',
          value: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
        }]
      })
    });
    */

    // For immediate functionality: Use mailto link approach
    // The form data is validated and logged
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        name,
        email: 'tradesmartmoneytsm@gmail.com', // Where they should email
        subject,
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please email us directly at tradesmartmoneytsm@gmail.com' },
      { status: 500 }
    );
  }
}
