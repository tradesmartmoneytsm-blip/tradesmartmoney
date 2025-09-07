# TradeSmartMoney - Advanced Stock Screener

A professional stock screening application similar to intradayscreener.com, built with modern web technologies for intraday and swing trading analysis.

## 🚀 Features

### Core Functionality
- **Advanced Stock Screening** - Filter stocks based on multiple criteria
- **Real-time Data Table** - Sortable columns with comprehensive stock metrics
- **Visual Query Builder** - Build complex queries with a drag-and-drop interface
- **Predefined Screens** - Quick access to popular screening strategies
- **Export Functionality** - Download results as CSV files
- **Technical Analysis** - RSI, MACD, Moving Averages, Support/Resistance levels

### Key Metrics Available
- Current Market Price (CMP)
- Price-to-Earnings (P/E) Ratio
- Market Capitalization
- Dividend Yield
- Return on Capital Employed (ROCE)
- Trading Volume
- Daily/Weekly/Monthly Returns
- Earnings Per Share (EPS)
- Piotroski Score
- Sector Classification

### Filtering Options
- **Price Range** - Min/Max price filters
- **Volume** - Minimum trading volume
- **Performance** - Return percentages (1-day, 1-week, 1-month)
- **Valuation** - P/E ratios, EPS, Market Cap
- **Profitability** - ROCE, Dividend Yield
- **Quality** - Piotroski Score (1-9)
- **Sector** - Industry-based filtering
- **Custom Queries** - Advanced text-based filtering

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Data Tables**: Custom implementation with sorting
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Next.js built-in tooling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tradesmartmoney
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Basic Filtering
1. Use the **Basic Filters** tab for simple price, volume, and return filtering
2. Set minimum/maximum values for key metrics
3. Apply quick screens for common strategies (Intraday Bullish, High Growth, Value Stocks)

### Advanced Filtering
1. Switch to the **Advanced Filters** tab
2. Add filters for EPS, P/E ratios, market cap, ROCE, and dividend yield
3. Select specific sectors for industry-focused screening
4. Use custom query syntax for complex conditions

### Visual Query Builder
1. Click the **Query Builder** tab
2. Add conditions using dropdown menus
3. Combine conditions with AND/OR logic
4. Preview the generated query before applying

### Data Analysis
- **Sort Results** - Click column headers to sort by any metric
- **Export Data** - Use the Export CSV button to download results
- **Technical Analysis** - Click on stock names to view technical indicators
- **Pagination** - Navigate through large result sets

## 📊 Sample Queries

### Intraday Trading Stocks
```
Current price >=80 AND Current price <=260 AND Volume >= 10000 AND Return over 1day >=2
```

### High Growth Stocks
```
Market capitalization > 500 AND Price to earning < 15 AND Return on capital employed > 22%
```

### Value Investment Candidates
```
Price to earning < 20 AND Market capitalization > 1000 AND Dividend yield > 1
```

## 🔧 Customization

### Adding New Metrics
1. Update the `Stock` interface in `src/types/stock.ts`
2. Add corresponding fields to the mock data service
3. Update the table component to display new columns
4. Add filter controls in the filters component

### Connecting Real Data
Replace the mock `StockService` with API calls to:
- Stock market data providers (Alpha Vantage, Yahoo Finance, etc.)
- Real-time data feeds
- Technical analysis services

### Styling Customization
- Modify Tailwind CSS classes in components
- Update the color scheme in `src/lib/utils.ts`
- Customize the layout in component files

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** - Full feature set with expanded layouts
- **Tablet** - Optimized grid layouts and touch-friendly controls
- **Mobile** - Stacked layouts with scrollable tables

## 📢 Advertisement Optimization

### Ad Revenue Optimization Features
- **Multiple Ad Formats**: Header, sidebar, in-content, footer, sticky, mobile, and video ads
- **Responsive Design**: All ads adapt to different screen sizes
- **Cookie Consent Integration**: Ads only show after user consent
- **Video Ad Support**: Higher CPM video advertisements
- **Mobile-Optimized**: Specialized mobile ad units for better mobile monetization
- **Multiple Ad Networks Ready**: Prepared for Google AdSense, Amazon, Facebook, and more

### Production Setup Checklist

#### 1. Google AdSense Setup
- [ ] Create Google AdSense account
- [ ] Add domain to AdSense
- [ ] Get site approved for ads
- [ ] Create ad units in AdSense dashboard:
  - [ ] Header Leaderboard (728x90)
  - [ ] Sidebar Skyscraper (300x600)
  - [ ] In-Content Rectangle (300x250)
  - [ ] Footer Banner (728x90)
  - [ ] Mobile Banner (320x50)
  - [ ] Sticky Rectangle (300x250)
  - [ ] Video Ad Unit
  - [ ] Native Ad Unit
  - [ ] Mobile Interstitial
  - [ ] Mobile Anchor

#### 2. Update Ad Slot IDs
Replace placeholder IDs in `src/components/AdSense.tsx`:
```typescript
// Replace these with actual ad unit IDs from AdSense dashboard
ca-pub-6601377389077210/1001 → YOUR_ACTUAL_AD_UNIT_ID
ca-pub-6601377389077210/1002 → YOUR_ACTUAL_AD_UNIT_ID
// ... continue for all ad units
```

#### 3. Additional Ad Networks (Optional)
- [ ] Amazon Publisher Services (APS)
- [ ] Facebook Audience Network
- [ ] Criteo
- [ ] Update `public/ads.txt` with actual publisher IDs

#### 4. Testing Checklist
- [ ] Test ads on desktop
- [ ] Test ads on mobile
- [ ] Verify cookie consent integration
- [ ] Check ad placement doesn't affect UX
- [ ] Test video ad functionality
- [ ] Verify ads.txt is accessible

#### 5. SEO & Performance
- [ ] Ensure ads don't impact page speed
- [ ] Test Core Web Vitals with ads
- [ ] Verify ads don't interfere with navigation
- [ ] Check mobile-friendliness

### Ad Placement Strategy
1. **Header Ads**: High visibility, good for brand awareness
2. **In-Content Ads**: Better engagement, higher CTR
3. **Sticky Ads**: Persistent visibility without being intrusive
4. **Video Ads**: Higher CPM rates
5. **Mobile-Specific**: Optimized for mobile user experience

### Revenue Optimization Tips
- Monitor ad performance in AdSense dashboard
- A/B test different ad placements
- Use responsive ad units for better fill rates
- Consider enabling video ads for higher revenue
- Maintain good user experience to ensure return visits

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
npx vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'out' directory to Netlify
```

## 🔄 Future Enhancements

- **Real-time Data Integration** - Connect to live stock market APIs
- **User Authentication** - Save custom screens and watchlists
- **Advanced Charts** - Candlestick charts and technical overlays
- **Alert System** - Email/SMS notifications for screening results
- **Portfolio Tracking** - Monitor selected stocks over time
- **Dark Mode** - Theme switching functionality
- **Mobile App** - React Native version for mobile platforms

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Note**: This application uses mock data for demonstration. In a production environment, integrate with reliable stock market data providers and ensure compliance with financial data regulations.
