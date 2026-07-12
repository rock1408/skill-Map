import React from "react";
import { ArrowRight, Cloud, Cpu, ShieldAlert, Code2, TrendingUp, Briefcase, DollarSign, Share2, BookOpen, Sparkles, AlertCircle } from "lucide-react";
import { AffiliateCourse, getCategoryGradients } from "../coursesData";
import StarRating from "./StarRating";

interface CourseBannerProps {
  course: AffiliateCourse;
}

// Helper to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Cloud Computing": return <Cloud className="w-5 h-5 text-indigo-400" />;
    case "Data Science & AI":
    case "Data Analytics": return <Cpu className="w-5 h-5 text-teal-400" />;
    case "Cybersecurity": return <ShieldAlert className="w-5 h-5 text-red-400" />;
    case "Web Development": return <Code2 className="w-5 h-5 text-sky-400" />;
    case "Business":
    case "Business Analysis": return <TrendingUp className="w-5 h-5 text-amber-400" />;
    case "Business Tools": return <Briefcase className="w-5 h-5 text-yellow-400" />;
    case "Finance & ERP": return <DollarSign className="w-5 h-5 text-rose-400" />;
    case "Marketing": return <Share2 className="w-5 h-5 text-pink-400" />;
    default: return <BookOpen className="w-5 h-5 text-violet-400" />;
  }
};

export const CourseBanner: React.FC<CourseBannerProps> = ({ course }) => {
  const grads = getCategoryGradients(course.category);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-brand-bg shadow-lg transition-all duration-500">
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${grads.from} ${grads.to} opacity-90 transition-all duration-700`} />
      <div className="absolute inset-0 bg-[#0D0F14]/40" />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        
        {/* Left column: Category + Title + Tags */}
        <div className="flex-1 space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              {getCategoryIcon(course.category)}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted">
              {course.category}
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-secondary flex items-center gap-1">
              <Sparkles size={10} /> Featured Partner Course
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight tracking-tight">
            {course.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {course.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-brand-muted">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Center column: Badge status */}
        <div className="flex flex-col items-start md:items-center justify-center min-w-[120px]">
          <span className="text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">
            Course Status
          </span>
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary font-bold text-xs uppercase tracking-widest shadow-md">
            <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
            {course.badge}
          </span>
          <span className="text-[9px] font-mono text-brand-muted/70 mt-2 flex items-center gap-1">
            <AlertCircle size={10} /> Sponsored Affiliate
          </span>
        </div>

        {/* Right column: CTA and Star Rating */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-4 justify-center">
          <a
            href={course.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            className="px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-secondary hover:to-brand-secondary/80 text-white font-semibold rounded-xl text-center shadow-lg hover:shadow-brand-secondary/15 transition-all flex items-center justify-center gap-2 group cursor-pointer font-sans"
          >
            Start Learning
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="text-right text-[11px] text-brand-muted max-w-[200px] leading-snug flex flex-col items-start sm:items-end">
            <StarRating rating={course.rating} />
            <span className="block text-[10px] text-brand-muted/60 mt-1">Verified on Udemy™</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseBanner;
