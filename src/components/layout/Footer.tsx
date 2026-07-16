import Link from "next/link";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";
import { Youtube, Linkedin, Github, Mail } from "lucide-react";

const columns = [
  {
    title: "AkOps",
    links: [
      { label: "DevOps Consulting", href: "/services#devops-consulting" },
      { label: "Cloud Engineering", href: "/services#cloud-engineering" },
      { label: "Platform Engineering", href: "/services#platform-engineering" },
      { label: "FinOps", href: "/services#finops" },
      { label: "AIOps", href: "/services#aiops" },
    ],
  },
  {
    title: "Learn & Grow",
    links: [
      { label: "AkOps Resume AI", href: "/resume-ai" },
      { label: "AkOps Academy", href: "/academy" },
      { label: "Roadmaps", href: "/roadmaps" },
      { label: "Playground", href: "/playground" },
      { label: "AkOps YouTube", href: "/youtube" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white">
                A
              </span>
              AkOps Labs
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href={siteConfig.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted hover:text-accent">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-accent">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-accent">
                <Github className="h-5 w-5" />
              </a>
              <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-muted hover:text-accent">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} AkOps Labs. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built with Next.js · Engineered for scale
          </p>
        </div>
      </Container>
    </footer>
  );
}
