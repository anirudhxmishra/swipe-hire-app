import { Job } from "./types/jobs";

export const skillSuggestions = [
  // 🌐 Frontend
  "React", "Next.js", "Vue.js", "Svelte", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS",
  "Framer Motion", "Redux", "React Query", "Vite", "WebSockets", "Three.js",

  // ⚙️ Backend
  "Node.js", "Express.js", "NestJS", "Python", "Django", "Flask", "Go", "Rust", "Java", "Spring Boot",
  "PHP", "Laravel", "Ruby on Rails", "FastAPI", "GraphQL", "REST API",

  // ☁️ DevOps & Cloud
  "AWS", "Google Cloud", "Azure", "Firebase", "Docker", "Kubernetes", "Terraform", "CI/CD",
  "Jenkins", "GitHub Actions", "NGINX", "Linux", "Serverless", "Vercel", "Netlify",

  // 📊 Data & AI
  "Machine Learning", "Deep Learning", "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch",
  "LLMs", "LangChain", "Vector Databases", "Pinecone", "RAG", "OpenAI API", "Hugging Face",
  "Data Visualization", "Power BI", "Tableau", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "Redis",

  // 📱 Mobile & Cross-platform
  "React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS", "Expo", "PWA",

  // 🎨 Design & UI/UX
  "UI/UX", "Figma", "Adobe XD", "Sketch", "Design Systems", "Prototyping", "Motion Design",
  "User Research", "Accessibility", "Wireframing",

  // 💼 Business, Marketing & Product
  "Product Management", "Agile", "Scrum", "Marketing", "SEO", "Content Strategy",
  "Social Media", "Copywriting", "Analytics", "A/B Testing", "Growth Hacking",

  // 🔐 Security
  "Cybersecurity", "OAuth", "JWT", "Encryption", "Penetration Testing", "DevSecOps",

  // 🧠 Soft & Collaboration Skills
  "Communication", "Leadership", "Problem Solving", "Critical Thinking",
  "Collaboration", "Time Management", "Creativity", "Adaptability", "Teamwork",

  // 🧩 Emerging Tech
  "Blockchain", "Solidity", "Web3.js", "Smart Contracts", "AR/VR", "3D Design", "Generative AI",
  "Prompt Engineering", "Edge Computing", "Quantum Computing"
];

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    rating: 4.6,
    location: "Bengaluru, India",
    jobType: "Full-time",
    salary: {
      amount: 2800000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "2 days ago",
    benefits: ["Health Insurance", "Remote Flexibility", "Stock Options"],
    qualifications: ["B.Tech in Computer Science", "5+ years experience"],
    fullDescription: {
      category: "Engineering",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Hybrid",
      description: [
        "Collaborate with design and product teams to build scalable web apps.",
        "Work with TypeScript, React, and Node.js in production environments.",
      ],
      requirements: [
        "Strong understanding of full-stack architecture.",
        "Experience with AWS and CI/CD pipelines.",
      ],
    },
    applyUrl: "https://techcorp.com/careers/fullstack",
    companyLogo: "https://via.placeholder.com/80x80.png?text=T",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    rating: 4.3,
    location: "Remote (India)",
    jobType: "Full-time",
    salary: {
      amount: 1800000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "5 days ago",
    benefits: ["Flexible Hours", "Remote Work", "Creative Environment"],
    qualifications: ["Bachelor’s in Design", "Strong Figma Portfolio"],
    fullDescription: {
      category: "Design",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Remote",
      description: [
        "Design user-centered interfaces and interactive prototypes.",
        "Collaborate with developers to ensure pixel-perfect implementation.",
      ],
      requirements: [
        "Proficiency in Figma and Adobe XD.",
        "Strong portfolio demonstrating UX/UI skills.",
      ],
    },
    applyUrl: "https://designhub.io/jobs/designer",
    companyLogo: "https://via.placeholder.com/80x80.png?text=D",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudScale",
    rating: 4.5,
    location: "Hyderabad, India",
    jobType: "Full-time",
    salary: {
      amount: 2400000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "1 week ago",
    benefits: ["Learning Budget", "Health Insurance", "Team Retreats"],
    qualifications: ["3+ years in DevOps", "Experience with Docker & Kubernetes"],
    fullDescription: {
      category: "Infrastructure",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "On-site",
      description: [
        "Manage CI/CD pipelines for high-scale web platforms.",
        "Implement infrastructure automation with Terraform and AWS.",
      ],
      requirements: [
        "Proficient in Docker, Kubernetes, and AWS services.",
        "Knowledge of monitoring tools like Prometheus and Grafana.",
      ],
    },
    applyUrl: "https://cloudscale.io/careers/devops",
    companyLogo: "https://via.placeholder.com/80x80.png?text=C",
  },
  {
    id: "4",
    title: "Mobile App Developer",
    company: "AppVerse",
    rating: 4.4,
    location: "Pune, India",
    jobType: "Full-time",
    salary: {
      amount: 1600000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "3 days ago",
    benefits: ["Remote Work", "Health Insurance", "Paid Leave"],
    qualifications: ["Bachelor’s in CS", "2+ years Flutter/React Native"],
    fullDescription: {
      category: "Mobile Development",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Hybrid",
      description: [
        "Develop cross-platform mobile apps using Flutter or React Native.",
        "Collaborate with designers to ensure smooth UX/UI transitions.",
      ],
      requirements: [
        "Hands-on experience with REST APIs.",
        "Knowledge of mobile app deployment to App Store/Play Store.",
      ],
    },
    applyUrl: "https://appverse.io/careers/mobile-dev",
    companyLogo: "https://via.placeholder.com/80x80.png?text=A",
  },
  {
    id: "5",
    title: "Backend Engineer",
    company: "DataWorks",
    rating: 4.2,
    location: "Chennai, India",
    jobType: "Full-time",
    salary: {
      amount: 2000000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "6 days ago",
    benefits: ["Learning Support", "Meal Coupons", "Flexible Hours"],
    qualifications: ["3+ years in Node.js", "SQL and NoSQL expertise"],
    fullDescription: {
      category: "Backend",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "On-site",
      description: [
        "Design and develop robust backend APIs and services.",
        "Optimize performance and scalability of distributed systems.",
      ],
      requirements: [
        "Proficiency in Node.js and Express.",
        "Experience with MongoDB and PostgreSQL.",
      ],
    },
    applyUrl: "https://dataworks.in/careers/backend",
    companyLogo: "https://via.placeholder.com/80x80.png?text=D",
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    company: "AIForge",
    rating: 4.8,
    location: "Bengaluru, India",
    jobType: "Full-time",
    salary: {
      amount: 3200000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "1 day ago",
    benefits: ["Health Insurance", "GPU Credits", "Flexible Work"],
    qualifications: ["M.Tech/PhD in AI", "Strong Python/ML experience"],
    fullDescription: {
      category: "Artificial Intelligence",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Hybrid",
      description: [
        "Build and deploy machine learning models for large-scale data.",
        "Collaborate with research and engineering teams to improve accuracy.",
      ],
      requirements: [
        "Proficiency with TensorFlow or PyTorch.",
        "Strong statistics and data science foundation.",
      ],
    },
    applyUrl: "https://aiforge.ai/jobs/ml-engineer",
    companyLogo: "https://via.placeholder.com/80x80.png?text=AI",
  },
  {
    id: "7",
    title: "UI/UX Intern",
    company: "PixelCraft",
    rating: 4.1,
    location: "Remote",
    jobType: "Internship",
    salary: {
      amount: 15000,
      currency: "INR",
      unit: "month",
    },
    postedAgo: "4 days ago",
    benefits: ["Mentorship", "Certificate", "Flexible Hours"],
    qualifications: ["Pursuing Design Degree", "Basic Figma knowledge"],
    fullDescription: {
      category: "Design",
      stipend: "15,000/month",
      duration: "3 months",
      workMode: "Remote",
      description: [
        "Assist in designing app interfaces and marketing visuals.",
        "Participate in user research and design brainstorming sessions.",
      ],
      requirements: [
        "Basic understanding of UI/UX principles.",
        "Good communication and collaboration skills.",
      ],
    },
    applyUrl: "https://pixelcraft.io/internships/uiux",
    companyLogo: "https://via.placeholder.com/80x80.png?text=P",
  },
  {
    id: "8",
    title: "Frontend Developer",
    company: "WebHive",
    rating: 4.5,
    location: "Gurugram, India",
    jobType: "Contract",
    salary: {
      amount: 120000,
      currency: "INR",
      unit: "month",
    },
    postedAgo: "2 weeks ago",
    benefits: ["Remote Work", "Performance Bonus"],
    qualifications: ["React.js Expert", "Strong HTML/CSS/JS"],
    fullDescription: {
      category: "Frontend",
      stipend: "N/A",
      duration: "6 months",
      workMode: "Remote",
      description: [
        "Implement responsive and accessible UI for enterprise clients.",
        "Integrate APIs and ensure fast rendering performance.",
      ],
      requirements: [
        "Proficiency in React.js and TailwindCSS.",
        "Understanding of accessibility and SEO best practices.",
      ],
    },
    applyUrl: "https://webhive.dev/jobs/frontend",
    companyLogo: "https://via.placeholder.com/80x80.png?text=W",
  },
  {
    id: "9",
    title: "Data Analyst",
    company: "Insightify",
    rating: 4.4,
    location: "Mumbai, India",
    jobType: "Full-time",
    salary: {
      amount: 1500000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "3 days ago",
    benefits: ["Health Benefits", "Free Meals", "Learning Support"],
    qualifications: ["Bachelor’s in Statistics", "SQL, Excel, PowerBI"],
    fullDescription: {
      category: "Analytics",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Hybrid",
      description: [
        "Analyze business data to derive actionable insights.",
        "Work with stakeholders to define key performance metrics.",
      ],
      requirements: [
        "Proficiency in PowerBI and SQL.",
        "Strong analytical and communication skills.",
      ],
    },
    applyUrl: "https://insightify.in/careers/data-analyst",
    companyLogo: "https://via.placeholder.com/80x80.png?text=I",
  },
  {
    id: "10",
    title: "Cybersecurity Specialist",
    company: "SecureNet",
    rating: 4.7,
    location: "Delhi, India",
    jobType: "Full-time",
    salary: {
      amount: 3000000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "1 week ago",
    benefits: ["Health Insurance", "Gym Membership", "Training Budget"],
    qualifications: ["CEH or CISSP Certification", "5+ years in security"],
    fullDescription: {
      category: "Security",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "On-site",
      description: [
        "Monitor and respond to network security incidents.",
        "Implement and test company-wide security protocols.",
      ],
      requirements: [
        "Deep understanding of penetration testing and firewalls.",
        "Experience with SIEM and endpoint protection systems.",
      ],
    },
    applyUrl: "https://securenet.in/jobs/security-specialist",
    companyLogo: "https://via.placeholder.com/80x80.png?text=S",
  },
  {
    id: "11",
    title: "QA Engineer",
    company: "BugZero",
    rating: 4.3,
    location: "Noida, India",
    jobType: "Full-time",
    salary: {
      amount: 1400000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "5 days ago",
    benefits: ["Free Lunch", "Work From Home", "Flexible Hours"],
    qualifications: ["Automation Testing", "Cypress/Jest knowledge"],
    fullDescription: {
      category: "Quality Assurance",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Hybrid",
      description: [
        "Design and execute automated test suites.",
        "Collaborate with dev teams to fix reported issues promptly.",
      ],
      requirements: [
        "Strong JS and automation background.",
        "Experience with CI/CD pipelines.",
      ],
    },
    applyUrl: "https://bugzero.io/jobs/qa-engineer",
    companyLogo: "https://via.placeholder.com/80x80.png?text=B",
  },
  {
    id: "12",
    title: "HR Executive",
    company: "PeopleFirst",
    rating: 4.0,
    location: "Kolkata, India",
    jobType: "Full-time",
    salary: {
      amount: 900000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "2 weeks ago",
    benefits: ["Employee Wellness", "Paid Time Off"],
    qualifications: ["MBA in HR", "2+ years HR experience"],
    fullDescription: {
      category: "Human Resources",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "On-site",
      description: [
        "Manage recruitment, onboarding, and employee engagement programs.",
        "Handle HR documentation and compliance tasks.",
      ],
      requirements: [
        "Excellent communication and people skills.",
        "Knowledge of labor laws and HR tools.",
      ],
    },
    applyUrl: "https://peoplefirst.in/careers/hr-executive",
    companyLogo: "https://via.placeholder.com/80x80.png?text=H",
  },
  {
    id: "13",
    title: "Customer Support Specialist",
    company: "Helpify",
    rating: 4.2,
    location: "Remote (India)",
    jobType: "Full-time",
    salary: {
      amount: 600000,
      currency: "INR",
      unit: "year",
    },
    postedAgo: "4 days ago",
    benefits: ["Remote Work", "Internet Reimbursement", "Health Insurance"],
    qualifications: ["Excellent Communication", "Experience with CRM tools"],
    fullDescription: {
      category: "Support",
      stipend: "N/A",
      duration: "Permanent",
      workMode: "Remote",
      description: [
        "Provide customer support via chat, email, and phone.",
        "Assist clients with product-related queries and feedback.",
      ],
      requirements: [
        "Good written and verbal English skills.",
        "Experience with Zendesk or Freshdesk preferred.",
      ],
    },
    applyUrl: "https://helpify.io/jobs/support",
    companyLogo: "https://via.placeholder.com/80x80.png?text=H",
  },
];
