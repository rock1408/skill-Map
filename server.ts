import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { CAREER_ROLES_150, slugify, INDUSTRIES_15 } from "./src/careersData";
import { BLOG_POSTS } from "./src/blogData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Local JSON-based storage for maps, users, and progress
const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Ensure data folder and db file exist
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({ users: [], roadmaps: [], progress: [] }, null, 2)
  );
}

// DB Helpers
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { users: [], roadmaps: [], progress: [] };
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Initialize Gemini SDK with telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Fallback Mock data generator if API key is missing/invalid
function generateFallbackRoadmap(targetRole: string, inputSkills: string[], preferences: any) {
  const years = preferences.timeline || "1 Year";
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

// API: Generate Roadmap using Gemini
app.post("/api/generate-roadmap", async (req, res) => {
  const { targetRole, inputSkills, preferences } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: "Target career role is required." });
  }

  const skillsStr = (inputSkills || []).join(", ") || "none listed";
  const timelineGoal = preferences?.timeline || "1 Year";
  const hoursPerWeek = preferences?.hoursPerWeek || 15;
  const learningStyles = (preferences?.learningStyle || []).join(", ") || "General";
  const budget = preferences?.budget || "Free Only";
  const currentSituation = preferences?.situation || "Starting from scratch";
  const motivation = preferences?.motivation || "Career growth";

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.log("No valid API Key. Serving high-fidelity mock custom roadmap.");
    const mockMap = generateFallbackRoadmap(targetRole, inputSkills || [], preferences || {});
    return res.json(mockMap);
  }

  const systemPrompt = `You are SkillMap AI — a world-class career coach and curriculum designer supporting ALL career fields globally. Your mission is to generate highly personalized, actionable career roadmaps in JSON format.

Analyze the user's details:
- Current skills they already know: ${skillsStr}
- Target career goal: ${targetRole}
- Available hours/week: ${hoursPerWeek}
- Preferred timeline: ${timelineGoal}
- Preferred learning styles: ${learningStyles}
- Budget constraint: ${budget}
- Current background/situation: ${currentSituation}
- Primary motivation: ${motivation}

Design a personalized roadmap with 3 learning phases specifically structured for this profile.
Recognize and validate their current skills to show them what they have. 
Highlight the remaining gaps. Provide real recommended platforms (Udemy, Coursera, edX, YouTube, freeCodeCamp, etc.) with realistic parameters.
Provide mind-map branches starting from Phase 1, Phase 2, Phase 3 with skills.

ALWAYS respond in this exact JSON format (strictly JSON, no extra text):
{
  "targetRole": "string",
  "industry": "string",
  "totalEstimatedMonths": number,
  "hoursPerWeekAssumed": number,
  "skillMatchPercent": number,
  "summary": "2-3 sentence personalized overview",
  "existingSkillsRecognized": [
    {"skill": "string", "level": "beginner|intermediate|advanced"}
  ],
  "skillGaps": [
    {
      "skill": "string",
      "priority": "critical|important|nice-to-have",
      "reason": "string"
    }
  ],
  "phases": [
    {
      "phaseNumber": number,
      "title": "string",
      "durationWeeks": number,
      "objectives": ["string"],
      "skills": ["string"],
      "freeResources": [
        {
          "type": "video|course|docs|book|community|tool",
          "title": "string",
          "platform": "string",
          "url": "string",
          "estimatedHours": number,
          "description": "string"
        }
      ],
      "paidCourses": [
        {
          "platform": "string",
          "title": "string",
          "instructor": "string",
          "priceUSD": number,
          "durationHours": number,
          "rating": number,
          "url": "string",
          "whyRecommended": "string"
        }
      ],
      "projects": [
        {
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "difficulty": "beginner|intermediate|advanced",
          "portfolioValue": "string",
          "steps": ["string"]
        }
      ],
      "milestone": "string",
      "weeklySchedule": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "provider": "string",
      "examCostUSD": number,
      "prepWeeks": number,
      "priority": number,
      "url": "string",
      "isFree": boolean
    }
  ],
  "careerProgression": [
    {
      "level": "entry|mid|senior|lead|executive",
      "title": "string",
      "yearsExperience": "string",
      "avgSalaryUSD": number,
      "keySkills": ["string"]
    }
  ],
  "jobReadinessChecklist": [
    {"item": "string", "category": "portfolio|network|resume|skills|mindset"}
  ],
  "professionalCommunities": [
    {"name": "string", "type": "discord|slack|reddit|association|meetup", "url": "string"}
  ],
  "careerTips": ["string"],
  "mindMapData": {
    "centralNode": "string",
    "branches": [
      {
        "id": "string",
        "label": "string",
        "color": "string",
        "children": [
          {
            "id": "string",
            "label": "string",
            "type": "skill|resource|project|cert",
            "status": "have|learn|critical",
            "children": []
          }
        ]
      }
    ]
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate the skill map",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Serve fallback custom roadmap if API error occurs
    const mockMap = generateFallbackRoadmap(targetRole, inputSkills || [], preferences || {});
    return res.json(mockMap);
  }
});

// Save Map
app.post("/api/save-roadmap", (req, res) => {
  const { userId, targetRole, inputSkills, preferences, roadmapJson } = req.body;
  const db = readDB();

  const id = Math.random().toString(36).substring(2, 11);
  const shareSlug = `slug-${id}`;

  const newRoadmap = {
    id,
    userId: userId || null,
    targetRole,
    inputSkills: inputSkills || [],
    preferences: preferences || {},
    roadmapJson: roadmapJson || {},
    created_at: new Date().toISOString(),
    is_public: true,
    share_slug: shareSlug,
    view_count: 0,
  };

  db.roadmaps.push(newRoadmap);
  writeDB(db);

  res.json({ id, shareSlug, success: true });
});

// Load Map
app.get("/api/load-roadmap/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const roadmap = db.roadmaps.find((r: any) => r.id === id || r.share_slug === id);
  if (!roadmap) {
    return res.status(404).json({ error: "Roadmap not found" });
  }

  roadmap.view_count += 1;
  writeDB(db);

  res.json(roadmap);
});

// Load progress proofs for a roadmap
app.get("/api/load-proofs/:roadmapId", (req, res) => {
  const { roadmapId } = req.params;
  const db = readDB();
  const proofs = (db.progress || []).filter((p: any) => p.roadmapId === roadmapId);
  res.json(proofs);
});

// Save a progress proof for a roadmap node
app.post("/api/save-proof", (req, res) => {
  const { userId, roadmapId, skillName, proofType, proofImage, aiPrompt } = req.body;
  
  if (!roadmapId || !skillName || !proofImage) {
    return res.status(400).json({ error: "RoadmapId, skillName, and proofImage are required." });
  }

  const db = readDB();
  if (!db.progress) {
    db.progress = [];
  }

  // Find existing proof to overwrite or create new
  const index = db.progress.findIndex(
    (p: any) => p.roadmapId === roadmapId && p.skillName.toLowerCase() === skillName.toLowerCase()
  );

  const proofItem = {
    id: Math.random().toString(36).substring(2, 11),
    userId: userId || null,
    roadmapId,
    skillName,
    proofType,
    proofImage,
    aiPrompt: aiPrompt || "",
    verifiedAt: new Date().toISOString()
  };

  if (index >= 0) {
    db.progress[index] = { ...db.progress[index], ...proofItem };
  } else {
    db.progress.push(proofItem);
  }

  writeDB(db);
  res.json({ success: true, proof: proofItem });
});

// AI-Generated Project Proof Schematic Image Placeholder
app.post("/api/generate-proof-placeholder", async (req, res) => {
  const { skillName, prompt } = req.body;

  if (!skillName) {
    return res.status(400).json({ error: "skillName is required." });
  }

  const desc = prompt || `Development workspace and tests demonstrating mastery of ${skillName}`;

  // If Gemini API Key is available, let's ask Gemini to write a custom technical SVG
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    const systemPrompt = `You are a technical designer and developer. Your task is to generate a highly detailed, visually stunning SVG schematic/blueprint that serves as a visual "proof of project completion" for the skill "${skillName}".
Based on the user's project description: "${desc}", draw a clean, stylized blueprint, dashboard, flowchart, or technical diagram.
Aesthetic specifications:
- Canvas size: width="600" height="400" viewbox="0 0 600 400"
- Background: A modern, ultra-sleek dark gray/black workspace (#0d0e12 or #12131a)
- Lines/Accents: Use glowing neon lines with colors like teal (#34d399), indigo (#6366f1), or emerald (#10b981)
- Content: Draw multiple schematic elements, tech nodes, line charts representing analytics, database blocks, or styled code mockups
- Text: Include clear labels, e.g., "SKILL VERIFIED: ${skillName}", "SCHEMATIC DESIGN PROOF", and elements from the project description.
- Header: A technical HUD status bar at the top or side: "STATUS: VERIFIED // PORTFOLIO ID: PROOF-982A"

OUTPUT RULE:
Return ONLY valid, raw SVG XML code starting with <svg and ending with </svg>. Do NOT include any markdown code block wraps (like \`\`\`xml or \`\`\`svg), do NOT write any explanation or intro. Just raw SVG content.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create the verification schematic for skill: ${skillName}. User project details: ${desc}`,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      let svgText = response.text || "";
      // Clean up markdown wraps if model generated them
      svgText = svgText.replace(/```xml/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();
      if (svgText.startsWith("<svg") || svgText.includes("<svg")) {
        return res.json({ svg: svgText });
      }
    } catch (error) {
      console.error("Gemini Proof Gen failed, using high-fidelity fallback:", error);
    }
  }

  // Fallback high-fidelity programmatic technical SVG generator
  const cleanSkill = skillName.toUpperCase();
  const cleanDesc = desc.substring(0, 100) + (desc.length > 100 ? "..." : "");
  
  // Custom neon tech graphics based on skill name length or modulo
  const modulo = cleanSkill.length % 3;
  let accentColor = "#34d399"; // Teal
  let accentSecondary = "#6366f1"; // Indigo
  if (modulo === 1) {
    accentColor = "#38bdf8"; // Sky
    accentSecondary = "#a855f7"; // Purple
  } else if (modulo === 2) {
    accentColor = "#fbbf24"; // Amber
    accentSecondary = "#f43f5e"; // Rose
  }

  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <!-- Base dark background -->
    <rect width="600" height="400" rx="16" fill="#0d0e12" />
    <defs>
      <!-- Tech Grid Pattern -->
      <pattern id="tech-grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
      <!-- Glow filter -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <!-- Background grid -->
    <rect width="600" height="400" rx="16" fill="url(#tech-grid)" />
    
    <!-- HUD Header Status -->
    <rect x="25" y="25" width="550" height="35" rx="6" fill="#181920" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <circle cx="45" cy="42" r="5" fill="#34d399" filter="url(#glow)" />
    <text x="60" y="47" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="1">SYSTEM STATUS: VERIFIED</text>
    <text x="440" y="46" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10">REF-ID: SM-${Math.floor(Math.random() * 900000 + 100000)}</text>
    
    <!-- Content Card -->
    <rect x="25" y="75" width="550" height="300" rx="10" fill="rgba(24, 25, 32, 0.4)" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    
    <!-- Code Bracket Visuals -->
    <path d="M 45 120 L 45 105 L 80 105" fill="none" stroke="${accentColor}" stroke-width="2" />
    <path d="M 555 120 L 555 105 L 520 105" fill="none" stroke="${accentColor}" stroke-width="2" />
    <path d="M 45 330 L 45 345 L 80 345" fill="none" stroke="${accentColor}" stroke-width="2" />
    <path d="M 555 330 L 555 345 L 520 345" fill="none" stroke="${accentColor}" stroke-width="2" />
    
    <!-- Central HUD Circle -->
    <circle cx="300" cy="200" r="65" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="6" />
    <circle cx="300" cy="200" r="60" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="10, 15" />
    <circle cx="300" cy="200" r="50" fill="none" stroke="${accentSecondary}" stroke-width="2" />
    <polygon points="290,190 315,200 290,210" fill="${accentColor}" filter="url(#glow)" />
    
    <!-- Surrounding Nodes and Connections -->
    <g stroke="rgba(255,255,255,0.1)" stroke-width="1.5">
      <line x1="160" y1="200" x2="235" y2="200" />
      <line x1="365" y1="200" x2="440" y2="200" />
      <line x1="300" y1="115" x2="300" y2="135" />
    </g>
    
    <!-- Left Node -->
    <rect x="75" y="175" width="85" height="45" rx="6" fill="#181920" stroke="${accentColor}" stroke-width="1" />
    <text x="117" y="195" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="9" font-weight="bold">COMPLIANT</text>
    <text x="117" y="210" text-anchor="middle" fill="${accentColor}" font-family="monospace" font-size="8">TESTS PASS</text>

    <!-- Right Node -->
    <rect x="440" y="175" width="85" height="45" rx="6" fill="#181920" stroke="${accentSecondary}" stroke-width="1" />
    <text x="482" y="195" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="9" font-weight="bold">DEPLOYED</text>
    <text x="482" y="210" text-anchor="middle" fill="${accentSecondary}" font-family="monospace" font-size="8">PRODUCTION</text>

    <!-- Verification Main Typography -->
    <text x="300" y="290" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="extrabold" letter-spacing="1">${cleanSkill}</text>
    <text x="300" y="310" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="11" italic="true">"${cleanDesc}"</text>
    
    <!-- Decorative waveforms or analytics at the bottom -->
    <path d="M 60 340 Q 120 310 180 330 T 300 320 T 420 340 T 540 330" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3" />
    <path d="M 60 340 Q 120 310 180 330 T 300 320 T 420 340 T 540 330" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.6" stroke-dasharray="4, 4" />
  </svg>`;

  res.json({ svg: fallbackSvg });
});

// Authentication APIs
app.post("/api/signup", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const db = readDB();
  const exists = db.users.find((u: any) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const newUser = {
    id: Math.random().toString(36).substring(2, 11),
    email,
    password, // Plain for mock purposes
    name,
    avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, avatar_url: newUser.avatar_url } });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  res.json({ user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url } });
});

