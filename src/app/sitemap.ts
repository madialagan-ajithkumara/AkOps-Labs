import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/resume-ai",
    "/academy",
    "/roadmaps",
    "/playground",
    "/playground/games",
    "/playground/games/kubernetes",
    "/playground/games/aws",
    "/playground/games/azure",
    "/playground/games/cicd",
    "/playground/games/iac",
    "/playground/tasks",
    "/playground/progress",
    "/playground/pipeline-speed-run",
    "/playground/terminal-challenge",
    "/playground/trivia-quiz",
    "/playground/memory-match",
    "/playground/config-debug",
    "/playground/yaml-battle",
    "/playground/command-ninja",
    "/playground/terraform-escape-room",
    "/playground/aws-cost-detective",
    "/playground/incident-commander",
    "/playground/cicd-simulator",
    "/playground/architecture-builder",
    "/playground/k8s-troubleshooting-room",
    "/playground/ai-interview-arena",
    "/youtube",
    "/about",
    "/contact",
  ];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
