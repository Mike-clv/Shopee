import type { LucideIcon } from "lucide-react";

export type BlogBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "tip"; text: string }
  | { kind: "list"; items: string[] }
  | {
      kind: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    };

export type BlogCover = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogAuthor = {
  name: string;
  title: string;
  href: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Static ISO date — deterministic, safe to render during prerender. */
  date: string;
  /** Static ISO date for the latest editorial review. */
  updated: string;
  minutes: number;
  tag: { label: string; href: string };
  icon: LucideIcon;
  /** Full literal Tailwind gradient for the card cover. */
  gradient: string;
  /** Local editorial illustration rendered above the article body. */
  cover: BlogCover;
  author: BlogAuthor;
  /** Search-filter CTAs rendered in the detail page ticket box. */
  hintedCtas: { label: string; href: string }[];
  faqs: BlogFaq[];
  body: BlogBlock[];
};
