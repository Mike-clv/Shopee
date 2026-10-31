import {
  BadgePercent,
  BookOpen,
  CalendarDays,
  ListChecks,
  ShoppingBag,
  Sparkles,
  Tag,
  Timer,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CmsPostIcon } from "./types";

const ICONS: Record<CmsPostIcon, LucideIcon> = {
  BadgePercent,
  Truck,
  BookOpen,
  Timer,
  Zap,
  CalendarDays,
  ListChecks,
  ShoppingBag,
  Sparkles,
  Tag,
};

export function cmsIcon(name: string | null | undefined): LucideIcon {
  return ICONS[(name as CmsPostIcon) ?? "Tag"] ?? Tag;
}
