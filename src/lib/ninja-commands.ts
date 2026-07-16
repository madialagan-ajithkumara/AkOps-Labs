export type NinjaCommand = { id: string; prompt: string; command: string; category: string };

export const ninjaCommands: NinjaCommand[] = [
  { id: "c1", prompt: "List all pods in all namespaces", command: "kubectl get pods -A", category: "Kubernetes" },
  { id: "c2", prompt: "Show logs for a pod named 'api'", command: "kubectl logs api", category: "Kubernetes" },
  { id: "c3", prompt: "Create a new git branch called 'feature'", command: "git checkout -b feature", category: "Git" },
  { id: "c4", prompt: "See the commit history", command: "git log", category: "Git" },
  { id: "c5", prompt: "Build a Docker image tagged 'app:1.0'", command: "docker build -t app:1.0 .", category: "Docker" },
  { id: "c6", prompt: "List running Docker containers", command: "docker ps", category: "Docker" },
  { id: "c7", prompt: "Initialize a Terraform working directory", command: "terraform init", category: "IaC" },
  { id: "c8", prompt: "Preview Terraform changes", command: "terraform plan", category: "IaC" },
  { id: "c9", prompt: "List files including hidden ones", command: "ls -la", category: "Linux" },
  { id: "c10", prompt: "Find a process by name", command: "ps aux | grep app", category: "Linux" },
  { id: "c11", prompt: "Scale a deployment to 5 replicas", command: "kubectl scale deployment app --replicas=5", category: "Kubernetes" },
  { id: "c12", prompt: "Stage all changes in Git", command: "git add -A", category: "Git" },
  { id: "c13", prompt: "Copy a file into a running container", command: "docker cp file.txt app:/app/file.txt", category: "Docker" },
  { id: "c14", prompt: "Destroy Terraform-managed infrastructure", command: "terraform destroy", category: "IaC" },
  { id: "c15", prompt: "Follow a log file in real time", command: "tail -f app.log", category: "Linux" },
];
