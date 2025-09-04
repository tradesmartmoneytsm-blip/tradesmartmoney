import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(2)}K`;
  }
  return `₹${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function getColorForPercentage(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
} 