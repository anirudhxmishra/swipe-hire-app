export interface Job {
  /** Unique ID for job */
  id: string;

  /** Job title, e.g. "Senior Full Stack Developer" */
  title: string;

  /** Company name */
  company: string;

  /** Optional company logo image URL */
  companyLogo?: string;

  /** Company rating, e.g. 4.6 */
  rating: number;

  /** Job location string, e.g. "Bengaluru, India" */
  location: string;

  /** Job type, e.g. "Full-time", "Internship", etc. */
  jobType: string;

  /** Salary details (optional) */
  salary?: {
    amount: number;
    currency: string;
    unit: "month" | "year" | "hour";
  };

  /** Human-friendly post time like "2 days ago" */
  postedAgo: string;

  /** List of perks or benefits */
  benefits: string[];

  /** Minimum qualifications or eligibility */
  qualifications: string[];

  /** Nested structure for detailed job description */
  fullDescription: {
    category: string;       // e.g. "Engineering"
    stipend: string;        // e.g. "N/A" or "₹10,000/month"
    duration: string;       // e.g. "Permanent" or "6 months"
    workMode: string;       // e.g. "Remote", "Hybrid", "On-site"
    description: string[];  // Main job details or bullet points
    requirements: string[]; // Technical/soft skill requirements
  };

  /** URL to apply for the job */
  applyUrl: string;
}
