// Design Tokens - Centralized Design System
export const designTokens = {
  // Spacing Scale
  spacing: {
    page: 'px-3 sm:px-4 lg:px-8',
    pagePadding: 'py-4 sm:py-6 lg:py-8',
    section: 'mb-6 sm:mb-8',
    card: 'p-4 sm:p-6 lg:p-8',
    cardSmall: 'p-4 sm:p-6',
    gridGap: 'gap-4 sm:gap-6 lg:gap-8',
    gridGapSmall: 'gap-3 sm:gap-4 lg:gap-6',
  },

  // Typography Scale
  typography: {
    pageTitle: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
    sectionTitle: 'text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900',
    cardTitle: 'text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900',
    body: 'text-base sm:text-lg text-gray-600',
    bodySmall: 'text-sm sm:text-base text-gray-600',
    caption: 'text-xs sm:text-sm text-gray-500',
  },

  // Component Sizes
  icons: {
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8',
    large: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10',
  },

  // Interactive States
  interactive: {
    button: 'transition-all duration-300 touch-manipulation',
    card: 'transition-all duration-300 hover:shadow-lg touch-manipulation',
    hover: 'hover:scale-105',
  },

  // Layout Grids
  grids: {
    responsive1to3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    responsive2to4: 'grid grid-cols-2 lg:grid-cols-4',
    responsive2to5: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    cardGrid: 'grid gap-4 sm:gap-6',
  },

  // Color Schemes
  colors: {
    positive: 'text-green-600 bg-green-50 border-green-200',
    negative: 'text-red-600 bg-red-50 border-red-200',
    neutral: 'text-gray-600 bg-gray-50 border-gray-200',
  },
};

// Utility function to combine design tokens
export const dt = designTokens; 