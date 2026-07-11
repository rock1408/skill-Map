export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export interface Preferences {
  timeline: string;
  hoursPerWeek: number;
  learningStyle: string[];
  budget: string;
  situation: string;
  motivation: string;
}

export interface ExistingSkill {
  skill: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface SkillGap {
  skill: string;
  priority: "critical" | "important" | "nice-to-have";
  reason: string;
}

export interface FreeResource {
  type: "video" | "course" | "docs" | "book" | "community" | "tool";
  title: string;
  platform: string;
  url: string;
  estimatedHours: number;
  description: string;
}

export interface PaidCourse {
  platform: string;
  title: string;
  instructor: string;
  priceUSD: number;
  durationHours: number;
  rating: number;
  url: string;
  whyRecommended: string;
}

export interface ProjectBrief {
  title: string;
  description: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  portfolioValue: string;
  steps: string[];
}

export interface Phase {
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  objectives: string[];
  skills: string[];
  freeResources: FreeResource[];
  paidCourses: PaidCourse[];
  projects: ProjectBrief[];
  milestone: string;
  weeklySchedule: string;
}

export interface Certification {
  name: string;
  provider: string;
  examCostUSD: number;
  prepWeeks: number;
  priority: number;
  url: string;
  isFree: boolean;
}

export interface CareerProgression {
  level: "entry" | "mid" | "senior" | "lead" | "executive";
  title: string;
  yearsExperience: string;
  avgSalaryUSD: number;
  keySkills: string[];
}

export interface JobReadinessItem {
  item: string;
  category: "portfolio" | "network" | "resume" | "skills" | "mindset";
}

export interface ProfessionalCommunity {
  name: string;
  type: "discord" | "slack" | "reddit" | "association" | "meetup";
  url: string;
}

export interface MindMapChild {
  id: string;
  label: string;
  type: "skill" | "resource" | "project" | "cert";
  status: "have" | "learn" | "critical";
  children: MindMapChild[];
}

export interface MindMapBranch {
  id: string;
  label: string;
  color: string;
  children: MindMapChild[];
}

export interface MindMapData {
  centralNode: string;
  branches: MindMapBranch[];
}

export interface RoadmapData {
  targetRole: string;
  industry: string;
  totalEstimatedMonths: number;
  hoursPerWeekAssumed: number;
  skillMatchPercent: number;
  summary: string;
  existingSkillsRecognized: ExistingSkill[];
  skillGaps: SkillGap[];
  phases: Phase[];
  certifications: Certification[];
  careerProgression: CareerProgression[];
  jobReadinessChecklist: JobReadinessItem[];
  professionalCommunities: ProfessionalCommunity[];
  careerTips: string[];
  mindMapData: MindMapData;
}

export interface SavedRoadmap {
  id: string;
  userId: string | null;
  targetRole: string;
  inputSkills: string[];
  preferences: Preferences;
  roadmapJson: RoadmapData;
  created_at: string;
  is_public: boolean;
  share_slug: string;
  view_count: number;
}
