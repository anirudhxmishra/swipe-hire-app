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
 * Returns the initials of a company name (e.g., "Tech Hire" → "TH").
 */
export const getCompanyInitials = (companyName: string): string => {
  if (!companyName) return "?";
  const words = companyName.split(" ");
  const initials = words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  return initials || companyName[0].toUpperCase();
};

/**
 * Returns a bright gradient color style for company initials,
 * based on the hash of the company name.
 */
export const getCompanyColorStyle = (companyName: string): React.CSSProperties => {
  const colors = [
    ["#ff9a9e", "#fad0c4"],
    ["#a18cd1", "#fbc2eb"],
    ["#84fab0", "#8fd3f4"],
    ["#ffecd2", "#fcb69f"],
    ["#cfd9df", "#e2ebf0"],
    ["#f6d365", "#fda085"],
    ["#96e6a1", "#d4fc79"],
    ["#ff6a88", "#ff99ac"],
    ["#a1c4fd", "#c2e9fb"],
  ];

  const hash = companyName
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const [start, end] = colors[hash % colors.length];

  return {
    background: `linear-gradient(135deg, ${start}, ${end})`,
    color: "#fff",
  };
};
