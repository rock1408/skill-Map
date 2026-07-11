import React, { useState, useMemo } from "react";
import { Search, Sparkles, Sliders, Flame, Plus, Check, Trash2, ArrowLeft, ArrowRight, GitMerge, LayoutGrid, Layers, Info } from "lucide-react";
import { INDUSTRIES, CAREER_ROLES, CareerRole, POPULAR_COMBOS } from "../data";

interface MultiCareerPickerProps {
  selectedCareers: string[];
  setSelectedCareers: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

export default function MultiCareerPicker({
  selectedCareers,
  setSelectedCareers,
  onNext,
  onBack,
}: MultiCareerPickerProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all"); // "all", "demand", "high_salary", "fast"

  // Filter career roles based on search, industry, and quick filter chips
  const filteredRoles = useMemo(() => {
    return CAREER_ROLES.filter((role) => {
      const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            role.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesIndustry = selectedIndustry === "all" || role.industryId === selectedIndustry;
      
      let matchesFilter = true;
      if (filterMode === "demand") matchesFilter = role.demand === "High";
      if (filterMode === "high_salary") matchesFilter = role.avgSalary >= 100000;
      if (filterMode === "fast") matchesFilter = role.timeEstimate.includes("4-6") || role.timeEstimate.includes("6-8") || role.timeEstimate.includes("6 months") || role.timeEstimate.includes("8 months");

      return matchesSearch && matchesIndustry && matchesFilter;
    });
  }, [searchQuery, selectedIndustry, filterMode]);

  const toggleCareer = (title: string) => {
    setSelectedCareers((prev) => {
      if (prev.includes(title)) {
        return prev.filter((t) => t !== title);
      }
      if (prev.length >= 4) return prev; // Max 4 careers
      return [...prev, title];
    });
  };

  const selectCombo = (roles: string[]) => {
    setSelectedCareers(roles.slice(0, 4));
  };

  // Live Skill Overlap Calculator
  const skillOverlap = useMemo(() => {
    if (selectedCareers.length < 2) return [];
    const skillCounts: { [key: string]: number } = {};
    selectedCareers.forEach((title) => {
      const role = CAREER_ROLES.find((r) => r.title === title);
      if (role) {
        role.skills.forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    return Object.keys(skillCounts).filter((skill) => skillCounts[skill] >= 2);
  }, [selectedCareers]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro */}
      <div className="space-y-2">
        <label className="block text-lg font-display font-medium text-white">
          Where do you want to go?
        </label>
        <p className="text-brand-muted text-sm leading-relaxed">
          Select up to 4 target careers. SkillMap finds the overlapping skills across all selections, creating an optimized single roadmap so you learn everything efficiently!
        </p>
      </div>

      {/* Popular Combos Horizontal Scroll */}
      <div className="space-y-2">
        <span className="text-xs font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={14} className="text-brand-secondary" /> Popular Career Combinations
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {POPULAR_COMBOS.map((combo) => {
            const isSelected = JSON.stringify(selectedCareers.slice().sort()) === JSON.stringify(combo.roles.slice().sort());
            return (
              <button
                key={combo.id}
                onClick={() => selectCombo(combo.roles)}
                className={`flex-none px-4 py-2 text-xs font-medium font-mono rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand-secondary bg-brand-secondary/15 text-brand-secondary font-bold"
                    : "border-white/8 bg-brand-surface hover:bg-brand-surface2 text-brand-body hover:text-white"
                }`}
              >
                {combo.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Panel Picker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* PANEL 1: Industry Sidebar */}
        <div className="lg:col-span-3 space-y-2 bg-brand-surface border border-white/5 p-3 rounded-2xl max-h-[500px] overflow-y-auto">
          <span className="block text-xs font-bold font-display text-brand-muted uppercase tracking-wider mb-2 px-2">
            Categories
          </span>
          <button
            onClick={() => setSelectedIndustry("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
              selectedIndustry === "all"
                ? "bg-brand-primary/15 text-white border-l-2 border-brand-primary font-bold pl-4"
                : "text-brand-body hover:bg-white/5"
            }`}
          >
            <span>🌐 All Fields</span>
            <span className="text-xs font-mono text-brand-muted">({CAREER_ROLES.length})</span>
          </button>
          {INDUSTRIES.map((ind) => {
            const count = CAREER_ROLES.filter((r) => r.industryId === ind.id).length;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedIndustry === ind.id
                    ? "bg-brand-primary/15 text-white border-l-2 border-brand-primary font-bold pl-4"
                    : "text-brand-body hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{ind.icon}</span>
                  <span className="truncate">{ind.name}</span>
                </span>
                <span className="text-xs font-mono text-brand-muted">({count})</span>
              </button>
            );
          })}
        </div>

        {/* PANEL 2: Career Grid */}
        <div className="lg:col-span-6 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col xl:flex-row gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-2.5 text-brand-muted" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job titles or key skills..."
                className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-white/8 rounded-xl text-sm focus:border-brand-primary outline-none transition-all placeholder-brand-muted"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none flex-nowrap items-center shrink-0">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  filterMode === "all" ? "border-white/15 bg-white/10 text-white" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode("demand")}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  filterMode === "demand" ? "border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted hover:text-white"
                }`}
              >
                <Flame size={12} /> High Demand
              </button>
              <button
                onClick={() => setFilterMode("high_salary")}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  filterMode === "high_salary" ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary-light" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted hover:text-white"
                }`}
              >
                💰 $100k+
              </button>
              <button
                onClick={() => setFilterMode("fast")}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  filterMode === "fast" ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning" : "border-white/5 bg-brand-surface hover:bg-brand-surface2 text-brand-muted hover:text-white"
                }`}
              >
                ⚡ Under 1 Year
              </button>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
            {filteredRoles.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-white/8 bg-brand-surface/25 rounded-2xl text-center text-brand-muted">
                <Sliders size={24} className="mb-2 text-brand-muted" />
                <p className="text-sm">No careers match your current filters.</p>
              </div>
            ) : (
              filteredRoles.map((role) => {
                const isSelected = selectedCareers.includes(role.title);
                const orderIndex = selectedCareers.indexOf(role.title);

                return (
                  <div
                    key={role.title}
                    onClick={() => toggleCareer(role.title)}
                    className={`p-4 border rounded-2xl text-left transition-all cursor-pointer group flex flex-col justify-between h-[180px] ${
                      isSelected
                        ? "border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/5"
                        : "border-white/8 bg-brand-surface hover:border-white/15 hover:bg-brand-surface2"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-muted">
                          {role.industry}
                        </span>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center text-[10px] font-bold">
                            {orderIndex === 0 ? "★" : orderIndex + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-white/20 flex items-center justify-center text-brand-muted group-hover:text-white transition-colors">
                            <Plus size={12} />
                          </div>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-white text-base mt-1.5 leading-snug group-hover:text-brand-secondary transition-colors">
                        {role.title}
                      </h4>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap gap-1">
                        {role.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-surface2 border border-white/5 text-brand-muted"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-brand-muted border-t border-white/5 pt-2">
                        <span className="font-mono text-brand-white font-semibold">
                          {role.salaryRange}
                        </span>
                        <span className="flex items-center gap-1 font-sans">
                          <Flame size={11} className="text-brand-secondary" /> {role.timeEstimate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 3: Career Portfolio Summary */}
        <div className="lg:col-span-3 space-y-4 bg-brand-surface border border-white/5 p-4 rounded-2xl flex flex-col justify-between max-h-[500px]">
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-display text-brand-white uppercase tracking-wider">
                Your Selection ({selectedCareers.length}/4)
              </span>
            </div>

            {selectedCareers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-brand-muted bg-brand-surface2/40 border border-dashed border-white/8 rounded-xl">
                <LayoutGrid size={24} className="mb-2" />
                <p className="text-xs leading-relaxed px-4">
                  Select careers from the list to build your personalized roadmap.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedCareers.map((title, idx) => (
                  <div
                    key={title}
                    className="flex items-center justify-between p-2.5 bg-brand-surface2 border border-white/8 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-brand-secondary">
                        {idx === 0 ? "★" : idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                        {title}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleCareer(title)}
                      className="p-1 rounded hover:bg-white/5 text-brand-muted hover:text-brand-accent transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Overlap Info panel */}
            {selectedCareers.length >= 2 && (
              <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl space-y-2">
                <span className="text-[11px] font-mono font-bold text-brand-secondary flex items-center gap-1.5 uppercase tracking-wide">
                  <GitMerge size={12} /> {skillOverlap.length} Skills Overlap!
                </span>
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  You'll master these shared tools once and gain qualification across all selected paths. High yield!
                </p>
                <div className="flex flex-wrap gap-1">
                  {skillOverlap.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-surface/80 border border-white/5 text-brand-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillOverlap.length > 5 && (
                    <span className="text-[9px] font-mono px-1 py-0.5 text-brand-muted">
                      +{skillOverlap.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer inside panel */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-brand-muted leading-tight">
              <Info size={14} className="text-brand-secondary shrink-0" />
              <span>1st choice is set as primary focus</span>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2.5 font-medium border border-white/10 rounded-xl text-brand-body hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCareers.length === 0}
          className="flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
        >
          Set Preferences <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
