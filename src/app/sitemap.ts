import type { MetadataRoute } from "next";
import { siteConfig, playgroundGames } from "@/lib/site-config";
import { courses } from "@/lib/courses";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/courses",
    ...courses.map((c) => `/courses/${c.slug}`),
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/playground",
    "/playground/tasks",
    "/playground/progress",
    ...playgroundGames.map((g) => `/playground/${g.slug}`),
    "/roadmaps",
    "/pricing",
    "/services",
    "/about",
    "/login",
  ];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
