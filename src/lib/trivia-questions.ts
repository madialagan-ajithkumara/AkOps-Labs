export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
};

export const triviaQuestions: Question[] = [
  {
    id: "q1",
    question: "Which command builds a Docker image from a Dockerfile in the current directory?",
    options: ["docker run .", "docker build .", "docker create .", "docker compose ."],
    correctIndex: 1,
    category: "Docker",
  },
  {
    id: "q2",
    question: "In Kubernetes, what is the smallest deployable unit?",
    options: ["Container", "Node", "Pod", "Deployment"],
    correctIndex: 2,
    category: "Kubernetes",
  },
  {
    id: "q3",
    question: "What does CI stand for in CI/CD?",
    options: ["Code Integration", "Continuous Integration", "Container Instance", "Continuous Inspection"],
    correctIndex: 1,
    category: "CI/CD",
  },
  {
    id: "q4",
    question: "Which AWS service is primarily used for object storage?",
    options: ["EC2", "RDS", "S3", "Lambda"],
    correctIndex: 2,
    category: "Cloud",
  },
  {
    id: "q5",
    question: "What Git command creates a new branch and switches to it in one step?",
    options: ["git branch -m", "git checkout -b", "git switch --new", "git merge -b"],
    correctIndex: 1,
    category: "Git",
  },
  {
    id: "q6",
    question: "In Kubernetes, which object manages a set of replica Pods and ensures a stable set is always running?",
    options: ["Service", "ConfigMap", "Deployment", "Ingress"],
    correctIndex: 2,
    category: "Kubernetes",
  },
  {
    id: "q7",
    question: "What is the primary purpose of Terraform?",
    options: [
      "Container orchestration",
      "Infrastructure as Code provisioning",
      "Log aggregation",
      "Continuous deployment only",
    ],
    correctIndex: 1,
    category: "IaC",
  },
  {
    id: "q8",
    question: "Which HTTP status code indicates a successful request?",
    options: ["404", "500", "200", "301"],
    correctIndex: 2,
    category: "Fundamentals",
  },
  {
    id: "q9",
    question: "What does 'idempotent' mean in the context of infrastructure automation?",
    options: [
      "It can only run once",
      "Running it multiple times produces the same result as running it once",
      "It requires manual approval",
      "It automatically rolls back on failure",
    ],
    correctIndex: 1,
    category: "Fundamentals",
  },
  {
    id: "q10",
    question: "Which Kubernetes object exposes a set of Pods as a network service?",
    options: ["Service", "Namespace", "Volume", "Secret"],
    correctIndex: 0,
    category: "Kubernetes",
  },
  {
    id: "q11",
    question: "In FinOps, what does 'rightsizing' refer to?",
    options: [
      "Resizing container images",
      "Matching cloud resource capacity to actual workload needs to reduce cost",
      "Increasing instance count automatically",
      "Compressing log files",
    ],
    correctIndex: 1,
    category: "FinOps",
  },
  {
    id: "q12",
    question: "What is the default port that a Docker container's web server commonly needs mapped with '-p' to be reachable from the host?",
    options: ["It's automatic, no mapping needed", "22", "You must explicitly map host:container ports", "443 always"],
    correctIndex: 2,
    category: "Docker",
  },
  {
    id: "q13",
    question: "Which of these is a canary deployment strategy?",
    options: [
      "Deploying to 100% of users immediately",
      "Gradually rolling out a change to a small subset of users before full release",
      "Deploying only on weekends",
      "Rolling back automatically after every deploy",
    ],
    correctIndex: 1,
    category: "CI/CD",
  },
  {
    id: "q14",
    question: "What does 'IAM' stand for in cloud platforms?",
    options: ["Internal Access Monitor", "Identity and Access Management", "Infrastructure Automation Module", "Integrated Application Manager"],
    correctIndex: 1,
    category: "Cloud",
  },
  {
    id: "q15",
    question: "Which command shows the commit history in Git?",
    options: ["git status", "git log", "git diff", "git show-history"],
    correctIndex: 1,
    category: "Git",
  },
  {
    id: "q16",
    question: "In AIOps, what is 'anomaly detection' primarily used for?",
    options: [
      "Writing documentation automatically",
      "Identifying unusual patterns in metrics/logs that may indicate an incident",
      "Compiling source code faster",
      "Managing user permissions",
    ],
    correctIndex: 1,
    category: "AIOps",
  },
  {
    id: "q17",
    question: "What is a 'blue-green deployment'?",
    options: [
      "A deployment that only runs at night",
      "Running two identical production environments and switching traffic between them",
      "A deployment strategy using only two servers total",
      "Color-coding logs by severity",
    ],
    correctIndex: 1,
    category: "CI/CD",
  },
  {
    id: "q18",
    question: "Which file format does Kubernetes typically use for defining manifests?",
    options: ["XML", "YAML", "INI", "CSV"],
    correctIndex: 1,
    category: "Kubernetes",
  },
];
