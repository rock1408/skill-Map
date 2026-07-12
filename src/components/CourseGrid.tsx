import React, { useState } from "react";
import { Search } from "lucide-react";
import { AffiliateCourse, AFFILIATE_COURSES } from "../coursesData";
import CourseCard from "./CourseCard";

interface CourseGridProps {
  initialCategory?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function CourseGrid({ initialCategory = "All", limit, showFilters = true }: CourseGridProps) {
  const [selectedTab, setSelectedTab] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filterTabs = [
    { label: "All Courses", value: "All" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Web Development", value: "Web Development" },
    { label: "AI & Data Science", value: "Data Science" }, // Matches "Data Science & AI" and "Data Analytics"
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Business & Tools", value: "Business" }, // Matches "Business", "Business Tools", "Business Analysis"
    { label: "Finance & ERP", value: "Finance & ERP" },
    { label: "Marketing", value: "Marketing" }
  ];

  // Helper to match filtered categories
  const matchesFilter = (course: AffiliateCourse, tabValue: string) => {
    if (tabValue === "All") return true;
    if (tabValue === "Data Science") {
      return course.category === "Data Science & AI" || course.category === "Data Analytics";
    }
    if (tabValue === "Business") {
      return course.category === "Business" || course.category === "Business Tools" || course.category === "Business Analysis";
    }
    return course.category === tabValue;
  };

  const filteredCourses = AFFILIATE_COURSES.filter(course => {
    const categoryMatches = matchesFilter(course, selectedTab);
    const searchMatches = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatches && searchMatches;
  });

  const displayedCourses = limit ? filteredCourses.slice(0, limit) : filteredCourses;

  return (
    <div className="space-y-6">
      {/* Filters and search bar */}
      {showFilters && (
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search recommended courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-brand-surface border border-white/10 rounded-xl outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 font-sans text-sm text-white placeholder-brand-muted transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer whitespace-nowrap ${
                  selectedTab === tab.value
                    ? "bg-brand-primary/20 text-brand-secondary border-brand-primary/40 shadow-sm"
                    : "bg-brand-surface border-white/5 text-brand-muted hover:text-white hover:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      {displayedCourses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-brand-muted text-sm">No course matches found for your filter/search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
