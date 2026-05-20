---
name: blog-post
description: 약꼭 블로그(`/blog/<slug>`)에 새 글을 작성합니다. 사용자가 주제(또는 여러 주제)를 주면 MDX 파일 생성, lib/posts.ts 등록, 빌드 확인까지 한 번에 처리합니다. 카테고리·이미지·CTA·FAQ 패턴 모두 기존 글 톤에 맞춰 자동 작성합니다.
---

# 약꼭 블로그 포스팅 스킬

이 스킬은 약꼭 블로그(`content/blog/*.mdx`)에 새 글을 추가하는 작업을 한 번에 처리합니다.

## 사용자가 줄 정보

최소: **글 주제(제목 또는 키워드)** 한 줄.

선택: 카테고리, 발행일, 슬러그, 분량, 강조하고 싶은 톤 등. 명시되지 않으면 아래 기본값을 따릅니다.

## 워크플로우

1. **주제 수집** — 사용자가 여러 주제를 동시에 제시했다면 각각 별도 글로 처리.
2. **메타 결정** — 슬러그(kebab-case 영문), 카테고리, 이미지(Unsplash), TL;DR 3줄을 먼저 정리.
3. **본문 작성** — 아래 본문 구조 따라 MDX 작성 (5,500~6,500자 권장).
4. **FAQ 작성** — `meta.faqs`에 3~4개 Q&A. 실제 검색 의도에 맞춘 질문으로.
5. **등록** — `lib/posts.ts`에 import와 `BLOG_POSTS` 배열 추가.
6. **검증** — `npx tsc --noEmit` + `npm run build` 확인.
7. **커밋** — 사용자가 별도로 요청하면 그때만 커밋. 기본은 작성까지만.

## 메타 스키마 (참고: `lib/posts.ts`의 `BlogPostMeta`)

```ts
export const meta = {
  slug: "kebab-case-slug",
  title: "검색어와 정확히 매칭되는 제목",
  description: "150~160자, 검색 의도 키워드 2~3개 포함",
  category: "family" | "nutrition" | "chronic" | "senior" | "pet" | "lifestyle",
  categoryLabel: "한국어 라벨", // 아래 카테고리 표 참고
  publishedAt: "YYYY-MM-DD",   // 오늘 날짜 기본
  hero: {
    emoji: "🍽️",                // 주제 상징
    tagline: "한 줄 부제 (15자 내외)",
  },
  image: {
    src: "https://images.unsplash.com/photo-...", // Unsplash photo URL (쿼리 없는 원본)
    alt: "한국어 자연어 1~2문장, 의미 전달",
    credit: {
      name: "사진작가 이름",
      link: "https://unsplash.com/photos/...",
    },
  },
  faqs: [
    { q: "질문?", a: "답변 (1~3문장)" },
    // 3~4개
  ],
};
```

## 카테고리 표

| id | categoryLabel | 적합한 주제 |
| --- | --- | --- |
| `family` | 가족 케어 | 떨어져 사는 부모·자녀 함께 챙기는 복약 |
| `nutrition` | 영양제 가이드 | 영양제 조합·생애주기·운동 영양제 |
| `chronic` | 만성질환 관리 | 혈압·당뇨·고지혈증·갑상선·수면제 |
| `senior` | 시니어 케어 | 낙상·치매·노인 복약 |
| `pet` | 반려동물 케어 | 강아지·고양이 복약 |
| `lifestyle` | 라이프스타일 | 일상 Q&A(끼니·음주·운동 일상) |

## 본문 구조

```mdx
export const meta = { /* 위 스키마 */ };


  도입부 1~2문단 (200~400자). 독자의 상황을 묘사하고 결론을 한 줄로 미리 던집니다.


<aside className="tldr" aria-label="핵심 요약">
  <p className="tldr-title">한눈에 요약</p>
  <ul>
    <li>핵심 메시지 1</li>
    <li>핵심 메시지 2</li>
    <li>핵심 메시지 3</li>
  </ul>
</aside>

<h2>왜 이게 중요한가 (또는 메커니즘)</h2>

  설명 1문단

<ul>
  <li><strong>요점</strong> — 설명</li>
</ul>

<h2>섹션 2~4개 (주제 핵심)</h2>

  본문...

<h2>한눈에 보는 정리 표</h2>

<div className="table-wrap">
  <table>
    <thead>
      <tr>
        <th scope="col">컬럼1</th>
        <th scope="col">컬럼2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">행 이름</th>
        <td>값</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>한 줄 행동 가이드 / 시나리오 / 자주 하는 실수</h2>

  ...

<aside className="callout" aria-label="안전 안내">
  <p className="callout-title">임의 판단 금지 / 의사 상담 등</p>

    필요한 안전 안내 1~2문단

</aside>

<h2>정리</h2>

  마무리 2~3문장. 핵심을 다시 짚어주기.


<div className="callout">
  <p className="callout-title">약꼭이 도와드려요</p>

    약꼭 실제 기능 범위 내에서 CTA 작성 (아래 가이드 참고)

</div>
```

