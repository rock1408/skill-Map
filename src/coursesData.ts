export interface AffiliateCourse {
  id: number;
  title: string;
  category: string;
  tags: string[];
  affiliateUrl: string;
  badge: string;
  rating: number | null; // TODO: replace with real current rating pulled from Udemy course page before launch
  studentsEnrolled: number | null; // TODO: replace with real student count pulled from Udemy course page before launch
}

export const AFFILIATE_COURSES: AffiliateCourse[] = [
  {
    id: 1,
    title: "Ultimate AWS Certified Solutions Architect Associate 2026",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud", "Certification"],
    affiliateUrl: "https://trk.udemy.com/0GnaEE",
    badge: "Bestseller",
    rating: null, // TODO: replace with real current rating pulled from Udemy course page before launch
    studentsEnrolled: null // TODO: replace with real student count pulled from Udemy course page before launch
  },
  {
    id: 2,
    title: "AWS Networking Zero to Hero: Masterclass",
    category: "Cloud Computing",
    tags: ["AWS", "Networking"],
    affiliateUrl: "https://trk.udemy.com/2RgDkg",
    badge: "Trending",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 3,
    title: "Microsoft Azure AI Cloud Developer Associate [Exams 2026]",
    category: "Cloud Computing",
    tags: ["Azure", "AI", "Certification"],
    affiliateUrl: "https://trk.udemy.com/9V9kG0",
    badge: "New",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 4,
    title: "JavaScript - The Complete Guide (Beginner + Advanced)",
    category: "Web Development",
    tags: ["JavaScript", "Programming"],
    affiliateUrl: "https://trk.udemy.com/JkjnrR",
    badge: "Bestseller",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 5,
    title: "The Complete Full-Stack Web Development Bootcamp",
    category: "Web Development",
    tags: ["Full-Stack", "Web Dev"],
    affiliateUrl: "https://trk.udemy.com/YVjegJ",
    badge: "Bestseller",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 6,
    title: "Learn AI Python Machine Learning Data Science Big Data",
    category: "Data Science & AI",
    tags: ["Python", "AI", "ML", "Data Science"],
    affiliateUrl: "https://trk.udemy.com/xJmMkA",
    badge: "Popular",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 7,
    title: "Cyber Security Course 2026: From Zero To Hero",
    category: "Cybersecurity",
    tags: ["Cybersecurity", "Beginner Friendly"],
    affiliateUrl: "https://trk.udemy.com/OYaqeN",
    badge: "Trending",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 8,
    title: "Product Management Course: Essentials for Beginners",
    category: "Business",
    tags: ["Product Management", "Business"],
    affiliateUrl: "https://trk.udemy.com/NGeLGK",
    badge: "New",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 9,
    title: "Salesforce Mastery: Learn Salesforce and Enhance Your Career",
    category: "Business Tools",
    tags: ["Salesforce", "CRM"],
    affiliateUrl: "https://trk.udemy.com/MKkOKK",
    badge: "Popular",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 10,
    title: "Mastering Microsoft Power Automate 2026: From Zero to Hero",
    category: "Business Tools",
    tags: ["Power Automate", "Automation"],
    affiliateUrl: "https://trk.udemy.com/1GgxGd",
    badge: "New",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 11,
    title: "Power BI For Beginners",
    category: "Data Analytics",
    tags: ["Power BI", "Data Visualization"],
    affiliateUrl: "https://trk.udemy.com/vD0MDe",
    badge: "Beginner Friendly",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 12,
    title: "Business Analysis: BPMN, Data Analytics For Business Analyst",
    category: "Business Analysis",
    tags: ["BPMN", "Business Analysis"],
    affiliateUrl: "https://trk.udemy.com/KBPbxx",
    badge: "Popular",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 13,
    title: "SAP S/4HANA for Financial Accounting Associate Certification",
    category: "Finance & ERP",
    tags: ["SAP", "Finance", "Certification"],
    affiliateUrl: "https://trk.udemy.com/xJmMnv",
    badge: "Certification",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 14,
    title: "SAP para Iniciantes - SAP SD e SAP MM (2026)",
    category: "Finance & ERP",
    tags: ["SAP", "Beginner"],
    affiliateUrl: "https://trk.udemy.com/PzAxaQ",
    badge: "New",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 15,
    title: "Mega Digital Marketing Course A-Z: 32 Courses in 1 + Updates",
    category: "Marketing",
    tags: ["Digital Marketing", "SEO", "Ads"],
    affiliateUrl: "https://trk.udemy.com/ZVmark",
    badge: "Bestseller",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 16,
    title: "AI for Everyone (AI4E)",
    category: "Data Science & AI",
    tags: ["AI", "Beginner Friendly"],
    affiliateUrl: "https://trk.udemy.com/E0xB9K",
    badge: "Popular",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 17,
    title: "Introduction to Artificial Intelligence",
    category: "Data Science & AI",
    tags: ["AI", "Fundamentals"],
    affiliateUrl: "https://trk.udemy.com/6kxjAG",
    badge: "Beginner Friendly",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 18,
    title: "Master HTML: Learn What You Should in HTML",
    category: "Web Development",
    tags: ["HTML", "Beginner"],
    affiliateUrl: "https://trk.udemy.com/YVje1j",
    badge: "Beginner Friendly",
    rating: null,
    studentsEnrolled: null
  },
  {
    id: 19,
    title: "Google Cloud Generative AI Leader Full Practice Exams 2026",
    category: "Cloud Computing",
    tags: ["Google Cloud", "AI", "Certification"],
    affiliateUrl: "https://trk.udemy.com/vD0M4j",
    badge: "Certification",
    rating: null,
    studentsEnrolled: null
  }
];

