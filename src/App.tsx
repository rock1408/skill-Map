import React, { useState, useEffect } from "react";
import { 
  Network, Compass, Award, HelpCircle, LogIn, LayoutDashboard, 
  MapPin, Check, ExternalLink, RefreshCw, Star, Info, Share2, 
  Linkedin, Twitter, Copy, ArrowRight, ShieldCheck, TrendingUp, Users, Flame
} from "lucide-react";
import Navbar from "./components/Navbar";
import SkillTagInput from "./components/SkillTagInput";
import MultiCareerPicker from "./components/MultiCareerPicker";
import PreferencesForm from "./components/PreferencesForm";
import GenerationLoader from "./components/GenerationLoader";
import SkillMapCanvas from "./components/SkillMapCanvas";
import RoadmapList from "./components/RoadmapList";
import SalaryChart from "./components/SalaryChart";
import ProjectProofModal from "./components/ProjectProofModal";
import { User, Preferences, RoadmapData, SavedRoadmap } from "./types";
import { CAREER_ROLES, FEATURED_EXAMPLES, INDUSTRIES, SKILLS_DATABASE } from "./data";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [savedMaps, setSavedMaps] = useState<SavedRoadmap[]>([]);
  
  // Generator states
  const [generatorStep, setGeneratorStep] = useState<number>(1);
  const [inputSkills, setInputSkills] = useState<{ name: string; proficiency: "beginner" | "intermediate" | "advanced" }[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    timeline: "1 Year",
    hoursPerWeek: 15,
    learningStyle: ["video", "project"],
    budget: "Free Only",
    situation: "Starting from scratch",
    motivation: "Career shift"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Roadmap viewer states
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData | null>(null);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [inProgressNodes, setInProgressNodes] = useState<string[]>([]);
  const [roadmapView, setRoadmapView] = useState<"map" | "list">("map");

  // Project Verification Proof States
  const [proofs, setProofs] = useState<any[]>([]);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [activeProofSkillName, setActiveProofSkillName] = useState("");

  useEffect(() => {
    if (activeRoadmapId) {
      fetch(`/api/load-proofs/${activeRoadmapId}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setProofs(data))
        .catch((err) => console.error("Failed to load proofs:", err));
    } else {
      setProofs([]);
    }
  }, [activeRoadmapId]);

  const handleToggleCompletedState = (skillName: string, shouldBeCompleted: boolean) => {
    if (shouldBeCompleted) {
      setCompletedNodes((prev) => (prev.includes(skillName) ? prev : [...prev, skillName]));
      setInProgressNodes((prev) => prev.filter((s) => s !== skillName));
    } else {
      setCompletedNodes((prev) => prev.filter((s) => s !== skillName));
    }
  };

  const handleProofSaved = (newProof: any) => {
    setProofs((prev) => {
      const idx = prev.findIndex((p) => p.skillName.toLowerCase() === newProof.skillName.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newProof;
        return copy;
      }
      return [...prev, newProof];
    });
  };

  const handleProofDeleted = (skillName: string) => {
    setProofs((prev) => prev.filter((p) => p.skillName.toLowerCase() !== skillName.toLowerCase()));
  };

  // Auth States
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Compare Tool states
  const [compareA, setCompareA] = useState<string>("Data Scientist");
  const [compareB, setCompareB] = useState<string>("UX/UI Designer");

  // Explore preview modal
  const [previewRole, setPreviewRole] = useState<string | null>(null);

  // Selected industry state
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  // Sharing copy state
  const [copiedShare, setCopiedShare] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("skillmap_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      loadSavedMaps(parsed.id);
    }
  }, []);

  const loadSavedMaps = async (userId: string) => {
    try {
      const res = await fetch(`/api/saved-roadmaps/${userId}`);
      if (res.ok) {
        const maps = await res.json();
        setSavedMaps(maps);
      }
    } catch (err) {
      console.error("Failed to load saved roadmaps:", err);
    }
  };

  // Trigger Auth Actions
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword, name: authName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      
      setUser(data.user);
      localStorage.setItem("skillmap_user", JSON.stringify(data.user));
      setCurrentPage("landing");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setUser(data.user);
      localStorage.setItem("skillmap_user", JSON.stringify(data.user));
      loadSavedMaps(data.user.id);
      setCurrentPage("landing");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSavedMaps([]);
    localStorage.removeItem("skillmap_user");
    setCurrentPage("landing");
  };

  // Generate Career Roadmap via backend proxy
  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    setGeneratorStep(4); // Loader screen

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: selectedCareers[0], // primary choice
          inputSkills: inputSkills.map(s => s.name),
          preferences
        })
      });
      const data = await res.json();
      
      setActiveRoadmap(data);
      // Automatically pre-populate some completed nodes based on user recognized inputs
      setCompletedNodes(inputSkills.filter(s => s.proficiency === "advanced" || s.proficiency === "intermediate").map(s => s.name));
      setInProgressNodes(inputSkills.filter(s => s.proficiency === "beginner").map(s => s.name));

      // Save generated roadmap automatically
      const saveRes = await fetch("/api/save-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          targetRole: selectedCareers[0],
          inputSkills: inputSkills.map(s => s.name),
          preferences,
          roadmapJson: data
        })
      });

      if (saveRes.ok) {
        const savedData = await saveRes.json();
        setActiveRoadmapId(savedData.shareSlug);
        if (user) loadSavedMaps(user.id);
      }

      setIsGenerating(false);
      setCurrentPage("roadmap");
    } catch (err) {
      console.error("Roadmap Generation failed", err);
      setIsGenerating(false);
      setGeneratorStep(3); // return to preferences on failure
    }
  };

  // Load Example Roadmap immediately
  const handleLoadExample = (example: typeof FEATURED_EXAMPLES[0]) => {
    setActiveRoadmap(example.roadmap);
    setCompletedNodes([]);
    setInProgressNodes([]);
    setActiveRoadmapId(`ex-${example.slug}`);
    setCurrentPage("roadmap");
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${activeRoadmapId}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Dynamic progress calculations for active map
  const activeTotalSkills = activeRoadmap
    ? activeRoadmap.phases.reduce((sum, phase) => sum + (phase.skills?.length || 0), 0)
    : 0;
  const activeCompletedSkillsCount = activeRoadmap
    ? activeRoadmap.phases.reduce(
        (sum, phase) => sum + (phase.skills?.filter((s) => completedNodes.includes(s)).length || 0),
        0
      )
    : 0;
  const activeProgressPercent = activeTotalSkills === 0 ? 0 : Math.round((activeCompletedSkillsCount / activeTotalSkills) * 100);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-body font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Mesh Gradients for Frosted Glass Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      {/* 1. Global Navigation */}
      <div className="relative z-10 w-full">
        <Navbar
          user={user}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
          onLogout={handleLogout}
        />
      </div>

      {/* 2. Main Page Router Router container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        
        {/* =======================================
            PAGE: LANDING
            ======================================= */}
        {currentPage === "landing" && (
          <div className="space-y-24">
            
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
              {/* Hero details (60%) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary-light text-xs font-mono font-bold tracking-wide uppercase">
                  ✦ 100% Free — No Credit Card Ever
                </span>
                
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  Map Your Skills To <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                    Your Dream Career.
                  </span>
                </h1>

                <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
                  Enter what you know. Select where you want to go. SkillMap's AI models instantly construct your custom visual career mind-map, highlighting crucial skill gaps, milestones, and certified pipelines — 100% free.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => {
                      setInputSkills([]);
                      setSelectedCareers([]);
                      setGeneratorStep(1);
                      setCurrentPage("map");
                    }}
                    className="px-8 py-4 rounded-xl font-bold text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/45 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    🗺️ Build My SkillMap →
                  </button>
                  <button
                    onClick={() => setCurrentPage("examples")}
                    className="px-8 py-4 rounded-xl font-semibold border border-white/10 hover:border-brand-primary/50 text-white bg-white/5 hover:bg-brand-surface transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    👀 See Example Maps
                  </button>
                </div>

                {/* Trust Signals bar */}
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-brand-muted">
                  <span>✓ 200+ Career Tracks</span>
                  <span>✓ 30 Industries</span>
                  <span>✓ AI-Powered</span>
                  <span>✓ Always Free Forever</span>
                </div>
              </div>

              {/* Hero interactive animated SVG constellation (40%) */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-brand-surface border border-white/8 shadow-2xl flex items-center justify-center p-6 overflow-hidden pulse-glow">
                  {/* Glowing core background */}
                  <div className="absolute w-24 h-24 bg-brand-primary/25 rounded-full blur-3xl" />
                  
                  {/* Constellation Canvas SVG */}
                  <svg className="w-full h-full relative" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="16" className="fill-brand-bg stroke-brand-primary stroke-[2]" />
                    <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Primary Goal</text>

                    {/* Nodes radiating */}
                    {[
                      { x: 40, y: 50, label: "Figma", color: "#34d399" },
                      { x: 160, y: 70, label: "React", color: "#6366f1" },
                      { x: 60, y: 150, label: "CSS Layout", color: "#fbbf24" },
                      { x: 140, y: 140, label: "TypeScript", color: "#a855f7" }
                    ].map((n, i) => (
                      <g key={i}>
                        <line x1="100" y1="100" x2={n.x} y2={n.y} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" strokeDasharray="3,3" />
                        <circle cx={n.x} cy={n.y} r="10" className="fill-brand-bg stroke-[1.5]" stroke={n.color} />
                        <text x={n.x} y={n.y + 18} textAnchor="middle" fill="#a1a1aa" fontSize="8" fontFamily="monospace">{n.label}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* STATS SECTION */}
            <div className="p-8 bg-brand-surface border border-white/5 rounded-3xl grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-brand-secondary">50,000+</span>
                <span className="block text-xs font-mono text-brand-muted uppercase">Maps Generated</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-brand-primary-light">200+</span>
                <span className="block text-xs font-mono text-brand-muted uppercase">Career Tracks</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-brand-secondary">30+</span>
                <span className="block text-xs font-mono text-brand-muted uppercase">Industries</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-brand-warning">4.9/5</span>
                <span className="block text-xs font-mono text-brand-muted uppercase">User Rating</span>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-1">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-white">100% Free</span>
                <span className="block text-xs font-mono text-brand-muted uppercase">No Paid Plans</span>
              </div>
            </div>

            {/* THREE STEPS ROADMAP */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="font-display font-bold text-3xl text-white tracking-tight">How SkillMap Works</h2>
                <p className="text-brand-muted text-sm max-w-xl mx-auto">Get your custom career timeline and matching resources in three simple, interactive steps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-brand-surface border border-white/5 hover:border-white/10 rounded-2xl space-y-4 text-left transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold font-mono text-lg">
                    1
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Add Your Current Skills</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Tell SkillMap what you already know — tools, frameworks, soft skills, certifications, degrees, or years of work experience.
                  </p>
                </div>

                <div className="p-6 bg-brand-surface border border-white/5 hover:border-white/10 rounded-2xl space-y-4 text-left transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary font-bold font-mono text-lg">
                    2
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Pick Target Roles</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Choose up to 4 target careers across any field. SkillMap analyzes their skill requirements to construct an optimized overlap path.
                  </p>
                </div>

                <div className="p-6 bg-brand-surface border border-white/5 hover:border-white/10 rounded-2xl space-y-4 text-left transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold font-mono text-lg">
                    3
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Get Your Mind Map</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    AI builds your personalized step-by-step roadmap with phases, milestones, portfolio projects, and direct links to leading free resources.
                  </p>
                </div>
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="font-display font-bold text-3xl text-white tracking-tight">Every Career. Every Industry.</h2>
                <p className="text-brand-muted text-sm max-w-xl mx-auto">Browse core tracks across 10 global professional domains.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INDUSTRIES.map((ind) => (
                  <div
                    key={ind.id}
                    onClick={() => {
                      setSelectedIndustry(ind.id);
                      setCurrentPage("explore");
                    }}
                    className="p-5 bg-brand-surface border border-white/5 hover:border-brand-primary/35 hover:scale-[1.01] rounded-2xl transition-all cursor-pointer text-left space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{ind.icon}</span>
                      <span className="text-[10px] font-mono text-brand-muted bg-brand-bg border border-white/5 px-2 py-0.5 rounded">
                        {CAREER_ROLES.filter((r) => r.industryId === ind.id).length} {CAREER_ROLES.filter((r) => r.industryId === ind.id).length === 1 ? "role" : "roles"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base group-hover:text-brand-secondary transition-colors">
                        {ind.name}
                      </h4>
                      <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                        e.g. {ind.examples.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FREE FOREVER BANNER */}
            <div className="p-8 sm:p-12 bg-gradient-to-tr from-brand-primary/10 via-brand-secondary/5 to-transparent border border-white/10 rounded-3xl text-center space-y-6">
              <span className="inline-block text-xs font-mono font-bold uppercase text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full border border-brand-secondary/15">
                NO SUBSCRIPTIONS • NO PAYWALLS
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                SkillMap is and always will be 100% Free.
              </h2>
              <p className="text-brand-muted text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                We believe career opportunities shouldn't hide behind paid subscriptions. To keep our platform self-sustaining, we receive small affiliate commissions when you enroll in paid recommended courses — at absolutely zero extra cost to you.
              </p>
              <button
                onClick={() => {
                  setInputSkills([]);
                  setSelectedCareers([]);
                  setGeneratorStep(1);
                  setCurrentPage("map");
                }}
                className="px-8 py-4 rounded-xl font-bold text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 shadow-xl shadow-brand-primary/25 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Start Mapping For Free →
              </button>
            </div>

          </div>
        )}

        {/* =======================================
            PAGE: CAREER MAP GENERATOR
            ======================================= */}
        {currentPage === "map" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step Indicators */}
            {generatorStep < 4 && (
              <div className="flex items-center justify-between border-b border-white/5 pb-4 font-mono text-[11px] font-bold text-brand-muted uppercase">
                <button
                  onClick={() => setGeneratorStep(1)}
                  className={`transition-colors cursor-pointer ${generatorStep === 1 ? "text-brand-secondary font-extrabold" : "hover:text-white"}`}
                >
                  1. Current Skills
                </button>
                <span className="text-white/10">|</span>
                <button
                  onClick={() => inputSkills.length > 0 && setGeneratorStep(2)}
                  disabled={inputSkills.length === 0}
                  className={`transition-colors disabled:opacity-50 ${generatorStep === 2 ? "text-brand-secondary font-extrabold" : "hover:text-white"}`}
                >
                  2. Pick Careers
                </button>
                <span className="text-white/10">|</span>
                <button
                  onClick={() => selectedCareers.length > 0 && setGeneratorStep(3)}
                  disabled={selectedCareers.length === 0}
                  className={`transition-colors disabled:opacity-50 ${generatorStep === 3 ? "text-brand-secondary font-extrabold" : "hover:text-white"}`}
                >
                  3. Preferences
                </button>
              </div>
            )}

            {/* Main Form container */}
            <div className="p-6 sm:p-8 bg-brand-surface/50 border border-white/5 rounded-3xl shadow-xl">
              {generatorStep === 1 && (
                <SkillTagInput
                  selectedSkills={inputSkills}
                  setSelectedSkills={setInputSkills}
                  experienceYears={preferences.hoursPerWeek} // using as mock state binder
                  setExperienceYears={(y) => setPreferences(prev => ({ ...prev, hoursPerWeek: y }))}
                  education={preferences.situation} // using as mock state binder
                  setEducation={(e) => setPreferences(prev => ({ ...prev, situation: e }))}
                  onNext={() => setGeneratorStep(2)}
                />
              )}

              {generatorStep === 2 && (
                <MultiCareerPicker
                  selectedCareers={selectedCareers}
                  setSelectedCareers={setSelectedCareers}
                  onNext={() => setGeneratorStep(3)}
                  onBack={() => setGeneratorStep(1)}
                />
              )}

              {generatorStep === 3 && (
                <PreferencesForm
                  preferences={preferences}
                  setPreferences={setPreferences}
                  onGenerate={handleGenerateRoadmap}
                  onBack={() => setGeneratorStep(2)}
                />
              )}

              {generatorStep === 4 && <GenerationLoader />}
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: ROADMAP RESULTS
            ======================================= */}
        {currentPage === "roadmap" && activeRoadmap && (
          <div className="space-y-6">
            {/* Top Stats & Actions Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-4 text-left">
                {/* Circular Progress Ring around Active Roadmap Map Icon */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0" id="active-roadmap-progress-ring">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-white/10 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-brand-secondary fill-none transition-all duration-700 ease-out"
                      stroke="var(--color-brand-secondary, #34d399)"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - activeProgressPercent / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex items-center justify-center text-brand-secondary">
                    <Network size={22} className="stroke-[2.5] animate-pulse" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-brand-primary text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-white/10 shadow">
                    {activeProgressPercent}%
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-mono font-bold tracking-wider text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/15 uppercase">
                    ACTIVE MAP: {activeRoadmap.industry}
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                    {activeRoadmap.targetRole} Roadmap
                  </h2>
                  <p className="text-xs text-brand-muted">
                    {activeRoadmap.totalEstimatedMonths} months estimate • {activeRoadmap.hoursPerWeekAssumed}h available / week • {activeRoadmap.skillMatchPercent}% profile match
                  </p>
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setRoadmapView("map")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    roadmapView === "map"
                      ? "bg-brand-primary text-white border border-brand-primary"
                      : "bg-brand-surface text-brand-body border border-white/5 hover:border-white/10"
                  }`}
                >
                  🗺️ Mind Map View
                </button>
                <button
                  onClick={() => setRoadmapView("list")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    roadmapView === "list"
                      ? "bg-brand-primary text-white border border-brand-primary"
                      : "bg-brand-surface text-brand-body border border-white/5 hover:border-white/10"
                  }`}
                >
                  📋 List View
                </button>

                {activeRoadmapId && (
                  <button
                    onClick={copyShareLink}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-brand-secondary text-brand-bg hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-secondary/10"
                  >
                    <Share2 size={13} /> {copiedShare ? "Link Copied!" : "Share Map"}
                  </button>
                )}
              </div>
            </div>

            {/* Active Sub View Container */}
            {roadmapView === "map" ? (
              <SkillMapCanvas
                roadmap={activeRoadmap}
                completedNodes={completedNodes}
                setCompletedNodes={setCompletedNodes}
                inProgressNodes={inProgressNodes}
                setInProgressNodes={setInProgressNodes}
                proofs={proofs}
                onVerifySkill={(skillName) => {
                  setActiveProofSkillName(skillName);
                  setIsProofModalOpen(true);
                }}
              />
            ) : (
              <RoadmapList
                roadmap={activeRoadmap}
                completedNodes={completedNodes}
                setCompletedNodes={setCompletedNodes}
                inProgressNodes={inProgressNodes}
                setInProgressNodes={setInProgressNodes}
                proofs={proofs}
                onVerifySkill={(skillName) => {
                  setActiveProofSkillName(skillName);
                  setIsProofModalOpen(true);
                }}
              />
            )}

            {/* Salary chart panel & progression timeline details */}
            <div className="grid grid-cols-1 gap-6">
              <SalaryChart progression={activeRoadmap.careerProgression} />
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: EXPLORE
            ======================================= */}
        {currentPage === "explore" && (
          <div className="space-y-8 text-left animate-fade-in">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">Explore Professional Careers</h2>
              <p className="text-brand-muted text-sm leading-relaxed max-w-2xl">
                Browse leading career roles, salary averages, job demand trends, and pre-generated learning paths. Click to load custom versions instantly.
              </p>
            </div>

            {/* Filter tags bar */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 border-b border-white/5 scrollbar-thin">
              <button
                onClick={() => setSelectedIndustry("all")}
                className={`flex-none px-4 py-2 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                  selectedIndustry === "all" ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary font-bold" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted"
                }`}
              >
                🌐 All Fields
              </button>
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`flex-none px-4 py-2 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                    selectedIndustry === ind.id ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary font-bold" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted"
                  }`}
                >
                  {ind.icon} {ind.name}
                </button>
              ))}
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAREER_ROLES.filter(r => selectedIndustry === "all" || r.industryId === selectedIndustry).map((role) => (
                <div
                  key={role.title}
                  className="p-5 bg-brand-surface border border-white/5 rounded-2xl flex flex-col justify-between h-[230px] group hover:border-brand-primary/45 hover:scale-[1.01] transition-all"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-brand-muted uppercase">{role.industry}</span>
                    <h4 className="font-display font-bold text-lg text-white leading-snug group-hover:text-brand-secondary transition-colors">
                      {role.title}
                    </h4>
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                      {role.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded bg-brand-surface2 border border-white/5 text-brand-muted">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                      <span className="font-mono font-bold text-white">{role.salaryRange}</span>
                      <button
                        onClick={() => {
                          setInputSkills([]);
                          setSelectedCareers([role.title]);
                          setGeneratorStep(3); // jump straight to Preferences
                          setCurrentPage("map");
                        }}
                        className="text-xs font-semibold text-brand-secondary group-hover:text-white flex items-center gap-1 transition-colors"
                      >
                        Start Map <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: COMPARE
            ======================================= */}
        {currentPage === "compare" && (
          <div className="space-y-8 text-left animate-fade-in max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">Career Comparison Tool</h2>
              <p className="text-brand-muted text-sm max-w-xl">
                Compare salaries, learning timelines, starting difficulties, and critical overlaps side-by-side to find the most efficient route.
              </p>
            </div>

            {/* Dropdown panel selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-surface border border-white/5 p-4 rounded-2xl">
              <div className="space-y-2">
                <span className="block text-xs font-bold font-mono text-brand-muted uppercase">CAREER TRACK A</span>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-surface2 border border-white/10 rounded-xl text-white text-sm focus:border-brand-primary outline-none transition-all cursor-pointer"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.title} value={r.title} className="bg-[#18181b] text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold font-mono text-brand-muted uppercase">CAREER TRACK B</span>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-surface2 border border-white/10 rounded-xl text-white text-sm focus:border-brand-primary outline-none transition-all cursor-pointer"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.title} value={r.title} className="bg-[#18181b] text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison matrix table */}
            {compareA && compareB && (
              <div className="border border-white/8 bg-brand-surface rounded-2xl overflow-hidden divide-y divide-white/5 text-sm">
                
                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 bg-brand-surface2 font-bold font-display text-white">
                  <span>Metric</span>
                  <span className="text-brand-primary-light">{compareA}</span>
                  <span className="text-brand-secondary">{compareB}</span>
                </div>

                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
                  <span className="font-mono text-xs text-brand-muted">SALARY RANGE</span>
                  <span className="font-bold text-white">
                    {CAREER_ROLES.find(r => r.title === compareA)?.salaryRange}
                  </span>
                  <span className="font-bold text-white">
                    {CAREER_ROLES.find(r => r.title === compareB)?.salaryRange}
                  </span>
                </div>

                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
                  <span className="font-mono text-xs text-brand-muted">PREP TIME</span>
                  <span className="text-brand-body">
                    {CAREER_ROLES.find(r => r.title === compareA)?.timeEstimate}
                  </span>
                  <span className="text-brand-body">
                    {CAREER_ROLES.find(r => r.title === compareB)?.timeEstimate}
                  </span>
                </div>

                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
                  <span className="font-mono text-xs text-brand-muted">DIFFICULTY</span>
                  <span className="text-brand-body font-semibold">
                    {CAREER_ROLES.find(r => r.title === compareA)?.difficulty}
                  </span>
                  <span className="text-brand-body font-semibold">
                    {CAREER_ROLES.find(r => r.title === compareB)?.difficulty}
                  </span>
                </div>

                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
                  <span className="font-mono text-xs text-brand-muted">MARKET DEMAND</span>
                  <span className="text-brand-secondary font-bold flex items-center gap-1">
                    <Flame size={13} /> {CAREER_ROLES.find(r => r.title === compareA)?.demand}
                  </span>
                  <span className="text-brand-secondary font-bold flex items-center gap-1">
                    <Flame size={13} /> {CAREER_ROLES.find(r => r.title === compareB)?.demand}
                  </span>
                </div>

                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
                  <span className="font-mono text-xs text-brand-muted">REQUIRED SKILLS</span>
                  <span className="text-xs text-brand-muted leading-relaxed">
                    {CAREER_ROLES.find(r => r.title === compareA)?.skills.join(", ")}
                  </span>
                  <span className="text-xs text-brand-muted leading-relaxed">
                    {CAREER_ROLES.find(r => r.title === compareB)?.skills.join(", ")}
                  </span>
                </div>

              </div>
            )}
          </div>
        )}

        {/* =======================================
            PAGE: EXAMPLES GALLERY
            ======================================= */}
        {currentPage === "examples" && (
          <div className="space-y-8 text-left animate-fade-in">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">Example Roadmap Gallery</h2>
              <p className="text-brand-muted text-sm max-w-xl">
                Browse pre-built transforms showing how actual learners successfully acquire overlapping skills to pivot into high-demand roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURED_EXAMPLES.map((ex) => (
                <div
                  key={ex.slug}
                  className="p-6 bg-brand-surface border border-white/5 hover:border-brand-primary/30 rounded-2xl flex flex-col justify-between h-[220px] group transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted">
                      <span>PIVOT TIMELINE: {ex.timeline}</span>
                      <span className="text-brand-secondary uppercase font-bold">{ex.roadmap.industry}</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-white leading-tight group-hover:text-brand-secondary transition-colors">
                      {ex.title}
                    </h4>
                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                      {ex.roadmap.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[11px] font-mono text-brand-muted uppercase">
                      Phases: {ex.roadmap.phases.length} • {ex.roadmap.certifications?.length || 0} Certifications
                    </span>
                    <button
                      onClick={() => handleLoadExample(ex)}
                      className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:brightness-110 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
                    >
                      Explore Map →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: ABOUT
            ======================================= */}
        {currentPage === "about" && (
          <div className="max-w-2xl mx-auto space-y-6 text-left animate-fade-in py-8">
            <h2 className="font-display font-extrabold text-3xl text-white">About SkillMap</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              SkillMap is an open, global career path decoder and visual mind-mapping curriculum platform. We believe that professional growth shouldn't hide behind paid paywalls, high Stripe plans, or subscription models.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="font-display font-bold text-lg text-white">How is this platform supported?</h4>
              <p className="text-xs text-brand-body leading-relaxed">
                SkillMap is 100% free forever for all users. We cover our hosting, API pipelines, and development costs by displaying non-intrusive affiliate course alternatives from trusted online providers. If you choose to enroll in a paid recommendation, SkillMap receives a small commission at absolutely zero additional charge to you. That's our promise!
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-xl border border-white/5 text-xs text-brand-muted leading-relaxed font-mono uppercase tracking-wider text-center">
              ♥ BUILT WITH PASSION FOR CAREER CHANGERS EVERYWHERE ♥
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: LOGIN / SIGNUP
            ======================================= */}
        {(currentPage === "login" || currentPage === "signup") && (
          <div className="max-w-md mx-auto py-12 animate-fade-in">
            <div className="p-8 bg-brand-surface border border-white/8 rounded-3xl shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-display font-bold text-2xl text-white">
                  {currentPage === "login" ? "Welcome Back to SkillMap" : "Create Your Free Account"}
                </h3>
                <p className="text-xs text-brand-muted">
                  Save your generated mind-maps and track completed progress milestones forever.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-brand-accent/15 border border-brand-accent/25 rounded-xl text-xs text-brand-accent font-mono text-center">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={currentPage === "login" ? handleLogin : handleSignUp} className="space-y-4 text-left">
                {currentPage === "signup" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-brand-muted uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 bg-brand-surface2 border border-white/8 focus:border-brand-primary outline-none transition-all rounded-xl text-sm text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-brand-muted uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-brand-surface2 border border-white/8 focus:border-brand-primary outline-none transition-all rounded-xl text-sm text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-brand-muted uppercase">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-brand-surface2 border border-white/8 focus:border-brand-primary outline-none transition-all rounded-xl text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer text-sm"
                >
                  {currentPage === "login" ? "Login to Profile" : "Create Account"}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-white/5 text-xs text-brand-muted">
                {currentPage === "login" ? (
                  <span>
                    Don't have an account?{" "}
                    <button onClick={() => setCurrentPage("signup")} className="text-brand-secondary font-bold hover:underline">
                      Sign Up Free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{" "}
                    <button onClick={() => setCurrentPage("login")} className="text-brand-secondary font-bold hover:underline">
                      Login Here
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =======================================
            PAGE: DASHBOARD
            ======================================= */}
        {currentPage === "dashboard" && user && (
          <div className="space-y-8 text-left animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Your Saved Roadmaps</h2>
                <p className="text-brand-muted text-sm mt-1">
                  Explore and resume progress on your custom generated pipelines.
                </p>
              </div>
              <button
                onClick={() => {
                  setInputSkills([]);
                  setSelectedCareers([]);
                  setGeneratorStep(1);
                  setCurrentPage("map");
                }}
                className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-brand-bg hover:brightness-110 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
              >
                + Generate New Map
              </button>
            </div>

            {savedMaps.length === 0 ? (
              <div className="p-12 border border-dashed border-white/8 bg-brand-surface/20 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                <Network size={36} className="text-brand-muted mx-auto" />
                <h4 className="font-display font-bold text-lg text-white">No saved maps yet!</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Generate your custom career path mind maps using our step generator to see them displayed here.
                </p>
                <button
                  onClick={() => {
                    setInputSkills([]);
                    setSelectedCareers([]);
                    setGeneratorStep(1);
                    setCurrentPage("map");
                  }}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
                >
                  Create My First Map
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMaps.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-5 bg-brand-surface border border-white/5 rounded-2xl flex flex-col justify-between h-[180px] hover:border-brand-secondary/35 hover:scale-[1.01] transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-brand-muted uppercase">
                        <span>Created: {new Date(saved.created_at).toLocaleDateString()}</span>
                        <span>{saved.roadmapJson.industry}</span>
                      </div>
                      <h4 className="font-display font-bold text-lg text-white leading-snug mt-1.5 group-hover:text-brand-secondary transition-colors">
                        {saved.targetRole} Roadmap
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-brand-muted uppercase">
                        Gaps: {saved.roadmapJson.skillGaps?.length || 0} nodes
                      </span>
                      <button
                        onClick={() => {
                          setActiveRoadmap(saved.roadmapJson);
                          setActiveRoadmapId(saved.share_slug);
                          setCompletedNodes([]);
                          setInProgressNodes([]);
                          setCurrentPage("roadmap");
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-secondary text-brand-bg hover:brightness-110 text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        Open Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. Global Footer */}
      <footer className="border-t border-white/5 bg-brand-surface py-12 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-display text-lg font-bold text-white">
              Skill<span className="text-brand-secondary">Map</span>
            </span>
            <p className="text-brand-muted text-[11px]">
              "Map your skills to your dream career." • Free forever ♥
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-brand-muted font-medium">
            <button onClick={() => setCurrentPage("explore")} className="hover:text-white transition-colors">Explore</button>
            <button onClick={() => setCurrentPage("examples")} className="hover:text-white transition-colors">Examples</button>
            <button onClick={() => setCurrentPage("compare")} className="hover:text-white transition-colors">Compare</button>
            <button onClick={() => setCurrentPage("about")} className="hover:text-white transition-colors">About</button>
          </div>

          <div className="text-brand-muted text-[11px] text-center sm:text-right">
            Built with ♥ for career changers everywhere. All rights reserved.
          </div>
        </div>
      </footer>

      <ProjectProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        skillName={activeProofSkillName}
        roadmapId={activeRoadmapId || ""}
        userId={user ? user.email : null}
        existingProof={proofs.find((p) => p.skillName.toLowerCase() === activeProofSkillName.toLowerCase())}
        onProofSaved={handleProofSaved}
        onProofDeleted={handleProofDeleted}
        onToggleCompleted={handleToggleCompletedState}
      />

    </div>
  );
}
