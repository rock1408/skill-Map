import React, { useState, useEffect } from "react";
import { Network, Sparkles, BrainCircuit } from "lucide-react";

const STEPS = [
  "🔍 Analyzing your background & selected skills...",
  "🎯 Aligning target role prerequisites...",
  "🔗 Mapping skill paths & calculating overlap...",
  "📊 Diagnosing skill gaps & priority nodes...",
  "📚 Scanning leading free tutorials and course registries...",
  "🗺️ Rendering your customized SkillMap visualization..."
];

const QUOTES = [
  "\"The best time to plant a tree was 20 years ago. The second best time is now.\" — Proverb",
  "\"Every expert was once a beginner. Start where you are, use what you have.\" — Arthur Ashe",
  "\"Your career change is just a sequence of mapped skill-acquisitions away.\"",
  "\"Continuous learning is the minimum requirement for success in any modern field.\" — Brian Tracy",
  "\"Do not let what you cannot do interfere with what you can do.\" — John Wooden"
];

export default function GenerationLoader({ aiModel = "hybrid" }: { aiModel?: string }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Increment step sequentially
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(stepInterval);
  }, []);

  // Increment quote
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 3200);

    return () => clearInterval(quoteInterval);
  }, []);

  // Smooth progress bar increment
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; // Hold before load complete
        const inc = Math.random() * 8 + 3;
        return Math.min(prev + inc, 98);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center py-16 px-4 max-w-xl mx-auto space-y-8 animate-fade-in">
      {/* Constellation building animation */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute inset-0 border border-brand-primary/20 rounded-full animate-ping opacity-30" />
        <div className="absolute w-28 h-28 border border-brand-secondary/30 rounded-full animate-pulse opacity-45" />
        
        {/* Animated Connecting SVG */}
        <svg className="absolute inset-0 w-full h-full rotate-45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="14" className="fill-brand-bg stroke-brand-primary stroke-[2] animate-pulse" />
          
          <line x1="50" y1="50" x2="20" y2="20" className="stroke-brand-secondary stroke-[1.5] stroke-dasharray-4 animate-dash" />
          <circle cx="20" cy="20" r="6" className="fill-brand-bg stroke-brand-secondary stroke-[1.5]" />

          <line x1="50" y1="50" x2="80" y2="30" className="stroke-brand-primary stroke-[1.5] stroke-dasharray-4 animate-dash" />
          <circle cx="80" cy="30" r="6" className="fill-brand-bg stroke-brand-primary stroke-[1.5]" />

          <line x1="50" y1="50" x2="35" y2="80" className="stroke-brand-accent stroke-[1.5] stroke-dasharray-4 animate-dash" />
          <circle cx="35" cy="80" r="6" className="fill-brand-bg stroke-brand-accent stroke-[1.5]" />

          <line x1="50" y1="50" x2="75" y2="75" className="stroke-brand-warning stroke-[1.5] stroke-dasharray-4 animate-dash" />
          <circle cx="75" cy="75" r="6" className="fill-brand-bg stroke-brand-warning stroke-[1.5]" />
        </svg>

        <BrainCircuit className="text-brand-secondary animate-pulse relative z-10" size={32} />
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold text-2xl text-white tracking-tight">
          Assembling Your Career Map...
        </h3>
        {/* Steps display list */}
        <div className="min-h-[24px]">
          <p className="text-brand-secondary font-mono text-sm font-semibold animate-pulse">
            {STEPS[currentStepIdx]}
          </p>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="w-full space-y-2">
        <div className="h-2 w-full bg-brand-surface border border-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-brand-muted">
          <span>COMPILING ALGORITHMS</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>

      {/* Active AI Engine Badge */}
      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-surface border border-white/5 rounded-full text-[10px] font-mono text-brand-muted uppercase tracking-wider">
        <Sparkles size={11} className="text-brand-primary animate-pulse" />
        <span>Active Engine: </span>
        <span className="text-brand-secondary font-bold">
          {aiModel === "hybrid" ? "Google Gemini + NVIDIA Nemotron (Parallel Dual)" :
           aiModel === "nemotron" ? "NVIDIA Nemotron-3 NIM" :
           "Google Gemini 3.5"}
        </span>
      </div>

      {/* Rotating quotes box */}
      <div className="p-4 bg-brand-surface border border-white/5 rounded-2xl w-full min-h-[80px] flex items-center justify-center">
        <p className="text-xs text-brand-body italic leading-relaxed max-w-md transition-all duration-500">
          {QUOTES[quoteIdx]}
        </p>
      </div>
    </div>
  );
}
