'use client';

import { useState, useEffect } from 'react';
import { Palette, Monitor, Terminal, FlaskConical } from 'lucide-react';

export type Theme = 'professional' | 'terminal' | 'data-science';

interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'inline';
  isScrolled?: boolean;
}

export function ThemeSwitcher({ variant = 'dropdown', isScrolled = false }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('professional');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['professional', 'terminal', 'data-science'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('professional');
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const themes = [
    {
      id: 'professional' as Theme,
      name: 'Professional',
      description: 'Modern blue & purple gradients',
      icon: Monitor,
      colors: ['#2563eb', '#7c3aed'],
    },
    {
      id: 'terminal' as Theme,
      name: 'Terminal',
      description: 'Dark terminal aesthetic',
      icon: Terminal,
      colors: ['#00ff41', '#000000'],
    },
    {
      id: 'data-science' as Theme,
      name: 'Data Science',
      description: 'Matplotlib/Jupyter style',
      icon: FlaskConical,
      colors: ['#1f77b4', '#2ca02c'],
    },
  ];

  const currentThemeData = themes.find(t => t.id === currentTheme);

  // Inline variant for mobile menu
  if (variant === 'inline') {
    return (
      <div className="space-y-2">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive 
                  ? 'bg-white/20' 
                  : 'bg-blue-50'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">{theme.name}</div>
                <div className="text-xs opacity-80">{theme.description}</div>
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg ${
          isScrolled
            ? 'bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white'
            : 'bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm'
        }`}
        aria-label="Theme switcher"
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{currentThemeData?.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Select Theme
              </div>
              
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                        {theme.name}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {theme.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