## 톤 규칙

- **일반인 친화**: 영문 약어/학명은 풀어 쓰기. 예) `BCAA → 근육 회복 아미노산`, `25(OH)D → 비타민 D 혈액 검사`, `NSAIDs → 소염진통제(이부프로펜 같은)`, `ALDH2 → 알코올 분해 효소`, `WPI → 유당 적은 단백질`.
- **약사 관점**: 단정형보다 "권장됩니다·근거가 있어요·약사에게 확인하세요" 같은 어휘. 의학적 단언은 피하고 가이드 톤 유지.
- **분량**: 본문 5,500~6,500자 권장. 한국어 기준. `wc -m`으로 확인.
- **리딩타임 표시 금지** (사용자 메모리 결정).
- **내부 링크**: 본문 중간에 관련 글 1~2개를 `<a href="/blog/<slug>">텍스트</a>` 형태로 자연스럽게 인용.
- **이미지**: Unsplash 자유 이용 가능 사진. 쿼리 파라미터는 떼고 원본 URL을 `image.src`에 저장 (런타임에 `postImageUrl`이 hero/card/og variant를 자동 부착).

## CTA 작성 규칙 — 약꼭 실제 기능만

블로그 끝의 `<div className="callout">` CTA에서는 **실제 존재하는 기능만** 언급합니다.

**언급 가능 (실제 기능)**
- 약·영양제를 6가지 카테고리로 등록
- 시간대별 알림 (지정 시간에 알림 송신)
- 캘린더 색깔 기록 (복용·미루기·건너뛰기)
- 가족 공유 (공유 코드 하나로 알림·기록 공유)
- 반려동물 프로필 추가
- iOS App Store 다운로드 안내(필요 시): https://apps.apple.com/kr/app/id6752120136

**언급 금지 (존재하지 않는 기능)**
- 통계 그래프·차트
- "필요할 때 복용" 같은 특수 카테고리
- "공복/식후" 옵션이 약 등록 화면에 별도로 있다는 식의 디테일
- 약물 상호작용 자동 점검
- AI 추천

## SEO·시맨틱 HTML 체크리스트

- `meta.description` 150~160자
- `title`은 검색어와 그대로 매칭되게 (변형 금지)
- 헤딩 레벨 점프 없이 `<h2>` → `<h3>` 순서
- 표는 `<thead>`/`<tbody>` + `<th scope="col">` / `<th scope="row">`
- 안전 안내는 `<aside>` + `aria-label`로 시맨틱하게
- FAQ는 `meta.faqs`에 두면 BlogPostLayout이 `<dl><dt><dd>` 자동 렌더 + `FaqLd`로 FAQPage JSON-LD 자동 출력
- 이미지 alt 한국어 자연어 1~2문장

## 등록 단계

`lib/posts.ts`에 다음을 추가합니다.

```ts
// 1) import 추가 (다른 import들 옆)
import NewPost, { meta as newPostMeta } from "@/content/blog/<slug>.mdx";

// 2) BLOG_POSTS 배열에 추가
export const BLOG_POSTS: BlogPost[] = [
  // ...기존
  toPost(newPostMeta, NewPost),
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
```

## 검증

```bash
npx tsc --noEmit        # 타입 통과 확인
npm run build           # MDX 컴파일 + 정적 페이지 생성 확인
```

빌드 로그에 `/blog/<새 slug>` 경로가 출력되면 성공.

## 다중 글 작성 시

사용자가 여러 주제를 한 번에 줬다면:

1. 각각의 메타·구조를 머릿속으로 먼저 그리고
2. 카테고리·슬러그·`publishedAt`이 충돌하지 않는지 확인 (같은 날 발행 OK)
3. `Write` 도구로 1편씩 차례로 생성
4. `lib/posts.ts`는 한 번에 일괄 수정
5. 마지막에 빌드 한 번만 돌리기

## 참고 파일

- 작성 예시 (가장 최근 톤): `content/blog/empty-stomach-medications.mdx`, `content/blog/gym-beginner-supplements.mdx`, `content/blog/hangover-cure-truth.mdx`
- 타입: `lib/posts.ts` (`BlogPostMeta`, `BlogPostFaq`)
- 레이아웃: `components/BlogPostLayout.tsx` (FAQ 자동 렌더링, 면책 안내, 약꼭 CTA aside)
- JSON-LD: `components/jsonld/ArticleLd.tsx`, `components/jsonld/FaqLd.tsx`
- 본문 스타일: `app/globals.css`의 `.prose-yakkok` 영역 (table/dl/aside.tldr/callout)

## 절대 하지 말 것

- 기존 글 수정 (사용자가 명시적으로 요청한 경우만)
- 리딩타임 표시
- 약꼭 가상 기능 언급
- 의학적 단언("이 약은 절대 안전합니다" 같은 표현)
- 영문 약어를 풀이 없이 노출
- 6,500자 초과(스캐닝 이탈 증가)
