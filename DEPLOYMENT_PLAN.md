# Vibe Grade - 배포 계획서

## 프로젝트 개요
학생 수업 성적 관리 및 GitHub 자동 분석 시스템

**목표**: 완전 무료 인프라로 배포 및 운영

---

## 기술 스택

### Frontend
- **React 18** + **Vite 5** (현재 구조 유지)
- **Recharts** (통계 차트)
- **TailwindCSS** (선택사항, 현재 inline styles 사용 중)

### Backend & Infrastructure
- **Cloudflare Pages** (정적 호스팅, 무료)
- **Cloudflare Workers/Functions** (서버리스 API, 무료 10만 req/day)
- **Cloudflare Pages Functions** (Pages와 통합된 API 엔드포인트)

### Database
**옵션 1: Neon PostgreSQL (추천)**
- 무료 Tier: 0.5GB storage
- PostgreSQL 호환
- 서버리스 아키텍처
- Connection pooling 내장
- Vercel/Cloudflare와 호환

**옵션 2: Supabase**
- 무료 Tier: 500MB storage, 50k MAU
- PostgreSQL + Auth + Storage 통합
- REST API 자동 생성
- Realtime 기능

**옵션 3: Cloudflare D1**
- 완전 무료 (SQLite 기반)
- Cloudflare Workers와 완벽 통합
- PostgreSQL과 문법 약간 다름

### 외부 API
- **GitHub REST API** (Public Repo 분석, 무료 60 req/hour)
- **GitHub GraphQL API** (더 효율적, 5000 points/hour)

### Domain & DNS
- **도메인**: edu.abada.co.kr
- **DNS**: Cloudflare DNS (무료)

---

## 시스템 아키텍처

```
┌─────────────────┐
│   사용자        │
│  (브라우저)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare Pages │
│  (React App)     │ ◄── GitHub 자동 배포
└────────┬────────┘
         │ API 호출
         ▼
┌─────────────────┐
│ CF Workers/Fns  │
│  (Serverless)   │
└────┬───────┬────┘
     │       │
     │       └──────► GitHub API
     │                (코드 분석)
     ▼
┌─────────────────┐
│ Neon PostgreSQL │
│   (Database)    │
└─────────────────┘
```

---

## 데이터베이스 스키마

### 1. students (학생)
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
```

### 2. grades (성적)
```sql
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,

  -- 체크리스트 (JSON)
  checklist JSONB DEFAULT '{}',
  website_score INTEGER DEFAULT 0,
  website_grade VARCHAR(2),

  -- 기타 평가
  mini_project1 INTEGER DEFAULT 0,
  mini_project2 INTEGER DEFAULT 0,
  presentation INTEGER DEFAULT 0,
  weekly_progress INTEGER DEFAULT 0,
  attendance INTEGER DEFAULT 0,

  -- 코멘트
  comment TEXT,

  -- 자동 분석 결과
  auto_analysis JSONB,
  last_analyzed_at TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. announcements (공지사항)
```sql
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal', -- urgent, normal, info
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published BOOLEAN DEFAULT true
);
```

### 4. analysis_cache (분석 캐시)
```sql
CREATE TABLE analysis_cache (
  id SERIAL PRIMARY KEY,
  github_url TEXT UNIQUE NOT NULL,
  analysis_result JSONB NOT NULL,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);
```

### 5. admin_users (관리자)
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API 엔드포인트 설계

### Students API
```
GET    /api/students              # 학생 목록
POST   /api/students              # 학생 추가
PUT    /api/students/:id          # 학생 수정
DELETE /api/students/:id          # 학생 삭제
POST   /api/students/bulk         # CSV 일괄 업로드
```

### Grades API
```
GET    /api/grades/:studentId     # 성적 조회
PUT    /api/grades/:studentId     # 성적 업데이트
POST   /api/grades/auto-analyze   # 자동 분석
POST   /api/grades/bulk-analyze   # 전체 자동 분석
```

