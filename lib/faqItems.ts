export type FAQCategory =
  | "service"
  | "pricing"
  | "features"
  | "usage"
  | "launch";

export interface FAQItem {
  q: string;
  a: string;
  category: FAQCategory;
  featured?: boolean;
}

export const FAQ_CATEGORIES: { id: FAQCategory; label: string }[] = [
  { id: "service", label: "서비스 소개" },
  { id: "pricing", label: "요금" },
  { id: "features", label: "기능" },
  { id: "usage", label: "사용법" },
  { id: "launch", label: "출시 일정" },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: "약꼭은 어떤 앱인가요?",
    a: "약꼭은 복약 시간을 알려주고 복약 기록을 캘린더로 관리해주는 무료 복약 관리 앱입니다. 영양제, 일반의약품, 처방약 등 다양한 약을 한 곳에서 챙길 수 있어요.",
    category: "service",
    featured: true,
  },
  {
    q: "약꼭은 무료인가요?",
    a: "네, 약꼭은 누구나 무료로 이용할 수 있습니다. 회원가입과 모든 기본 기능이 무료로 제공돼요.",
    category: "pricing",
    featured: true,
  },
  {
    q: "가족과 함께 복약을 관리할 수 있나요?",
    a: "네. 공유 코드를 통해 부모님이나 가족 구성원의 복약을 함께 관리할 수 있어요. 한 명이 등록하면 가족이 함께 알림을 받고 기록을 확인할 수 있습니다.",
    category: "features",
    featured: true,
  },
  {
    q: "반려동물 약도 관리할 수 있나요?",
    a: "반려동물 프로필을 추가하면 우리 아이의 약 복용 시간도 동일하게 관리할 수 있어요.",
    category: "features",
  },
  {
    q: "어떤 종류의 약을 등록할 수 있나요?",
    a: "영양제, 일반의약품, 알레르기·호흡기약, 만성질환약, 처방약, 정신건강·수면약까지 6가지 카테고리로 등록할 수 있어요. 각 카테고리는 색깔로 구분되어 캘린더에 표시됩니다.",
    category: "features",
  },
  {
    q: "알림을 못 들었을 때는 어떻게 하나요?",
    a: "복용했어요, 10분 미루기, 오늘 건너뛰기 중에서 선택할 수 있어요. 실제 생활 패턴에 맞춰 유연하게 사용할 수 있습니다.",
    category: "usage",
  },
  {
    q: "로그인은 어떻게 하나요?",
    a: "Kakao 또는 Apple 계정으로 간편 로그인 1초 만에 시작할 수 있어요. 별도의 회원가입 절차는 필요 없습니다.",
    category: "usage",
  },
  {
    q: "약꼭은 언제 출시되나요?",
    a: "약꼭 iOS 앱은 App Store에서 다운로드할 수 있어요. Android 버전은 출시 준비 중입니다.",
    category: "launch",
    featured: true,
  },
];
