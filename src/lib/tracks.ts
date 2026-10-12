import { courses, type Course } from "./courses";

// Subscription tracks. All prices are USD per month and under $5.
// Projects are NOT part of tracks — they stay free with an account.
export type TrackId = "devops" | "cloud" | "kubernetes" | "pro";

export type Track = {
  id: TrackId;
  number: string;
  name: string;
  tagline: string;
  monthly: number; // price per month, billed monthly
  yearly: number; // price per month, billed yearly
  color: string;
  extras: string[];
  comingSoon: string[];
};

export const tracks: Track[] = [
  {
    id: "devops",
    number: "01",
    name: "DevOps",
    tagline: "Every DevOps skill you need to learn.",
    monthly: 3.99,
    yearly: 2.49,
    color: "#00c853",
    extras: ["Hands-on Playground labs", "Daily tasks & XP", "Completion certificates"],
    comingSoon: ["Observability"],
  },
  {
    id: "cloud",
    number: "02",
    name: "Cloud",
    tagline: "Every DevOps and Cloud skill you need to learn.",
    monthly: 4.49,
    yearly: 3.49,
    color: "#f43f5e",
    extras: ["Everything in DevOps (Track 01)", "Completion certificates"],
    comingSoon: ["Azure", "GCP"],
  },
  {
    id: "kubernetes",
    number: "03",
    name: "Kubernetes",
    tagline: "Every DevOps skill plus deep Kubernetes.",
    monthly: 4.49,
    yearly: 3.49,
    color: "#6366f1",
    extras: ["Everything in DevOps (Track 01)", "Completion certificates"],
    comingSoon: ["Helm & GitOps"],
  },
  {
    id: "pro",
    number: "04",
    name: "Pro",
    tagline: "Every skill on the platform, one pass.",
    monthly: 4.99,
    yearly: 3.99,
    color: "#eab308",
    extras: ["Everything in DevOps + Cloud + Kubernetes", "Complete access to the platform", "Complete Labs access"],
    comingSoon: [],
  },
];

export const trackById = (id: TrackId) => tracks.find((t) => t.id === id)!;

// Which tracks include a given course.
export function tracksForCourse(c: Course): TrackId[] {
  if (c.track === "devops") return ["devops", "cloud", "kubernetes", "pro"];
  if (c.track === "cloud") return ["cloud", "pro"];
  return ["kubernetes", "pro"];
}

// Courses a track adds on its own (not inherited from DevOps).
export const ownCourses = (id: TrackId): Course[] =>
  id === "pro" ? [] : courses.filter((c) => c.track === id);

export const discountPct = (t: Track) => Math.round((1 - t.yearly / t.monthly) * 100);
