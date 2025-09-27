import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify token function
function verifyToken(token: string, password: string): boolean {
  try {
    const [timestamp, hash] = token.split('_');
    
    if (!timestamp || !hash) {
      return false;
    }

    // Check if token is not too old (24 hours = 86400000 ms)
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (currentTime - tokenTime > maxAge) {
      console.log('❌ Token expired');
      return false;
    }

    // Verify hash
    const expectedHash = crypto.createHash('sha256').update(password + timestamp).digest('hex');
    return hash === expectedHash;

  } catch (error) {
    console.error('❌ Token verification error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token is required'
      }, { status: 400 });
    }

    // Get admin password from environment variable
    const adminPassword = process.env.SWING_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('❌ SWING_ADMIN_PASSWORD not set in environment variables');
      return NextResponse.json({
        success: false,
        error: 'Admin authentication not configured'
      }, { status: 500 });
    }

    // Verify token
    const isValid = verifyToken(token, adminPassword);

    if (!isValid) {
      console.log('❌ Invalid or expired token');
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 401 });
    }

    console.log('✅ Token verification successful');

    return NextResponse.json({
      success: true,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Token verification failed'
    }, { status: 500 });
  }
} 