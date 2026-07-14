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
    "/playground/pipeline-speed-run",
    "/playground/bug-squash",
    "/playground/trivia-quiz",
    "/playground/memory-match",
    "/playground/config-debug",
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
