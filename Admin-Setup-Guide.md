# 🔐 Admin Authentication Setup Guide

This guide will help you secure your swing trading admin panel so that only you can create, edit, and delete swing trades.

## 🚀 Quick Setup

### 1. Set Your Admin Password

Add the following environment variable to your `.env.local` file:

```env
SWING_ADMIN_PASSWORD=your_secure_password_here
```

**Important:** Choose a strong password with at least 12 characters, including uppercase, lowercase, numbers, and special characters.

### 2. For Production (Vercel)

Add the same environment variable in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `SWING_ADMIN_PASSWORD`
   - **Value:** Your secure admin password
   - **Environment:** Production (and Preview if needed)

### 3. Restart Your Development Server

After adding the environment variable locally, restart your development server:

```bash
npm run dev
```

## 🛡️ How It Works

### Admin Panel Access
- Navigate to `/admin/swing-trades`
- You'll see a login form requesting the admin password
- Enter your password to access the admin panel
- Session remains active for 24 hours

### Security Features
- **Password Protection:** Only users with the correct password can access admin functions
- **Token-Based Auth:** Uses secure tokens that expire after 24 hours
- **Protected Operations:** Only authenticated users can:
  - Create new swing trades
  - Edit existing trades
  - Delete trades
- **Public Reading:** Anyone can view swing trades (no authentication required for viewing)

### Session Management
- Login tokens are stored in browser's localStorage
- Tokens automatically expire after 24 hours
- Logout button clears authentication immediately
- Invalid/expired tokens are automatically handled

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /api/admin/auth` - Login with password
- `POST /api/admin/verify` - Verify auth token

### Protected Operations
- `POST /api/swing-trades` - Create trade (requires auth)
- `PUT /api/swing-trades` - Update trade (requires auth)  
- `DELETE /api/swing-trades` - Delete trade (requires auth)

### Public Operations
- `GET /api/swing-trades` - View trades (no auth required)

## 🚨 Security Best Practices

### Password Security
- Use a unique, strong password (12+ characters)
- Don't share your admin password
- Consider using a password manager
- Change password if compromised

### Environment Variables
- Never commit `.env.local` to git
- Use different passwords for development and production
- Keep your production password secure

### Access Control
- Only access admin panel from trusted devices
- Log out when finished managing trades
- Monitor for suspicious login attempts

## 📱 Usage Workflow

### Adding a New Trade
1. Access `/admin/swing-trades`
2. Login with your password
3. Click "Add New Trade"
4. Fill in all trade details
5. Save the trade
6. It will appear in the appropriate strategy section

### Managing Existing Trades
1. View all trades in the admin table
2. Use edit button to modify trade details
3. Update status when trades hit targets or stop losses
4. Delete trades if needed

### Logging Out
- Always click "Logout" when finished
- This ensures your session is properly terminated

## 🔍 Troubleshooting

### "Admin authentication not configured" Error
- Make sure `SWING_ADMIN_PASSWORD` is set in your environment variables
- Restart your server after adding the variable

### "Invalid password" Error
- Double-check your password
- Ensure no extra spaces in the environment variable

### Token Expired
- Tokens expire after 24 hours for security
- Simply login again with your password

### Can't Access After Deploy
- Verify the environment variable is set in Vercel
- Check it's deployed to the correct environment (Production)

## 🛟 Support

If you encounter any issues:

1. Check your environment variables are correctly set
2. Verify the password matches exactly
3. Clear browser localStorage if needed: `localStorage.clear()`
4. Restart your development server

---

**Remember:** This admin system is designed for single-user access. Keep your password secure and only access from trusted devices. 