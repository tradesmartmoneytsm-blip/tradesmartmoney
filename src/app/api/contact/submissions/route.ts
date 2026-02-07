import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: string;
}

// GET endpoint to retrieve all contact submissions
export async function GET(request: NextRequest) {
  try {
    // Check for admin auth (you can enhance this with proper authentication)
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY || 'admin123'; // Change this in .env
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'contact-submissions.json');

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        submissions: [],
        message: 'No submissions yet'
      });
    }

    // Read submissions
    const fileContent = await readFile(filePath, 'utf-8');
    const submissions = JSON.parse(fileContent);

    // Sort by timestamp (newest first)
    submissions.sort((a: Submission, b: Submission) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve submissions' },
      { status: 500 }
    );
  }
}