// List saved roadmaps for dashboard
app.get("/api/saved-roadmaps/:userId", (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  const maps = db.roadmaps.filter((r: any) => r.userId === userId);
  res.json(maps);
});

// --- BEGIN SEO & ADSENSE PRERENDER ENGINE ---

function generateCareerPreRender(role: any) {
  const slug = slugify(role.title);
  const related = CAREER_ROLES_150
    .filter(r => r.industryId === role.industryId && r.title !== role.title)
    .slice(0, 4);
  
  return `
    <article>
      <h1>How to Become a ${role.title}</h1>
      <p>Discover the comprehensive, step-by-step career transition guide to become a professional <strong>${role.title}</strong> in the <strong>${role.industry}</strong> industry. Whether you are switching careers with no prior experience or leveling up your existing skill set, this guide outlines everything you need to succeed.</p>
      
      <section>
        <h2>Salary Range and Market Demand</h2>
        <p>The average salary for a ${role.title} is approximately <strong>$${role.avgSalary.toLocaleString()}</strong> per year, with typical salary bands ranging from <strong>${role.salaryRange}</strong>. Due to rapid industry shifts, market demand for this role is currently rated as <strong>${role.demand}</strong>, offering long-term stability and extensive growth potential.</p>
      </section>

      <section>
        <h2>Day-in-the-Life & Key Responsibilities</h2>
        <p>${role.description}</p>
        <p>On a daily basis, a professional in this role collaborates with cross-functional stakeholders, runs technical diagnostics or planning loops, reviews performance metrics, and implements solutions using specialized industry tools.</p>
      </section>

      <section>
        <h2>Core Skills & Competencies Required</h2>
        <p>To successfully transition into this field, you must master the following core competencies:</p>
        <ul>
          ${role.skills.map((s: string) => `<li><strong>${s}:</strong> Essential for daily operations and completing core project deliverables.</li>`).join("")}
        </ul>
      </section>
      
      <section>
        <h2>Step-by-Step Learning and Career Transition Plan</h2>
        <p>Our recommended learning schedule spans approximately <strong>${role.timeEstimate}</strong> of dedicated study, structured into three progressive phases:</p>
        
        <h3>Phase 1: Foundation Building</h3>
        <p>Focus on mastering core terminology, visual frameworks, and basic tools. Dedicate 10-15 hours per week to understand the basic mechanics of the discipline.</p>
        
        <h3>Phase 2: Intermediate Scaling & Projects</h3>
        <p>Incorporate more complex systems, databases, or project management methodologies. Focus on building real-world projects that demonstrate your practical capacity to solve problems.</p>
        
        <h3>Phase 3: Deployment, Portfolios, & Job Readiness</h3>
        <p>Compile your completed projects into a structured, responsive personal portfolio. Undertake mock interviews, refine your resume to highlight transferable skills, and start networking in specialized communities.</p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <div>
          <h3>How long does it take to become a ${role.title}?</h3>
          <p>Typically, it takes about ${role.timeEstimate} of focused, daily study (around 15-20 hours per week) to build a competitive entry-level portfolio.</p>
        </div>
        <div>
          <h3>Do I need a college degree to work as a ${role.title}?</h3>
          <p>No. Most modern employers in this field prioritize verified skills and a strong practical portfolio over traditional academic degrees.</p>
        </div>
        <div>
          <h3>What are the most critical skills to learn first?</h3>
          <p>The most critical starting skills are: ${role.skills.slice(0, 3).join(", ")}.</p>
        </div>
      </section>
      
      <section>
        <h2>Related Career Fields</h2>
        <ul>
          ${related.map(r => `<li><a href="/careers/${slugify(r.title)}">${r.title}</a> - Average Salary: $${r.avgSalary.toLocaleString()}</li>`).join("")}
        </ul>
      </section>
      
      <p><a href="/?role=${encodeURIComponent(role.title)}">Click here to generate a fully customized, AI-powered interactive SkillMap mind-map for ${role.title}!</a></p>
    </article>
  `;
}

