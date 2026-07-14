import {
  GitBranch,
  Cloud,
  LayoutGrid,
  PieChart,
  Sparkles,
  ScanSearch,
  Gauge,
  Compass,
  FileEdit,
  GraduationCap,
  Wrench,
  BadgeCheck,
  Building2,
  Languages,
  PlaySquare,
  Boxes,
  CloudCog,
  CheckCircle2,
  type LucideProps,
} from "lucide-react";

const icons = {
  GitBranch,
  Cloud,
  LayoutGrid,
  PieChart,
  Sparkles,
  ScanSearch,
  Gauge,
  Compass,
  FileEdit,
  GraduationCap,
  Wrench,
  BadgeCheck,
  Building2,
  Languages,
  PlaySquare,
  Boxes,
  CloudCog,
  CheckCircle2,
};

export type IconName = keyof typeof icons;

export default function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