export function getCategoryGradients(category: string): { from: string; to: string; borderGlow: string } {
  switch (category) {
    case "Cloud Computing":
      return { from: "from-violet-600/20", to: "to-indigo-500/10", borderGlow: "group-hover:border-violet-500/40" };
    case "Data Science & AI":
    case "Data Analytics":
      return { from: "from-teal-600/20", to: "to-emerald-500/10", borderGlow: "group-hover:border-teal-500/40" };
    case "Cybersecurity":
      return { from: "from-red-600/20", to: "to-orange-500/10", borderGlow: "group-hover:border-red-500/40" };
    case "Web Development":
      return { from: "from-sky-600/20", to: "to-blue-500/10", borderGlow: "group-hover:border-sky-500/40" };
    case "Business":
    case "Business Tools":
    case "Business Analysis":
      return { from: "from-amber-600/20", to: "to-yellow-500/10", borderGlow: "group-hover:border-amber-500/40" };
    case "Finance & ERP":
      return { from: "from-rose-600/20", to: "to-purple-500/10", borderGlow: "group-hover:border-rose-500/40" };
    case "Marketing":
      return { from: "from-fuchsia-600/20", to: "to-pink-500/10", borderGlow: "group-hover:border-fuchsia-500/40" };
    default:
      return { from: "from-violet-600/20", to: "to-brand-surface/20", borderGlow: "group-hover:border-brand-primary/40" };
  }
}

export function matchCoursesToSkills(skills: string[]): AffiliateCourse[] {
  if (!skills || skills.length === 0) return [];
  const matched: AffiliateCourse[] = [];
  const addedIds = new Set<number>();

  for (const skill of skills) {
    const sLower = skill.toLowerCase();
    for (const course of AFFILIATE_COURSES) {
      if (addedIds.has(course.id)) continue;

      // Check tag matches
      const tagMatch = course.tags.some(tag => {
        const tLower = tag.toLowerCase();
        return sLower.includes(tLower) || tLower.includes(sLower);
      });

      // Check title matches
      const titleMatch = course.title.toLowerCase().includes(sLower);

      if (tagMatch || titleMatch) {
        matched.push(course);
        addedIds.add(course.id);
      }
    }
  }

  // Fallback to top rated courses if no specific skill matched
  if (matched.length === 0) {
    return AFFILIATE_COURSES.slice(0, 3);
  }

  return matched;
}

export function getCategoryIconName(category: string): string {
  switch (category) {
    case "Cloud Computing": return "Cloud";
    case "Data Science & AI":
    case "Data Analytics": return "Cpu";
    case "Cybersecurity": return "ShieldAlert";
    case "Web Development": return "Code2";
    case "Business":
    case "Business Analysis": return "TrendingUp";
    case "Business Tools": return "Briefcase";
    case "Finance & ERP": return "DollarSign";
    case "Marketing": return "Share2";
    default: return "BookOpen";
  }
}