### GitHub Analysis API
```
POST   /api/github/analyze        # GitHub 리포 분석
  Body: { "url": "https://github.com/user/repo" }

Response: {
  "pageCount": 5,
  "hasNavigation": true,
  "hasResponsive": true,
  "features": ["form", "animation"],
  "commitCount": 42,
  "lastCommit": "2025-01-20",
  "suggestedChecklist": {
    "page1": true,
    "page2": true,
    ...
  }
}
```

### Announcements API
```
GET    /api/announcements         # 공지사항 목록
POST   /api/announcements         # 공지사항 작성
PUT    /api/announcements/:id     # 수정
DELETE /api/announcements/:id     # 삭제
```

### Export API
```
GET    /api/export/csv            # CSV 내보내기
GET    /api/export/json           # JSON 내보내기
GET    /api/export/grades         # 성적표 (전체)
```

### Auth API (간단한 인증)
```
POST   /api/auth/login            # 관리자 로그인
POST   /api/auth/logout           # 로그아웃
GET    /api/auth/me               # 현재 사용자
```

---

## GitHub 자동 분석 로직

### 분석 항목

#### 1. 페이지 수 계산
```javascript
// HTML 파일 개수 확인
GET /repos/:owner/:repo/git/trees/main?recursive=1
→ .html 파일 필터링 (index.html 제외하고 카운트)
```

#### 2. 기본 구조 체크
- `index.html` 존재
- `style.css` 또는 `<style>` 태그
- `README.md` 존재

#### 3. 기능 감지 (HTML 파싱)
```javascript
// 주요 파일 내용 가져오기
GET /repos/:owner/:repo/contents/index.html

// 파싱하여 확인:
- <nav> 태그 → 네비게이션 메뉴
- <form> 태그 → 연락처 폼
- <meta name="viewport"> → 반응형
- @media queries → 반응형
- :hover, animation, transition → 애니메이션
- data-theme, .dark-mode → 다크모드
```

#### 4. 활동성 분석
```javascript
GET /repos/:owner/:repo/commits
→ 커밋 개수, 최근 커밋 날짜
```

#### 5. 배포 URL 검증
```javascript
// Cloudflare Workers에서 fetch
const response = await fetch(deployedUrl);
→ 상태 코드 200 체크
→ HTML 기본 구조 검증
```

---

## 프로젝트 구조

```
vibe-grade-project/
├── src/
│   ├── components/           # React 컴포넌트
│   │   ├── StudentList.jsx
│   │   ├── GradingPanel.jsx
│   │   ├── Statistics.jsx
│   │   ├── Announcements.jsx
│   │   └── AutoAnalysis.jsx
│   ├── services/             # API 클라이언트
│   │   ├── api.js
│   │   ├── github.js
│   │   └── storage.js
│   ├── utils/
│   │   ├── grading.js
│   │   └── export.js
│   ├── App.jsx
│   └── main.jsx
│
├── functions/                # Cloudflare Pages Functions
│   ├── api/
│   │   ├── students.js       # /api/students
│   │   ├── grades.js         # /api/grades
│   │   ├── github/
│   │   │   └── analyze.js    # /api/github/analyze
│   │   ├── announcements.js
│   │   └── export.js
│   └── _middleware.js        # 인증/CORS
│
├── db/
│   ├── schema.sql            # DB 스키마
│   ├── migrations/
│   └── seed.sql              # 초기 데이터
│
├── public/
├── package.json
├── vite.config.js
├── wrangler.toml             # Cloudflare 설정
└── README.md
```

---

## 배포 프로세스

### 1단계: 환경 준비

#### GitHub Repository 생성
```bash
cd vibe-grade-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vibe-grade.git
git push -u origin main
```

#### Neon PostgreSQL 설정
1. https://neon.tech 가입
2. 새 프로젝트 생성: `vibe-grade-db`
3. Connection String 복사:
   ```
   postgresql://user:password@ep-xxx.neon.tech/vibe_grade
   ```

