// src/utils/jobUtils.ts

import { Job } from "@/types/jobs";

/**
 * Format date string into readable format, e.g. "Nov 2, 2025".
 */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

/**
 * Safely format salary — supports undefined or missing data.
 */
export const formatSalary = (salary?: Job["salary"]): string => {
  if (!salary || !salary.amount) return "Not specified";
  return `${salary.currency} ${salary.amount.toLocaleString()}/${salary.unit}`;
};

/**
 * Get color hint for match percentage.
 */
export const getMatchColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
};

/**
 * Returns initials for a company name.
 * Example: "TechCorp Pvt Ltd" → "TP"
 */
export function getCompanyInitials(name: string): string {
  if (!name) return "?";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) {
    // If single word like "DesignHub" → "D"
    return words[0].charAt(0).toUpperCase();
  }

  // Multiple words → first letter of first two
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}
