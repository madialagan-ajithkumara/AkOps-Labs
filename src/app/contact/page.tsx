import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { siteConfig } from "@/lib/site-config";
import { Mail, Linkedin, Youtube, Github, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact AkOps Labs",
  description:
    "Get in touch with AkOps Labs for consulting, corporate training, partnerships, or product questions about AkOps Resume AI.",
};

const reasons = [
  "DevOps, Cloud, or Platform Engineering consulting",
  "Corporate training with AkOps Academy",
  "Partnership or integration inquiries",
  "Questions about AkOps Resume AI",
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow absolute inset-0" />
      <Container className="relative py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Contact</Badge>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Let&apos;s build something together.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Tell us about your project, team, or question — we typically respond
            within one business day.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card>
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-lg border border-hairline bg-tint px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg border border-hairline bg-tint px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="company">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full rounded-lg border border-hairline bg-tint px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="reason">
                    What can we help with?
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    className="w-full rounded-lg border border-hairline bg-tint px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    {reasons.map((r) => (
                      <option key={r} value={r} className="bg-surface">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-hairline bg-tint px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                    placeholder="Tell us a bit about what you're looking for..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90 sm:w-auto"
                >
                  Send message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card>
              <h3 className="text-sm font-semibold">Direct contact</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold">Follow AkOps Labs</h3>
              <div className="mt-3 space-y-3">
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href={siteConfig.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
                  <Youtube className="h-4 w-4" /> YouTube
                </a>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold">Looking for AkOps Resume AI?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Product support and feedback for Resume AI is handled directly on the platform.
              </p>
              <a
                href={siteConfig.resumeAiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
              >
                Open AkOps Resume AI ↗
              </a>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
