import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Circle, 
  Hourglass, 
  DollarSign, 
  TrendingUp, 
  Award, 
  BookOpen, 
  ExternalLink, 
  HelpCircle, 
  GraduationCap, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  FileCheck, 
  ShieldCheck, 
  Upload, 
  Activity, 
  Compass, 
  Check, 
  Layers, 
  Target, 
  Briefcase, 
  Zap, 
  CheckSquare, 
  Square, 
  Eye, 
  AlertCircle 
} from "lucide-react";
import { RoadmapData, Phase, FreeResource, PaidCourse, ProjectBrief, Certification } from "../types";

interface InfographicViewProps {
  roadmap: RoadmapData;
  completedNodes: string[];
  setCompletedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  inProgressNodes: string[];
  setInProgressNodes: React.Dispatch<React.SetStateAction<string[]>>;
  proofs?: any[];
  onVerifySkill?: (skillName: string) => void;
}

export default function InfographicView({
  roadmap,
  completedNodes,
  setCompletedNodes,
  inProgressNodes,
  setInProgressNodes,
  proofs = [],
  onVerifySkill,
}: InfographicViewProps) {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(0);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [showTips, setShowTips] = useState<boolean>(true);

  // Helper to find if project has verified proof
  const getProjectProof = (projectTitle: string) => {
    return proofs.find(p => p.projectTitle === projectTitle);
  };

  // Helper to check if a specific skill has verification proof
  const getSkillProof = (skillName: string) => {
    return proofs.find(p => p.skillName === skillName);
  };

  // Stats calculation
  const totalSkills = useMemo(() => {
    return roadmap.phases.reduce((sum, p) => sum + (p.skills?.length || 0), 0);
  }, [roadmap]);

  const completedSkillsCount = useMemo(() => {
    let count = 0;
    roadmap.phases.forEach(p => {
      p.skills?.forEach(s => {
        if (completedNodes.includes(s)) count++;
      });
    });
    return count;
  }, [roadmap, completedNodes]);

  const overallProgressPercent = useMemo(() => {
    if (totalSkills === 0) return 0;
    return Math.round((completedSkillsCount / totalSkills) * 100);
  }, [totalSkills, completedSkillsCount]);

  // Handle skill completion toggle
  const toggleSkill = (skillName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (completedNodes.includes(skillName)) {
      setCompletedNodes(prev => prev.filter(s => s !== skillName));
      // Add back to in_progress or leave empty
      if (!inProgressNodes.includes(skillName)) {
        setInProgressNodes(prev => [...prev, skillName]);
      }
    } else {
      setCompletedNodes(prev => [...prev, skillName]);
      setInProgressNodes(prev => prev.filter(s => s !== skillName));
    }
  };

  // Set skill in-progress toggle
  const toggleInProgress = (skillName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (inProgressNodes.includes(skillName)) {
      setInProgressNodes(prev => prev.filter(s => s !== skillName));
    } else {
      setInProgressNodes(prev => [...prev, skillName]);
      setCompletedNodes(prev => prev.filter(s => s !== skillName));
    }
  };

  return (
    <div className="space-y-8" id="infographic-container">
      {/* 1. HERO INFOGRAPHIC BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-bg via-brand-surface to-brand-primary/10 rounded-3xl border border-white/8 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary uppercase bg-brand-secondary/10 px-3 py-1 rounded-full border border-brand-secondary/15">
                Path Decoded
              </span>
              <span className="text-xs font-mono font-bold text-brand-muted">
                Interactive Infographic
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Decoding the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{roadmap.targetRole}</span> Pipeline
            </h1>
            
            <p className="text-sm text-brand-muted leading-relaxed max-w-2xl">
              {roadmap.summary}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/8 px-3 py-1.5 rounded-xl">
                <Compass className="w-4 h-4 text-brand-secondary" />
                <span>Industry: <strong className="text-white">{roadmap.industry}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/8 px-3 py-1.5 rounded-xl">
                <Hourglass className="w-4 h-4 text-brand-primary" />
                <span>Timeframe: <strong className="text-white">{roadmap.totalEstimatedMonths} Months</strong></span>
              </div>
            </div>
          </div>

          {/* 2. DYNAMIC RING CHART */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative flex flex-col items-center p-6 bg-brand-surface/40 rounded-2xl border border-white/5 shadow-xl w-full max-w-[280px]">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-white/5 fill-none"
                    strokeWidth="10"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-brand-secondary fill-none transition-all duration-1000 ease-out"
                    stroke="var(--color-brand-secondary)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - overallProgressPercent / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-black text-3xl text-white">{overallProgressPercent}%</span>
                  <span className="text-[10px] font-mono tracking-wider text-brand-muted uppercase">Complete</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs font-mono font-bold text-white">
                  {completedSkillsCount} of {totalSkills} Skills Mastered
                </p>
                <p className="text-[10px] text-brand-muted mt-1">
                  Click skills below to log achievements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY METRICS STATS BLOCKS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-white/8 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-brand-muted uppercase tracking-wider">Match Index</span>
            <strong className="block text-xl text-white font-display mt-0.5">{roadmap.skillMatchPercent}%</strong>
            <span className="text-[9px] text-brand-secondary font-mono">Recognized skills applied</span>
          </div>
        </div>

        <div className="bg-brand-surface border border-white/8 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-brand-muted uppercase tracking-wider">Target Role</span>
            <strong className="block text-base text-white font-display mt-1 truncate max-w-[130px]" title={roadmap.targetRole}>
              {roadmap.targetRole}
            </strong>
            <span className="text-[9px] text-brand-muted font-mono">High demand field</span>
          </div>
        </div>

        <div className="bg-brand-surface border border-white/8 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0">
            <Hourglass className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-brand-muted uppercase tracking-wider">Weekly Commitment</span>
            <strong className="block text-xl text-white font-display mt-0.5">{roadmap.hoursPerWeekAssumed} Hrs</strong>
            <span className="text-[9px] text-brand-muted font-mono">Paced for active busy lifestyles</span>
          </div>
        </div>

        <div className="bg-brand-surface border border-white/8 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-brand-muted uppercase tracking-wider">Certifications</span>
            <strong className="block text-xl text-white font-display mt-0.5">
              {roadmap.certifications?.length || 0} Recommended
            </strong>
            <span className="text-[9px] text-yellow-500 font-mono">Resume multipliers</span>
          </div>
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE INFOGRAPHIC ROADMAP FLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THERMOMETER TIMELINE SELECTOR */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-primary" /> Roadmap Milestones
          </h3>
          <p className="text-xs text-brand-muted">
            The transition program is broken into structured phases. Select a phase to explore its curated study path, specialized projects, and tools.
          </p>

          <div className="space-y-3 pt-2">
            {roadmap.phases.map((phase, idx) => {
              const isSelected = selectedPhaseIdx === idx;
              
              // Count phase skills complete
              const phaseSkills = phase.skills || [];
              const phaseCompleteCount = phaseSkills.filter(s => completedNodes.includes(s)).length;
              const isPhaseFinished = phaseSkills.length > 0 && phaseCompleteCount === phaseSkills.length;
              
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPhaseIdx(idx)}
                  className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-brand-surface border-brand-primary/50 shadow-lg shadow-brand-primary/5"
                      : "bg-brand-surface/40 border-white/5 hover:border-white/12 hover:bg-brand-surface/70"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black transition-colors ${
                      isPhaseFinished
                        ? "bg-brand-secondary text-brand-bg"
                        : isSelected
                          ? "bg-brand-primary text-white"
                          : "bg-white/10 text-brand-muted group-hover:text-white"
                    }`}>
                      {isPhaseFinished ? <Check className="w-4 h-4 stroke-[3]" /> : phase.phaseNumber}
                    </div>
                    {idx < roadmap.phases.length - 1 && (
                      <div className="w-0.5 h-12 bg-white/5 group-hover:bg-white/10 transition-colors mt-1" />
                    )}
                  </div>

                  <div className="space-y-1 pr-6 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`font-display font-bold text-xs ${isSelected ? "text-white" : "text-brand-muted group-hover:text-white"}`}>
                        {phase.title.split(":")[1] || phase.title}
                      </h4>
                    </div>
                    <span className="block text-[10px] font-mono text-brand-muted">
                      {phase.durationWeeks} Weeks • {phase.skills?.length || 0} Skills
                    </span>

                    {/* Progress micro-bar */}
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full transition-all duration-500 ${isPhaseFinished ? "bg-brand-secondary" : "bg-brand-primary"}`}
                        style={{ width: `${(phaseCompleteCount / Math.max(phaseSkills.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${
                    isSelected ? "text-brand-primary translate-x-0" : "text-brand-muted opacity-0 group-hover:opacity-100 -translate-x-2"
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Quick tips card */}
          {showTips && (
            <div className="bg-brand-surface/40 border border-white/5 rounded-2xl p-4 space-y-2 relative">
              <button 
                onClick={() => setShowTips(false)} 
                className="absolute top-3 right-3 text-brand-muted hover:text-white text-xs"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>Expert Career Tips</span>
              </div>
              <ul className="text-[11px] text-brand-muted space-y-1.5 list-disc pl-4 leading-normal">
                {roadmap.careerTips?.slice(0, 3).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAIL EXPLORER OF SELECT PHASE */}
        <div className="lg:col-span-8 space-y-6">
          {roadmap.phases[selectedPhaseIdx] && (
            <motion.div
              key={selectedPhaseIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-surface border border-white/8 rounded-3xl p-6 space-y-6 shadow-xl"
            >
              {/* Phase header info */}
              <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-brand-primary uppercase font-extrabold bg-brand-primary/10 px-2.5 py-0.5 rounded border border-brand-primary/15">
                    Phase {roadmap.phases[selectedPhaseIdx].phaseNumber} Details
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-white">
                    {roadmap.phases[selectedPhaseIdx].title}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Recommended Duration: <strong>{roadmap.phases[selectedPhaseIdx].durationWeeks} Weeks</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-2xl p-2.5 self-start sm:self-center">
                  <Activity className="w-4 h-4 text-brand-secondary shrink-0" />
                  <div className="text-right">
                    <span className="block text-[9px] font-mono text-brand-muted uppercase">Phase Schedule</span>
                    <span className="block text-[11px] font-bold text-white truncate max-w-[150px]">
                      {roadmap.phases[selectedPhaseIdx].weeklySchedule || "Flexible schedule"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Skill check-off infographic list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-brand-muted uppercase tracking-wider">
                    Core Skills to Master ({roadmap.phases[selectedPhaseIdx].skills?.length || 0})
                  </h4>
                  <span className="text-[10px] text-brand-muted font-mono">
                    Check complete when comfortable
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roadmap.phases[selectedPhaseIdx].skills?.map((skill, sIdx) => {
                    const isCompleted = completedNodes.includes(skill);
                    const isInProgress = inProgressNodes.includes(skill);
                    const hasProof = getSkillProof(skill);
                    const isExpanded = expandedSkill === skill;

                    return (
                      <div 
                        key={sIdx}
                        className={`group rounded-2xl border transition-all hover:bg-brand-surface/80 flex flex-col overflow-hidden ${
                          isCompleted
                            ? "border-brand-secondary/30 bg-brand-secondary/5"
                            : isInProgress
                              ? "border-brand-primary/30 bg-brand-primary/5"
                              : "border-white/5 bg-white/2"
                        }`}
                      >
                        {/* Main clickable skill row */}
                        <div 
                          onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Checkbox */}
                            <button
                              onClick={(e) => toggleSkill(skill, e)}
                              className="text-brand-muted hover:text-brand-secondary transition-colors cursor-pointer shrink-0"
                              title="Toggle completed status"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-brand-secondary fill-brand-secondary/10" />
                              ) : (
                                <Circle className="w-5 h-5 opacity-40 hover:opacity-100" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <span className={`block text-xs font-bold truncate leading-tight ${isCompleted ? "text-brand-secondary line-through opacity-80" : "text-white"}`}>
                                {skill}
                              </span>
                              
                              <div className="flex items-center gap-1.5 mt-1">
                                <button 
                                  onClick={(e) => toggleInProgress(skill, e)}
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                                    isInProgress 
                                      ? "bg-brand-primary/25 text-brand-primary border border-brand-primary/30" 
                                      : "bg-white/5 text-brand-muted hover:text-white"
                                  }`}
                                >
                                  {isInProgress ? "● In Progress" : "Mark Active"}
                                </button>
                                
                                {hasProof && (
                                  <span className="flex items-center gap-0.5 text-[9px] font-mono bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 px-1.5 py-0.5 rounded">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <ChevronDown className={`w-4 h-4 text-brand-muted group-hover:text-white transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </div>

                        {/* Expandable info for this specific skill */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-brand-bg/50 border-t border-white/5"
                            >
                              <div className="p-4 space-y-4 text-xs">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-brand-muted uppercase font-mono block">Skill Description</span>
                                  <p className="text-brand-muted leading-relaxed">
                                    Master this skill to fulfill requirements in {roadmap.targetRole} opportunities. Focus on both functional paradigms and project integrations.
                                  </p>
                                </div>

                                {/* Curated Resource Highlights */}
                                <div className="space-y-2">
                                  <span className="text-[10px] text-brand-muted uppercase font-mono block">Curated Material</span>
                                  {roadmap.phases[selectedPhaseIdx].freeResources?.[0] ? (
                                    <div className="bg-brand-surface p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                      <div className="min-w-0">
                                        <span className="block font-bold text-white truncate text-[11px]">
                                          {roadmap.phases[selectedPhaseIdx].freeResources[0].title}
                                        </span>
                                        <span className="block text-[9px] text-brand-muted">
                                          {roadmap.phases[selectedPhaseIdx].freeResources[0].platform} • ~{roadmap.phases[selectedPhaseIdx].freeResources[0].estimatedHours} hrs
                                        </span>
                                      </div>
                                      <a
                                        href={roadmap.phases[selectedPhaseIdx].freeResources[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-brand-primary/10 hover:bg-brand-primary/25 text-brand-primary rounded-lg transition-colors shrink-0"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-brand-muted">No custom resources attached</span>
                                  )}
                                </div>

                                {/* Project verification link */}
                                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-4">
                                  <div className="space-y-0.5">
                                    <span className="block text-[10px] text-brand-muted font-mono uppercase">Proof of Competency</span>
                                    <span className="block text-[10px] text-brand-muted">Upload code to earn verification badges</span>
                                  </div>

                                  {hasProof ? (
                                    <div className="flex items-center gap-1 bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/30 rounded-xl px-3 py-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold">Proof Locked</span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => onVerifySkill && onVerifySkill(skill)}
                                      className="px-3 py-1.5 bg-brand-primary hover:brightness-110 text-white rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer shadow flex items-center gap-1"
                                    >
                                      <FileCheck className="w-3.5 h-3.5" /> Submit Proof
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Objectives banner */}
              <div className="bg-brand-bg/40 border border-white/5 rounded-2xl p-4 space-y-3">
                <h4 className="font-display font-bold text-xs text-brand-muted uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-brand-primary" /> Phase Learning Objectives
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {roadmap.phases[selectedPhaseIdx].objectives?.map((obj, oIdx) => (
                    <li key={oIdx} className="flex items-start gap-2 text-brand-body leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Projects section of the infographic */}
              {roadmap.phases[selectedPhaseIdx].projects && roadmap.phases[selectedPhaseIdx].projects.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs text-brand-muted uppercase tracking-wider">
                    Hands-on Capstone Projects
                  </h4>

                  <div className="space-y-4">
                    {roadmap.phases[selectedPhaseIdx].projects.map((proj, pIdx) => {
                      const proof = getProjectProof(proj.title);
                      
                      return (
                        <div key={pIdx} className="bg-brand-surface/80 border border-white/8 rounded-2xl p-4 space-y-4 relative overflow-hidden shadow-sm">
                          {proof && (
                            <div className="absolute top-0 right-0 bg-brand-secondary text-brand-bg text-[9px] font-mono font-bold px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> VERIFIED PROOF
                            </div>
                          )}

                          <div className="space-y-1 max-w-[85%]">
                            <span className={`inline-block text-[9px] font-mono font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${
                              proj.difficulty === "advanced" 
                                ? "bg-red-500/10 text-red-400 border-red-500/15" 
                                : proj.difficulty === "intermediate"
                                  ? "bg-brand-primary/10 text-brand-primary border-brand-primary/15"
                                  : "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/15"
                            }`}>
                              {proj.difficulty} Project
                            </span>
                            <h5 className="font-display font-bold text-sm text-white">{proj.title}</h5>
                            <p className="text-xs text-brand-muted leading-relaxed">{proj.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5">
                            <div>
                              <strong className="block text-brand-muted text-[10px] font-mono uppercase">Portfolio Impact Value</strong>
                              <p className="text-white font-bold mt-0.5">{proj.portfolioValue || "Highly recommended display asset"}</p>
                            </div>
                            <div>
                              <strong className="block text-brand-muted text-[10px] font-mono uppercase">Applied Skills</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {proj.skills?.map((s, idx) => (
                                  <span key={idx} className="bg-white/5 text-brand-muted text-[10px] px-1.5 py-0.5 rounded border border-white/5">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Steps Accordion or Checklist */}
                          <div className="bg-brand-bg/40 border border-white/5 p-3 rounded-xl space-y-2">
                            <strong className="block text-brand-muted text-[10px] font-mono uppercase">Execution Blueprint</strong>
                            <ol className="space-y-1.5 text-xs text-brand-body">
                              {proj.steps?.map((step, sidx) => (
                                <li key={sidx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="font-mono text-brand-primary font-bold text-[10px] mt-0.5 shrink-0 bg-brand-primary/10 px-1.5 py-0.2 rounded border border-brand-primary/15">
                                    Step {sidx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Submit Proof CTA for project */}
                          <div className="flex items-center justify-between gap-4 pt-2">
                            <span className="text-[10px] text-brand-muted leading-relaxed">
                              🔒 Earn validation stars and progress points by linking code credentials
                            </span>

                            {proof ? (
                              <div className="text-xs text-brand-secondary font-mono flex items-center gap-1 bg-brand-secondary/5 px-2.5 py-1 rounded border border-brand-secondary/10">
                                <FileCheck className="w-3.5 h-3.5" /> Locked to Git
                              </div>
                            ) : (
                              <button
                                onClick={() => onVerifySkill && onVerifySkill(proj.skills[0] || `${proj.title} Proof`)}
                                className="px-3.5 py-1.5 bg-brand-primary hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-brand-primary/15 flex items-center gap-1 shrink-0"
                              >
                                <Upload className="w-3.5 h-3.5" /> Upload Code Proof
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Milestone banner */}
              {roadmap.phases[selectedPhaseIdx].milestone && (
                <div className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 border border-brand-secondary/25 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none -mr-4 -mb-4">
                    <Award size={100} />
                  </div>
                  <div className="p-3 bg-brand-secondary text-brand-bg rounded-xl shrink-0">
                    <Target className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono tracking-wider text-brand-secondary uppercase font-black">
                      PHASE GOAL & MILESTONE ACHIEVEMENT
                    </span>
                    <p className="text-xs text-white font-bold leading-normal">
                      {roadmap.phases[selectedPhaseIdx].milestone}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* 5. JOB READINESS RADAR GRID */}
      <div className="bg-brand-surface border border-white/8 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-brand-secondary uppercase font-black bg-brand-secondary/10 px-2.5 py-0.5 rounded border border-brand-secondary/15 inline-block">
            Evaluation metrics
          </span>
          <h3 className="font-display font-extrabold text-xl text-white">
            Job Readiness Checklist
          </h3>
          <p className="text-xs text-brand-muted">
            Complete the portfolio, networking, and skill assignments to hit 100% employment readiness index.
          </p>
        </div>

        {/* Visual progress checklist bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["portfolio", "resume", "skills", "network"] as const).map((cat) => {
            const items = roadmap.jobReadinessChecklist?.filter(i => i.category === cat) || [];
            if (items.length === 0) return null;

            // Simple calculation for complete rate:
            // Since this is a global checklist, we can check off items using standard local storage or mock toggles.
            // Let's create an state for checklist checked items, or check off items as user gains skills.
            // For real infographics, we can link it dynamically to completed skills count!
            const finishedInCatCount = cat === "skills" 
              ? Math.min(items.length, Math.ceil(completedSkillsCount / Math.max(1, totalSkills / items.length)))
              : cat === "portfolio"
                ? proofs.length > 0 ? items.length : Math.round(items.length / 2)
                : Math.round(items.length / 2);

            const isFullyDone = finishedInCatCount === items.length;

            return (
              <div key={cat} className="bg-brand-bg/40 border border-white/5 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isFullyDone ? "bg-brand-secondary" : "bg-brand-primary animate-pulse"}`} />
                    {cat}
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted">
                    {finishedInCatCount}/{items.length} Complete
                  </span>
                </div>

                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${isFullyDone ? "bg-brand-secondary" : "bg-brand-primary"}`}
                    style={{ width: `${(finishedInCatCount / items.length) * 100}%` }}
                  />
                </div>

                <ul className="space-y-2 pt-2 text-[11px] text-brand-muted">
                  {items.map((item, idx) => {
                    const isDone = idx < finishedInCatCount;
                    return (
                      <li key={idx} className="flex items-start gap-2 leading-tight">
                        <span className="shrink-0 mt-0.5">
                          {isDone ? (
                            <Check className="w-3 h-3 text-brand-secondary stroke-[3]" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-white/20" />
                          )}
                        </span>
                        <span className={isDone ? "text-brand-muted line-through opacity-70" : "text-brand-body"}>
                          {item.item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. INTEGRATED CERTIFICATION SHIELDS BANNER */}
      {roadmap.certifications && roadmap.certifications.length > 0 && (
        <div className="bg-gradient-to-b from-brand-surface to-brand-bg border border-white/8 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Award size={250} className="stroke-[1]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-yellow-500 uppercase font-black bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-500/15 inline-block">
              Resume Accelerators
            </span>
            <h3 className="font-display font-extrabold text-xl text-white">
              Professional Certification Alignment
            </h3>
            <p className="text-xs text-brand-muted">
              Add external validation to your credentials by tracking recognized certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.certifications.map((cert, idx) => (
              <div key={idx} className="bg-brand-surface border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-sm hover:border-yellow-500/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl shrink-0">
                    <Award className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-brand-muted uppercase">Recommended Priority #{cert.priority}</span>
                    <h4 className="font-display font-bold text-sm text-white leading-snug">{cert.name}</h4>
                    <p className="text-xs text-brand-muted">Offered by <strong>{cert.provider}</strong></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5 font-mono text-brand-muted">
                  <div>
                    <span className="block text-[9px] uppercase">Exam Fee</span>
                    <span className="block text-white font-bold font-sans mt-0.5">
                      {cert.examCostUSD > 0 ? `$${cert.examCostUSD}` : "Free"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase">Prep Time</span>
                    <span className="block text-white font-bold font-sans mt-0.5">{cert.prepWeeks} Weeks</span>
                  </div>
                </div>

                <a 
                  href={cert.url || "https://coursera.org"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-yellow-500 hover:brightness-110 text-brand-bg rounded-xl font-mono text-xs font-bold text-center block transition-all"
                >
                  Explore Syllabi & Guides
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
