# Local NSE Data Collector

## 🚀 Quick Start Guide

This script runs from your **local machine** to bypass NSE's cloud IP blocking and uploads data directly to your Supabase database.

### 📋 Prerequisites

1. **Node.js** installed on your machine
2. **Your Supabase credentials** (URL and Service Role Key)

### 🔧 Setup

1. **Install dotenv dependency**:
   ```bash
   npm install dotenv
   ```

2. **Create `.env` file** in the project root:
   ```bash
   # In project root directory (tradesmartmoney/)
   echo "NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url" > .env
   echo "SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key" >> .env
   ```

3. **Replace with your actual credentials**:
   - Get your Supabase URL and Service Role Key from your Supabase dashboard
   - Edit the `.env` file with your real values

### 🏃‍♂️ Run the Collector

```bash
# From project root
node scripts/local-nse-collector.js
```

### ✅ Expected Output

```
🚀 Starting LOCAL NSE Data Collection...
💻 Running from your local machine to bypass cloud IP blocking
🔗 Setting NSE session cookies...
✅ NSE session cookies established
📡 Fetching most active stock calls...
✅ Fetched 10 most active calls
📡 Fetching most active stock puts...
✅ Fetched 10 most active puts
💾 Storing 10 records in most_active_stock_calls...
✅ Successfully stored 10 records in most_active_stock_calls
💾 Storing 10 records in most_active_stock_puts...
✅ Successfully stored 10 records in most_active_stock_puts

🎯 Data Collection Summary:
   📞 Calls: 10 records ✅
   📈 Puts: 10 records ✅
   💾 Total: 20 records
✅ NSE data collection completed successfully!
🌐 Data is now available on your website
```

### 🎯 Benefits

- ✅ **Bypasses cloud IP blocking** - Runs from your residential IP
- ✅ **Same successful code** - Uses the tested working logic
- ✅ **Direct to Supabase** - Uploads real data to your database
- ✅ **Manual control** - Run when needed during market hours

### ⏰ When to Run

**Best times**:
- During market hours (9:20 AM - 3:30 PM IST)
- When you want fresh data on your website
- Before important trading sessions

### 🔄 Automation Options

**Option 1: Manual** (Recommended initially)
- Run the script manually when needed
- Full control over data collection timing

**Option 2: Local Scheduler**
- Use `cron` (macOS/Linux) or Task Scheduler (Windows)
- Run every 30 minutes during market hours
- Example cron: `*/30 9-15 * * 1-5 cd /path/to/project && node scripts/local-nse-collector.js`

### 🛡️ Security Notes

- Keep your `.env` file private (already in `.gitignore`)
- Don't commit Supabase credentials to GitHub
- Service Role Key has full database access - handle with care

### 🆘 Troubleshooting

**If you see errors**:
1. **Missing credentials**: Check your `.env` file exists and has correct values
2. **Network issues**: Try running again in a few minutes
3. **NSE blocking**: Switch to a different network/VPN if needed

**Check if it worked**:
- Visit your Smart Money Flow page on the website
- You should see fresh NSE data displayed 