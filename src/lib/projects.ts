// PLACEHOLDER catalog — replace with your real end-to-end projects.
// `downloadUrl` is where the zip lives (e.g. a Supabase Storage signed URL or GitHub release).
export type Project = {
  slug: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate";
  tools: string[];
  color: string;
  deliverables: string[];
  downloadUrl?: string;
  status: "available" | "coming-soon";
};

export const projects: Project[] = [
  {
    slug: "cicd-pipeline-docker-k8s",
    title: "CI/CD Pipeline: Git to Kubernetes",
    summary: "Take a sample app from commit to a running Kubernetes deployment with an automated pipeline.",
    level: "Beginner",
    tools: ["GitHub Actions", "Docker", "Kubernetes"],
    color: "#00c853",
    deliverables: ["Complete source code", "Pipeline YAML", "Kubernetes manifests", "Step-by-step README"],
    status: "available",
  },
  {
    slug: "terraform-aws-three-tier",
    title: "Three-Tier App on AWS with Terraform",
    summary: "Provision a VPC, load balancer, app servers and database entirely from Terraform.",
    level: "Intermediate",
    tools: ["Terraform", "AWS", "EC2", "RDS"],
    color: "#f59e0b",
    deliverables: ["Terraform modules", "Architecture diagram", "Cost notes", "Teardown guide"],
    status: "available",
  },
  {
    slug: "monitoring-prometheus-grafana",
    title: "Monitoring with Prometheus & Grafana",
    summary: "Add metrics, dashboards and alerts to a containerized application.",
    level: "Beginner",
    tools: ["Prometheus", "Grafana", "Docker Compose"],
    color: "#f43f5e",
    deliverables: ["Compose stack", "Dashboards JSON", "Alert rules"],
    status: "coming-soon",
  },
  {
    slug: "gitops-argocd",
    title: "GitOps with ArgoCD",
    summary: "Run continuous delivery to Kubernetes using Git as the source of truth.",
    level: "Intermediate",
    tools: ["ArgoCD", "Kubernetes", "Helm"],
    color: "#6366f1",
    deliverables: ["Helm chart", "ArgoCD apps", "Promotion workflow"],
    status: "coming-soon",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
