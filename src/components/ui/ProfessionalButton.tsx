import React from 'react';
import { brandTokens } from '@/lib/design-tokens';
import { RefreshCw } from 'lucide-react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function ProfessionalButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = brandTokens.components.button[variant];
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: brandTokens.icons.sm,
    md: brandTokens.icons.md,
    lg: brandTokens.icons.lg
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        inline-flex items-center justify-center gap-2
        focus-ring
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={iconSizes[size]} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
}

// Specialized button variants
export function RefreshButton({
  onRefresh,
  loading = false,
  size = 'sm',
  className = ''
}: {
  onRefresh: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <ProfessionalButton
      variant="secondary"
      size={size}
      loading={loading}
      onClick={onRefresh}
      className={className}
      icon={loading ? undefined : RefreshCw}
    >
      {loading ? 'Refreshing...' : 'Refresh'}
    </ProfessionalButton>
  );
}

export function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  onClick,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ProfessionalButton
      variant={variant}
      size={size}
      loading={loading}
      icon={icon}
      onClick={onClick}
      className={className}
    >
      {children}
    </ProfessionalButton>
  );
}

export function StatusButton({
  status,
  children,
  size = 'sm',
  className = ''
}: {
  status: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const statusColors = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
    warning: 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    neutral: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full shadow-sm
        ${statusColors[status]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Button Group Component
export function ButtonGroup({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
} 