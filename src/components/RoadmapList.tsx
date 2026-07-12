import React, { useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, FileText, Video, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Milestone, Compass, ShieldCheck, Users, Briefcase, Award, Upload, BookOpen, Globe, Wrench, Star, Info } from "lucide-react";
import { RoadmapData, Phase, FreeResource, PaidCourse, ProjectBrief, SkillGap, ExistingSkill } from "../types";
import { matchCoursesToSkills, getCategoryGradients } from "../coursesData";
import InlineUrgencyStrip from "./InlineUrgencyStrip";

interface RoadmapListProps {
  roadmap: RoadmapData;
  completedNodes: string[];
  setCompletedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  inProgressNodes: string[];
  setInProgressNodes: React.Dispatch<React.SetStateAction<string[]>>;
  proofs?: any[];
  onVerifySkill: (skillName: string) => void;
}

export default function RoadmapList({
  roadmap,
  completedNodes,
  setCompletedNodes,
  inProgressNodes,
  setInProgressNodes,
  proofs = [],
  onVerifySkill,
}: RoadmapListProps) {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]); // Default expand Phase 1
  const [readinessCheck, setReadinessCheck] = useState<string[]>([]);

  const togglePhaseExpand = (phaseNum: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseNum) ? prev.filter((p) => p !== phaseNum) : [...prev, phaseNum]
    );
  };

  const handleToggleSkillCompleted = (skillName: string) => {
    setCompletedNodes((prev) => {
      const isCompleted = prev.includes(skillName);
      if (isCompleted) {
        return prev.filter((s) => s !== skillName);
      } else {
        setInProgressNodes((ip) => ip.filter((s) => s !== skillName));
        return [...prev, skillName];
      }
    });
  };

  const toggleReadinessCheck = (item: string) => {
    setReadinessCheck((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Calculations for dynamic progress tracking
  const totalSkills = roadmap.phases.reduce((sum, phase) => sum + (phase.skills?.length || 0), 0);
  const completedSkillsCount = roadmap.phases.reduce(
    (sum, phase) => sum + (phase.skills?.filter((s) => completedNodes.includes(s)).length || 0),
    0
  );
  const progressPercent = totalSkills === 0 ? 0 : Math.round((completedSkillsCount / totalSkills) * 100);

  return (
    <div className="space-y-10 text-left animate-fade-in">
      
      {/* 1. Skill Gap Analysis & Progress Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Progress Ring Box */}
        <div className="lg:col-span-4 p-6 bg-brand-surface border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-mono font-bold text-brand-muted uppercase tracking-wider">
            Roadmap Progress
          </span>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circular progress indicator */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-white/10 fill-none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-brand-secondary fill-none transition-all duration-500 ease-out"
                stroke="var(--color-brand-secondary, #34d399)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercent / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-display font-bold text-white">{progressPercent}%</span>
              <span className="text-[10px] text-brand-muted font-mono uppercase tracking-wider">Mastered</span>
            </div>
          </div>
          
          <p className="text-xs text-brand-muted font-sans leading-relaxed">
            {completedSkillsCount} of {totalSkills} essential skills cleared. Complete milestones below to update your mind map!
          </p>
        </div>

        {/* Gap Analysis Listing */}
        <div className="lg:col-span-8 p-6 bg-brand-surface border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg text-white">Skill Gap Assessment</h4>
            <p className="text-xs text-brand-muted leading-relaxed mt-1">
              SkillMap's algorithm analyzed your profile against standard requirements. Here is your have vs need diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Recognised Skills */}
            <div className="space-y-2 bg-brand-bg/40 p-4 rounded-xl border border-white/5 max-h-[160px] overflow-y-auto">
              <span className="block text-[11px] font-mono font-bold text-brand-secondary uppercase tracking-wide">
                ✓ Existing Skills Recognized ({roadmap.existingSkillsRecognized?.length || 0})
              </span>
              <div className="space-y-1.5">
                {roadmap.existingSkillsRecognized?.length === 0 ? (
                  <span className="text-xs text-brand-muted block">None listed. Add some in Step 1!</span>
                ) : (
                  roadmap.existingSkillsRecognized?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-brand-body">
                      <CheckCircle2 size={13} className="text-brand-secondary" />
                      <span>{item.skill} ({item.level})</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Key Gaps */}
            <div className="space-y-2 bg-brand-bg/40 p-4 rounded-xl border border-white/5 max-h-[160px] overflow-y-auto">
              <span className="block text-[11px] font-mono font-bold text-brand-accent uppercase tracking-wide">
                ⚠️ Critical Gaps Identified ({roadmap.skillGaps?.length || 0})
              </span>
              <div className="space-y-1.5">
                {roadmap.skillGaps?.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-brand-body">
                    <AlertTriangle size={13} className="text-brand-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">{gap.skill}</span>
                      <p className="text-[10px] text-brand-muted leading-normal mt-0.5">{gap.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Collapsible Learning Phase Cards */}
      <div className="space-y-4">
        <h4 className="font-display font-bold text-xl text-white">Your Step-by-Step Learning Curriculum</h4>
        <div className="space-y-4">
          {roadmap.phases.map((phase) => {
            const isExpanded = expandedPhases.includes(phase.phaseNumber);
            const totalPhaseSkills = phase.skills?.length || 0;
            const completedPhaseSkills = phase.skills?.filter(s => completedNodes.includes(s)).length || 0;

            return (
              <div
                key={phase.phaseNumber}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? "border-brand-primary bg-brand-surface2/30" : "border-white/8 bg-brand-surface hover:border-white/12"
                }`}
              >
                {/* Header panel */}
                <div
                  onClick={() => togglePhaseExpand(phase.phaseNumber)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer select-none bg-brand-surface/40 hover:bg-brand-surface/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold font-mono text-sm shrink-0">
                      P{phase.phaseNumber}
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-white text-base leading-snug">
                        {phase.title}
                      </h5>
                      <span className="block text-xs font-mono text-brand-muted mt-0.5">
                        Duration: {phase.durationWeeks} weeks • {completedPhaseSkills}/{totalPhaseSkills} skills complete
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {completedPhaseSkills === totalPhaseSkills && totalPhaseSkills > 0 && (
                      <span className="text-[10px] font-mono font-bold uppercase bg-brand-secondary/15 text-brand-secondary px-2 py-0.5 rounded border border-brand-secondary/25">
                        Completed
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Body details */}
                {isExpanded && (
                  <div className="p-6 border-t border-white/5 space-y-6">
                    {/* Objectives / Skills Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                      <div className="space-y-3">
                        <span className="block text-xs font-mono font-bold text-brand-muted uppercase tracking-wide">
                          Learning Objectives
                        </span>
                        <ul className="space-y-2">
                          {phase.objectives.map((obj, i) => (
                            <li key={i} className="text-xs text-brand-body flex items-start gap-2 leading-relaxed">
                              <CheckCircle2 size={13} className="text-brand-secondary shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <span className="block text-xs font-mono font-bold text-brand-muted uppercase tracking-wide">
                          Skills to Master in this Phase
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill) => {
                            const isCompleted = completedNodes.includes(skill);
                            const isVerified = proofs?.some(
                              (p) => p.skillName.toLowerCase() === skill.toLowerCase() && p.proofImage
                            );
                            return (
                              <div
                                key={skill}
                                className={`flex items-center gap-1 bg-brand-bg/50 border rounded-full p-0.5 transition-all ${
                                  isVerified ? "border-brand-secondary/40" : "border-white/5 hover:border-white/10"
                                }`}
                              >
                                <button
                                  onClick={() => handleToggleSkillCompleted(skill)}
                                  className={`flex items-center gap-1.5 px-3 py-1 border border-transparent rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                                    isCompleted
                                      ? "bg-brand-secondary/10 text-brand-secondary font-bold"
                                      : "text-brand-body hover:text-white"
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 size={12} className="text-brand-secondary" /> : <Circle size={12} />}
                                  <span>{skill}</span>
                                </button>
                                
                                <button
                                  onClick={() => onVerifySkill(skill)}
                                  className={`p-1.5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                    isVerified 
                                      ? "bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/30 hover:brightness-110" 
                                      : "text-brand-muted hover:text-brand-primary hover:bg-white/5"
                                  }`}
                                  title={isVerified ? "View Project Verification Proof" : "Verify Skill Completion with Project Proof"}
                                >
                                  {isVerified ? (
                                    <ShieldCheck size={12} className="text-brand-secondary animate-pulse" />
                                  ) : (
                                    <Upload size={12} />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Resources (Free vs Paid) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Free resources */}
                      <div className="space-y-3.5">
                        <span className="block text-xs font-mono font-bold text-brand-secondary uppercase tracking-wide">
                          📚 Free Recommended Resources (Always First)
                        </span>
                        <div className="space-y-3">
                          {phase.freeResources.map((res, idx) => {
                            const getIcon = () => {
                              switch (res.type?.toLowerCase()) {
                                case "video":
                                  return <Video size={13} className="text-brand-secondary" />;
                                case "docs":
                                  return <FileText size={13} className="text-brand-secondary" />;
                                case "book":
                                  return <BookOpen size={13} className="text-brand-secondary" />;
                                case "community":
                                  return <Users size={13} className="text-brand-secondary" />;
                                case "tool":
                                  return <Wrench size={13} className="text-brand-secondary" />;
                                default:
                                  return <Globe size={13} className="text-brand-secondary" />;
                              }
                            };

                            return (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-brand-surface rounded-xl border border-white/5 hover:border-brand-secondary/30 transition-all flex items-start justify-between group cursor-pointer"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    {getIcon()}
                                    <span className="text-[10px] font-mono font-bold text-brand-secondary uppercase">
                                      {res.type} • {res.platform}
                                    </span>
                                  </div>
                                  <h6 className="text-xs font-bold text-white leading-snug group-hover:text-brand-secondary transition-colors mt-0.5">
                                    {res.title}
                                  </h6>
                                  <p className="text-[11px] text-brand-muted leading-relaxed">
                                    {res.description}
                                  </p>
                                </div>
                                <ExternalLink size={13} className="text-brand-muted group-hover:text-white shrink-0 ml-2" />
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Paid courses */}
                      <div className="space-y-3.5">
                        <span className="block text-xs font-mono font-bold text-brand-primary-light uppercase tracking-wide">
                          💎 Premium Partner Masterclasses (Sponsored)
                        </span>
                        <div className="space-y-3">
                          {(() => {
                            const matchedUdemy = matchCoursesToSkills(phase.skills);
                            if (matchedUdemy.length > 0) {
                              return matchedUdemy.slice(0, 2).map((course) => (
                                <a
                                  key={course.id}
                                  href={course.affiliateUrl}
                                  target="_blank"
                                  rel="noopener sponsored"
                                  className="p-3 bg-brand-surface/70 border border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-surface rounded-xl transition-all flex items-start justify-between group cursor-pointer text-left"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[9px] font-mono font-bold uppercase tracking-wide bg-brand-primary/10 text-brand-primary-light px-1.5 py-0.5 rounded border border-brand-primary/15">
                                        Udemy • {course.badge}
                                      </span>
                                      <span className="text-[8px] font-mono text-brand-muted">
                                        Sponsored
                                      </span>
                                    </div>
                                    <h6 className="text-xs font-bold text-white leading-snug group-hover:text-brand-primary transition-colors mt-1.5">
                                      {course.title}
                                    </h6>
                                    <div className="flex items-center gap-1.5 text-[10px] text-brand-muted font-mono mt-0.5">
                                      {course.rating ? (
                                        <>
                                          <span className="text-yellow-500 flex items-center gap-0.5"><Star size={10} className="fill-yellow-500" /> {course.rating}</span>
                                          <span>•</span>
                                        </>
                                      ) : (
                                        <span className="italic">Rating pending verification</span>
                                      )}
                                      <span>{course.category}</span>
                                    </div>
                                    <p className="text-[11px] text-brand-muted/80 leading-relaxed mt-1">
                                      Highly rated expert-led preparation curriculum covering: {course.tags.slice(0, 3).join(", ")}.
                                    </p>
                                  </div>
                                  <ExternalLink size={13} className="text-brand-muted group-hover:text-white shrink-0 ml-2 mt-0.5" />
                                </a>
                              ));
                            } else {
                              return phase.paidCourses.map((course, idx) => (
                                <a
                                  key={idx}
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-brand-surface rounded-xl border border-white/5 hover:border-brand-primary/30 transition-all flex items-start justify-between group cursor-pointer text-left"
                                >
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wide bg-brand-primary/10 text-brand-primary-light px-1.5 py-0.5 rounded border border-brand-primary/15">
                                      {course.platform} • Affiliate
                                    </span>
                                    <h6 className="text-xs font-bold text-white leading-snug group-hover:text-brand-primary transition-colors mt-1.5">
                                      {course.title}
                                    </h6>
                                    <span className="block text-[11px] text-brand-muted">
                                      Instructor: {course.instructor} • Rating: ⭐ {course.rating} • Price: ${course.priceUSD}
                                    </span>
                                    <p className="text-[11px] text-brand-muted italic mt-0.5">
                                      "{course.whyRecommended}"
                                    </p>
                                  </div>
                                  <ExternalLink size={13} className="text-brand-muted group-hover:text-white shrink-0 ml-2" />
                                </a>
                              ));
                            }
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Inline Urgency strip contextually based on phase skills */}
                    {(() => {
                      const matchedCourses = matchCoursesToSkills(phase.skills);
                      if (matchedCourses.length > 0) {
                        const course = matchedCourses[0];
                        return (
                          <div className="mt-2">
                            <InlineUrgencyStrip
                              course={course}
                              skillName={phase.skills[0] || course.tags[0]}
                              roleName={roadmap.targetRole}
                              patternType={((phase.phaseNumber || 1) % 4 + 1) as any}
                            />
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Practice Portfolio Projects */}
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <span className="block text-xs font-mono font-bold text-brand-accent uppercase tracking-wide">
                        🛠️ Portfolio Capstone Projects to Build
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.projects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-white/5 bg-brand-bg/50 space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20 uppercase">
                                  {proj.difficulty} Difficulty
                                </span>
                              </div>
                              <h6 className="text-sm font-bold text-white">{proj.title}</h6>
                              <p className="text-xs text-brand-muted leading-relaxed">
                                {proj.description}
                              </p>
                              <span className="block text-[11px] text-brand-muted">
                                <strong className="text-white">Practices:</strong> {proj.skills.join(", ")}
                              </span>
                            </div>

                            {proj.steps && (
                              <div className="pt-3 border-t border-white/5 space-y-1.5">
                                <span className="block text-[10px] font-mono font-bold text-brand-muted uppercase">
                                  Implementation Steps
                                </span>
                                {proj.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="text-xs text-brand-body flex gap-1.5 items-start">
                                    <span className="font-bold text-brand-accent">{sIdx + 1}.</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase Milestone Footer */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-brand-muted">
                        <Milestone size={14} className="text-brand-secondary" />
                        <span>
                          <strong className="text-white">Phase Milestone:</strong> {phase.milestone}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recommended Certifications sequence */}
      {roadmap.certifications && roadmap.certifications.length > 0 && (
        <div className="p-6 bg-brand-surface border border-white/5 rounded-2xl space-y-4">
          <h5 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Award size={18} className="text-brand-primary" /> Professional Certification Timeline
          </h5>
          <p className="text-xs text-brand-muted">
            Acquire these credentials to stand out to hiring agencies. Order indicates suggested sequence of exam targets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.certifications.map((cert, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/5 bg-brand-bg/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold font-mono text-sm shrink-0">
                  #{idx + 1}
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white leading-snug">{cert.name}</h6>
                  <span className="block text-[10px] font-mono text-brand-muted mt-1">
                    Provider: {cert.provider} • Exam Fee: {cert.isFree ? "Free" : `$${cert.examCostUSD}`} • Prep Time: ~{cert.prepWeeks} weeks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Job Readiness Checklist */}
      <div className="p-6 bg-brand-surface border border-white/5 rounded-2xl space-y-4">
        <div>
          <h5 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-secondary" /> Job Readiness Audit
          </h5>
          <p className="text-xs text-brand-muted mt-1">
            Standard checklist to ensure your brand, portfolio, and code repositories are complete before launching applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {roadmap.jobReadinessChecklist?.map((check, idx) => {
            const isChecked = readinessCheck.includes(check.item);
            return (
              <button
                key={idx}
                onClick={() => toggleReadinessCheck(check.item)}
                className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                  isChecked
                    ? "border-brand-secondary/30 bg-brand-secondary/10 text-white"
                    : "border-white/5 bg-brand-bg/50 text-brand-body hover:border-white/12 hover:bg-brand-bg"
                }`}
              >
                <div className={`w-4.5 h-4.5 border rounded flex items-center justify-center mt-0.5 shrink-0 ${
                  isChecked ? "bg-brand-secondary border-brand-secondary text-brand-bg" : "border-white/20 text-transparent"
                }`}>
                  ✓
                </div>
                <div>
                  <span className="font-semibold block">{check.item}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-brand-muted mt-1 block">
                    Category: {check.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
