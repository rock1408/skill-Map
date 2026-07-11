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
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
            <div className="w-full h-full bg-brand-bg rounded-[11px] flex items-center justify-center text-brand-secondary group-hover:text-brand-white transition-colors">
              <Network size={20} className="stroke-[2.5]" />
            </div>
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