function generateCareerSchema(role: any) {
  const slug = slugify(role.title);
  const url = `https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/careers/${slug}`;
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": `How to Become a ${role.title} | Career Roadmap, Salary & Skills | SkillMap`,
        "description": `Learn how to become a ${role.title}. Discover average salaries ($${role.avgSalary}), market demand, and expected preparation timelines.`
      },
      {
        "@type": "HowTo",
        "name": `How to Become a ${role.title}`,
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        },
        "totalTime": `P${role.timeEstimate.includes("10") ? "10M" : "6M"}`,
        "step": [
          {
            "@type": "HowToStep",
            "name": "Phase 1: Foundations",
            "text": `Master core terminologies and initial concepts of ${role.title}.`
          },
          {
            "@type": "HowToStep",
            "name": "Phase 2: Projects & Portfolios",
            "text": "Build practical projects solving actual business challenges."
          },
          {
            "@type": "HowToStep",
            "name": "Phase 3: Job Application & Verification",
            "text": "Optimize your resume, prepare mock interviews, and begin networking."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How long does it take to become a ${role.title}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Typically, it takes about ${role.timeEstimate} of focused, daily study to build a competitive portfolio.`
            }
          },
          {
            "@type": "Question",
            "name": `Do I need a college degree to work as a ${role.title}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Most modern employers in this field prioritize verified skills and a strong practical portfolio over traditional academic degrees."
            }
          }
        ]
      }
    ]
  });
}

