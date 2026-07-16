export type EscapeDoor = {
  id: string;
  clue: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

export const escapeDoors: EscapeDoor[] = [
  {
    id: "door1",
    clue: "The door is locked because your state file is missing. What command initializes a working directory and downloads providers?",
    options: ["terraform init", "terraform plan", "terraform apply", "terraform validate"],
    correctIndex: 0,
    hint: "It's always the first command you run in a new Terraform project.",
  },
  {
    id: "door2",
    clue: "You need to preview what Terraform will change before committing. Which command shows that without applying it?",
    options: ["terraform apply -auto-approve", "terraform plan", "terraform show", "terraform refresh"],
    correctIndex: 1,
    hint: "This command is a dry run.",
  },
  {
    id: "door3",
    clue: "Two engineers are editing the same Terraform project. What prevents them from corrupting the state file simultaneously?",
    options: ["A bigger EC2 instance", "State locking (e.g. via DynamoDB)", "Running terraform twice", "Using more variables"],
    correctIndex: 1,
    hint: "Think concurrency control on the state file.",
  },
  {
    id: "door4",
    clue: "Your infrastructure was changed manually in the AWS console and no longer matches your Terraform code. What is this called?",
    options: ["Drift", "Rollback", "Tainting", "Provisioning"],
    correctIndex: 0,
    hint: "It's the same word used for weather patterns moving off course.",
  },
  {
    id: "door5",
    clue: "The final door: you want to reuse the same set of resources across dev, staging, and prod with different variables. What Terraform feature packages that?",
    options: ["A provider", "A module", "A data source", "A backend"],
    correctIndex: 1,
    hint: "It's a reusable, configurable bundle of resources.",
  },
];
