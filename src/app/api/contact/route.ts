import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

    // Save to file system for persistence
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'contact-submissions.json');

      // Create data directory if it doesn't exist
      if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
      }

      // Read existing submissions or create new array
      let submissions = [];
      if (existsSync(filePath)) {
        const fileContent = await readFile(filePath, 'utf-8');
        submissions = JSON.parse(fileContent);
      }

      // Add new submission
      submissions.push(submission);

      // Write back to file
      await writeFile(filePath, JSON.stringify(submissions, null, 2));
      
      console.log('✅ Contact submission saved to file system');
    } catch (fileError) {
      // Log error but don't fail the request
      console.error('⚠️ Failed to save submission to file:', fileError);
    }

    // TODO: In production, also send email notification
    // Options:
    // 1. Use Resend (recommended, easy setup): https://resend.com/docs/send-with-nextjs
    // 2. Use SendGrid
    // 3. Use Nodemailer with Gmail SMTP
    
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
