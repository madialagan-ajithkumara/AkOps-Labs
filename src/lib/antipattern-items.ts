export type AntiPatternItem = { id: string; label: string; isBad: boolean };

export const antiPatternItems: AntiPatternItem[] = [
  // Bad practices — squash these
  { id: "b1", label: "Hardcoded AWS keys in code", isBad: true },
  { id: "b2", label: "Using :latest tag in prod", isBad: true },
  { id: "b3", label: "Containers running as root", isBad: true },
  { id: "b4", label: "No resource limits on pods", isBad: true },
  { id: "b5", label: "Secrets committed to Git", isBad: true },
  { id: "b6", label: "No health checks configured", isBad: true },
  { id: "b7", label: "Manual changes made in prod", isBad: true },
  { id: "b8", label: "No monitoring or alerting", isBad: true },
  { id: "b9", label: "Skipping review for hotfixes", isBad: true },
  { id: "b10", label: "SSH keys shared over chat", isBad: true },
  { id: "b11", label: "No backup strategy", isBad: true },
  { id: "b12", label: "Single point of failure", isBad: true },
  // Good practices — avoid these
  { id: "g1", label: "Multi-stage Docker build", isBad: false },
  { id: "g2", label: "Least-privilege IAM policy", isBad: false },
  { id: "g3", label: "Readiness & liveness probes", isBad: false },
  { id: "g4", label: "Secrets stored in a vault", isBad: false },
  { id: "g5", label: "Infrastructure as Code", isBad: false },
  { id: "g6", label: "Automated rollback on failure", isBad: false },
  { id: "g7", label: "Immutable infrastructure", isBad: false },
  { id: "g8", label: "Blue-green deployment", isBad: false },
];
