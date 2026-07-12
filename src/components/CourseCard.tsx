import React from "react";
import { ExternalLink, Cloud, Cpu, ShieldAlert, Code2, TrendingUp, Briefcase, DollarSign, Share2, BookOpen, Info } from "lucide-react";
import { AffiliateCourse, getCategoryGradients } from "../coursesData";
import StarRating from "./StarRating";

interface CourseCardProps {
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

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const grads = getCategoryGradients(course.category);

  return (
    <div
      className={`group relative flex flex-col justify-between bg-brand-surface border border-white/8 rounded-2xl p-5 hover:-translate-y-1.5 transition-all duration-300 shadow-xl ${grads.borderGlow}`}
    >
      {/* Background tint layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${grads.from} ${grads.to} opacity-5 rounded-2xl transition-opacity group-hover:opacity-10 pointer-events-none`} />

      <div>
        {/* Top row: Icon, Sponsored indicator, Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              {getCategoryIcon(course.category)}
            </span>
            <span className="text-[9px] font-mono font-bold tracking-wider text-brand-secondary uppercase bg-brand-secondary/10 px-1.5 py-0.5 rounded border border-brand-secondary/20">
              Sponsored
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-muted uppercase bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full">
            {course.badge}
          </span>
        </div>

        {/* Course Title */}
        <h4 className="font-display text-base font-bold text-white tracking-tight line-clamp-2 leading-snug mb-3 text-left">
          {course.title}
        </h4>

        {/* Reusable Star Rating Component */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-left">
          <StarRating rating={course.rating} />
          {course.rating !== null && course.studentsEnrolled && (
            <span className="text-[10px] text-brand-muted whitespace-nowrap">({course.studentsEnrolled.toLocaleString()} students)</span>
          )}
        </div>
      </div>

      {/* Footer section */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
        {/* Tag Pills */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-brand-muted">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <a
          href={course.affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
          className="w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:border-brand-secondary hover:bg-brand-secondary/15 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:shadow-lg group-hover:shadow-brand-primary/15 cursor-pointer"
        >
          View Course
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
