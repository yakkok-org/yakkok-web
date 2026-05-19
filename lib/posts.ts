import type { ComponentType } from "react";

import ParentsSevenWays, {
  meta as parentsSevenWaysMeta,
} from "@/content/blog/parents-seven-ways.mdx";
import SupplementCombinations, {
  meta as supplementCombinationsMeta,
} from "@/content/blog/supplement-combinations.mdx";
import HypertensionMissedDose, {
  meta as hypertensionMissedDoseMeta,
} from "@/content/blog/hypertension-missed-dose.mdx";
import DementiaChecklist, {
  meta as dementiaChecklistMeta,
} from "@/content/blog/dementia-checklist.mdx";
import HeartwormSchedule, {
  meta as heartwormScheduleMeta,
} from "@/content/blog/heartworm-schedule.mdx";
import WomensEssentialSupplements, {
  meta as womensEssentialSupplementsMeta,
} from "@/content/blog/womens-essential-supplements.mdx";
import SeniorFallMedications, {
  meta as seniorFallMedicationsMeta,
} from "@/content/blog/senior-fall-medications.mdx";
import SleepAidGuide, {
  meta as sleepAidGuideMeta,
} from "@/content/blog/sleep-aid-guide.mdx";
import EmptyStomachMedications, {
  meta as emptyStomachMedicationsMeta,
} from "@/content/blog/empty-stomach-medications.mdx";
import HangoverCureTruth, {
  meta as hangoverCureTruthMeta,
} from "@/content/blog/hangover-cure-truth.mdx";
import GymBeginnerSupplements, {
  meta as gymBeginnerSupplementsMeta,
} from "@/content/blog/gym-beginner-supplements.mdx";

export type BlogCategory =
  | "family"
  | "nutrition"
  | "chronic"
  | "senior"
  | "pet"
  | "lifestyle";

export interface BlogPostFaq {
  q: string;
  a: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedAt: string;
  updatedAt?: string;
  hero: { emoji: string; tagline: string };
  image: {
    src: string;
    alt: string;
    credit: { name: string; link: string };
  };
  faqs?: BlogPostFaq[];
}

export interface BlogPost extends BlogPostMeta {
  Body: ComponentType;
}

function toPost(rawMeta: unknown, Body: ComponentType): BlogPost {
  return { ...(rawMeta as BlogPostMeta), Body };
}

export const BLOG_POSTS: BlogPost[] = [
  toPost(parentsSevenWaysMeta, ParentsSevenWays),
  toPost(supplementCombinationsMeta, SupplementCombinations),
  toPost(hypertensionMissedDoseMeta, HypertensionMissedDose),
  toPost(dementiaChecklistMeta, DementiaChecklist),
  toPost(heartwormScheduleMeta, HeartwormSchedule),
  toPost(womensEssentialSupplementsMeta, WomensEssentialSupplements),
  toPost(seniorFallMedicationsMeta, SeniorFallMedications),
  toPost(sleepAidGuideMeta, SleepAidGuide),
  toPost(emptyStomachMedicationsMeta, EmptyStomachMedications),
  toPost(hangoverCureTruthMeta, HangoverCureTruth),
  toPost(gymBeginnerSupplementsMeta, GymBeginnerSupplements),
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function findPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) return undefined;
  return BLOG_POSTS.find((p) => p.slug === slug);
}

type ImageVariant = "hero" | "card" | "og";

export function postImageUrl(
  src: string,
  variant: ImageVariant = "hero"
): string {
  const params: Record<ImageVariant, string> = {
    hero: "w=1600&h=900&q=80&auto=format&fit=crop",
    card: "w=800&h=450&q=80&auto=format&fit=crop",
    og: "w=1200&h=630&q=80&auto=format&fit=crop",
  };
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}${params[variant]}`;
}
