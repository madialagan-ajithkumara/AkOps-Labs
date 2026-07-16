export type ConceptPair = { id: string; term: string; definition: string };

export const conceptPairs: ConceptPair[] = [
  { id: "idempotency", term: "Idempotency", definition: "Running it many times gives the same result" },
  { id: "iac", term: "Infrastructure as Code", definition: "Managing infra through versioned config files" },
  { id: "blue-green", term: "Blue-Green Deployment", definition: "Two identical environments, switch traffic instantly" },
  { id: "canary", term: "Canary Release", definition: "Roll out a change to a small subset of users first" },
  { id: "rollback", term: "Rollback", definition: "Revert to the last known-good release" },
  { id: "hpa", term: "Horizontal Pod Autoscaler", definition: "Adds or removes pods based on load" },
  { id: "sidecar", term: "Sidecar Pattern", definition: "A helper container running alongside the main app" },
  { id: "immutable", term: "Immutable Infrastructure", definition: "Never patch servers — replace them instead" },
];
