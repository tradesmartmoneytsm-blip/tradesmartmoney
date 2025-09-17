# Google Cloud Functions NSE Data Collector

## 🎯 **Why Google Cloud Functions?**

- ✅ **Different IP ranges** - Google Cloud IPs may not be blocked by NSE
- ✅ **Serverless** - No server management required
- ✅ **Cost-effective** - Pay only for execution time (~$1-5/month)
- ✅ **Reliable** - Google's infrastructure with auto-scaling
- ✅ **Easy scheduling** - Built-in Cloud Scheduler integration

## 🚀 **Setup Instructions**

### **1. Prerequisites**

```bash
# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

### **2. Configure Environment Variables**

Edit `deploy.sh` and replace with your actual values:

```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your_service_role_key"
```

### **3. Deploy the Function**

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy to Google Cloud Functions
./deploy.sh
```

### **4. Set Up Automated Scheduling**

```bash
# Create Cloud Scheduler job to run every 5 minutes during market hours
gcloud scheduler jobs create http nse-collector-schedule \
  --schedule="*/5 9-13 * * 1-5" \
  --time-zone="Asia/Kolkata" \
  --uri="YOUR_FUNCTION_URL" \
  --http-method=GET
```

## 🧪 **Testing**

### **Manual Test**
```bash
# Test with force parameter (ignores market hours)
curl "YOUR_FUNCTION_URL?force=true"
```

### **Expected Response**
```json
{
  "success": true,
  "session_id": "GCF_20240916102030",
  "timestamp": "2024-09-16T10:20:30.123456",
  "data": {
    "calls": {
      "count": 10,
      "stored": true,
      "sample": [
        {"symbol": "RELIANCE", "percentage_change": 45.67},
        {"symbol": "TCS", "percentage_change": 23.45}
      ]
    },
    "puts": {
      "count": 10,
      "stored": true,
      "sample": [
        {"symbol": "BHARTIARTL", "percentage_change": 12.34}
      ]
    }
  }
}
```

## 📊 **Monitoring**

### **View Logs**
```bash
# View function logs
gcloud functions logs read nse-data-collector --region=us-central1

# Follow logs in real-time
gcloud functions logs tail nse-data-collector --region=us-central1
```

### **View Scheduler Jobs**
```bash
# List scheduled jobs
gcloud scheduler jobs list

# View job details
gcloud scheduler jobs describe nse-collector-schedule
```

## 💰 **Cost Estimation**

**Google Cloud Functions Pricing:**
- **Invocations**: Free tier: 2M requests/month
- **Compute**: $0.0000004 per 100ms at 512MB
- **Network**: $0.12 per GB egress

**Estimated Monthly Cost:**
- **48 runs/day × 22 trading days = 1,056 runs/month**
- **~5 seconds per run × 1,056 = 5,280 seconds**
- **Cost: ~$1-3/month** (well within free tier limits)

## 🔧 **Configuration Options**

### **Memory & Timeout**
```bash
# Adjust in deploy.sh
MEMORY="512MB"    # 128MB to 8GB
TIMEOUT="540s"    # Up to 540s (9 minutes)
```

### **Region Selection**
```bash
# For better performance in India
REGION="asia-south1"  # Mumbai
REGION="asia-southeast1"  # Singapore
REGION="us-central1"  # Iowa (default)
```

### **Environment Variables**
Add more variables in `deploy.sh`:
```bash
--set-env-vars="SUPABASE_URL=$SUPABASE_URL,SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY,DEBUG=true"
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **403 Forbidden from NSE**
   - Try different regions (asia-south1, asia-southeast1)
   - Add random delays between requests
   - Rotate User-Agent headers

2. **Timeout Errors**
   - Increase timeout in deploy.sh
   - Optimize request retry logic

3. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase service role permissions
   - Test connection manually

### **Debug Mode**
```bash
# Enable debug logging
gcloud functions deploy nse-data-collector \
  --set-env-vars="DEBUG=true" \
  --update-env-vars
```

## 🔄 **Updates & Maintenance**

### **Update Function Code**
```bash
# After making changes to main.py
./deploy.sh
```

### **Update Schedule**
```bash
# Modify schedule (e.g., every 3 minutes)
gcloud scheduler jobs update http nse-collector-schedule \
  --schedule="*/3 9-13 * * 1-5"
```

### **Monitor Performance**
```bash
# View function metrics
gcloud functions describe nse-data-collector --region=us-central1
```

## 🎯 **Advantages over GitHub Actions**

| Feature | Google Cloud Functions | GitHub Actions |
|---------|----------------------|----------------|
| **IP Blocking** | ✅ Less likely | ❌ Often blocked |
| **Cost** | ~$1-3/month | Free |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Setup** | Medium | Easy |
| **Monitoring** | ✅ Built-in | Limited |
| **Scaling** | ✅ Auto | Fixed |

## 🚀 **Next Steps**

1. **Deploy and test** the function
2. **Monitor for a few days** to ensure NSE doesn't block Google Cloud IPs  
3. **Set up alerting** for failed runs
4. **Consider fallback** to alternative data sources if needed

Your TradeSmart Money platform will have **automated, reliable NSE data collection** running in Google Cloud! 🎉

