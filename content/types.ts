export type Change =
  | {
      kind: "metrics";
      items: {
        value: number;
        suffix: string;
        decimals: number;
        label: string;
      }[];
      caption?: string;
    }
  | {
      kind: "pairs";
      items: { label: string; before: string; after: string }[];
      caption?: string;
    }
  | { kind: "text"; before: string; after: string; caption?: string };

export type DemoId =
  | "splash-roundtrip"
  | "parallel-fetch"
  | "sse-stream"
  | "token-handoff";

export interface ProjectLink {
  href: string;
  label: "Live" | "GitHub";
}

export interface Project {
  slug: string;
  group: "work" | "side";
  title: string;
  tag?: string; // 카드 우상단 칩 (work)
  note?: string; // "2인 작업" 등 보조 표기
  featured?: boolean; // work: 접기 전에 보이는 항목
  users?: string; // side: "누가 쓰는가"
  change?: Change; // 카드의 Before→After
  summary?: string; // side 카드 한 줄 설명
  wide?: boolean; // side 카드가 그리드 한 행을 모두 차지
  cardPoints?: string[]; // side 카드에 보이는 짧은 포인트 2개
  situation: string[];
  actions: string[];
  result: string;
  stack?: string[];
  links?: ProjectLink[];
  demos?: DemoId[];
  screenshots?: { src: string; alt: string }[]; // 첫 장은 카드 썸네일
  source: string; // 근거 문서 위치. 렌더하지 않음
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string; // 한 줄
  highlights: string[]; // 핵심 성과
  ways: string[]; // 일하는 방식
  techStack: string[];
  link?: { href: string; label: string };
}

export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  /** 바 채움 비율 (0~1) */
  bar: number;
}

export interface Social {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "velog" | "mail";
}

export interface Certification {
  title: string;
  date: string;
  detail: string;
}

export interface Education {
  title: string;
  period: string;
  detail: string;
}