#### Cloudflare 계정 설정
1. https://cloudflare.com 가입
2. DNS에 도메인 추가: `abada.co.kr`
3. Pages 프로젝트 생성

### 2단계: Database 초기화

```bash
# Neon 대시보드의 SQL Editor에서 실행
# 또는 psql 명령어로:
psql "postgresql://user:password@ep-xxx.neon.tech/vibe_grade" < db/schema.sql
```

### 3단계: Cloudflare Pages 설정

#### wrangler.toml 생성
```toml
name = "vibe-grade"
compatibility_date = "2025-01-22"

[vars]
NEON_DATABASE_URL = "postgresql://..."

# Environment variables (Cloudflare 대시보드에서 설정)
# GITHUB_TOKEN (선택사항, rate limit 증가용)
```

#### 환경 변수 설정 (Cloudflare Dashboard)
```
NEON_DATABASE_URL=postgresql://...
GITHUB_TOKEN=ghp_xxxxx (선택)
JWT_SECRET=random-secret-key
```

### 4단계: Cloudflare Pages 배포

#### GitHub 연동 자동 배포
1. Cloudflare Dashboard → Pages
2. "Create a project" → "Connect to Git"
3. Repository 선택: `vibe-grade`
4. 빌드 설정:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Environment variables 추가
6. "Save and Deploy"

#### 수동 배포 (CLI)
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=vibe-grade
```

### 5단계: DNS 설정

**Cloudflare DNS 설정**
```
Type: CNAME
Name: edu
Target: vibe-grade.pages.dev
Proxy: Enabled (주황색 구름)
```

**abada.co.kr DNS에서 위임 (기존 DNS 서버 사용 시)**
```
Type: CNAME
Name: edu
Target: vibe-grade.pages.dev
```

### 6단계: Custom Domain 연결

Cloudflare Pages Dashboard:
1. 프로젝트 선택 → "Custom domains"
2. "Set up a custom domain"
3. 입력: `edu.abada.co.kr`
4. SSL/TLS 자동 적용 (무료)

---

## 개발 워크플로우

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Frontend)
npm run dev

# Cloudflare Pages Functions 로컬 테스트
npx wrangler pages dev dist

# 또는 동시 실행
npm run dev & npx wrangler pages dev dist
```

### 환경 변수 (.env.local)
```env
VITE_API_URL=http://localhost:8788/api
VITE_NEON_DATABASE_URL=postgresql://...
```

### Git Workflow
```bash
# 기능 개발
git checkout -b feature/auto-analysis
# 코드 작성...
git add .
git commit -m "feat: Add GitHub auto analysis"
git push origin feature/auto-analysis

# main에 머지하면 자동 배포
git checkout main
git merge feature/auto-analysis
git push origin main
```

---

## 구현 단계별 계획

### Phase 1: 기본 인프라 (1-2일)
- [ ] GitHub Repository 생성
- [ ] Neon PostgreSQL 설정 및 스키마 생성
- [ ] Cloudflare Pages 연동
- [ ] 도메인 연결
- [ ] 기본 배포 테스트

### Phase 2: Backend API (2-3일)
- [ ] Cloudflare Pages Functions 구조 설정
- [ ] Students API 구현
- [ ] Grades API 구현
- [ ] Database 연결 및 쿼리 구현
- [ ] CORS 및 인증 미들웨어

### Phase 3: Frontend 개선 (2-3일)
- [ ] 현재 로컬 상태를 API 연동으로 변경
- [ ] API 클라이언트 서비스 구현
- [ ] 로딩/에러 상태 처리
- [ ] 데이터 동기화

### Phase 4: GitHub 자동 분석 (3-4일)
- [ ] GitHub API 연동
- [ ] 리포지토리 분석 로직
- [ ] HTML 파싱 및 기능 감지
- [ ] 자동 채점 알고리즘
- [ ] UI에 "자동 분석" 버튼 추가

