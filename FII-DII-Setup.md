# FII/DII Activity Setup Guide

This guide explains how to set up the FII/DII (Foreign and Domestic Institutional Investor) activity tracking feature.

## 🏗️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 2. Create Database Table
Run the SQL script from `database-schema.sql` in your Supabase SQL editor:

```sql
-- This creates the fii_dii_data table with proper indexes and constraints
-- See database-schema.sql for the full script
```

### 3. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🔄 Data Collection

### Manual Data Collection
You can manually trigger data collection by calling:
```bash
curl -X GET "http://localhost:3000/api/fii-dii-data"
```

### Daily Automated Collection
Set up a cron job or use a service like Vercel Cron to call:
```bash
curl -X POST "http://localhost:3000/api/cron/daily-fii-dii"
```

**Recommended Schedule**: Daily at 6:30 PM IST (after market close)

### Example Vercel Cron (vercel.json)
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-fii-dii",
      "schedule": "30 13 * * 1-5"
    }
  ]
}
```

## 📊 Data Structure

The system stores FII/DII data with these fields:
- **Date**: Trading date
- **Category**: FII or DII
- **Buy Value**: Amount bought (₹ crores)
- **Sell Value**: Amount sold (₹ crores)  
- **Net Value**: Net flow (buy - sell)

## 🎯 Data Sources

### Primary: NSE India API
- Attempts to fetch from `https://www.nseindia.com/api/fiidiiTradeReact`
- Real-time institutional investor data

### Fallback: Simulated Data
- If NSE API fails, generates realistic sample data
- Maintains app functionality during development

## 🔧 Customization

### Adding More Data Sources
To add additional FII/DII data sources, modify `src/app/api/fii-dii-data/route.ts`:

1. Add new scraping function in `scrapeFiiDiiData()`
2. Implement source-specific parsing logic
3. Add error handling and fallback

### UI Customization
The FII/DII Activity component (`src/components/FiiDiiActivity.tsx`) includes:
- Summary cards with buy/sell/net values
- 15-day trend chart
- Recent activity table
- Real-time data refresh

## 📈 Features

✅ **30-day historical data storage**  
✅ **Real-time data visualization**  
✅ **Automatic data cleanup** (keeps only last 30 days)  
✅ **Trend analysis** with directional indicators  
✅ **Error handling** with graceful fallbacks  
✅ **Mobile responsive** design  

## 🚀 Production Deployment

1. **Deploy to Vercel**: `vercel --prod`
2. **Set Environment Variables** in Vercel dashboard
3. **Enable Cron Jobs** in Vercel (Pro plan required)
4. **Monitor Logs** for successful daily data collection

## 📝 Notes

- Data updates daily after market hours
- 30-day retention policy automatically enforced
- Component works without database (shows sample data)
- Real NSE API integration included for production use 