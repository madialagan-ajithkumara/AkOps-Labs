export type TerminalStep = {
  id: string;
  instruction: string;
  accept: string[]; // normalized acceptable command strings
  output: string; // simulated terminal output on success
  hint: string;
};

export type TerminalScenario = {
  id: string;
  slug: string;
  title: string;
  tool: "kubectl" | "docker" | "terraform" | "git";
  briefing: string;
  prompt: string; // shell prompt shown, e.g. "prod-cluster ~"
  steps: TerminalStep[];
  xp: number;
};

function norm(cmd: string): string {
  return cmd.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isCommandCorrect(input: string, accept: string[]): boolean {
  const n = norm(input);
  return accept.some((a) => norm(a) === n);
}

export const terminalScenarios: TerminalScenario[] = [
  {
    id: "crash-loop",
    slug: "crash-loop",
    title: "Crash-Looping Pod",
    tool: "kubectl",
    briefing:
      "The checkout-service in production is throwing 502s. Customers can't check out. Diagnose the pod and roll it back to the last working version.",
    prompt: "prod-cluster ~",
    xp: 60,
    steps: [
      {
        id: "s1",
        instruction: "List the pods to see what's going on.",
        accept: ["kubectl get pods"],
        output:
          "NAME                          READY   STATUS             RESTARTS   AGE\ncheckout-service-7d8f9-x2k1   0/1     CrashLoopBackOff   6          4m",
        hint: "Try: kubectl get pods",
      },
      {
        id: "s2",
        instruction: "Describe the crashing pod to see recent events.",
        accept: [
          "kubectl describe pod checkout-service-7d8f9-x2k1",
          "kubectl describe pods checkout-service-7d8f9-x2k1",
        ],
        output:
          "Events:\n  Warning  BackOff  ... Back-off restarting failed container\n  Warning  Unhealthy ... Readiness probe failed: connection refused on :8080",
        hint: "Try: kubectl describe pod checkout-service-7d8f9-x2k1",
      },
      {
        id: "s3",
        instruction: "Check the container logs to find the actual error.",
        accept: [
          "kubectl logs checkout-service-7d8f9-x2k1",
          "kubectl logs pod/checkout-service-7d8f9-x2k1",
        ],
        output:
          'FATAL panic: cannot connect to database\n  DB_HOST env var is unset (bad config from last deploy)',
        hint: "Try: kubectl logs checkout-service-7d8f9-x2k1",
      },
      {
        id: "s4",
        instruction:
          "The last deploy shipped a broken config. Roll the deployment back to the previous revision.",
        accept: [
          "kubectl rollout undo deployment/checkout-service",
          "kubectl rollout undo deployment checkout-service",
        ],
        output:
          "deployment.apps/checkout-service rolled back\nRolling update ... checkout-service-6c4a2 1/1 Running",
        hint: "Try: kubectl rollout undo deployment/checkout-service",
      },
    ],
  },
  {
    id: "scale-traffic",
    slug: "scale-traffic",
    title: "Black Friday Traffic Spike",
    tool: "kubectl",
    briefing:
      "Traffic to the storefront is about to 4x for a flash sale in 10 minutes. Scale the deployment ahead of the spike and confirm it landed.",
    prompt: "prod-cluster ~",
    xp: 45,
    steps: [
      {
        id: "s1",
        instruction: "Check the current deployments and replica counts.",
        accept: ["kubectl get deployments", "kubectl get deployment"],
        output:
          "NAME        READY   UP-TO-DATE   AVAILABLE   AGE\nstorefront  2/2     2            2           12d",
        hint: "Try: kubectl get deployments",
      },
      {
        id: "s2",
        instruction: "Scale the storefront deployment to 8 replicas.",
        accept: [
          "kubectl scale deployment/storefront --replicas=8",
          "kubectl scale deployment storefront --replicas=8",
          "kubectl scale deploy/storefront --replicas=8",
        ],
        output: "deployment.apps/storefront scaled",
        hint: "Try: kubectl scale deployment/storefront --replicas=8",
      },
      {
        id: "s3",
        instruction: "Watch the pods to confirm all 8 replicas are ready.",
        accept: ["kubectl get pods"],
        output:
          "8/8 pods Running — storefront is ready for the traffic spike.",
        hint: "Try: kubectl get pods",
      },
    ],
  },
  {
    id: "docker-build",
    slug: "docker-build",
    title: "Broken Docker Build",
    tool: "docker",
    briefing:
      "A teammate says 'it works on my machine' but the image won't build in CI. Build it locally, list the image, and run it to verify the fix.",
    prompt: "local ~/app",
    xp: 45,
    steps: [
      {
        id: "s1",
        instruction: "Build the image from the Dockerfile in this directory, tagged as app:latest.",
        accept: ["docker build -t app:latest .", "docker build -t app ."],
        output:
          "Step 6/6 : CMD [\"node\", \"server.js\"]\nSuccessfully built 4f9a12c8e0d1\nSuccessfully tagged app:latest",
        hint: "Try: docker build -t app:latest .",
      },
      {
        id: "s2",
        instruction: "List local images to confirm it was created.",
        accept: ["docker images"],
        output:
          "REPOSITORY   TAG      IMAGE ID       SIZE\napp          latest   4f9a12c8e0d1   184MB",
        hint: "Try: docker images",
      },
      {
        id: "s3",
        instruction: "Run the container, mapping container port 8080 to host port 8080.",
        accept: [
          "docker run -p 8080:8080 app",
          "docker run -p 8080:8080 app:latest",
        ],
        output: "Server listening on :8080 — build fixed, ready for CI.",
        hint: "Try: docker run -p 8080:8080 app",
      },
    ],
  },
  {
    id: "terraform-drift",
    slug: "terraform-drift",
    title: "Terraform Drift Check",
    tool: "terraform",
    briefing:
      "Someone made a manual change to an S3 bucket in the AWS console. Find the drift and apply the code as the source of truth.",
    prompt: "infra/prod ~",
    xp: 50,
    steps: [
      {
        id: "s1",
        instruction: "See what Terraform thinks will change before touching anything.",
        accept: ["terraform plan"],
        output:
          "~ resource \"aws_s3_bucket\" \"assets\" {\n    ~ versioning { enabled = false -> true }\n  }\nPlan: 0 to add, 1 to change, 0 to destroy.",
        hint: "Try: terraform plan",
      },
      {
        id: "s2",
        instruction: "List the resources currently tracked in state.",
        accept: ["terraform state list"],
        output: "aws_s3_bucket.assets\naws_iam_role.app\naws_vpc.main",
        hint: "Try: terraform state list",
      },
      {
        id: "s3",
        instruction: "Apply the plan to bring the bucket back in line with code.",
        accept: ["terraform apply -auto-approve", "terraform apply"],
        output:
          "aws_s3_bucket.assets: Modifying...\naws_s3_bucket.assets: Modifications complete\nApply complete! Resources: 0 added, 1 changed, 0 destroyed.",
        hint: "Try: terraform apply",
      },
    ],
  },
];
