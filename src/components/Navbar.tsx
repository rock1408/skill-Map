import React from "react";
import { Network, LogIn, User as UserIcon, LayoutDashboard, Compass, LogOut } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}

export default function Navbar({ user, onNavigate, currentPage, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 backdrop-blur-xl bg-brand-bg/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-full h-full text-brand-secondary group-hover:text-brand-white transition-colors">
              <defs>
                <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="36" height="36" rx="10" ry="10" fill="#0D0F14" stroke="url(#navGrad)" strokeWidth="2" />
              <g transform="translate(8, 8)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <rect x="16" y="16" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="9" y="2" width="6" height="6" rx="1" />
                <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                <path d="M12 12V8" />
              </g>
            </svg>
          </div>
          <div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              Skill<span className="text-brand-secondary">Map</span>
            </span>
            <span className="block text-[10px] text-brand-muted font-mono leading-none">
              CAREER DECODER
            </span>
          </div>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate("explore")}
            className={`font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentPage === "explore" ? "text-brand-secondary" : "text-brand-body hover:text-white"
            }`}
          >
            <Compass size={16} /> Explore
          </button>
          <button
            onClick={() => onNavigate("examples")}
            className={`font-medium transition-colors cursor-pointer ${
              currentPage === "examples" ? "text-brand-secondary" : "text-brand-body hover:text-white"
            }`}
          >
            Examples
          </button>
          <button
            onClick={() => onNavigate("compare")}
            className={`font-medium transition-colors cursor-pointer ${
              currentPage === "compare" ? "text-brand-secondary" : "text-brand-body hover:text-white"
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => onNavigate("blog")}
            className={`font-medium transition-colors cursor-pointer ${
              currentPage === "blog" || currentPage === "blog-detail" ? "text-brand-secondary" : "text-brand-body hover:text-white"
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => onNavigate("about")}
            className={`font-medium transition-colors cursor-pointer ${
              currentPage === "about" ? "text-brand-secondary" : "text-brand-body hover:text-white"
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-secondary text-brand-body hover:text-white transition-all text-sm font-medium font-mono"
              >
                <LayoutDashboard size={14} /> {user.name.split(" ")[0]}
              </button>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-brand-accent hover:border-brand-accent/25 transition-all cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-body hover:text-white transition-colors cursor-pointer"
              >
                <LogIn size={15} /> Login
              </button>
              <button
                onClick={() => onNavigate("map")}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-brand-bg font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all cursor-pointer"
              >
                Map My Career
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
