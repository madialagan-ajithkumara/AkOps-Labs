// Three subscription plans, all under $5/month (USD).
//  - DevOps: video courses + Playground labs
//  - Project: end-to-end downloadable projects
//  - Pro: everything in DevOps + Project + personal help from Ajith
export type PlanId = "devops" | "project" | "pro";

export type Plan = {
  id: PlanId;
  number: string;
  name: string;
  tagline: string;
  monthly: number; // USD per month, billed monthly
  yearly: number; // USD per month, billed yearly
  color: string;
};

export const plans: Plan[] = [
  { id: "devops", number: "01", name: "DevOps", tagline: "Every DevOps course and lab you need to learn.", monthly: 3.99, yearly: 2.49, color: "#00c853" },
  { id: "project", number: "02", name: "Project", tagline: "End-to-end real projects to build and download.", monthly: 3.99, yearly: 2.49, color: "#f43f5e" },
  { id: "pro", number: "03", name: "Pro", tagline: "Everything in DevOps and Project, plus personal help from Ajith.", monthly: 4.99, yearly: 3.99, color: "#eab308" },
];

export const planById = (id: PlanId) => plans.find((p) => p.id === id)!;
export const discountPct = (p: Plan) => Math.round((1 - p.yearly / p.monthly) * 100);
