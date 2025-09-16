# TradeSmart Money - NSE Data Collection Scripts

This directory contains standalone scripts for collecting data from NSE APIs and storing in Supabase, designed to run independently of the Next.js application.

## Architecture

```
GitHub Actions → NSE APIs → Supabase → Website (read-only)
```

**Why this approach?**
- ✅ No server load on Vercel deployment
- ✅ No rate limiting issues from NSE on your domain
- ✅ Better separation of concerns
- ✅ More reliable data collection
- ✅ Cost-effective (free GitHub Actions)

## Scripts

### `nse-data-collector.js`

Standalone Node.js script that:
- Fetches Most Active Stock Calls/Puts from NSE
- Processes and aggregates the data
- Stores results in Supabase tables
- Runs every 5 minutes during market hours via GitHub Actions

**Features:**
- Cookie management for NSE session
- Retry logic with exponential backoff
- Market hours validation
- Comprehensive error handling
- Professional logging

## Usage

### GitHub Actions (Automatic)

The script runs automatically via GitHub Actions:
- **Schedule**: Every 5 minutes from 9:20 AM to 1:00 PM IST
- **Days**: Monday to Friday only
- **Workflow**: `.github/workflows/intraday-insights-collector.yml`

### Manual Testing

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_key"

# Install dependencies
cd scripts
npm install

# Run data collection
node nse-data-collector.js

# Force run (ignore market hours)
FORCE_RUN=true node nse-data-collector.js
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `FORCE_RUN` | Force run outside market hours | ❌ |

## Database Schema

The script stores data in these Supabase tables:
- `most_active_stock_calls`
- `most_active_stock_puts`

See `database-intraday-insights-schema.sql` for the complete schema.

## Data Flow

1. **Collection**: GitHub Actions → `nse-data-collector.js` → NSE APIs
2. **Processing**: Aggregate percentage changes by symbol
3. **Storage**: Store top 20 results in Supabase
4. **Display**: Website reads from Supabase via API route

## Monitoring

### GitHub Actions Logs
- View workflow runs at: `https://github.com/your-repo/actions`
- Monitor success/failure rates
- Check data collection metrics

### Supabase Logs
- Monitor database insertions
- Check RLS policy effectiveness
- Review storage usage

## Troubleshooting

### Common Issues

1. **NSE 401 Errors**
   - Automatic cookie refresh implemented
   - Retry logic handles temporary failures

2. **Supabase Connection**
   - Verify environment variables
   - Check RLS policies
   - Confirm service role permissions

3. **Market Hours**
   - Script validates IST time automatically
   - Use `FORCE_RUN=true` for testing

### Debugging

```bash
# Enable detailed logging
DEBUG=1 node nse-data-collector.js

# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
client.from('most_active_stock_calls').select('*').limit(1).then(console.log);
"
```

## Development

### Adding New Data Sources

1. Create new collection method in `NSEDataCollector` class
2. Add corresponding Supabase table in schema
3. Update storage logic in `storeDataInSupabase`
4. Test with `FORCE_RUN=true`

### Extending Functionality

The script is modular and can be extended to collect:
- Volume gainers
- Active equities
- Market indices
- Sector performance
- Options chain data

## Security

- ✅ Service role key stored as GitHub Secret
- ✅ No credentials in code repository
- ✅ RLS policies protect data access
- ✅ Environment-specific configuration 