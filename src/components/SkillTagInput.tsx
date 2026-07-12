import React, { useState, useRef, useEffect } from "react";
import { Search, X, Check, Award, GraduationCap, Briefcase, ChevronRight, Sliders, Info } from "lucide-react";
import { SKILLS_DATABASE, SkillItem } from "../data";

interface SelectedSkill {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced";
}

interface SkillTagInputProps {
  selectedSkills: SelectedSkill[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<SelectedSkill[]>>;
  experienceYears: number;
  setExperienceYears: (y: number) => void;
  education: string;
  setEducation: (e: string) => void;
  onNext: () => void;
}

export default function SkillTagInput({
  selectedSkills,
  setSelectedSkills,
  experienceYears,
  setExperienceYears,
  education,
  setEducation,
  onNext,
}: SkillTagInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SkillItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update autocomplete suggestions based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = SKILLS_DATABASE.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedSkills.some((sel) => sel.name.toLowerCase() === s.name.toLowerCase())
    ).slice(0, 8);
    setSuggestions(filtered);
  }, [searchQuery, selectedSkills]);

  const addSkill = (skillName: string) => {
    if (!selectedSkills.some((s) => s.name === skillName)) {
      setSelectedSkills((prev) => [...prev, { name: skillName, proficiency: "beginner" }]);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const toggleProficiency = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.map((s) => {
        if (s.name !== skillName) return s;
        const levels: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];
        const nextIndex = (levels.indexOf(s.proficiency) + 1) % levels.length;
        return { ...s, proficiency: levels[nextIndex] };
      })
    );
  };

  // Quick preset adder
  const addPreset = (label: string, skills: string[]) => {
    setSelectedSkills((prev) => {
      const updated = [...prev];
      skills.forEach((s) => {
        if (!updated.some((u) => u.name === s)) {
          updated.push({ name: s, proficiency: "beginner" });
        }
      });
      return updated;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Input Box */}
      <div className="space-y-3">
        <label className="block text-lg font-display font-medium text-white">
          What do you already know?
        </label>
        <p className="text-brand-muted text-sm leading-relaxed">
          Search and select any skills, databases, programming frameworks, design platforms, or soft skills you have. Click a chip to cycle proficiency levels.
        </p>

        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-brand-muted" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  e.preventDefault();
                  if (suggestions.length > 0) {
                    addSkill(suggestions[0].name);
                  } else {
                    addSkill(searchQuery.trim());
                  }
                }
              }}
              placeholder="Search e.g. Python, Figma, Excel, Project Management, Patient Care..."
              className="w-full pl-11 pr-4 py-3.5 bg-brand-surface border border-white/10 rounded-xl focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/40 font-sans text-white placeholder-brand-muted transition-all"
            />
          </div>

          {showSuggestions && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#161b27] border border-white/15 rounded-xl shadow-2xl divide-y divide-white/5 overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={item.name}
                  onClick={() => addSkill(item.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-primary/10 transition-colors cursor-pointer"
                >
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-surface border border-white/5 text-brand-muted">
                    {item.category}
                  </span>
                </button>
              ))}
              {suggestions.length === 0 && (
                <button
                  onClick={() => addSkill(searchQuery.trim())}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-secondary/10 transition-colors cursor-pointer"
                >
                  <span className="text-brand-secondary font-medium">Add "{searchQuery.trim()}" as a custom skill</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary">
                    Custom
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Chips Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold font-display text-brand-white uppercase tracking-wider">
            Your Skills ({selectedSkills.length})
          </span>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => setSelectedSkills([])}
              className="text-xs text-brand-accent hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/8 rounded-2xl bg-brand-surface/30 text-center">
            <Sliders size={28} className="text-brand-muted mb-3" />
            <p className="text-sm text-brand-muted">No skills selected yet. Type above or check presets below!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {selectedSkills.map((skill) => {
              const profColor =
                skill.proficiency === "advanced"
                  ? "border-brand-primary bg-brand-primary/15 text-brand-primary-light"
                  : skill.proficiency === "intermediate"
                  ? "border-brand-secondary bg-brand-secondary/15 text-brand-secondary"
                  : "border-brand-warning bg-brand-warning/15 text-brand-warning";

              return (
                <div
                  key={skill.name}
                  className={`flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 border rounded-full text-xs font-mono font-medium transition-all ${profColor}`}
                >
                  <button
                    onClick={() => toggleProficiency(skill.name)}
                    className="hover:opacity-80 font-bold capitalize transition-opacity mr-1"
                    title="Click to toggle proficiency level"
                  >
                    {skill.name} ({skill.proficiency})
                  </button>
                  <button
                    onClick={() => removeSkill(skill.name)}
                    className="p-0.5 rounded-full hover:bg-white/10 text-brand-muted hover:text-white transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick presets row */}
      <div className="space-y-3">
        <span className="text-xs font-semibold font-display text-brand-white uppercase tracking-wider flex items-center gap-1.5">
          <Info size={14} className="text-brand-secondary" /> Common starting backgrounds
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => addPreset("basic_coding", ["Python", "HTML", "CSS", "Bash", "Problem Solving"])}
            className="flex flex-col text-left p-3.5 bg-brand-surface hover:bg-brand-surface2 border border-white/8 hover:border-white/12 rounded-xl transition-all group"
          >
            <span className="font-semibold text-white group-hover:text-brand-secondary text-sm">💻 Basic Coding</span>
            <span className="text-[11px] text-brand-muted mt-1 leading-snug">Adds Python, HTML, CSS, Bash, and logic skills.</span>
          </button>
          <button
            onClick={() => addPreset("biz_admin", ["Excel", "PowerPoint", "Google Sheets", "Leadership", "Project Management"])}
            className="flex flex-col text-left p-3.5 bg-brand-surface hover:bg-brand-surface2 border border-white/8 hover:border-white/12 rounded-xl transition-all group"
          >
            <span className="font-semibold text-white group-hover:text-brand-secondary text-sm">📊 Business / Ops</span>
            <span className="text-[11px] text-brand-muted mt-1 leading-snug">Adds Excel, PowerPoint, Project Management, and Leadership.</span>
          </button>
          <button
            onClick={() => addPreset("trades", ["Blueprint reading", "Hand tools", "Troubleshooting", "Communication"])}
            className="flex flex-col text-left p-3.5 bg-brand-surface hover:bg-brand-surface2 border border-white/8 hover:border-white/12 rounded-xl transition-all group"
          >
            <span className="font-semibold text-white group-hover:text-brand-secondary text-sm">🔧 Trades Background</span>
            <span className="text-[11px] text-brand-muted mt-1 leading-snug">Adds tools usage, troubleshooting, blueprint reading, etc.</span>
          </button>
        </div>
      </div>

      {/* Experience & Education Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        {/* Experience Slider */}
        <div className="space-y-3 bg-brand-surface p-4 border border-white/5 rounded-xl">
          <label className="flex items-center gap-2 text-sm font-medium text-white">
            <Briefcase size={16} className="text-brand-secondary" /> Years of Work Experience
          </label>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-display font-bold text-brand-secondary">
              {experienceYears === 0 ? "Entry level (0)" : experienceYears === 20 ? "20+ years" : `${experienceYears} Years`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value))}
            className="w-full h-1.5 bg-brand-surface2 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
          />
        </div>

        {/* Education Selection */}
        <div className="space-y-3 bg-brand-surface p-4 border border-white/5 rounded-xl">
          <label className="flex items-center gap-2 text-sm font-medium text-white">
            <GraduationCap size={16} className="text-brand-primary" /> Highest Education Level
          </label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full px-3 py-2 bg-brand-surface2 border border-white/10 rounded-lg text-sm text-white focus:border-brand-primary outline-none transition-all cursor-pointer"
          >
            <option value="Self-Taught" className="bg-[#18181b] text-white">Self-Taught / Independent Learner</option>
            <option value="High School" className="bg-[#18181b] text-white">High School Diploma</option>
            <option value="Bootcamp" className="bg-[#18181b] text-white">Bootcamp Graduate</option>
            <option value="Some College" className="bg-[#18181b] text-white">Some College Coursework</option>
            <option value="Associate's" className="bg-[#18181b] text-white">Associate's Degree</option>
            <option value="Bachelor's" className="bg-[#18181b] text-white">Bachelor's Degree</option>
            <option value="Master's" className="bg-[#18181b] text-white">Master's Degree</option>
            <option value="PhD" className="bg-[#18181b] text-white">PhD / Doctorate</option>
            <option value="Trade/Vocational" className="bg-[#18181b] text-white">Trade or Vocational Certificate</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={selectedSkills.length === 0}
          className="flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
        >
          Choose My Careers <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
