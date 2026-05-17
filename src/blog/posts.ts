import type { ComponentType } from "react";

export type BlogCategory =
  | "family"
  | "nutrition"
  | "chronic"
  | "senior"
  | "pet";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedAt: string;
  updatedAt?: string;
  hero: {
    emoji: string;
    tagline: string;
  };
  image: {
    /** Unsplash 등 베이스 photo URL (sizing 파라미터 없는 형태) */
    src: string;
    alt: string;
    credit: {
      name: string;
      link: string;
    };
  };
}

export interface BlogPost extends BlogPostMeta {
  Body: ComponentType;
}

import ParentsSevenWays from "./posts/parents-seven-ways";
import SupplementCombinations from "./posts/supplement-combinations";
import HypertensionMissedDose from "./posts/hypertension-missed-dose";
import DementiaChecklist from "./posts/dementia-checklist";
import HeartwormSchedule from "./posts/heartworm-schedule";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "parents-seven-ways",
    title: "부모님 약 빠뜨리지 않게 챙기는 7가지 방법",
    description:
      "떨어져 사는 부모님의 복약을 자녀가 함께 관리하는 현실적인 7가지 방법. 알림·기록·공유까지 단계별로 정리했습니다.",
    category: "family",
    categoryLabel: "가족 케어",
    publishedAt: "2026-05-17",
    hero: {
      emoji: "👨‍👩‍👧",
      tagline: "떨어져 살아도 함께 챙기는 법",
    },
    image: {
      src: "https://images.unsplash.com/photo-1771527114640-b618002269d4",
      alt: "약을 복용하는 노인의 모습",
      credit: {
        name: "Gizem Nikomedi",
        link: "https://unsplash.com/photos/MRqbrr-vOuU",
      },
    },
    Body: ParentsSevenWays,
  },
  {
    slug: "supplement-combinations",
    title: "영양제 같이 먹으면 안 되는 조합 12가지",
    description:
      "흔히 먹는 영양제 중 함께 복용 시 흡수율이 떨어지거나 부작용이 생길 수 있는 12가지 조합과 시간 차이 두는 법을 정리했습니다.",
    category: "nutrition",
    categoryLabel: "영양제 가이드",
    publishedAt: "2026-05-17",
    hero: {
      emoji: "💊",
      tagline: "흡수율을 떨어뜨리는 조합 정리",
    },
    image: {
      src: "https://images.unsplash.com/photo-1670850757896-e1b6c3e311ea",
      alt: "테이블 위에 놓인 다양한 영양제 알약",
      credit: {
        name: "Supliful - Supplements On Demand",
        link: "https://unsplash.com/photos/AYJV-uVBAv4",
      },
    },
    Body: SupplementCombinations,
  },
  {
    slug: "hypertension-missed-dose",
    title: "고혈압 약, 한 번 빠뜨리면 어떻게 될까?",
    description:
      "고혈압 약을 한 번 깜빡했을 때 어떻게 대처해야 하는지, 반복되면 어떤 위험이 있는지 약사 관점에서 정리했습니다.",
    category: "chronic",
    categoryLabel: "만성질환 관리",
    publishedAt: "2026-05-17",
    hero: {
      emoji: "🩺",
      tagline: "빠뜨린 한 알, 어떻게 대처할까",
    },
    image: {
      src: "https://images.unsplash.com/photo-1562243061-204550d8a2c9",
      alt: "캡슐이 담긴 처방 약병",
      credit: {
        name: "Alexander Grey",
        link: "https://unsplash.com/photos/FEPfs43yiPE",
      },
    },
    Body: HypertensionMissedDose,
  },
  {
    slug: "dementia-checklist",
    title: "치매 초기 부모님 복약 체크리스트",
    description:
      "치매 초기 진단을 받은 부모님의 복약 관리를 위한 가족용 체크리스트. 약 정리부터 응급 상황 대응까지.",
    category: "senior",
    categoryLabel: "시니어 케어",
    publishedAt: "2026-05-17",
    hero: {
      emoji: "🧠",
      tagline: "초기 단계에서 가족이 준비할 것",
    },
    image: {
      src: "https://images.unsplash.com/photo-1702648156180-25d8be9c9527",
      alt: "거실 소파에 함께 앉아 있는 노부부",
      credit: {
        name: "Centre for Ageing Better",
        link: "https://unsplash.com/photos/rQJ3xo-0WYE",
      },
    },
    Body: DementiaChecklist,
  },
  {
    slug: "heartworm-schedule",
    title: "반려견 심장사상충약 1년 스케줄 짜는 법",
    description:
      "반려견 심장사상충 예방약을 1년 내내 빠뜨리지 않고 챙기는 스케줄 짜는 법. 계절별 주의사항도 함께 정리했습니다.",
    category: "pet",
    categoryLabel: "반려동물 케어",
    publishedAt: "2026-05-17",
    hero: {
      emoji: "🐶",
      tagline: "월 1회 약, 빠뜨리지 않는 스케줄링",
    },
    image: {
      src: "https://images.unsplash.com/photo-1700665537604-412e89a285c3",
      alt: "가정에서 함께 있는 사람과 강아지",
      credit: {
        name: "Jonatan Bustos",
        link: "https://unsplash.com/photos/P1Ku27zZJDs",
      },
    },
    Body: HeartwormSchedule,
  },
];

export function findPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) return undefined;
  return BLOG_POSTS.find((p) => p.slug === slug);
}

type ImageVariant = "hero" | "card" | "og";

/**
 * Unsplash hotlink URL에 sizing/quality 파라미터를 붙인다.
 * 변형: hero(상세 헤더), card(목록 썸네일), og(공유 카드).
 */
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
