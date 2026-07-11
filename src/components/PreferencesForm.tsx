import React from "react";
import { ArrowLeft, Map, Clock, Video, BookOpen, PenTool, Award, GraduationCap, Coins, TrendingUp } from "lucide-react";
import { Preferences } from "../types";

interface PreferencesFormProps {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
  onGenerate: () => void;
  onBack: () => void;
}

export default function PreferencesForm({
  preferences,
  setPreferences,
  onGenerate,
  onBack,
}: PreferencesFormProps) {
  const updatePreference = (key: keyof Preferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLearningStyle = (style: string) => {
    const current = preferences.learningStyle || [];
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    updatePreference("learningStyle", updated);
  };

  const hoursLabels = (h: number) => {
    if (h <= 10) return "Casual Learner (under 10h/wk)";
    if (h <= 20) return "Part-time Hustle (10-20h/wk)";
    if (h <= 30) return "Serious Commitment (20-30h/wk)";
    return "Full-time Focus (30-40h/wk)";
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <label className="block text-lg font-display font-medium text-white">
          Personalize your Roadmap
        </label>
        <p className="text-brand-muted text-sm mt-1">
          These answers help SkillMap customize resource timelines, learning mediums, and recommended milestones.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Timeline selection */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} className="text-brand-primary" /> Target Learning Timeline
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["3 Months", "6 Months", "1 Year", "2 Years", "No Rush"].map((t) => {
              const isSelected = preferences.timeline === t;
              return (
                <button
                  key={t}
                  onClick={() => updatePreference("timeline", t)}
                  className={`p-3 text-sm font-mono rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary-light font-bold"
                      : "border-white/8 bg-brand-surface hover:bg-brand-surface2 text-brand-body hover:text-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Hours available */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} className="text-brand-secondary" /> Weekly Hours Available
          </span>
          <div className="bg-brand-surface border border-white/5 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-brand-secondary">{preferences.hoursPerWeek} Hours/Week</span>
              <span className="text-xs text-brand-muted font-mono">{hoursLabels(preferences.hoursPerWeek)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={preferences.hoursPerWeek}
              onChange={(e) => updatePreference("hoursPerWeek", parseInt(e.target.value))}
              className="w-full h-1.5 bg-brand-surface2 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
            />
          </div>
        </div>

        {/* Learning Styles - MultiSelect */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <span className="block text-sm font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={15} className="text-brand-secondary" /> Preferred Learning Mediums (Select all that apply)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "video", label: "📹 Video Courses", icon: Video },
              { id: "book", label: "📚 Reading & Docs", icon: BookOpen },
              { id: "project", label: "🛠️ Hands-on Projects", icon: PenTool },
              { id: "cert", label: "🏆 Certifications", icon: Award },
            ].map((style) => {
              const isSelected = (preferences.learningStyle || []).includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleLearningStyle(style.id)}
                  className={`p-3.5 flex flex-col items-center justify-center text-center gap-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-secondary bg-brand-secondary/10 text-white font-bold scale-[1.02]"
                      : "border-white/8 bg-brand-surface hover:bg-brand-surface2 text-brand-body hover:text-white"
                  }`}
                >
                  <span className="text-lg">{style.label.split(" ")[0]}</span>
                  <span className="text-xs">{style.label.split(" ").slice(1).join(" ")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Constraints */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
            <Coins size={15} className="text-brand-primary" /> Learning Budget Limit
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "Free Only", label: "🆓 100% Free Only" },
              { id: "$1-$50/mo", label: "💸 $1 - $50 / Month" },
              { id: "$50-$100/mo", label: "💰 $50 - $100 / Month" },
              { id: "No Limit", label: "💎 Unlimited" },
            ].map((b) => {
              const isSelected = preferences.budget === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => updatePreference("budget", b.id)}
                  className={`p-3 text-xs font-mono rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary-light font-bold"
                      : "border-white/8 bg-brand-surface hover:bg-brand-surface2 text-brand-body hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Motivation Category */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={15} className="text-brand-secondary" /> Primary Motivation
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "Salary Growth", label: "📈 Higher Salary" },
              { id: "Remote Freedom", label: "🌍 Remote Work / Freedom" },
              { id: "Career Shift", label: "🔄 Passion / Career Shift" },
              { id: "Job Security", label: "🛡️ Stability & Security" },
            ].map((m) => {
              const isSelected = preferences.motivation === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => updatePreference("motivation", m.id)}
                  className={`p-3 text-xs font-mono rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-secondary bg-brand-secondary/10 text-white font-bold"
                      : "border-white/8 bg-brand-surface hover:bg-brand-surface2 text-brand-body hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2.5 font-medium border border-white/10 rounded-xl text-brand-body hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-[1.02] shadow-xl shadow-brand-primary/20 transition-all cursor-pointer animate-pulse-slow"
        >
          <Map size={18} /> Generate My SkillMap
        </button>
      </div>
    </div>
  );
}
