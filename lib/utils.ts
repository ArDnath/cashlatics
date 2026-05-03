import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without style conflicts.
 * clsx handles conditional classes, while twMerge ensures 
 * the last class defined wins (standard Tailwind behavior).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
