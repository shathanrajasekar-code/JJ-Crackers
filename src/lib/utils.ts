import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp === price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
