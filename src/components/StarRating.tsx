import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | null;
}

export default function StarRating({ rating }: StarRatingProps) {
  if (rating === null) {
    return (
      <span className="text-[11px] text-brand-muted font-mono italic">
        Rating pending
      </span>
    );
  }

  const roundedRating = Math.round(rating * 10) / 10;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5 font-mono whitespace-nowrap">
      <div className="flex text-yellow-500 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={11} className="fill-current" />;
          }
          if (i === fullStars && hasHalfStar) {
            // Simple visual star representation
            return <Star key={i} size={11} className="fill-current" />;
          }
          return <Star key={i} size={11} className="opacity-30" />;
        })}
      </div>
      <span className="font-bold text-white text-xs mt-0.5 shrink-0">{roundedRating}★</span>
    </div>
  );
}
