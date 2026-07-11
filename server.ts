import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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
