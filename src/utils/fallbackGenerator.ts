import { RoadmapData } from "../types";

export function generateLocalFallbackRoadmap(targetRole: string, inputSkills: string[], preferences: any): RoadmapData {
  return {
    targetRole,
    industry: "Technology",
    totalEstimatedMonths: preferences.timeline === "3 Months" ? 3 : preferences.timeline === "6 Months" ? 6 : preferences.timeline === "2 Years" ? 24 : 12,
    hoursPerWeekAssumed: preferences.hoursPerWeek || 15,
    skillMatchPercent: Math.min(Math.floor(inputSkills.length * 8 + 15), 90),
    summary: `This personalized SkillMap outlines the optimal path to transition into a ${targetRole}. By leveraging your background in ${inputSkills.slice(0, 3).join(", ") || "fundamental topics"}, we focus on high-yield skills first.`,
    existingSkillsRecognized: inputSkills.map(s => ({ skill: s, level: "intermediate" })),
    skillGaps: [
      {
        skill: `${targetRole} Core Principles`,
        priority: "critical",
        reason: "Essential starting foundation required for all subsequent work."
      },
      {
        skill: "Advanced Practical Projects",
        priority: "important",
        reason: "Crucial for establishing a portfolio to demonstrate competence."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Foundations & Core Concepts",
        durationWeeks: 4,
        objectives: ["Master core terminologies", "Set up local development environments", "Complete basic hands-on exercises"],
        skills: [`${targetRole} Basics`, "Standard Tools"],
        freeResources: [
          {
            type: "video",
            title: `Introduction to ${targetRole}`,
            platform: "YouTube (Free)",
            url: "https://youtube.com",
            estimatedHours: 6,
            description: "A complete step-by-step introduction covering core concepts."
          }
        ],
        paidCourses: [
          {
            platform: "udemy",
            title: `Masterclass in ${targetRole}`,
            instructor: "Dr. Career Expert",
            priceUSD: 14.99,
            durationHours: 24,
            rating: 4.8,
            url: "https://udemy.com",
            whyRecommended: "Highly structured courses with real quizzes and projects."
          }
        ],
        projects: [
          {
            title: "The Sandbox Sandbox",
            description: "Build a mini version using foundational principles.",
            skills: ["Basics"],
            difficulty: "beginner",
            portfolioValue: "High introductory value",
            steps: ["Step 1: Set up folder structure", "Step 2: Implement core algorithm", "Step 3: Deploy locally"]
          }
        ],
        milestone: "Successfully run and demonstrate the introductory sandbox project.",
        weeklySchedule: "Week 1-2: Core lectures. Week 3-4: Build first portfolio piece."
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Intermediate Scaling",
        durationWeeks: 6,
        objectives: ["Integrate professional databases", "Solve common bottleneck errors", "Collaborate on minor pull-requests"],
        skills: ["Database Integrations", "Intermediate Logic", "Testing Flows"],
        freeResources: [
          {
            type: "docs",
            title: "Official Documentation Guide",
            platform: "Web (Free)",
            url: "https://devdocs.io/",
            estimatedHours: 4,
            description: "Detailed overview of optimal practices and configurations."
          }
        ],
        paidCourses: [
          {
            platform: "coursera",
            title: `Professional Certificate in ${targetRole}`,
            instructor: "Industry Partners",
            priceUSD: 39.00,
            durationHours: 40,
            rating: 4.7,
            url: "https://coursera.org",
            whyRecommended: "Offers recognized certifications from top companies."
          }
        ],
        projects: [
          {
            title: "Intermediate Enterprise Application",
            description: "Implement database persistence and error logging.",
            skills: ["Database Integrations", "Intermediate Logic"],
            difficulty: "intermediate",
            portfolioValue: "Outstanding portfolio show-stopper",
            steps: ["Step 1: Wire database connection", "Step 2: Add validation rules", "Step 3: Test corner cases"]
          }
        ],
        milestone: "Deploy a live full-stack system with persistent data store.",
        weeklySchedule: "Week 1-3: DB and server logic. Week 4-6: UI polish & hosting."
      }
    ],
    certifications: [
      {
        name: `Certified ${targetRole} Associate`,
        provider: "Professional Institute",
        examCostUSD: 150,
        prepWeeks: 6,
        priority: 1,
        url: "https://www.coursera.org/",
        isFree: false
      }
    ],
    careerProgression: [
      {
        level: "entry",
        title: `Junior ${targetRole}`,
        yearsExperience: "0-2 years",
        avgSalaryUSD: 72000,
        keySkills: ["Foundational Syntax", "Basic Debugging"]
      },
      {
        level: "mid",
        title: `${targetRole}`,
        yearsExperience: "2-5 years",
        avgSalaryUSD: 105000,
        keySkills: ["Systems Design", "Performance Optimization"]
      },
      {
        level: "senior",
        title: `Senior ${targetRole}`,
        yearsExperience: "5+ years",
        avgSalaryUSD: 145000,
        keySkills: ["Architecting Solutions", "Mentoring"]
      }
    ],
    jobReadinessChecklist: [
      { item: "Build and deploy 2 unique capstone applications", category: "portfolio" },
      { item: "Incorporate clear, clean documentation in Github repository", category: "portfolio" },
      { item: "Draft a personalized cover letter emphasizing overlapping skills", category: "resume" },
      { item: "Complete 10 mock conceptual interviews on Core topics", category: "skills" }
    ],
    professionalCommunities: [
      { name: `Reddit r/${targetRole.toLowerCase().replace(/\s+/g, '')}`, type: "reddit", url: "https://reddit.com" }
    ],
    careerTips: [
      "Prioritize depth over breadth; master 2 key tools fully before learning 10 others.",
      "Document your learning path in public blog posts or social media updates to invite mentoring."
    ],
    mindMapData: {
      centralNode: targetRole,
      branches: [
        {
          id: "p1",
          label: "Phase 1: Foundations",
          color: "#6C63FF",
          children: [
            { id: "s1", label: `${targetRole} Basics`, type: "skill", status: "learn", children: [] },
            { id: "s2", label: "Standard Tools", type: "skill", status: "learn", children: [] }
          ]
        },
        {
          id: "p2",
          label: "Phase 2: Intermediate Scaling",
          color: "#00D4AA",
          children: [
            { id: "s3", label: "Database Integrations", type: "skill", status: "critical", children: [] },
            { id: "s4", label: "Testing Flows", type: "skill", status: "learn", children: [] }
          ]
        }
      ]
    }
  };
}