### Phase 5: 공지사항 기능 (1-2일)
- [ ] Announcements API
- [ ] 공지사항 관리 UI
- [ ] 학생용 공지 뷰

### Phase 6: 일괄 분석 & 최적화 (2-3일)
- [ ] 전체 학생 일괄 분석
- [ ] Progress tracking
- [ ] 분석 캐싱
- [ ] Rate limit 처리

### Phase 7: 배포 및 테스트 (1-2일)
- [ ] Production 배포
- [ ] 성능 테스트
- [ ] 버그 수정
- [ ] 문서화

**총 예상 기간: 12-20일**

---

## 비용 분석

### 완전 무료 조합
| 서비스 | 무료 한도 | 예상 사용량 |
|--------|-----------|-------------|
| Cloudflare Pages | 무제한 요청 | ✓ 충분 |
| Cloudflare Workers | 10만 req/day | ✓ 충분 (학생 ~100명) |
| Neon PostgreSQL | 0.5GB storage | ✓ 충분 (~1만 레코드) |
| Cloudflare DNS | 무제한 | ✓ 완전 무료 |
| GitHub API | 60 req/h (인증시 5000) | ✓ 캐싱으로 해결 |

**월 예상 비용: $0**

### 확장 시 유료 전환 필요
- 학생 500명 이상: Neon Pro ($19/mo)
- 일일 분석 요청 10만 이상: Workers Paid ($5/mo)

---

## 보안 고려사항

### 1. API 인증
```javascript
// JWT 기반 간단한 인증
// functions/_middleware.js
export async function onRequest(context) {
  const authHeader = context.request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  // JWT 검증...
}
```

### 2. Rate Limiting
```javascript
// Cloudflare Workers KV로 간단한 rate limit
const key = `rate_limit:${ip}`;
const count = await env.KV.get(key);
if (count > 100) return new Response('Too Many Requests', { status: 429 });
```

### 3. SQL Injection 방지
```javascript
// Parameterized queries 사용
await db.query('SELECT * FROM students WHERE id = $1', [studentId]);
```

### 4. CORS 설정
```javascript
// 특정 도메인만 허용
const allowedOrigins = ['https://edu.abada.co.kr'];
```

---

## 모니터링 & 로깅

### Cloudflare Analytics
- 무료로 제공되는 기본 분석
- 요청 수, 대역폭, 에러율

### Sentry (선택사항)
- 에러 트래킹
- 무료 tier: 5,000 events/month

---

## 백업 전략

### 데이터베이스 백업
```bash
# Neon은 자동 백업 제공 (무료 tier: 7일 보관)
# 수동 백업 (매주 실행 권장):
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql
```

### GitHub 백업
- 모든 코드는 GitHub에 버전 관리
- CSV/JSON export로 데이터 백업

---

## 문제 해결 가이드

### CORS 에러
```javascript
// functions/_middleware.js
export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://edu.abada.co.kr',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const response = await context.next();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
```

### GitHub API Rate Limit
- Personal Access Token 사용 (5000 req/h)
- 분석 결과 캐싱 (24시간)
- GraphQL API 사용 (더 효율적)

### Database Connection Pool
```javascript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: env.NEON_DATABASE_URL });
```

---

## 다음 단계

1. **즉시 시작 가능한 작업**:
   - GitHub Repository 생성
   - Neon 계정 생성 및 DB 설정
   - Cloudflare 계정 설정

2. **개발 시작**:
   - 로컬에서 기능 구현
   - API 엔드포인트 작성
   - Frontend-Backend 연동

3. **배포 테스트**:
   - Staging 환경 배포
   - 도메인 연결 테스트
   - 프로덕션 배포

---

**문서 작성일**: 2025-01-22
**버전**: 1.0
**담당자**: 프로젝트 관리자
