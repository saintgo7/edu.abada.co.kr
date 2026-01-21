# Vibe Grade - 성적 관리 시스템

바이브코딩과 웹사이트 제작 교과목을 위한 성적 관리 프로그램

---

## 시스템 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

---

## WSL 설치 가이드

### 1. Node.js 설치 (미설치 시)

```bash
# NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 터미널 재시작 또는
source ~/.bashrc

# Node.js LTS 버전 설치
nvm install --lts
nvm use --lts

# 버전 확인
node -v
npm -v
```

### 2. 프로젝트 설치

```bash
# 프로젝트 디렉토리로 이동
cd vibe-grade-project

# 의존성 설치
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 프로젝트 구조

```
vibe-grade-project/
├── index.html          # HTML 진입점
├── package.json        # 의존성 관리
├── vite.config.js      # Vite 설정
├── README.md           # 설명서
└── src/
    ├── main.jsx        # React 진입점
    └── App.jsx         # 메인 컴포넌트
```

---

## 주요 기능

### 학생 관리
- 수동 입력 및 CSV 일괄 업로드
- 검색 기능 (이름/학번)
- GitHub URL 및 배포 URL 관리

### 체크리스트 기반 채점 (40점 만점)
| 카테고리 | 항목 | 배점 |
|---------|------|------|
| 기본 | 1페이지 완성, GitHub 업로드, 기본 스타일 | 12점 |
| 구조 | 2페이지+, 네비게이션, 반응형, 배포 | 6점 |
| 기능 | 3페이지+, 연락처 폼, 애니메이션, 통일 디자인 | 6점 |
| 확장 | 4페이지+, 다크모드, 스크롤 효과, 외부 연동 | 6점 |
| 완성도 | 5페이지+, 갤러리, 슬라이더, 전환효과, 디자인 | 6점 |
| 탁월함 | 6페이지+, 고급기능, 독창성 | 4점 |

### 평가 비율
| 항목 | 비율 |
|------|------|
| 미니 프로젝트 1 | 10% |
| 미니 프로젝트 2 | 15% |
| 최종 웹사이트 | 40% |
| 최종 발표 | 15% |
| 주차별 진행 | 10% |
| 출석 | 10% |

### 통계 및 내보내기
- 등급 분포 차트 (Bar, Pie)
- 요약 통계 (평균, 최고, 최저)
- CSV/JSON 내보내기

---

## CSV 업로드 형식

```csv
name,studentId,github,url
홍길동,20251001,https://github.com/hong,https://hong.vercel.app
김철수,20251002,https://github.com/kim,https://kim.vercel.app
```

---

## 문제 해결

### WSL에서 브라우저가 자동으로 열리지 않을 때

1. Windows 브라우저에서 직접 `http://localhost:3000` 접속
2. 또는 vite.config.js에서 `open: false`로 변경

### 포트 충돌 시

vite.config.js에서 port 번호 변경:
```javascript
server: {
  port: 3001,  // 다른 포트로 변경
}
```

---

## 라이선스

교육 목적으로 자유롭게 사용 가능

---

2025 Computer Software Engineering
