# 📊 Intraday Signals System - Complete Setup Guide

## 🎯 **System Overview**

The Intraday Signals System automatically scans ChartInk's institutional trading data every 5 minutes during market opening hour (9:25-10:25 AM IST) to identify stocks with high buyer/seller initiated trades (BIT+SIT), indicating institutional money movement.

### **Key Features:**
- ✅ **Automated scanning** every 5 minutes during opening hour
- ✅ **Real-time institutional activity** detection using ChartInk data
- ✅ **Supabase storage** with optimized indexing
- ✅ **Auto-refreshing UI** during market hours
- ✅ **Session-based filtering** (Opening Hour vs Intraday)
- ✅ **GitHub Actions** for reliable automation

---

## 🏗️ **Architecture Components**

### **1. Data Flow:**
```
ChartInk API → GitHub Actions → Next.js API → Supabase → React UI
     ↓              ↓              ↓          ↓         ↓
Institutional   Automated     Processing   Storage   Display
   Data         Scanner       & Analysis   Layer     Layer
```

### **2. Files Created:**
- `database-intraday-signals-schema.sql` - Supabase database schema
- `src/app/api/intraday-signals/route.ts` - API endpoint
- `.github/workflows/intraday-signals-scan.yml` - Automation
- `src/components/IntradaySignals.tsx` - UI component
- Updated `src/components/IntradayTrades.tsx` - Integration

---

## 🔧 **Setup Instructions**

### **Step 1: Supabase Database Setup**

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Run the schema script:**
   ```sql
   -- Copy and paste the entire content from database-intraday-signals-schema.sql
   ```
4. **Verify table creation:**
   ```sql
   SELECT * FROM public.intraday_signals LIMIT 5;
   ```

### **Step 2: GitHub Secrets Configuration**

**Add these secrets in your GitHub repository:**

1. **Go to**: Repository → Settings → Secrets and variables → Actions
2. **Add the following secrets:**

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
NEXTJS_APP_URL = https://www.tradesmartmoney.com  (optional)
DISCORD_WEBHOOK_URL = your_discord_webhook  (optional, for notifications)
```

### **Step 3: Test the API Endpoint**

**Manual test (during development):**
```bash
curl -X POST "https://www.tradesmartmoney.com/api/intraday-signals?force=true" \
  -H "Content-Type: application/json"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Intraday signals updated successfully",
  "data": {
    "signalsCount": 10,
    "marketSession": "OPENING_HOUR",
    "timestamp": "2025-01-15T04:30:00.000Z",
    "topSignal": {
      "symbol": "RELIANCE",
      "bit_sit_score": 1250000.50,
      "rank_position": 1
    }
  }
}
```

### **Step 4: GitHub Actions Testing**

1. **Go to**: Repository → Actions → "Intraday Signals Scanner"
2. **Click**: "Run workflow"
3. **Select**: `force_run: true` to test outside market hours
4. **Check**: Execution logs and Supabase data

---

## ⏰ **Automation Schedule**

### **Scanning Times:**
- **Active Period**: 9:25 AM to 10:25 AM IST (Monday-Friday)
- **Frequency**: Every 5 minutes (12 scans total)
- **Total Runs**: 60 scans per week during market opening

### **Cron Schedule Breakdown:**
```yaml
# UTC times (IST - 5:30 hours)
- cron: '55,0,5,10,15,20,25,30,35,40,45,50,55 3 * * 1-5'  # 3:55-3:55 AM UTC
- cron: '0,5,10,15,20,25,30,35,40,45,50,55 4 * * 1-5'     # 4:00-4:55 AM UTC
```

---

## 📊 **Data Schema Explanation**

### **Intraday Signals Table:**
```sql
CREATE TABLE public.intraday_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,                    -- Stock symbol (e.g., RELIANCE)
    bit_sit_score DECIMAL(15,2) NOT NULL,           -- Total BIT+SIT activity score
    bit_sit1 DECIMAL(15,2),                        -- [=1] 30 minute BIT+SIT
    bit_sit2 DECIMAL(15,2),                        -- [=2] 30 minute BIT+SIT
    current_price DECIMAL(10,2),                   -- Current stock price
    volume BIGINT,                                 -- Trading volume
    scan_time TIMESTAMP WITH TIME ZONE NOT NULL,   -- When signal was generated
    scan_date DATE NOT NULL,                       -- Trading date
    market_session VARCHAR(20) NOT NULL,           -- OPENING_HOUR/INTRADAY
    rank_position INTEGER NOT NULL,                -- Ranking (1 = highest score)
    is_active BOOLEAN DEFAULT TRUE,                -- Active signal flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Key Metrics Explained:**
- **BIT+SIT Score**: Total institutional buying/selling activity
- **Higher scores** = More institutional interest
- **Opening Hour signals** = Most important (9:25-10:25 AM)
- **Rank Position** = 1 to 10 (1 = highest institutional activity)

---

## 🎨 **UI Features**

