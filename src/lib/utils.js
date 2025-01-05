import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  // Add ordinal suffix to day
  const suffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd'; 
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${suffix(day)}-${month}-${year} ${time}`;
}
