import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AffiliateCourse, AFFILIATE_COURSES } from "../coursesData";

interface InlineUrgencyStripProps {
  course?: AffiliateCourse;
  skillName?: string;
  roleName?: string;
  patternType?: 1 | 2 | 3 | 4;
}

export default function InlineUrgencyStrip({ course, skillName, roleName, patternType = 1 }: InlineUrgencyStripProps) {
  // If no course is specified, pick one that matches skillName or select a default one
  const targetCourse = course || (skillName 
    ? AFFILIATE_COURSES.find(c => c.tags.some(t => t.toLowerCase() === skillName.toLowerCase())) || AFFILIATE_COURSES[0]
    : AFFILIATE_COURSES[0]);

  const activeRole = roleName || "Professional";

  // Construct approved copywriting patterns
  let copyText = "";
  if (patternType === 1) {
    copyText = `Still learning the hard way? "${targetCourse.title}" gets you job-ready faster.`;
  } else if (patternType === 2) {
    copyText = `The gap between where you are and a high-paying ${activeRole} career is smaller than you think — ${targetCourse.title} can close it.`;
  } else if (patternType === 3) {
    copyText = `Everyone else on this path is already learning ${skillName || targetCourse.tags[0] || "these competencies"}. Don't fall behind.`;
  } else {
    copyText = `Free resources will get you started. This comprehensive course gets you hired.`;
  }

  return (
    <div className="w-full relative overflow-hidden bg-brand-surface border border-brand-secondary/20 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-brand-secondary/40 shadow-md">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary to-brand-secondary" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 blur-xl rounded-full pointer-events-none" />

      {/* Text Copy Column */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          <span className="text-[10px] font-mono tracking-wider font-bold text-brand-secondary uppercase">
            RECOMMENDED PARTNER COURSE
          </span>
          <span className="text-[9px] font-mono text-brand-muted">
            • Sponsored Affiliate Link
          </span>
        </div>
        <p className="text-sm font-sans font-medium text-white leading-relaxed">
          {copyText}
        </p>
      </div>

      {/* CTA Button Column */}
      <div className="flex items-center gap-4 shrink-0">
        <a
          href={targetCourse.affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
          className="px-4 py-2 bg-brand-secondary/10 hover:bg-brand-secondary hover:text-brand-bg border border-brand-secondary/30 text-brand-secondary font-bold text-xs rounded-lg flex items-center gap-1 transition-all group whitespace-nowrap cursor-pointer"
        >
          View Course
          <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
