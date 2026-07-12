import React, { useState, useEffect, useRef } from "react";
import { AffiliateCourse, AFFILIATE_COURSES } from "../coursesData";
import CourseBanner from "./CourseBanner";

interface CourseCarouselProps {
  courses?: AffiliateCourse[];
  activeCategory?: string;
}

export default function CourseCarousel({ courses, activeCategory }: CourseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const baseCourses = courses || AFFILIATE_COURSES;
  const filteredByCat = activeCategory 
    ? baseCourses.filter(c => c.category.toLowerCase() === activeCategory.toLowerCase())
    : baseCourses;

  // Filter 4-5 featured courses
  const featuredCourses = filteredByCat.filter(c => 
    c.badge === "Bestseller" || c.badge === "Trending" || c.badge === "Popular" || c.badge === "Recommended"
  ).slice(0, 5);

  // Fallback to any courses in the category if there are no featured badges
  const finalSlides = featuredCourses.length > 0 ? featuredCourses : filteredByCat.slice(0, 5);

  useEffect(() => {
    // Reset index when category or courses change
    setActiveIndex(0);
  }, [activeCategory, courses]);

  useEffect(() => {
    if (finalSlides.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % finalSlides.length);
    }, 5500); // 5.5 second interval

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finalSlides.length, isPaused]);

  if (finalSlides.length === 0) return null;

  const activeCourse = finalSlides[activeIndex];

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Reusable Course Banner */}
      <CourseBanner course={activeCourse} />

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
        {finalSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-5 h-1 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "bg-brand-secondary w-8" : "bg-white/10 hover:bg-white/30"
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
