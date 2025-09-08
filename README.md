# Day-On-App

React 19, TypeScript, Vite를 기반으로 한 프론트엔드 애플리케이션입니다.

## 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn 패키지 매니저
- Visual Studio Code (권장)

## 프로젝트 설치 및 실행

### 1. 의존성 설치

```bash
# npm 사용
npm install

```

### 2. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev

```


### 3. 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

### 4. 코드 검사

```bash
# ESLint 실행
npm run lint
```

## 프로젝트 구조

```
day-on-app/
├── public/                 # 정적 파일
├── src/                    # 소스 코드
│   ├── components/         # 재사용 가능한 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   ├── types/             # TypeScript 타입 정의
│   ├── services/          # API 서비스
│   ├── assets/            # 이미지, 폰트 등
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── main.tsx           # 엔트리 포인트
├── index.html             # HTML 템플릿
├── vite.config.ts         # Vite 설정
├── tsconfig.json          # TypeScript 설정
├── eslint.config.js       # ESLint 설정
└── package.json           # 의존성 및 스크립트
```