# Mobile Design Plan for TradeSmart Money

## Current Issues
1. Fixed sidebar takes too much space on mobile
2. Horizontal bars in sector performance get cramped
3. Small touch targets
4. Text overflow issues

## Proposed Mobile Layout

### 1. **Responsive Breakpoints**
```
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)
- Desktop: > 1024px (xl)
```

### 2. **Mobile Layout Structure**

#### A. **Navigation** (Top)
- Sticky header with hamburger menu
- Horizontal scrollable submenu tabs

#### B. **Market Breadth** (Collapsible Card)
- Expandable/collapsible section
- Shows Advancing/Declining stocks
- Minimal space when collapsed

#### C. **Sector Performance** (Main Content)

**Option 1: Vertical Card List**
```
┌─────────────────────────┐
│ Banking          -0.48% │
│ ████████░░░░░░░  55,459 │
├─────────────────────────┤
│ IT               -0.47% │
│ ████████░░░░░░░  36,578 │
└─────────────────────────┘
```

**Option 2: Horizontal Scrollable Cards**
```
┌────────┐ ┌────────┐ ┌────────┐
│Banking │ │   IT   │ │ Pharma │
│ -0.48% │ │ -0.47% │ │ +0.50% │
│ 55,459 │ │ 36,578 │ │ 22,687 │
└────────┘ └────────┘ └────────┘
    ←  Swipe to see more  →
```

**Option 3: Compact Table View**
```
┌──────────────────────────┐
│ Sector    │ Change │ Value│
├──────────────────────────┤
│ Banking   │ -0.48% │ 55.4K│
│ IT        │ -0.47% │ 36.6K│
│ Pharma    │ +0.50% │ 22.7K│
└──────────────────────────┘
```

### 3. **Recommended: Hybrid Approach**
- **Collapsed view**: Show top 5 sectors in compact cards
- **Expanded view**: Full list with vertical bars
- **Tap to expand** individual sector for stocks

### 4. **Touch Optimization**
- Minimum touch target: 44x44px
- Increased padding for all interactive elements
- Larger fonts for readability
- Swipe gestures for navigation

### 5. **Performance Optimizations**
- Lazy load stock lists
- Virtual scrolling for long lists
- Reduce animations on low-end devices

