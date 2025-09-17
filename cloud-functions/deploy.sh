#!/bin/bash

# Google Cloud Functions Deployment Script for NSE Data Collector

set -e

# Configuration
FUNCTION_NAME="nse-data-collector"
REGION="us-central1"  # or asia-south1 for closer to India
RUNTIME="python311"
MEMORY="512MB"
TIMEOUT="540s"  # 9 minutes

# Load environment variables from .env.local
if [ -f "../.env.local" ]; then
    echo "📄 Loading credentials from .env.local..."
    source "../.env.local"
elif [ -f ".env.local" ]; then
    echo "📄 Loading credentials from .env.local..."
    source ".env.local"
fi

# Set variables for deployment
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-YOUR_SUPABASE_URL}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-YOUR_SUPABASE_SERVICE_KEY}"

# Check if credentials are loaded
if [ "$SUPABASE_URL" = "YOUR_SUPABASE_URL" ] || [ "$SUPABASE_SERVICE_KEY" = "YOUR_SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Could not load Supabase credentials from .env.local"
    echo "Please ensure .env.local contains:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    exit 1
fi

echo "✅ Loaded Supabase URL: ${SUPABASE_URL}"
echo "✅ Loaded Service Key: ${SUPABASE_SERVICE_KEY:0:20}..."

echo "🚀 Deploying NSE Data Collector to Google Cloud Functions..."
echo "Function: $FUNCTION_NAME"
echo "Region: $REGION"
echo "Runtime: $RUNTIME"

# Deploy the function
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=$RUNTIME \
  --region=$REGION \
  --source=./nse-collector \
  --entry-point=collect_nse_data \
  --memory=$MEMORY \
  --timeout=$TIMEOUT \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="SUPABASE_URL=$SUPABASE_URL,SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY"

echo "✅ Deployment completed!"
echo ""
echo "🔗 Function URL:"
gcloud functions describe $FUNCTION_NAME --region=$REGION --format="value(serviceConfig.uri)"
echo ""
echo "🧪 Test the function:"
echo "curl \"$(gcloud functions describe $FUNCTION_NAME --region=$REGION --format="value(serviceConfig.uri)")?force=true\""
echo ""
echo "⏰ To set up automated scheduling, create a Cloud Scheduler job:"
echo "gcloud scheduler jobs create http nse-collector-schedule \\"
echo "  --schedule=\"*/5 9-13 * * 1-5\" \\"
echo "  --time-zone=\"Asia/Kolkata\" \\"
echo "  --uri=\"$(gcloud functions describe $FUNCTION_NAME --region=$REGION --format="value(serviceConfig.uri)")\" \\"
echo "  --http-method=GET"

