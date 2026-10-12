// PLACEHOLDER catalog — replace titles, prices, lessons and video IDs with your real content.
// `videoId` is left empty until you decide on a host (Bunny/Vimeo/YouTube); the course
// page shows a video slot that will use it.
export type Course = {
  slug: string;
  title: string;
  tagline: string;
  level: "Beginner" | "Intermediate";
  hours: number;
  priceInr: number;
  priceUsd: number;
  color: string;
  outcomes: string[];
  modules: { title: string; lessons: string[] }[];
  videoId?: string;
  status: "available" | "coming-soon";
};

export const courses: Course[] = [
  {
    slug: "kubernetes-end-to-end",
    title: "Kubernetes End-to-End",
    tagline: "From your first pod to a production-ready cluster.",
    level: "Beginner",
    hours: 12,
    priceInr: 1499,
    priceUsd: 19,
    color: "#6366f1",
    outcomes: ["Deploy and scale apps on Kubernetes", "Use Services, Ingress, ConfigMaps and Secrets", "Debug crashing pods like a pro", "Package apps with Helm"],
    modules: [
      { title: "Containers & Kubernetes basics", lessons: ["Why Kubernetes", "Pods and Deployments", "Services and networking"] },
      { title: "Configuration & storage", lessons: ["ConfigMaps and Secrets", "Volumes and PVCs"] },
      { title: "Operating a cluster", lessons: ["Troubleshooting pods", "Helm basics", "Final project"] },
    ],
    status: "available",
  },
  {
    slug: "aws-for-devops",
    title: "AWS for DevOps",
    tagline: "The AWS services every DevOps engineer actually uses.",
    level: "Beginner",
    hours: 14,
    priceInr: 1499,
    priceUsd: 19,
    color: "#f59e0b",
    outcomes: ["Design a secure VPC and IAM setup", "Run apps on EC2, S3 and RDS", "Automate with the AWS CLI and Terraform", "Control cloud cost"],
    modules: [
      { title: "AWS fundamentals", lessons: ["Accounts and IAM", "VPC networking", "EC2 and storage"] },
      { title: "Automation", lessons: ["AWS CLI", "Terraform on AWS", "Monitoring with CloudWatch"] },
    ],
    status: "available",
  },
  {
    slug: "cicd-end-to-end",
    title: "CI/CD End-to-End",
    tagline: "Build, test and ship with Git, Jenkins and GitHub Actions.",
    level: "Beginner",
    hours: 10,
    priceInr: 999,
    priceUsd: 14,
    color: "#00c853",
    outcomes: ["Build a full CI/CD pipeline", "Containerize and deploy automatically", "Add tests, security scans and rollbacks"],
    modules: [
      { title: "Pipeline foundations", lessons: ["Git workflow", "GitHub Actions", "Jenkins pipelines"] },
      { title: "Shipping to production", lessons: ["Docker in CI", "Deploy to Kubernetes", "Rollbacks"] },
    ],
    status: "available",
  },
  {
    slug: "linux-docker-basics",
    title: "Linux & Docker Basics",
    tagline: "The foundation every DevOps path starts with.",
    level: "Beginner",
    hours: 8,
    priceInr: 799,
    priceUsd: 10,
    color: "#0ea5e9",
    outcomes: ["Be comfortable in the Linux terminal", "Write shell scripts", "Build and run Docker images"],
    modules: [{ title: "Core skills", lessons: ["Linux commands", "Shell scripting", "Dockerfiles", "Docker Compose"] }],
    status: "coming-soon",
  },
  {
    slug: "terraform-iac",
    title: "Terraform & Infrastructure as Code",
    tagline: "Provision cloud infrastructure from code.",
    level: "Intermediate",
    hours: 9,
    priceInr: 1299,
    priceUsd: 17,
    color: "#a855f7",
    outcomes: ["Write reusable Terraform modules", "Manage remote state safely", "Detect and fix drift"],
    modules: [{ title: "Terraform", lessons: ["Providers and resources", "State", "Modules", "Pipelines for IaC"] }],
    status: "coming-soon",
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