function generateBlogPreRender(post: any) {
  return `
    <article>
      <h1>${post.title}</h1>
      <p>Written by <strong>${post.author}</strong> on <strong>${post.date}</strong> in <strong>${post.category}</strong></p>
      <hr />
      <div class="blog-body-content">
        ${post.content}
      </div>
      <hr />
      <p><a href="/explore">Explore over 150+ interactive career paths on SkillMap!</a></p>
    </article>
  `;
}

function generateBlogSchema(post: any) {
  const url = `https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/blog/${post.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": post.title,
    "description": post.description,
    "datePublished": "2026-07-10T12:00:00Z",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkillMap",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/logo-assets.png"
      }
    }
  });
}

function injectSEO(html: string, seo: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  schemaJson?: string;
  extraContent?: string;
}) {
  let modified = html;
  
  // Replace title
  if (modified.includes("<title>")) {
    modified = modified.replace(/<title>.*?<\/title>/gi, `<title>${seo.title}</title>`);
  } else {
    modified = modified.replace("<head>", `<head><title>${seo.title}</title>`);
  }

  // Inject meta tags
  const metaTags = `
    <meta name="description" content="${seo.description.replace(/"/g, '&quot;')}" />
    <link rel="canonical" href="${seo.canonicalUrl}" />
    <meta property="og:title" content="${seo.title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${seo.description.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${seo.canonicalUrl}" />
    <meta property="og:type" content="${seo.ogType || 'website'}" />
    <meta property="og:image" content="${seo.ogImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}" />
    <meta property="og:site_name" content="SkillMap" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${seo.description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${seo.ogImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}" />
    ${seo.schemaJson ? `<script type="application/ld+json">${seo.schemaJson}</script>` : ''}
  `;

  modified = modified.replace("</head>", `${metaTags}\n</head>`);

  if (seo.extraContent) {
    const crawlerContent = `
      <div id="seo-crawler-content" style="display: none; visibility: hidden;" aria-hidden="true">
        ${seo.extraContent}
      </div>
    `;
    modified = modified.replace('<div id="root">', `<div id="root">\n${crawlerContent}`);
  }

  return modified;
}

function serveSEOPage(req: express.Request, res: express.Response, seoData: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  schemaJson?: string;
  extraContent?: string;
}) {
  const isProd = process.env.NODE_ENV === "production";
  const templatePath = isProd 
    ? path.join(process.cwd(), "dist", "index.html")
    : path.join(process.cwd(), "index.html");

  if (fs.existsSync(templatePath)) {
    let html = fs.readFileSync(templatePath, "utf-8");
    
    // In dev, inject Vite client scripts
    if (!isProd && !html.includes("/src/main.tsx")) {
      html = html.replace("</body>", `<script type="module" src="/src/main.tsx"></script>\n</body>`);
    }

    const modified = injectSEO(html, seoData);
    return res.send(modified);
  } else {
    return res.send(`<!DOCTYPE html><html lang="en"><head><title>${seoData.title}</title><meta name="description" content="${seoData.description}" /></head><body><div id="root"><h1>${seoData.title}</h1>${seoData.extraContent || ""}</div></body></html>`);
  }
}

// --- XML SITEMAP & ROBOTS.TXT ENDPOINTS ---

app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  const baseUrl = "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app";
  
  const staticPages = [
    "",
    "explore",
    "compare",
    "examples",
    "about",
    "contact",
    "privacy-policy",
    "terms-of-service",
    "cookie-policy"
  ];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  staticPages.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
  });
  
  CAREER_ROLES_150.forEach(role => {
    const slug = slugify(role.title);
    xml += `  <url>\n    <loc>${baseUrl}/careers/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });
  
  BLOG_POSTS.forEach(post => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });
  
  xml += `</urlset>`;
  res.send(xml);
});

