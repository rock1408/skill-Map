import { RoadmapData } from "./types";

export interface SkillItem {
  name: string;
  category: string;
}

export const SKILLS_DATABASE: SkillItem[] = [
  // Programming
  { name: "Python", category: "Programming" },
  { name: "JavaScript", category: "Programming" },
  { name: "TypeScript", category: "Programming" },
  { name: "R", category: "Programming" },
  { name: "Java", category: "Programming" },
  { name: "C++", category: "Programming" },
  { name: "C#", category: "Programming" },
  { name: "Go", category: "Programming" },
  { name: "Rust", category: "Programming" },
  { name: "Swift", category: "Programming" },
  { name: "Kotlin", category: "Programming" },
  { name: "PHP", category: "Programming" },
  { name: "Ruby", category: "Programming" },
  { name: "MATLAB", category: "Programming" },
  { name: "Bash", category: "Programming" },
  { name: "SQL", category: "Programming" },
  { name: "NoSQL", category: "Programming" },
  { name: "GraphQL", category: "Programming" },
  { name: "HTML", category: "Programming" },
  { name: "CSS", category: "Programming" },
  { name: "Sass", category: "Programming" },

  // Frameworks
  { name: "React", category: "Frameworks" },
  { name: "Vue", category: "Frameworks" },
  { name: "Angular", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "Django", category: "Frameworks" },
  { name: "Flask", category: "Frameworks" },
  { name: "FastAPI", category: "Frameworks" },
  { name: "Spring", category: "Frameworks" },
  { name: "Laravel", category: "Frameworks" },
  { name: "Rails", category: "Frameworks" },
  { name: "Node.js", category: "Frameworks" },
  { name: "Express", category: "Frameworks" },

  // Data & ML
  { name: "Pandas", category: "Data & ML" },
  { name: "NumPy", category: "Data & ML" },
  { name: "Scikit-learn", category: "Data & ML" },
  { name: "TensorFlow", category: "Data & ML" },
  { name: "PyTorch", category: "Data & ML" },
  { name: "Keras", category: "Data & ML" },
  { name: "XGBoost", category: "Data & ML" },
  { name: "Spark", category: "Data & ML" },
  { name: "Hadoop", category: "Data & ML" },
  { name: "dbt", category: "Data & ML" },
  { name: "Airflow", category: "Data & ML" },
  { name: "MLflow", category: "Data & ML" },
  { name: "Hugging Face", category: "Data & ML" },
  { name: "LangChain", category: "Data & ML" },
  { name: "OpenCV", category: "Data & ML" },

  // Cloud & DevOps
  { name: "AWS", category: "Cloud & DevOps" },
  { name: "Azure", category: "Cloud & DevOps" },
  { name: "GCP", category: "Cloud & DevOps" },
  { name: "Docker", category: "Cloud & DevOps" },
  { name: "Kubernetes", category: "Cloud & DevOps" },
  { name: "Terraform", category: "Cloud & DevOps" },
  { name: "CI/CD", category: "Cloud & DevOps" },
  { name: "Jenkins", category: "Cloud & DevOps" },
  { name: "GitHub Actions", category: "Cloud & DevOps" },
  { name: "Linux", category: "Cloud & DevOps" },
  { name: "Nginx", category: "Cloud & DevOps" },

  // Databases
  { name: "PostgreSQL", category: "Databases" },
  { name: "MySQL", category: "Databases" },
  { name: "MongoDB", category: "Databases" },
  { name: "Redis", category: "Databases" },
  { name: "Elasticsearch", category: "Databases" },
  { name: "Cassandra", category: "Databases" },
  { name: "DynamoDB", category: "Databases" },
  { name: "Snowflake", category: "Databases" },
  { name: "BigQuery", category: "Databases" },
  { name: "Redshift", category: "Databases" },

  // Design
  { name: "Figma", category: "Design" },
  { name: "Adobe XD", category: "Design" },
  { name: "Photoshop", category: "Design" },
  { name: "Illustrator", category: "Design" },
  { name: "Sketch", category: "Design" },
  { name: "InDesign", category: "Design" },
  { name: "Premiere Pro", category: "Design" },
  { name: "After Effects", category: "Design" },
  { name: "Blender", category: "Design" },
  { name: "Canva", category: "Design" },

  // Business & Project Management
  { name: "Excel", category: "Business" },
  { name: "PowerPoint", category: "Business" },
  { name: "Word", category: "Business" },
  { name: "Google Sheets", category: "Business" },
  { name: "Tableau", category: "Business" },
  { name: "Power BI", category: "Business" },
  { name: "Salesforce", category: "Business" },
  { name: "HubSpot", category: "Business" },
  { name: "Jira", category: "Business" },
  { name: "Notion", category: "Business" },
  { name: "Asana", category: "Business" },

  // Finance
  { name: "Financial Modeling", category: "Finance" },
  { name: "Valuation", category: "Finance" },
  { name: "Bloomberg Terminal", category: "Finance" },
  { name: "QuickBooks", category: "Finance" },
  { name: "SAP", category: "Finance" },
  { name: "Accounting", category: "Finance" },
  { name: "Budgeting", category: "Finance" },
  { name: "Tax Auditing", category: "Finance" },

  // Healthcare
  { name: "Patient Care", category: "Healthcare" },
  { name: "Clinical Assessment", category: "Healthcare" },
  { name: "EMR/EHR", category: "Healthcare" },
  { name: "HIPAA Compliance", category: "Healthcare" },
  { name: "Medical Coding", category: "Healthcare" },
  { name: "Pharmacology", category: "Healthcare" },

  // Soft Skills
  { name: "Leadership", category: "Soft Skills" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Project Management", category: "Soft Skills" },
  { name: "Critical Thinking", category: "Soft Skills" },
  { name: "Problem Solving", category: "Soft Skills" },
  { name: "Public Speaking", category: "Soft Skills" },
  { name: "Negotiation", category: "Soft Skills" },
  { name: "Mentoring", category: "Soft Skills" },

  // Certifications
  { name: "AWS SAA", category: "Certifications" },
  { name: "Google Cloud Architect", category: "Certifications" },
  { name: "Azure AZ-900", category: "Certifications" },
  { name: "CompTIA A+", category: "Certifications" },
  { name: "CompTIA Security+", category: "Certifications" },
  { name: "CompTIA Network+", category: "Certifications" },
  { name: "CISSP", category: "Certifications" },
  { name: "PMP", category: "Certifications" },
  { name: "Scrum Master", category: "Certifications" },
  { name: "CPA", category: "Certifications" },
  { name: "CFA Level 1", category: "Certifications" }
];

export interface IndustryItem {
  id: string;
  name: string;
  icon: string;
  rolesCount: number;
  examples: string[];
}

export const INDUSTRIES: IndustryItem[] = [
  { id: "tech", name: "Technology", icon: "💻", rolesCount: 5, examples: ["Software Engineer", "Data Scientist", "Cloud Architect"] },
  { id: "biz", name: "Business & Management", icon: "💼", rolesCount: 3, examples: ["Product Manager", "Project Manager", "Operations Lead"] },
  { id: "health", name: "Healthcare & Medicine", icon: "🏥", rolesCount: 2, examples: ["Medical Assistant", "Health Informatician", "Lab Tech"] },
  { id: "legal", name: "Legal & Government", icon: "⚖️", rolesCount: 2, examples: ["Paralegal", "Compliance Officer", "Policy Analyst"] },
  { id: "creative", name: "Creative & Media", icon: "🎨", rolesCount: 3, examples: ["UX Designer", "Video Editor", "Art Director"] },
  { id: "science", name: "Science & Research", icon: "🔬", rolesCount: 2, examples: ["Data Analyst", "Bioinformatics Specialist", "Lab Manager"] },
  { id: "engineering", name: "Engineering", icon: "🏗️", rolesCount: 2, examples: ["Mechanical Engineer", "CAD Designer", "Robotics Dev"] },
  { id: "trades", name: "Trades & Skilled Labor", icon: "🔧", rolesCount: 2, examples: ["Electrician", "HVAC Tech", "Solar Installer"] },
  { id: "finance", name: "Finance & Accounting", icon: "💰", rolesCount: 2, examples: ["Financial Analyst", "Accountant", "Tax Specialist"] },
  { id: "green", name: "Environment & Sustainability", icon: "🌱", rolesCount: 1, examples: ["Sustainability Consultant", "Energy Auditor"] }
];

export interface CareerRole {
  title: string;
  industry: string;
  industryId: string;
  salaryRange: string;
  demand: "High" | "Growing" | "Stable";
  timeEstimate: string;
  skills: string[];
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  avgSalary: number;
}

export const CAREER_ROLES: CareerRole[] = [
  {
    title: "Data Scientist",
    industry: "Technology",
    industryId: "tech",
    salaryRange: "$95k – $165k",
    demand: "High",
    timeEstimate: "~10-12 months",
    skills: ["Python", "SQL", "Pandas", "Scikit-learn", "Statistics"],
    description: "Extract insights from complex business data using machine learning, code logic, and statistical visualizations.",
    difficulty: "Advanced",
    avgSalary: 125000
  },
  {
    title: "UX/UI Designer",
    industry: "Creative & Media",
    industryId: "creative",
    salaryRange: "$75k – $130k",
    demand: "High",
    timeEstimate: "~8 months",
    skills: ["Figma", "User Research", "Wireframing", "Communication"],
    description: "Build eye-catching, responsive digital experiences centered around optimal human interaction standards.",
    difficulty: "Beginner",
    avgSalary: 92000
  },
  {
    title: "Frontend Developer",
    industry: "Technology",
    industryId: "tech",
    salaryRange: "$80k – $140k",
    demand: "High",
    timeEstimate: "~6-8 months",
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    description: "Build responsive web applications utilizing top-tier visual styling, modern UI frameworks, and clean APIs.",
    difficulty: "Beginner",
    avgSalary: 105000
  },
  {
    title: "Cybersecurity Analyst",
    industry: "Technology",
    industryId: "tech",
    salaryRange: "$85k – $150k",
    demand: "High",
    timeEstimate: "~8 months",
    skills: ["Linux", "CompTIA Security+", "Networking", "Penetration Testing"],
    description: "Monitor and defend networks from security breaches, managing standard firewall permissions and threat reports.",
    difficulty: "Intermediate",
    avgSalary: 110000
  },
  {
    title: "Product Manager",
    industry: "Business & Management",
    industryId: "biz",
    salaryRange: "$90k – $160k",
    demand: "Growing",
    timeEstimate: "~6 months",
    skills: ["Product Strategy", "Agile", "Jira", "Stakeholder Alignment"],
    description: "Direct the development and design lifecycle of interactive features, aligning business goals to clear releases.",
    difficulty: "Intermediate",
    avgSalary: 118000
  },
  {
    title: "Cloud Architect",
    industry: "Technology",
    industryId: "tech",
    salaryRange: "$110k – $185k",
    demand: "High",
    timeEstimate: "~12-14 months",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
    description: "Design secure, scaling network foundations using leading cloud providers and DevOps infrastructure tools.",
    difficulty: "Advanced",
    avgSalary: 142000
  },
  {
    title: "Financial Analyst",
    industry: "Finance & Accounting",
    industryId: "finance",
    salaryRange: "$70k – $115k",
    demand: "Stable",
    timeEstimate: "~6 months",
    skills: ["Excel", "Financial Modeling", "Accounting", "Bloomberg Terminal"],
    description: "Create projection maps, review budget statements, and advise firms on cash investment opportunities.",
    difficulty: "Intermediate",
    avgSalary: 85000
  },
  {
    title: "Solar Installation Technician",
    industry: "Trades & Skilled Labor",
    industryId: "trades",
    salaryRange: "$50k – $85k",
    demand: "High",
    timeEstimate: "~4-6 months",
    skills: ["Blueprints", "Electrical Safety", "Hand Tools", "Troubleshooting"],
    description: "Install, service, and configure electrical grids and panels converting solar radiation to green energy.",
    difficulty: "Beginner",
    avgSalary: 62000
  },
  {
    title: "Full Stack Engineer",
    industry: "Technology",
    industryId: "tech",
    salaryRange: "$85k – $155k",
    demand: "High",
    timeEstimate: "~8-10 months",
    skills: ["React", "Node.js", "Express", "TypeScript", "PostgreSQL"],
    description: "Build end-to-end web applications, designing frontend interfaces and backend APIs.",
    difficulty: "Intermediate",
    avgSalary: 120000
  },
  {
    title: "Project Manager",
    industry: "Business & Management",
    industryId: "biz",
    salaryRange: "$75k – $130k",
    demand: "Growing",
    timeEstimate: "~6 months",
    skills: ["Agile", "Jira", "Asana", "Communication", "Leadership"],
    description: "Coordinate project timelines, resources, and stakeholder communication to ensure successful delivery.",
    difficulty: "Intermediate",
    avgSalary: 95000
  },
  {
    title: "Operations Lead",
    industry: "Business & Management",
    industryId: "biz",
    salaryRange: "$80k – $140k",
    demand: "Stable",
    timeEstimate: "~8 months",
    skills: ["Excel", "Project Management", "Process Optimization", "Budgeting"],
    description: "Optimize company workflows, manage operational budgets, and align cross-department goals.",
    difficulty: "Intermediate",
    avgSalary: 105000
  },
  {
    title: "Health Informatician",
    industry: "Healthcare & Medicine",
    industryId: "health",
    salaryRange: "$65k – $110k",
    demand: "High",
    timeEstimate: "~8-10 months",
    skills: ["EMR/EHR", "SQL", "HIPAA Compliance", "Data Quality"],
    description: "Manage healthcare data systems, ensuring HIPAA compliance and optimizing patient record workflows.",
    difficulty: "Intermediate",
    avgSalary: 82000
  },
  {
    title: "Medical Assistant",
    industry: "Healthcare & Medicine",
    industryId: "health",
    salaryRange: "$40k – $60k",
    demand: "High",
    timeEstimate: "~6-8 months",
    skills: ["Patient Care", "Clinical Assessment", "EMR/EHR", "Communication"],
    description: "Support clinical workflows, assist in patient assessments, and manage administrative records.",
    difficulty: "Beginner",
    avgSalary: 48000
  },
  {
    title: "Compliance Officer",
    industry: "Legal & Government",
    industryId: "legal",
    salaryRange: "$70k – $125k",
    demand: "Growing",
    timeEstimate: "~8 months",
    skills: ["HIPAA Compliance", "Risk Assessment", "Auditing", "Communication"],
    description: "Ensure organizations comply with legal, environmental, and financial regulations.",
    difficulty: "Intermediate",
    avgSalary: 92000
  },
  {
    title: "Paralegal",
    industry: "Legal & Government",
    industryId: "legal",
    salaryRange: "$55k – $90k",
    demand: "Stable",
    timeEstimate: "~6 months",
    skills: ["Legal Research", "Document Drafting", "Notion", "Communication"],
    description: "Conduct legal research, draft motions and briefs, and organize case files for attorneys.",
    difficulty: "Beginner",
    avgSalary: 68000
  },
  {
    title: "Graphic Designer",
    industry: "Creative & Media",
    industryId: "creative",
    salaryRange: "$50k – $85k",
    demand: "Stable",
    timeEstimate: "~6 months",
    skills: ["Figma", "Photoshop", "Illustrator", "Canva", "Communication"],
    description: "Design promotional graphics, digital layouts, brand identities, and high-quality marketing materials.",
    difficulty: "Beginner",
    avgSalary: 65000
  },
  {
    title: "Video Editor",
    industry: "Creative & Media",
    industryId: "creative",
    salaryRange: "$55k – $95k",
    demand: "High",
    timeEstimate: "~6 months",
    skills: ["Premiere Pro", "After Effects", "Audio", "Storytelling"],
    description: "Synthesize raw video footage, adding visual effects, sound layouts, and animations to tell stories.",
    difficulty: "Beginner",
    avgSalary: 72000
  },
  {
    title: "Bioinformatics Specialist",
    industry: "Science & Research",
    industryId: "science",
    salaryRange: "$80k – $135k",
    demand: "High",
    timeEstimate: "~10-12 months",
    skills: ["Python", "R", "SQL", "Statistics", "Biology"],
    description: "Analyze biological data, particularly genomic sequencing records, using mathematical models.",
    difficulty: "Advanced",
    avgSalary: 105000
  },
  {
    title: "Data Analyst",
    industry: "Science & Research",
    industryId: "science",
    salaryRange: "$65k – $110k",
    demand: "High",
    timeEstimate: "~6 months",
    skills: ["Excel", "SQL", "Tableau", "Power BI", "Statistics"],
    description: "Analyze organizational data to extract actionable trends, building dashboards for decision makers.",
    difficulty: "Beginner",
    avgSalary: 82000
  },
  {
    title: "Robotics Developer",
    industry: "Engineering",
    industryId: "engineering",
    salaryRange: "$95k – $160k",
    demand: "High",
    timeEstimate: "~12 months",
    skills: ["C++", "Python", "Linux", "ROS", "Microcontrollers"],
    description: "Design, build, and program autonomous mechanical systems and robotic controls.",
    difficulty: "Advanced",
    avgSalary: 122000
  },
  {
    title: "CAD Designer",
    industry: "Engineering",
    industryId: "engineering",
    salaryRange: "$55k – $95k",
    demand: "Stable",
    timeEstimate: "~6-8 months",
    skills: ["AutoCAD", "SolidWorks", "Blueprints", "Technical Drafting"],
    description: "Create precise 3D models and technical schematics for architectural and manufacturing builds.",
    difficulty: "Intermediate",
    avgSalary: 74000
  },
  {
    title: "Electrician & Grid Specialist",
    industry: "Trades & Skilled Labor",
    industryId: "trades",
    salaryRange: "$60k – $105k",
    demand: "High",
    timeEstimate: "~8-10 months",
    skills: ["Blueprints", "Electrical Safety", "Troubleshooting", "Local Code Compliance"],
    description: "Install, repair, and maintain electrical systems, ensuring adherence to national codes.",
    difficulty: "Intermediate",
    avgSalary: 78000
  },
  {
    title: "Accountant",
    industry: "Finance & Accounting",
    industryId: "finance",
    salaryRange: "$60k – $100k",
    demand: "Stable",
    timeEstimate: "~6-8 months",
    skills: ["Accounting", "Excel", "Tax Auditing", "QuickBooks"],
    description: "Review corporate financial records, manage tax preparations, and ensure audit compliance.",
    difficulty: "Intermediate",
    avgSalary: 76000
  },
  {
    title: "Sustainability Consultant",
    industry: "Environment & Sustainability",
    industryId: "green",
    salaryRange: "$70k – $120k",
    demand: "Growing",
    timeEstimate: "~8 months",
    skills: ["Green Auditing", "LEED standards", "Carbon Accounting", "Project Management"],
    description: "Advise organizations on how to minimize carbon footprints, comply with environmental laws, and optimize waste.",
    difficulty: "Intermediate",
    avgSalary: 88000
  }
];

export const POPULAR_COMBOS = [
  { id: "ai_builder", label: "🤖 AI Builder", roles: ["Data Scientist", "Frontend Developer"] },
  { id: "fin_data", label: "📊 Data + Finance", roles: ["Financial Analyst", "Data Scientist"] },
  { id: "designer_dev", label: "🎨 Creative Developer", roles: ["UX/UI Designer", "Frontend Developer"] },
  { id: "cloud_sec", label: "🛡️ Secure Cloud Architect", roles: ["Cloud Architect", "Cybersecurity Analyst"] }
];

export interface FeaturedExample {
  title: string;
  from: string;
  to: string;
  timeline: string;
  overlap: number;
  phasesCount: number;
  slug: string;
  roadmap: RoadmapData;
}

export const FEATURED_EXAMPLES: FeaturedExample[] = [
  {
    title: "Zero experience to Frontend Developer",
    from: "High School Grad / Beginner",
    to: "Frontend Developer",
    timeline: "6 months",
    overlap: 2,
    phasesCount: 3,
    slug: "frontend-dev-6m",
    roadmap: {
      targetRole: "Frontend Developer",
      industry: "Technology",
      totalEstimatedMonths: 6,
      hoursPerWeekAssumed: 20,
      skillMatchPercent: 15,
      summary: "This roadmap bridges the gap from raw beginner to deployment-ready Frontend Developer, skipping useless theories and targeting pure hands-on practice.",
      existingSkillsRecognized: [],
      skillGaps: [
        { skill: "HTML & CSS", priority: "critical", reason: "Foundational structure of the web." },
        { skill: "JavaScript Fundamentals", priority: "critical", reason: "Adds interactive functions to standard layouts." },
        { skill: "React UI Frame", priority: "important", reason: "Industry staple framework for constructing modern SPA states." }
      ],
      phases: [
        {
          phaseNumber: 1,
          title: "Phase 1: Visual Layout Foundations",
          durationWeeks: 8,
          objectives: ["Create semantic layout structures", "Master CSS positioning layouts", "Learn responsive web standards"],
          skills: ["HTML", "CSS", "Figma Design Tools"],
          freeResources: [
            {
              type: "video",
              title: "Responsive Web Design for Beginners",
              platform: "freeCodeCamp YouTube",
              url: "https://youtube.com",
              estimatedHours: 12,
              description: "A complete step-by-step introduction covering core layouts."
            }
          ],
          paidCourses: [
            {
              platform: "udemy",
              title: "Modern HTML & CSS From The Beginning",
              instructor: "Brad Traversy",
              priceUSD: 14.99,
              durationHours: 21,
              rating: 4.8,
              url: "https://udemy.com",
              whyRecommended: "Highly structured courses with real world layout challenges."
            }
          ],
          projects: [
            {
              title: "Stunning Portfolio Landing Card",
              description: "Create a beautiful multi-grid personal bio page detailing your career goals.",
              skills: ["HTML", "CSS"],
              difficulty: "beginner",
              portfolioValue: "Outstanding initial portfolio presentation",
              steps: ["Step 1: Code basic semantic HTML layout", "Step 2: Add CSS Flexbox and custom animations", "Step 3: Host on GitHub Pages"]
            }
          ],
          milestone: "Host your first fully-responsive, customized landing page live on GitHub.",
          weeklySchedule: "Week 1-4: Semantic HTML & Flexbox. Week 5-8: CSS Grid and hosting."
        }
      ],
      certifications: [
        {
          name: "Responsive Web Design Certificate",
          provider: "freeCodeCamp",
          examCostUSD: 0,
          prepWeeks: 8,
          priority: 1,
          url: "https://freecodecamp.org",
          isFree: true
        }
      ],
      careerProgression: [
        {
          level: "entry",
          title: "Junior Frontend Developer",
          yearsExperience: "0-1 year",
          avgSalaryUSD: 68000,
          keySkills: ["HTML/CSS", "Basic JavaScript", "Git Actions"]
        }
      ],
      jobReadinessChecklist: [
        { item: "Deploy at least 3 custom responsive pages to a live host", category: "portfolio" }
      ],
      professionalCommunities: [
        { name: "Frontend Mentors Community", type: "discord", url: "https://discord.gg" }
      ],
      careerTips: [
        "Focus on visual polish. The browser interface is your absolute calling card."
      ],
      mindMapData: {
        centralNode: "Frontend Developer",
        branches: [
          {
            id: "p1",
            label: "Phase 1: Visual Layouts",
            color: "#6366f1",
            children: [
              { id: "e1", label: "HTML Structures", type: "skill", status: "learn", children: [] },
              { id: "e2", label: "CSS Styling", type: "skill", status: "learn", children: [] }
            ]
          }
        ]
      }
    }
  }
];
