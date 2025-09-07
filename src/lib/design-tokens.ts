// Professional Brand Design System for TradeSmartMoney
export const brandTokens = {
  // Premium Color Palette
  colors: {
    // Brand Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main brand blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    // Accent Colors
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Purple accent
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    // Success/Positive
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    // Danger/Negative  
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Neutral Grays
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    }
  },

  // Typography System
  typography: {
    // Display Text (Hero sections)
    display: {
      xl: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight',
      lg: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight',
      md: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight',
      sm: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight',
    },
    // Headers
    heading: {
      xl: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
      lg: 'text-xl sm:text-2xl lg:text-3xl font-bold',
      md: 'text-lg sm:text-xl lg:text-2xl font-semibold',
      sm: 'text-base sm:text-lg lg:text-xl font-semibold',
      xs: 'text-sm sm:text-base lg:text-lg font-semibold',
    },
    // Body Text
    body: {
      xl: 'text-lg sm:text-xl leading-relaxed',
      lg: 'text-base sm:text-lg leading-relaxed',
      md: 'text-sm sm:text-base leading-relaxed',
      sm: 'text-xs sm:text-sm leading-relaxed',
    },
    // Labels & Captions
    label: {
      lg: 'text-sm sm:text-base font-medium',
      md: 'text-xs sm:text-sm font-medium',
      sm: 'text-xs font-medium',
    },
    // Font Weights
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold', 
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    }
  },

  // Spacing & Layout
  spacing: {
    // Page Layout
    page: {
      x: 'px-4 sm:px-6 lg:px-8 xl:px-12',
      y: 'py-6 sm:py-8 lg:py-12 xl:py-16',
      container: 'max-w-7xl mx-auto',
      narrow: 'max-w-4xl mx-auto',
      wide: 'max-w-8xl mx-auto',
    },
    // Sections
    section: {
      y: 'py-8 sm:py-12 lg:py-16 xl:py-20',
      gap: 'space-y-8 sm:space-y-12 lg:space-y-16',
    },
    // Components
    component: {
      padding: {
        xs: 'p-2 sm:p-3',
        sm: 'p-3 sm:p-4 lg:p-6',
        md: 'p-4 sm:p-6 lg:p-8',
        lg: 'p-6 sm:p-8 lg:p-10 xl:p-12',
      },
      margin: {
        xs: 'm-2 sm:m-3',
        sm: 'm-3 sm:m-4 lg:m-6',
        md: 'm-4 sm:m-6 lg:m-8',
        lg: 'm-6 sm:m-8 lg:m-10',
      },
    },
    // Grids
    grid: {
      gap: {
        xs: 'gap-2 sm:gap-3',
        sm: 'gap-3 sm:gap-4 lg:gap-6',
        md: 'gap-4 sm:gap-6 lg:gap-8',
        lg: 'gap-6 sm:gap-8 lg:gap-10',
      }
    }
  },

  // Component Patterns
  components: {
    // Card Styles
    card: {
      base: 'bg-white rounded-xl shadow-sm border border-gray-100',
      elevated: 'bg-white rounded-xl shadow-lg border border-gray-100',
      premium: 'bg-gradient-to-br from-white via-gray-50/50 to-white rounded-xl shadow-lg border border-gray-200/50',
      interactive: 'transition-all duration-300 hover:shadow-xl hover:border-gray-300/50 hover:-translate-y-1',
      glass: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20',
  },
    // Button Styles  
    button: {
      primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300',
      secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-300',
      outline: 'border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-all duration-300',
      ghost: 'text-gray-600 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300',
    },
    // Badge/Status Styles
    badge: {
      success: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-sm',
      danger: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full shadow-sm',
      warning: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-full shadow-sm',
      info: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-sm',
      neutral: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-gray-400 to-slate-500 text-white rounded-full shadow-sm',
    }
  },

  // Animation & Effects
  effects: {
    // Transitions
    transition: {
      fast: 'transition-all duration-150',
      normal: 'transition-all duration-300',
      slow: 'transition-all duration-500',
      smooth: 'transition-all duration-300 ease-in-out',
    },
    // Hover Effects
    hover: {
      lift: 'hover:-translate-y-1 hover:shadow-lg',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-lg hover:shadow-blue-500/20',
      subtle: 'hover:bg-gray-50',
    },
    // Gradients
    gradient: {
      brand: 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600',
      brandLight: 'bg-gradient-to-r from-blue-50 via-white to-purple-50',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500',
      danger: 'bg-gradient-to-r from-red-500 to-rose-500',
      premium: 'bg-gradient-to-br from-white via-gray-50 to-white',
      glass: 'bg-gradient-to-br from-white/80 to-white/60',
    },
    // Shadows
    shadow: {
      soft: 'shadow-sm',
      normal: 'shadow-md',
      strong: 'shadow-lg',
      premium: 'shadow-xl shadow-blue-500/10',
      glow: 'shadow-lg shadow-blue-500/20',
    }
  },

  // Layout Grids
  grids: {
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    twoToFour: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    oneToThree: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    masonry: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6',
  },

  // Icon Sizes
  icons: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12',
  },

  // Responsive Breakpoints (for reference)
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// Legacy support - keeping the old export for backward compatibility
export const designTokens = brandTokens;
export const dt = brandTokens;

// Utility functions for easier access
export const brand = {
  // Quick access to common patterns
  card: (variant: 'base' | 'elevated' | 'premium' | 'glass' = 'base', interactive = true) => 
    `${brandTokens.components.card[variant]} ${interactive ? brandTokens.components.card.interactive : ''}`,
  
  button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') =>
    brandTokens.components.button[variant],
  
  badge: (variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' = 'info') =>
    brandTokens.components.badge[variant],
  
  text: {
    heading: (size: 'xl' | 'lg' | 'md' | 'sm' | 'xs' = 'md') => brandTokens.typography.heading[size],
    body: (size: 'xl' | 'lg' | 'md' | 'sm' = 'md') => brandTokens.typography.body[size],
    label: (size: 'lg' | 'md' | 'sm' = 'md') => brandTokens.typography.label[size],
    display: (size: 'xl' | 'lg' | 'md' | 'sm' = 'md') => brandTokens.typography.display[size],
  },
  
  gradient: (variant: 'brand' | 'brandLight' | 'success' | 'danger' | 'premium' | 'glass' = 'brand') =>
    brandTokens.effects.gradient[variant],
}; 