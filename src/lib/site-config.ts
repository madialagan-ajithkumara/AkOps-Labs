export const siteConfig = {
  name: "AkOps Labs",
  tagline: "Engineering the Future of Cloud, AI & Careers",
  url: "https://akopslabs.com",
  description:
    "AkOps Labs is the parent company behind AkOps Consulting, AkOps Resume AI, AkOps Academy, and the AKOps YouTube community — building enterprise cloud, DevOps, and AI-powered career products.",
  resumeAiUrl: "https://akops-resume.vercel.app/",
  youtubeUrl: "https://youtube.com/@akopstamil",
  email: "hello@akopslabs.com",
  linkedin: "https://linkedin.com/company/akopslabs",
  github: "https://github.com/akopslabs",
};

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Resume AI", href: "/resume-ai" },
  { label: "Academy", href: "/academy" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Playground", href: "/playground" },
  { label: "YouTube", href: "/youtube" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const services = [
  {
    slug: "devops-consulting",
    name: "DevOps Consulting",
    summary: "CI/CD pipelines, release automation, and delivery culture built for enterprise scale.",
    description:
      "We design and implement CI/CD pipelines, Infrastructure as Code, and release engineering practices that cut deployment time from days to minutes — without sacrificing reliability.",
    icon: "GitBranch",
    outcomes: ["50%+ faster release cycles", "Zero-downtime deployments", "Standardized IaC across teams"],
  },
  {
    slug: "cloud-engineering",
    name: "Cloud Engineering",
    summary: "AWS, Azure, and GCP architecture designed for resilience, security, and cost efficiency.",
    description:
      "From landing zones to multi-region architectures, our cloud engineers build infrastructure that scales with your business and survives audits.",
    icon: "Cloud",
    outcomes: ["Multi-cloud & hybrid architecture", "Security-first landing zones", "Infrastructure as Code (Terraform)"],
  },
  {
    slug: "platform-engineering",
    name: "Platform Engineering",
    summary: "Internal developer platforms that give engineering teams self-service, golden-path infrastructure.",
    description:
      "We build internal developer platforms (IDPs) on Kubernetes with golden-path templates, so your engineers ship features instead of fighting infrastructure.",
    icon: "LayoutGrid",
    outcomes: ["Self-service developer platforms", "Kubernetes at production scale", "Golden-path templates & guardrails"],
  },
  {
    slug: "finops",
    name: "FinOps",
    summary: "Cloud cost visibility, forecasting, and optimization that turns spend into a strategic lever.",
    description:
      "We implement FinOps practices and tooling that give finance and engineering shared visibility into cloud spend — then act on it with concrete savings plans.",
    icon: "PieChart",
    outcomes: ["20-40% average cost reduction", "Real-time cost visibility", "Chargeback & showback models"],
  },
  {
    slug: "aiops",
    name: "AIOps",
    summary: "AI-driven observability, anomaly detection, and incident response for modern infrastructure.",
    description:
      "We integrate AI-powered monitoring and anomaly detection into your observability stack, reducing alert fatigue and cutting mean-time-to-resolution.",
    icon: "Sparkles",
    outcomes: ["Faster incident detection", "Noise-free alerting", "Predictive capacity planning"],
  },
];

export const resumeAiFeatures = [
  {
    name: "Resume Analysis",
    description: "Deep, section-by-section analysis of your resume against role-specific benchmarks.",
    icon: "ScanSearch",
  },
  {
    name: "ATS Score",
    description: "Instant compatibility scoring against real Applicant Tracking Systems used by employers.",
    icon: "Gauge",
  },
  {
    name: "Career Coach",
    description: "AI-powered coaching that turns feedback into an actionable, personalized career plan.",
    icon: "Compass",
  },
  {
    name: "AI Resume Builder",
    description: "Generate polished, recruiter-ready resumes in minutes with AI-assisted writing.",
    icon: "FileEdit",
  },
];

export const academyPrograms = [
  {
    name: "Training Programs",
    description: "Structured, cohort-based programs in DevOps, Cloud, and Platform Engineering.",
    icon: "GraduationCap",
    items: ["DevOps Foundations", "Cloud Engineering Bootcamp", "Kubernetes Deep Dive"],
  },
  {
    name: "Workshops",
    description: "Hands-on, instructor-led sessions focused on a single high-impact skill.",
    icon: "Wrench",
    items: ["CI/CD Pipeline Workshop", "Terraform in a Day", "Observability & AIOps Workshop"],
  },
  {
    name: "Certifications",
    description: "Certification-track prep for the credentials that matter to employers.",
    icon: "BadgeCheck",
    items: ["AWS Certified Solutions Architect", "CKA / CKAD Prep", "Azure DevOps Engineer"],
  },
  {
    name: "Corporate Training",
    description: "Custom curriculum delivered on-site or remote for engineering organizations.",
    icon: "Building2",
    items: ["Team upskilling programs", "Custom curriculum design", "Ongoing mentorship tracks"],
  },
];

export const youtubeSeries = [
  {
    name: "AKOps Tamil",
    description: "DevOps and Cloud content in Tamil, built for India's growing engineering community.",
    icon: "Languages",
  },
  {
    name: "DevOps Tutorials",
    description: "Practical, no-fluff tutorials on CI/CD, automation, and delivery pipelines.",
    icon: "PlaySquare",
  },
  {
    name: "Kubernetes Series",
    description: "From first pod to production-grade clusters — a complete Kubernetes learning path.",
    icon: "Boxes",
  },
  {
    name: "Cloud Learning Content",
    description: "Deep dives into AWS, Azure, and GCP services explained the way engineers actually use them.",
    icon: "CloudCog",
  },
];

export const roadmaps = [
  {
    slug: "devops-roadmap",
    name: "DevOps Roadmap",
    description: "From Linux and Git fundamentals to CI/CD pipelines and production monitoring.",
    icon: "GitBranch",
    steps: ["Linux & Shell Scripting", "Git & Version Control", "CI/CD Pipelines", "Containers & Docker", "Monitoring & Alerting"],
  },
  {
    slug: "cloud-roadmap",
    name: "Cloud Roadmap",
    description: "A structured path through AWS, Azure, or GCP — from core services to architecture design.",
    icon: "Cloud",
    steps: ["Cloud Fundamentals", "Networking & IAM", "Compute & Storage", "Infrastructure as Code", "Well-Architected Design"],
  },
  {
    slug: "kubernetes-roadmap",
    name: "Kubernetes Roadmap",
    description: "From your first pod to running resilient, production-grade clusters at scale.",
    icon: "Boxes",
    steps: ["Containers & Images", "Pods, Deployments & Services", "Config, Secrets & Storage", "Helm & GitOps", "Cluster Operations at Scale"],
  },
  {
    slug: "career-roadmap",
    name: "Resume & Career Roadmap",
    description: "Turn your skills into interviews using AkOps Resume AI and a focused job-search system.",
    icon: "Compass",
    steps: ["Resume Analysis & ATS Score", "AI Resume Builder", "Career Coach Feedback", "Targeted Applications", "Interview Preparation"],
  },
];

export const successStories = [
  {
    name: "Arun K.",
    role: "DevOps Engineer, hired after AkOps Academy Bootcamp",
    quote:
      "The Kubernetes Deep Dive workshop was more hands-on than my previous 6 months of self-study. I had a job offer within 3 weeks of finishing.",
  },
  {
    name: "Divya R.",
    role: "Cloud Support Engineer",
    quote:
      "AkOps Resume AI's ATS score feature showed me exactly why my resume wasn't getting past filters. Fixed it in a day, started getting callbacks that week.",
  },
  {
    name: "Karthik S.",
    role: "Platform Engineer, AKOps Tamil viewer",
    quote:
      "I started with the AKOps Tamil YouTube series knowing nothing about DevOps. A year later I'm running Kubernetes clusters in production.",
  },
];

export const playgroundGames = [
  {
    slug: "pipeline-speed-run",
    name: "Pipeline Speed-Run",
    description: "Race the clock to build a CI/CD pipeline in the correct order across 3 levels.",
    icon: "Timer",
    tag: "Speed",
    color: "#0f9d58",
  },
  {
    slug: "bug-squash",
    name: "Bug Squash",
    description: "Click bugs before they cause an outage. Gets faster every round — how long can you last?",
    icon: "Bug",
    tag: "Reflex",
    color: "#dc2626",
  },
  {
    slug: "trivia-quiz",
    name: "DevOps Trivia Quiz",
    description: "Timed multiple-choice questions on Docker, Kubernetes, CI/CD, Cloud, and Git.",
    icon: "HelpCircle",
    tag: "Knowledge",
    color: "#2563eb",
  },
  {
    slug: "memory-match",
    name: "Icon Memory Match",
    description: "Flip and match pairs of DevOps tool icons. Fewer moves, higher score.",
    icon: "LayoutGrid",
    tag: "Casual",
    color: "#db2777",
  },
  {
    slug: "config-debug",
    name: "Config Debug Challenge",
    description: "Spot the broken line in real YAML and Dockerfile snippets before time runs out.",
    icon: "FileWarning",
    tag: "Advanced",
    color: "#ea580c",
  },
];