app.get("/robots.txt", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/sitemap.xml
`);
});

// --- SEO ROUTE CONTROLLERS ---

app.get("/explore", (req, res) => {
  const canonicalUrl = "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/explore";
  const directoryHtml = `
    <h1>Explore High-Demand Careers & Skill Maps</h1>
    <p>Browse our directory of over 150 professional career paths in 15 distinct sectors, fully calibrated with salary indices and learning requirements.</p>
    <ul>
      ${CAREER_ROLES_150.map(r => `<li><a href="/careers/${slugify(r.title)}">${r.title}</a> in <strong>${r.industry}</strong> (Average Salary: $${r.avgSalary.toLocaleString()}, Difficulty: ${r.difficulty})</li>`).join("")}
    </ul>
  `;
  
  serveSEOPage(req, res, {
    title: "Explore 150+ Career Tracks & Roadmaps | SkillMap",
    description: "Discover high-paying, high-demand careers across 15 industries. Evaluate average salaries, difficulties, and expected transition timeframes.",
    canonicalUrl,
    extraContent: directoryHtml
  });
});

app.get("/compare", (req, res) => {
  serveSEOPage(req, res, {
    title: "Compare Career Paths & Salaries Side-by-Side | SkillMap",
    description: "Directly compare multiple career pathways to evaluate prep times, salary ranges, learning difficulties, and required tool competencies.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/compare",
    extraContent: `<h1>Compare Careers</h1><p>Compare salaries, prep timelines, and core skills requirements side-by-side to make your perfect career pivot decision.</p>`
  });
});

app.get("/examples", (req, res) => {
  serveSEOPage(req, res, {
    title: "Success Career Pivot Roadmap Examples | SkillMap",
    description: "Browse curated, pre-verified career transition pathways from zero experience to frontend developers and machine learning specialists.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/examples",
    extraContent: `<h1>Success Story Gallery</h1><p>Learn how thousands of students leverage overlapping skill nodes to break into competitive technical, business, and trades spaces.</p>`
  });
});

app.get("/about", (req, res) => {
  serveSEOPage(req, res, {
    title: "About SkillMap AI | Demographics of Modern Career Transitions",
    description: "Learn about the mission behind SkillMap AI: enabling high-yield career pivots through verified visual skill paths and AI-powered guides.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/about",
    extraContent: `
      <h1>About Us</h1>
      <p>SkillMap democratizes vocational development through beautiful, verified interactive maps. We help users target and build exactly what hiring managers demand.</p>
    `
  });
});

app.get("/contact", (req, res) => {
  serveSEOPage(req, res, {
    title: "Contact Support & Corporate Partnerships | SkillMap",
    description: "Get in touch with SkillMap's user support, partnership directors, or administrative operations.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/contact",
    extraContent: `<h1>Contact SkillMap</h1><p>Reach out to us via email at support@skillmap.ai for inquiries, suggestions, and partnership opportunities.</p>`
  });
});

app.get("/privacy-policy", (req, res) => {
  serveSEOPage(req, res, {
    title: "Privacy Policy | SkillMap AdSense Compliance & Cookie Disclosures",
    description: "Read the SkillMap privacy guidelines regarding user session security, local caches, and Google AdSense cookie utilization.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/privacy-policy",
    extraContent: `
      <h1>Privacy Policy</h1>
      <p>This policy details our data tracking parameters. This site utilizes third-party advertising cookies via Google AdSense to serve personalized ads based on your web browsing history.</p>
    `
  });
});

app.get("/terms-of-service", (req, res) => {
  serveSEOPage(req, res, {
    title: "Terms of Service | SkillMap Platform Usage Policies",
    description: "Read the official legal agreement governing user capabilities and roadmap generation rules.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/terms-of-service",
    extraContent: `<h1>Terms of Service</h1><p>By using SkillMap, you agree to comply with our fair-use generation limits and user guidelines.</p>`
  });
});

app.get("/cookie-policy", (req, res) => {
  serveSEOPage(req, res, {
    title: "Cookie Policy | Third-Party Tracking Controls | SkillMap",
    description: "Learn how cookies and state tokens are utilized on SkillMap to provide optimal responsive services.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/cookie-policy",
    extraContent: `<h1>Cookie Policy</h1><p>We use essential local state cookies and third-party advertising cookies via Google AdSense to serve target ads.</p>`
  });
});

app.get(["/deals", "/recommended-courses"], (req, res) => {
  serveSEOPage(req, res, {
    title: "Special Partner Offers & Recommended Video Course Deals | SkillMap",
    description: "Browse our hand-selected catalog of premium affiliate courses from industry-leading instructors on Udemy. Accelerate your career shift today with verified resources.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/deals",
    extraContent: `<h1>Udemy Curated Career Video Courses</h1><p>Skip months of endless searching. Enroll in professional courses for AWS, Full Stack Web Development, Azure, and Cybersecurity with exclusive partner discounts.</p>`
  });
});

app.get("/careers/:slug", (req, res) => {
  const { slug } = req.params;
  const role = CAREER_ROLES_150.find(r => slugify(r.title) === slug);
  
  if (!role) {
    return res.status(404).send(`<!DOCTYPE html><html><body><h1>Career Not Found</h1><p>Browse our <a href="/explore">directory</a> for high-demand tracks.</p></body></html>`);
  }
  
  const title = `How to Become a ${role.title} | Career Roadmap & Salary | SkillMap`;
  const description = `Learn how to become a ${role.title}. Discover average salaries ($${role.avgSalary.toLocaleString()}), prep timelines, skills, and daily responsibilities.`;
  const canonicalUrl = `https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/careers/${slug}`;
  
  serveSEOPage(req, res, {
    title,
    description,
    canonicalUrl,
    schemaJson: generateCareerSchema(role),
    extraContent: generateCareerPreRender(role)
  });
});

app.get("/blog/:slug", (req, res) => {
  const { slug } = req.params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  
  if (!post) {
    return res.status(404).send(`<!DOCTYPE html><html><body><h1>Article Not Found</h1><p>Read our latest releases on our <a href="/">homepage</a>.</p></body></html>`);
  }
  
  serveSEOPage(req, res, {
    title: `${post.title} | SkillMap Career Blog`,
    description: post.description,
    canonicalUrl: `https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/blog/${slug}`,
    schemaJson: generateBlogSchema(post),
    extraContent: generateBlogPreRender(post)
  });
});

app.get("/share/:slug", (req, res) => {
  const { slug } = req.params;
  const db = readDB();
  const mapObj = db.roadmaps.find((r: any) => r.share_slug === slug || r.id === slug);
  
  if (!mapObj) {
    return res.status(404).send(`<!DOCTYPE html><html><body><h1>Shared Roadmap Not Found</h1><p>Create yours now on <a href="/">SkillMap</a>.</p></body></html>`);
  }
  
  serveSEOPage(req, res, {
    title: `Personalized ${mapObj.targetRole} Career SkillMap | Shared Roadmap`,
    description: `Check out this custom-generated interactive roadmap outlining the optimal path to transition into a ${mapObj.targetRole}, featuring visual nodes and metrics.`,
    canonicalUrl: `https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app/share/${slug}`,
    extraContent: `<h1>Shared ${mapObj.targetRole} Roadmap</h1><p>${mapObj.roadmapJson.summary || ''}</p>`
  });
});

// App fallback for simple root URLs to serve optimized home meta
app.get("/", (req, res, next) => {
  // If request contains sub-assets (like /@vite/client or index.css), let Vite handle it
  if (req.path !== "/" && req.path !== "/index.html") {
    return next();
  }
  
  const homeHtml = `
    <h1>SkillMap AI | Personalized Interactive Career Roadmaps</h1>
    <p>Empower your vocational development with AI-designed learning pathways. Assess overlapping competencies, design custom milestones, and verify project completions.</p>
    <h2>Our Top Career Sectors</h2>
    <ul>
      ${INDUSTRIES_15.map(i => `<li>${i.icon} ${i.name} - Explore and build tailored paths.</li>`).join("")}
    </ul>
    <h2>Trending Roles</h2>
    <ul>
      <li>Frontend Developer - $108,000 average salary</li>
      <li>Data Scientist - $125,000 average salary</li>
      <li>Cloud Architect - $142,000 average salary</li>
      <li>Cybersecurity Analyst - $110,000 average salary</li>
    </ul>
  `;
  
  serveSEOPage(req, res, {
    title: "SkillMap AI | Personalized Interactive Career Roadmaps & Skill Gap Analysis",
    description: "Map your skills to your dream career. Use our AI-powered roadmap builder to analyze skill gaps, explore career paths, and build interactive mind-maps with step-by-step milestones.",
    canonicalUrl: "https://ais-pre-q2wy5kdffayqzvecdvmlvs-1031936644051.asia-southeast1.run.app",
    extraContent: homeHtml
  });
});

// --- END SEO & ADSENSE PRERENDER ENGINE ---

// Serve frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillMap backend running on port ${PORT}`);
  });
}

startServer();
