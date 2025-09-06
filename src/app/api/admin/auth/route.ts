import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple token generation (you might want to use JWT in production)
function generateToken(password: string): string {
  const timestamp = Date.now().toString();
  const hash = crypto.createHash('sha256').update(password + timestamp).digest('hex');
  return `${timestamp}_${hash}`;
}

export async function POST(request: Request) {
  try {
    console.log('🔐 Admin auth request received');
    
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'Password is required'
      }, { status: 400 });
    }

    // Get admin password from environment variable
    const adminPassword = process.env.SWING_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('❌ SWING_ADMIN_PASSWORD not set in environment variables');
      return NextResponse.json({
        success: false,
        error: 'Admin authentication not configured. Please set SWING_ADMIN_PASSWORD environment variable.'
      }, { status: 500 });
    }

    // Validate password
    if (password !== adminPassword) {
      console.log('❌ Invalid password attempt');
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }

    // Generate auth token
    const token = generateToken(password);
    
    console.log('✅ Admin authentication successful');

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token: token
    });

  } catch (error) {
    console.error('❌ Admin auth error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    }, { status: 500 });
  }
} 