import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { Resend } from 'resend';

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

    // Create submission object
    const submission = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };

    // Log to console for immediate visibility
    console.log('📧 NEW CONTACT FORM SUBMISSION:', {
      from: `${name} <${email}>`,
      subject,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      timestamp: submission.timestamp
    });

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'Contact Form <noreply@tradesmartmoney.com>',
          to: ['tradesmartmoneytsm@gmail.com'],
          replyTo: email,
          subject: `[Contact Form] ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted:</strong> ${new Date(submission.timestamp).toLocaleString('en-IN')}</p>
            <hr />
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr />
            <p><em>Reply directly to this email to respond to ${name}</em></p>
          `,
        });
        
        console.log('✅ Email notification sent via Resend');
      } catch (emailError) {
        console.error('⚠️ Failed to send email:', emailError);
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured - email not sent');
    }

    // Save to file system for local development only
    if (process.env.NODE_ENV === 'development') {
      try {
        const dataDir = path.join(process.cwd(), 'data');
        const filePath = path.join(dataDir, 'contact-submissions.json');

        if (!existsSync(dataDir)) {
          await mkdir(dataDir, { recursive: true });
        }

        let submissions = [];
        if (existsSync(filePath)) {
          const fileContent = await readFile(filePath, 'utf-8');
          submissions = JSON.parse(fileContent);
        }

        submissions.push(submission);
        await writeFile(filePath, JSON.stringify(submissions, null, 2));
        
        console.log('✅ Contact submission saved to file system (dev only)');
      } catch (fileError) {
        console.error('⚠️ Failed to save submission to file:', fileError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24-48 hours.',
      submissionId: submission.id
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
