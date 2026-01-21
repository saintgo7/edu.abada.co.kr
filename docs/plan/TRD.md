# TRD (Technical Requirements Document)
# 기술 요구사항 정의서

**프로젝트명**: Vibe Grade - 학생 성적 관리 시스템
**버전**: 1.0
**작성일**: 2025-01-22
**상태**: Draft

---

## 1. 기술 스택 (Technology Stack)

### 1.1 Frontend

#### Core Framework
| 기술 | 버전 | 용도 | 라이선스 |
|------|------|------|----------|
| React | 18.2+ | UI 프레임워크 | MIT |
| Vite | 5.0+ | 빌드 도구 및 개발 서버 | MIT |
| React DOM | 18.2+ | React 렌더링 | MIT |

#### UI Libraries
| 기술 | 버전 | 용도 | 라이선스 |
|------|------|------|----------|
| Recharts | 2.10+ | 차트 및 데이터 시각화 | MIT |
| React Icons | 4.12+ | 아이콘 라이브러리 (선택) | MIT |

#### Styling
- **인라인 스타일** (현재 구조)
- **CSS Modules** (선택사항)
- **TailwindCSS** (선택사항)

#### State Management
- **React Hooks** (useState, useCallback, useMemo)
- **Context API** (전역 상태 관리, 필요시)

---

### 1.2 Backend

#### Runtime & Framework
| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Cloudflare Pages Functions | Latest | 서버리스 API | 무료 10만 req/day |
| Node.js | 18.x+ | 런타임 (로컬 개발) | LTS |

#### Database
| 기술 | 버전 | 용도 | 무료 한도 |
|------|------|------|----------|
| Neon PostgreSQL | Latest | 주 데이터베이스 | 0.5GB storage |
| @neondatabase/serverless | Latest | Serverless DB 드라이버 | - |

#### External APIs
| API | 용도 | Rate Limit |
|-----|------|------------|
| GitHub REST API v3 | 리포지토리 분석 | 60 req/h (미인증), 5000 req/h (인증) |
| GitHub GraphQL API v4 | 효율적 데이터 조회 (선택) | 5000 points/h |

---

### 1.3 Infrastructure & DevOps

#### Hosting & CDN
| 서비스 | 용도 | 무료 한도 |
|--------|------|----------|
| Cloudflare Pages | 정적 호스팅 및 배포 | 무제한 bandwidth |
| Cloudflare CDN | 콘텐츠 전송 가속화 | 무료 |
| Cloudflare DNS | 도메인 DNS 관리 | 무료 |

#### Version Control & CI/CD
| 도구 | 용도 |
|------|------|
| Git | 버전 관리 |
| GitHub | 저장소 호스팅 |
| Cloudflare Pages (Auto Deploy) | CI/CD 자동 배포 |

#### Monitoring & Logging
| 도구 | 용도 | 무료 한도 |
|------|------|----------|
| Cloudflare Analytics | 트래픽 및 성능 모니터링 | 무료 |
| Sentry (선택) | 에러 트래킹 | 5,000 events/month |

---

### 1.4 Development Tools

#### Package Manager
- **npm** 또는 **yarn**
- **pnpm** (선택사항, 빠른 설치)

#### Code Quality
| 도구 | 용도 | 설정 파일 |
|------|------|-----------|
| ESLint | JavaScript/React 린팅 | `.eslintrc.js` |
| Prettier | 코드 포맷팅 | `.prettierrc` |

#### Testing (선택사항)
| 도구 | 용도 |
|------|------|
| Vitest | 단위 테스트 |
| React Testing Library | 컴포넌트 테스트 |

---

## 2. 시스템 아키텍처 (System Architecture)

