import { Container, Boxes, GitBranch, Rocket, Cloud } from "lucide-react";

type IconSpec = {
  Icon: typeof Boxes;
  top: string;
  left: string;
  size: number;
  color: string;
  bg: string;
  delay: number;
};

const icons: IconSpec[] = [
  { Icon: Container, top: "10%", left: "6%", size: 26, color: "#2563eb", bg: "#dbeafe", delay: 0 },
  { Icon: Boxes, top: "68%", left: "8%", size: 24, color: "#2563eb", bg: "#dbeafe", delay: 0.7 },
  { Icon: GitBranch, top: "14%", left: "88%", size: 24, color: "#ea580c", bg: "#ffedd5", delay: 0.4 },
  { Icon: Rocket, top: "62%", left: "92%", size: 24, color: "#db2777", bg: "#fce7f3", delay: 1.1 },
  { Icon: Cloud, top: "40%", left: "94%", size: 22, color: "#0ea5e9", bg: "#e0f2fe", delay: 1.5 },
];

export default function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-blobs">
        <div className="blob blob-mint" />
        <div className="blob blob-peach" />
        <div className="blob blob-sky" />
      </div>

      {icons.map((f, i) => (
        <div
          key={i}
          className="absolute float-bob"
          style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
        >
          <div
            className="flex items-center justify-center rounded-2xl shadow-md"
            style={{ width: f.size + 26, height: f.size + 26, background: f.bg }}
          >
            <f.Icon style={{ width: f.size * 0.6, height: f.size * 0.6, color: f.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
