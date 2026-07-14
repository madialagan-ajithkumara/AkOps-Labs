export type Stage = { id: string; label: string };

export type Level = {
  name: string;
  timeLimit: number; // seconds
  stages: Stage[]; // in correct order
};

export const pipelineLevels: Level[] = [
  {
    name: "Level 1 — Basic Pipeline",
    timeLimit: 40,
    stages: [
      { id: "commit", label: "Commit Code" },
      { id: "build", label: "Build" },
      { id: "test", label: "Run Tests" },
      { id: "package", label: "Package" },
      { id: "deploy", label: "Deploy" },
    ],
  },
  {
    name: "Level 2 — CI/CD Pipeline",
    timeLimit: 55,
    stages: [
      { id: "commit", label: "Commit Code" },
      { id: "lint", label: "Lint & Static Analysis" },
      { id: "build", label: "Build" },
      { id: "unit-test", label: "Unit Tests" },
      { id: "containerize", label: "Containerize" },
      { id: "deploy-staging", label: "Deploy to Staging" },
      { id: "integration-test", label: "Integration Tests" },
    ],
  },
  {
    name: "Level 3 — Production Release",
    timeLimit: 70,
    stages: [
      { id: "commit", label: "Commit Code" },
      { id: "lint", label: "Lint & Static Analysis" },
      { id: "build", label: "Build" },
      { id: "unit-test", label: "Unit Tests" },
      { id: "security-scan", label: "Security Scan" },
      { id: "containerize", label: "Containerize" },
      { id: "deploy-staging", label: "Deploy to Staging" },
      { id: "integration-test", label: "Integration Tests" },
      { id: "deploy-prod", label: "Deploy to Production" },
    ],
  },
];
