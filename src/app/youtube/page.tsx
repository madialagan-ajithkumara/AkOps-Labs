import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { siteConfig, youtubeSeries } from "@/lib/site-config";
import { PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "AkOps YouTube — DevOps Tutorials, Kubernetes Series & AKOps Tamil",
  description:
    "The AkOps YouTube channel: AKOps Tamil, DevOps tutorials, Kubernetes series, and cloud learning content for engineers building real-world skills.",
};

export default function YoutubePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="glow absolute inset-0" />
        <Container className="relative py-24 text-center">
          <Badge>AkOps YouTube</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            A growing community of DevOps &amp; Cloud engineers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Practical tutorials, full learning series, and Tamil-language content —
            built for engineers learning DevOps, Kubernetes, and cloud from the ground up.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href={siteConfig.youtubeUrl} external>
              Subscribe on YouTube
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Series" title="Content organized around how engineers actually learn." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {youtubeSeries.map((y) => (
              <Card key={y.name}>
                <div className="flex aspect-video items-center justify-center rounded-lg bg-tint">
                  <PlayCircle className="h-10 w-10 text-accent" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent mt-4">
                  <Icon name={y.icon as any} className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{y.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{y.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="card-surface rounded-3xl px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Join thousands of engineers learning in public.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              New DevOps, Kubernetes, and cloud content every week — in English and Tamil.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href={siteConfig.youtubeUrl} external>
                Subscribe on YouTube
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
