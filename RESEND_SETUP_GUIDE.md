# 📧 Resend Email Setup for Contact Form (Production)

## Why Resend?
Your contact form now sends emails directly to `tradesmartmoneytsm@gmail.com` using Resend. This works in production (Vercel) unlike file storage.

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Resend Account
1. Go to https://resend.com/signup
2. Sign up with your email
3. Verify your email

### Step 2: Get API Key
1. After login, go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Name it: `TradeSmart Production`
4. **Copy the API key** (starts with `re_...`)

### Step 3: Add Domain (Important!)
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter: `tradesmartmoney.com`
4. Follow the instructions to add DNS records to your domain

**Don't have domain access?** Use Resend's test domain for now:
- The "from" email will be: `onboarding@resend.dev`
- Emails still work perfectly!

### Step 4: Add to Vercel
1. Go to your Vercel project: https://vercel.com
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your API key (paste the `re_...` key)
4. Click **Save**
5. **Redeploy your site** (Vercel → Deployments → Redeploy)

### Step 5: Add to Local Development (Optional)
1. Open `.env.local` in your project
2. Add this line:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Restart dev server: `npm run dev`

---

## ✅ Testing

### Test in Production:
1. Wait for Vercel deployment to finish
2. Go to your live site: `https://tradesmartmoney.com/contact`
3. Fill out and submit the form
4. Check your email: `tradesmartmoneytsm@gmail.com`
5. You should receive the submission!

### Test Locally:
```bash
npm run dev
```
Then visit `http://localhost:3000/contact`

---

## 📊 How It Works Now

### Production (Vercel):
- ✅ User submits form
- ✅ Email sent via Resend to `tradesmartmoneytsm@gmail.com`
- ✅ You receive notification
- ✅ Click "Reply" in your email to respond

### Local Development:
- ✅ User submits form
- ✅ Email sent (if RESEND_API_KEY is set)
- ✅ Also saved to `data/contact-submissions.json`
- ✅ View in admin panel: `/admin/contact-submissions`

---

## 🎯 Resend Free Tier

**100 emails/day** for FREE - perfect for contact forms!

- No credit card required to start
- $0.10 per 1,000 emails after free tier
- Perfect for small to medium websites

---

## 🐛 Troubleshooting

**Q: Not receiving emails?**
1. Check spam/junk folder
2. Verify `RESEND_API_KEY` is set in Vercel
3. Check Resend dashboard for logs
4. Redeploy on Vercel after adding env vars

**Q: Getting "from" email error?**
- Add your domain in Resend, OR
- Change line in code to use: `onboarding@resend.dev`

**Q: Want to test without deploying?**
- Add API key to `.env.local`
- Run `npm run dev`
- Test on localhost

---

## 🔧 Alternative: Test Domain

If you can't set up your domain right now, update the code:

```typescript
// In src/app/api/contact/route.ts, line ~42
from: 'Contact Form <onboarding@resend.dev>',  // Use Resend's test domain
```

This will work immediately without domain verification!

---

## 📧 Email Preview

When someone submits the form, you'll receive:

**Subject:** [Contact Form] Technical Support

**From:** John Doe <john@example.com>

**Body:**
```
New Contact Form Submission

From: John Doe <john@example.com>
Subject: Technical Support
Submitted: Feb 7, 2026, 11:30 PM

────────────

Message:
I need help with...

────────────
Reply directly to this email to respond to John Doe
```

And the **Reply-To** is set to the user's email, so you can just hit "Reply"!

---

**Need help?** Check Resend docs: https://resend.com/docs