### 2.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              (Browser - React SPA)                      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Cloudflare CDN + Pages                     │
│        (Static Assets + Pages Functions)                │
└──────┬──────────────────────────────────────┬───────────┘
       │                                      │
       │ /api/*                               │ /assets/*
       ▼                                      ▼
┌─────────────────────┐              ┌──────────────────┐
│ Cloudflare Workers  │              │  Static Files    │
│  (API Endpoints)    │              │  (HTML/CSS/JS)   │
└──────┬──────────────┘              └──────────────────┘
       │
       ├─────► GitHub API (리포지토리 분석)
       │
       └─────► Neon PostgreSQL (데이터 저장)
```

---

### 2.2 Frontend 아키텍처

#### Component Structure
```
src/
├── components/
│   ├── common/            # 공통 컴포넌트
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Loading.jsx
│   ├── student/           # 학생 관련
│   │   ├── StudentList.jsx
│   │   ├── StudentForm.jsx
│   │   └── StudentRow.jsx
│   ├── grading/           # 채점 관련
│   │   ├── GradingPanel.jsx
│   │   ├── Checklist.jsx
│   │   ├── ScoreInput.jsx
│   │   └── AutoAnalyzeButton.jsx
│   ├── statistics/        # 통계
│   │   ├── GradeChart.jsx
│   │   ├── PieChart.jsx
│   │   └── SummaryStats.jsx
│   └── announcement/      # 공지사항
│       ├── AnnouncementList.jsx
│       └── AnnouncementForm.jsx
├── services/              # API 클라이언트
│   ├── api.js             # API 기본 설정
│   ├── studentService.js
│   ├── gradeService.js
│   ├── githubService.js
│   └── announcementService.js
├── utils/                 # 유틸리티
│   ├── grading.js         # 성적 계산 로직
│   ├── validation.js      # 유효성 검사
│   └── export.js          # CSV/JSON 내보내기
├── hooks/                 # Custom Hooks
│   ├── useStudents.js
│   ├── useGrades.js
│   └── useAuth.js
├── App.jsx                # 메인 앱
└── main.jsx               # 엔트리 포인트
```

---

### 2.3 Backend 아키텍처

#### API Structure
```
functions/
├── api/
│   ├── students/
│   │   ├── index.js       # GET /api/students (목록 조회)
│   │   ├── [id].js        # GET/PUT/DELETE /api/students/:id
│   │   └── bulk.js        # POST /api/students/bulk (CSV 업로드)
│   ├── grades/
│   │   ├── [studentId].js # GET/PUT /api/grades/:studentId
│   │   └── bulk-analyze.js # POST /api/grades/bulk-analyze
│   ├── github/
│   │   └── analyze.js     # POST /api/github/analyze
│   ├── announcements/
│   │   ├── index.js       # GET/POST /api/announcements
│   │   └── [id].js        # GET/PUT/DELETE /api/announcements/:id
│   ├── export/
│   │   ├── csv.js         # GET /api/export/csv
│   │   └── json.js        # GET /api/export/json
│   └── auth/
│       ├── login.js       # POST /api/auth/login
│       └── me.js          # GET /api/auth/me
├── _middleware.js         # 인증, CORS, 에러 처리
└── lib/
    ├── db.js              # 데이터베이스 연결
    ├── auth.js            # JWT 인증 헬퍼
    └── github.js          # GitHub API 클라이언트
```

---

## 3. 데이터베이스 설계

### 3.1 ERD (Entity Relationship Diagram)

```
┌──────────────┐         1:1         ┌──────────────┐
│   students   │◄────────────────────┤    grades    │
└──────────────┘                     └──────────────┘
        △
        │
        │ 1:N
        │
        ▽
┌──────────────┐
│ admin_users  │
└──────────────┘

┌─────────────────┐
│ announcements   │  (독립 테이블)
└─────────────────┘

┌─────────────────┐
│ analysis_cache  │  (독립 테이블)
└─────────────────┘
```

---

### 3.2 테이블 스키마

#### students
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  github_url TEXT,
  deployed_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_id ON students(student_id);
CREATE INDEX idx_name ON students(name);
```

#### grades
```sql
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,

  -- 체크리스트 (JSONB)
  checklist JSONB DEFAULT '{}',
  website_score INTEGER DEFAULT 0 CHECK (website_score >= 0 AND website_score <= 40),
  website_grade VARCHAR(2),

  -- 기타 평가 항목
  mini_project1 INTEGER DEFAULT 0 CHECK (mini_project1 >= 0 AND mini_project1 <= 100),
  mini_project2 INTEGER DEFAULT 0 CHECK (mini_project2 >= 0 AND mini_project2 <= 100),
  presentation INTEGER DEFAULT 0 CHECK (presentation >= 0 AND presentation <= 100),
  weekly_progress INTEGER DEFAULT 0 CHECK (weekly_progress >= 0 AND weekly_progress <= 100),
  attendance INTEGER DEFAULT 0 CHECK (attendance >= 0 AND attendance <= 100),

  -- 코멘트
  comment TEXT,

  -- 자동 분석 결과
  auto_analysis JSONB,
  last_analyzed_at TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_grades_student_id ON grades(student_id);
```

#### announcements
```sql
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal', 'info')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_published ON announcements(published, created_at DESC);
```

#### analysis_cache
```sql
CREATE TABLE analysis_cache (
  id SERIAL PRIMARY KEY,
  github_url TEXT UNIQUE NOT NULL,
  analysis_result JSONB NOT NULL,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

CREATE INDEX idx_cache_url ON analysis_cache(github_url);
CREATE INDEX idx_cache_expires ON analysis_cache(expires_at);
```

#### admin_users
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'instructor')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_username ON admin_users(username);
```

---

### 3.3 JSONB 구조

#### checklist (grades.checklist)
```json
{
  "page1": 6,
  "github": 3,
  "basicStyle": 3,
  "page2": 2,
  "navigation": 1,
  ...
}
```

#### auto_analysis (grades.auto_analysis)
```json
{
  "pageCount": 5,
  "hasNavigation": true,
  "hasResponsive": true,
  "hasContactForm": true,
  "hasDarkMode": false,
  "commitCount": 42,
  "lastCommit": "2025-01-20T10:30:00Z",
  "suggestedChecklist": {
    "page1": true,
    "page2": true,
    "page3": true,
    "page4": true,
    "page5": true,
    "github": true,
    "navigation": true,
    "responsive": true,
    "contactForm": true
  },
  "confidence": 0.85,
  "errors": []
}
```

---

## 4. API 명세 (API Specification)

### 4.1 RESTful API 규칙

#### HTTP Methods
- **GET**: 조회
- **POST**: 생성
- **PUT**: 전체 수정
- **PATCH**: 부분 수정 (선택사항)
- **DELETE**: 삭제

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2025-01-22T10:30:00Z"
}
```

#### Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Student ID already exists",
    "details": { ... }
  },
  "timestamp": "2025-01-22T10:30:00Z"
}
```

#### HTTP Status Codes
- **200**: 성공
- **201**: 생성 성공
- **400**: 잘못된 요청
- **401**: 인증 실패
- **403**: 권한 없음
- **404**: 리소스 없음
- **429**: Rate limit 초과
- **500**: 서버 오류

---

### 4.2 주요 API 엔드포인트

#### Students API

**GET /api/students**
```
Query Parameters:
  - search: string (검색어)
  - limit: number (기본 100)
  - offset: number (기본 0)

Response:
{
  "success": true,
  "data": {
    "students": [ ... ],
    "total": 42,
    "limit": 100,
    "offset": 0
  }
}
```

**POST /api/students**
```
Request Body:
{
  "studentId": "20251001",
  "name": "홍길동",
  "githubUrl": "https://github.com/hong/project",
  "deployedUrl": "https://hong.vercel.app"
}

Response: (201 Created)
{
  "success": true,
  "data": {
    "id": 123,
    "studentId": "20251001",
    ...
  }
}
```

---

#### GitHub Analysis API

**POST /api/github/analyze**
```
Request Body:
{
  "url": "https://github.com/username/repo",
  "forceRefresh": false
}

Response:
{
  "success": true,
  "data": {
    "pageCount": 5,
    "hasNavigation": true,
    "hasResponsive": true,
    "hasContactForm": true,
    "hasDarkMode": false,
    "commitCount": 42,
    "lastCommit": "2025-01-20T10:30:00Z",
    "suggestedChecklist": { ... },
    "confidence": 0.85
  }
}
```

---

#### Grades API

**GET /api/grades/:studentId**
```
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 123,
    "checklist": { ... },
    "websiteScore": 32,
    "websiteGrade": "A",
    "miniProject1": 85,
    ...
  }
}
```

**PUT /api/grades/:studentId**
```
Request Body:
{
  "checklist": { ... },
  "miniProject1": 85,
  "comment": "Great work!"
}

Response: (200 OK)
{
  "success": true,
  "data": { ... }
}
```

---

### 4.3 GitHub API 사용

#### Repository Tree API
```
GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1

Response:
{
  "tree": [
    {
      "path": "index.html",
      "type": "blob",
      "size": 2048
    },
    ...
  ]
}
```

#### File Contents API
```
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}

Response:
{
  "content": "base64-encoded-content",
  "encoding": "base64"
}
```

#### Commits API
```
GET https://api.github.com/repos/{owner}/{repo}/commits?per_page=100

Response: [
  {
    "sha": "abc123",
    "commit": {
      "message": "Initial commit",
      "author": { ... }
    }
  },
  ...
]
```

---

## 5. 보안 요구사항

### 5.1 인증 (Authentication)

#### JWT 토큰 구조
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "username": "admin",
    "role": "admin",
    "iat": 1706000000,
    "exp": 1706604800
  }
}
```

#### 토큰 저장
- **LocalStorage**: JWT 토큰 저장
- **HttpOnly Cookie**: 선택사항 (더 안전)

---

### 5.2 데이터 검증

#### Input Validation
```javascript
// 학번: 숫자 8자리
const studentIdRegex = /^\d{8}$/;

// GitHub URL
const githubUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;

// URL
const urlRegex = /^https?:\/\/.+/;
```

#### SQL Injection 방지
```javascript
// ❌ 취약한 코드
const query = `SELECT * FROM students WHERE id = ${id}`;

// ✅ 안전한 코드 (Parameterized Query)
const query = 'SELECT * FROM students WHERE id = $1';
await db.query(query, [id]);
```

---

### 5.3 Rate Limiting

#### API Rate Limit
```javascript
// Cloudflare Workers KV 사용
const key = `rate_limit:${ip}:${endpoint}`;
const count = await env.KV.get(key) || 0;

if (count > 100) {
  return new Response('Too Many Requests', {
    status: 429,
    headers: { 'Retry-After': '3600' }
  });
}

await env.KV.put(key, count + 1, { expirationTtl: 3600 });
```

---

### 5.4 CORS 설정

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://edu.abada.co.kr',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

---

## 6. 성능 요구사항

### 6.1 Frontend 최적화

#### Code Splitting
```javascript
// React.lazy로 동적 임포트
const Statistics = React.lazy(() => import('./components/Statistics'));

<Suspense fallback={<Loading />}>
  <Statistics />
</Suspense>
```

#### Memoization
```javascript
// useMemo로 expensive 계산 캐싱
const gradeDistribution = useMemo(() => {
  return calculateDistribution(students);
}, [students]);

// useCallback으로 함수 캐싱
const handleDelete = useCallback((id) => {
  deleteStudent(id);
}, []);
```

---

### 6.2 Backend 최적화

#### Database Indexing
```sql
-- 자주 조회되는 컬럼에 인덱스
CREATE INDEX idx_student_id ON students(student_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
```

#### Connection Pooling
```javascript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: env.NEON_DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
});
```

#### Caching
```javascript
// GitHub 분석 결과 캐싱 (24시간)
const cached = await db.query(
  'SELECT * FROM analysis_cache WHERE github_url = $1 AND expires_at > NOW()',
  [url]
);

if (cached.rows.length > 0) {
  return cached.rows[0].analysis_result;
}
```

---

### 6.3 CDN & Asset Optimization

#### Static Asset Caching
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  }
}
```

---

## 7. 배포 요구사항

### 7.1 환경 변수

#### Development (.env.local)
```bash
VITE_API_URL=http://localhost:8788/api
VITE_GITHUB_TOKEN=ghp_xxxxx
```

#### Production (Cloudflare Dashboard)
```bash
NEON_DATABASE_URL=postgresql://...
GITHUB_TOKEN=ghp_xxxxx
JWT_SECRET=random-secret-key-32-chars
DOMAIN=edu.abada.co.kr
```

---

### 7.2 빌드 설정

#### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

#### wrangler.toml
```toml
name = "vibe-grade"
compatibility_date = "2025-01-22"

[env.production]
name = "vibe-grade-production"
route = "edu.abada.co.kr/*"

[env.staging]
name = "vibe-grade-staging"
```

---

### 7.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml (선택사항)
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=vibe-grade
```

---

## 8. 모니터링 및 로깅

### 8.1 Application Logging

```javascript
// 구조화된 로그
console.log(JSON.stringify({
  level: 'info',
  message: 'Student created',
  studentId: '20251001',
  timestamp: new Date().toISOString()
}));
```

---

### 8.2 Error Tracking

```javascript
// Sentry 통합 (선택사항)
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://xxx@sentry.io/xxx',
  environment: 'production'
});
```

---

## 9. 테스트 요구사항 (선택사항)

### 9.1 Unit Testing

```javascript
// grading.test.js
import { describe, it, expect } from 'vitest';
import { calculateFinalGrade, getGradeFromScore } from './grading';

describe('Grading Logic', () => {
  it('should calculate final grade correctly', () => {
    const student = {
      miniProject1: 80,
      miniProject2: 90,
      websiteScore: 35,
      presentation: 85,
      weeklyProgress: 90,
      attendance: 100
    };

    const finalScore = calculateFinalGrade(student);
    expect(finalScore).toBeCloseTo(87.5);
  });
});
```

---

## 10. 기술적 제약사항 및 고려사항

### 10.1 무료 Tier 제약
- **Neon DB**: 0.5GB storage, 한 프로젝트만
- **Cloudflare Workers**: 10만 req/day
- **GitHub API**: 60 req/h (미인증), 5000 req/h (인증)

### 10.2 브라우저 호환성
- ES6+ 지원 필수
- Fetch API 사용
- LocalStorage 사용

### 10.3 네트워크
- HTTPS 필수
- CORS 정책 준수
- WebSocket 미사용 (서버리스 제약)

---

**문서 끝**