### **Intraday Signals Component:**
- **Real-time updates** every 30 seconds during market hours
- **Session filtering** (All, Opening Hour, Intraday)
- **Signal strength indicators** (Very High, High, Medium, Low)
- **Institutional activity metrics** with formatted numbers
- **Auto-refresh** functionality
- **Error handling** with retry options

### **Signal Display:**
```
RELIANCE                                      ₹2,847.30
#1 • VERY HIGH                               OPENING HOUR

Total Score: ₹12.5Cr    BIT+SIT (1): ₹6.5Cr
BIT+SIT (2): ₹6.0Cr     Volume: 54.2L

Scanned at 09:30:15     Institutional Activity
```

---

## 🔍 **Monitoring & Maintenance**

### **System Health Checks:**

1. **GitHub Actions Status:**
   - Monitor workflow runs in GitHub Actions tab
   - Check for failures during market hours
   - Review logs for ChartInk API issues

2. **Database Health:**
   ```sql
   -- Check recent signals
   SELECT COUNT(*) as signal_count, MAX(scan_time) as latest_scan
   FROM public.intraday_signals 
   WHERE scan_date = CURRENT_DATE;
   
   -- Check system performance
   SELECT symbol, COUNT(*) as scan_count
   FROM public.intraday_signals 
   WHERE scan_date = CURRENT_DATE 
   GROUP BY symbol 
   ORDER BY scan_count DESC;
   ```

3. **API Performance:**
   ```bash
   # Test API response time
   time curl -s "https://www.tradesmartmoney.com/api/intraday-signals"
   ```

### **Cleanup Maintenance:**
```sql
-- Auto-cleanup old data (run weekly)
DELETE FROM public.intraday_signals 
WHERE scan_date < CURRENT_DATE - INTERVAL '7 days';
```

---

## 🚨 **Troubleshooting Guide**

### **Common Issues:**

#### **1. GitHub Action Fails:**
```
❌ Error: Failed to fetch data from ChartInk API
```
**Solutions:**
- ChartInk might be down (temporary)
- Check if widget_id (3799905) is still valid
- Update request headers if ChartInk changes format

#### **2. No Signals Displayed:**
```
❌ Error: No signals available
```
**Check:**
- Supabase connection is working
- Data exists for current date: `SELECT * FROM intraday_signals WHERE scan_date = CURRENT_DATE;`
- API endpoint is responding: `/api/intraday-signals`

#### **3. Time Zone Issues:**
```
❌ Scanning outside time window
```
**Verify:**
- GitHub Actions cron schedule is correct for IST
- API time window logic (9:25-10:25 AM IST = 565-625 minutes)

#### **4. Database Connection Error:**
```
❌ Missing Supabase environment variables
```
**Fix:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active
- Ensure RLS policies allow service role access

---

## 📈 **Performance Optimization**

### **Database Indexing:**
The schema includes optimized indexes for common queries:
- `scan_date` + `market_session` + `is_active` (composite)
- `bit_sit_score` DESC (for top signals)
- `scan_time` (for latest data)

### **API Caching:**
- Consider adding Redis cache for frequent queries
- Implement ETags for unchanged data
- Cache top 10 signals for 30 seconds during market hours

### **UI Optimization:**
- Auto-refresh only during market hours
- Lazy loading for historical data
- Efficient re-renders with React.memo

---

## 🔮 **Future Enhancements**

### **Planned Features:**
1. **Alert System**: Email/SMS notifications for high-value signals
2. **Historical Analysis**: Performance tracking of signals over time
3. **Sector Filtering**: Group signals by sectors
4. **Price Action Integration**: Combine with technical indicators
5. **Mobile App**: React Native version for mobile traders
6. **Webhook Integration**: Real-time updates to Discord/Slack

### **Advanced Analytics:**
- **Signal Success Rate**: Track how signals perform post-detection
- **Institutional Flow Patterns**: Identify recurring patterns
- **Correlation Analysis**: Compare with market movements
- **Machine Learning**: Predict signal strength accuracy

---

## ✅ **System Verification Checklist**

Before going live:

- [ ] Supabase table created successfully
- [ ] GitHub secrets configured
- [ ] API endpoint returns valid data
- [ ] GitHub Action runs without errors
- [ ] UI displays signals correctly
- [ ] Auto-refresh works during market hours
- [ ] Session filtering functions properly
- [ ] Error handling works as expected
- [ ] Performance is acceptable (< 2 second load)
- [ ] Mobile UI is responsive

---

## 📞 **Support & Monitoring**

### **Key Metrics to Monitor:**
- **Success Rate**: >95% successful scans during market hours
- **Response Time**: API calls < 2 seconds
- **Data Freshness**: Latest scan within 5 minutes during market hours
- **Error Rate**: <1% failed requests

### **Alert Thresholds:**
- **Critical**: No data for >10 minutes during market hours
- **Warning**: ChartInk API response time >5 seconds
- **Info**: New high-value signal detected (>₹5Cr BIT+SIT)

This system provides institutional-grade trading signals by leveraging the same data that professional traders use, making it accessible to retail investors through your platform. 