# GEMINI.md - 마이링크 (My Link) 프로젝트 가이드

이 파일은 **마이링크(My Link)** 프로젝트의 구조, 개발 규칙 및 주요 기능을 안내하기 위해 작성되었습니다.

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트 명**: 마이링크 (My Link)
- **목적**: 인플루언서, 크리에이터 등이 자신의 여러 온라인 링크를 하나의 페이지로 모아 공유할 수 있는 멀티링크 서비스.
- **핵심 기술 스택**:
  - **Framework**: Next.js 15+ (App Router)
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS v4
  - **UI Components**: shadcn/ui
  - **Theming**: next-themes (다크 모드 지원, 단축키 `d`로 토글)
  - **Font**: Geist, Geist Mono (Next.js font)

## 2. 주요 기능 및 아키텍처 (Key Features & Architecture)

### 핵심 기능 (MVP)
1. **사용자 인증**: 이메일 및 소셜 로그인(구글, 카카오, 깃허브).
2. **프로필 관리**: `displayName` 기반의 고유 URL 제공, `username` 및 `bio`에 대한 **인라인 편집(Inline Editing)** 지원.
3. **링크 관리**: 링크 추가/수정/삭제, **Google Favicon API**를 활용한 아이콘 자동 추출.
4. **공개 페이지 뷰어**: 방문자가 접속하여 링크를 확인하고 이동할 수 있는 반응형 페이지.

### 데이터 모델 (Firebase/Firestore 예상)
- `Users`: `uid`, `displayName`, `username`, `bio`
  - `Links` (Sub-collection): `linkId`, `title`, `url`, `faviconUrl`, `createdAt`

## 3. 개발 및 실행 (Building and Running)

### 주요 명령어
- `npm run dev`: 개발 서버 실행 (`next dev`)
- `npm run build`: 프로덕션 빌드 (`next build`)
- `npm run start`: 빌드된 프로덕션 서버 실행 (`next start`)
- `npm run lint`: ESLint를 통한 코드 린팅
- `npm run format`: Prettier를 사용한 코드 포맷팅 (`ts`, `tsx` 대상)
- `npm run typecheck`: TypeScript 타입 체크 실행

## 4. 개발 컨벤션 (Development Conventions)

- **컴포넌트 추가**: `npx shadcn@latest add [component]`를 사용하여 `components/ui` 폴더에 UI 컴포넌트 추가.
- **스타일링**: Tailwind CSS v4를 사용하며, 가능한 유틸리티 클래스 위주로 작성.
- **코드 스타일**: 프로젝트 루트의 `.prettierrc` 및 `eslint.config.mjs` 설정을 준수.
- **다크 모드**: `components/theme-provider.tsx`에 정의된 대로 `d` 키를 눌러 테마를 전환할 수 있는 기능이 내장되어 있음.
- **문서 참조**: 기획 및 설계 상세 내용은 `docs/` 디렉토리 내 `prd.md`, `scenarios.md`, `wireframes.md`를 참조할 것.

## 5. 프로젝트 구조 (Directory Structure)

- `app/`: Next.js App Router 기반의 페이지 및 레이아웃.
- `components/`: 공유 컴포넌트 및 `ui/` 폴더 내 shadcn/ui 컴포넌트.
- `docs/`: PRD, 시나리오, 와이어프레임 등 프로젝트 문서.
- `hooks/`: 커스텀 React Hooks.
- `lib/`: 유틸리티 함수 및 설정 파일.
- `public/`: 정적 파일 (이미지, 파비콘 등).

---
*이 가이드는 Gemini CLI를 통해 자동 생성되었으며, 프로젝트 진행 상황에 따라 업데이트될 수 있습니다.*
