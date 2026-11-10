# fourtune-vibe (Fortune Vibe 🔮)

> 은은한 촛불과 고서 향기가 가득한 대마법사의 서재, 고대 비전서가 당신의 오늘 하루 운명을 점쳐드립니다.

**Fortune Vibe**는 Google Gemini AI를 활용하여 의뢰인의 생년월일, 성별, 그리고 마음속 질문을 바탕으로 사주와 점성술 천체 배치를 결합한 신비로운 운세를 생성해 주는 React 웹 애플리케이션입니다.

---

## ✨ 주요 기능 (Key Features)

- **🧙‍♂️ 마법사의 서재 (Wizard's Sanctum) 테마**:
  - 미드나이트 딥 바이올렛 배경과 앤틱 골드 포인트의 신비로운 비주얼
  - 촛불 펄스 조명 및 입체적인 황금빛 마법 오라 버튼 호버 효과
- **📜 사주 & 점성술 천체 정보 입력**:
  - 생년, 생월, 생일(윤년/월별 일수 동적 계산) 및 성별(음양) 상태 관리
  - 필수 항목 누락 시 친절한 입력 요청 유효성 검사
- **🔮 Google Gemini API 실시간 운세 생성**:
  - 최신 Gemini Flash 모델 기반의 빠르고 정교한 한국어 운세 도출
  - 탄생 별자리 및 오행의 기운을 담은 맞춤형 오라클 신탁 리포트
- **📝 마크다운 렌더링 (`react-markdown`)**:
  - 황금빛 볼드체, 별빛 글머리 기호(✦), 마법 잠언 인용구 등 가독성 높은 텍스트 변환
- **📋 원클릭 복사 & 스마트 공유 기능**:
  - 의뢰인 정보와 질문, AI 답변이 정리된 텍스트를 클립보드에 즉시 복사
  - 모바일 및 지원 브라우저를 위한 Web Share API 다이렉트 공유 지원

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite
- **Architecture**: FSD (Feature-Sliced Design)
- **AI Engine**: Google Gemini API (`gemini-3.5-flash-lite`)
- **Styling**: Pure CSS3 (Custom Design System & Keyframe Animations)
- **Libraries**: `react-markdown`

---

## 📁 프로젝트 구조 (FSD Architecture)

```text
src/
├── app/                  # 최상위 App 및 글로벌 스타일링
│   ├── App.tsx
│   └── styles/index.css  # 마법사의 서재 디자인 시스템
├── pages/                # 라우트 페이지
│   └── Home/             # 메인 화면 조립
├── features/             # 비즈니스 기능 단위 슬라이스
│   ├── User_Input/       # 탄생 정보 & 질문 입력 폼
│   └── Fortune_Result/   # 운세 결과 카드 & 복사/공유 액션
└── shared/               # 공통 재사용 모듈
    ├── API/              # Gemini REST API 클라이언트
    ├── Lib/Hooks/        # useFortuneAI 커스텀 훅
    └── UI/               # Button, TextArea, Loading 컴포넌트
```

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트의 `.env` 파일에 발급받은 Gemini API 키를 설정합니다:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
# 또는 start.bat 더블클릭
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

---

## 📄 라이선스
MIT License
