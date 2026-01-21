# TRD (Technical Requirements Document)
# Technical Requirements Document

**Project Name**: Vibe Grade - Student Grading Management System
**Version**: 1.0
**Date**: 2025-01-22
**Status**: Draft

---

## 1. Technology Stack

### 1.1 Frontend

#### Core Framework
| Technology | Version | Purpose | License |
|------------|---------|---------|---------|
| React | 18.2+ | UI Framework | MIT |
| Vite | 5.0+ | Build Tool & Dev Server | MIT |
| React DOM | 18.2+ | React Rendering | MIT |

#### UI Libraries
| Technology | Version | Purpose | License |
|------------|---------|---------|---------|
| Recharts | 2.10+ | Charts & Data Visualization | MIT |
| React Icons | 4.12+ | Icon Library (optional) | MIT |

#### Styling
- **Inline Styles** (current structure)
- **CSS Modules** (optional)
- **TailwindCSS** (optional)

#### State Management
- **React Hooks** (useState, useCallback, useMemo)
- **Context API** (global state management, if needed)

---

### 1.2 Backend

#### Runtime & Framework
| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Cloudflare Pages Functions | Latest | Serverless API | Free 100k req/day |
| Node.js | 18.x+ | Runtime (local dev) | LTS |

#### Database
| Technology | Version | Purpose | Free Tier |
|------------|---------|---------|-----------|
| Neon PostgreSQL | Latest | Primary Database | 0.5GB storage |
| @neondatabase/serverless | Latest | Serverless DB Driver | - |

#### External APIs
| API | Purpose | Rate Limit |
|-----|---------|------------|
| GitHub REST API v3 | Repository analysis | 60 req/h (unauth), 5000 req/h (auth) |
| GitHub GraphQL API v4 | Efficient data query (optional) | 5000 points/h |

---

### 1.3 Infrastructure & DevOps

#### Hosting & CDN
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Cloudflare Pages | Static hosting & deployment | Unlimited bandwidth |
| Cloudflare CDN | Content delivery acceleration | Free |
| Cloudflare DNS | Domain DNS management | Free |

#### Version Control & CI/CD
| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Repository hosting |
| Cloudflare Pages (Auto Deploy) | CI/CD auto deployment |

#### Monitoring & Logging
| Tool | Purpose | Free Tier |
|------|---------|-----------|
| Cloudflare Analytics | Traffic & performance monitoring | Free |
| Sentry (optional) | Error tracking | 5,000 events/month |

---

### 1.4 Development Tools

#### Package Manager
- **npm** or **yarn**
- **pnpm** (optional, faster installation)

#### Code Quality
| Tool | Purpose | Config File |
|------|---------|-------------|
| ESLint | JavaScript/React linting | `.eslintrc.js` |
| Prettier | Code formatting | `.prettierrc` |

#### Testing (optional)
| Tool | Purpose |
|------|---------|
| Vitest | Unit testing |
| React Testing Library | Component testing |

---

## 2. System Architecture

### 2.1 Overall Architecture

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
       ├─────► GitHub API (Repository analysis)
       │
       └─────► Neon PostgreSQL (Data storage)
```

---

### 2.2 Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── common/            # Common components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Loading.jsx
│   ├── student/           # Student-related
│   │   ├── StudentList.jsx
│   │   ├── StudentForm.jsx
│   │   └── StudentRow.jsx
│   ├── grading/           # Grading-related
│   │   ├── GradingPanel.jsx
│   │   ├── Checklist.jsx
│   │   ├── ScoreInput.jsx
│   │   └── AutoAnalyzeButton.jsx
│   ├── statistics/        # Statistics
│   │   ├── GradeChart.jsx
│   │   ├── PieChart.jsx
│   │   └── SummaryStats.jsx
│   └── announcement/      # Announcements
│       ├── AnnouncementList.jsx
│       └── AnnouncementForm.jsx
├── services/              # API clients
│   ├── api.js             # API base config
│   ├── studentService.js
│   ├── gradeService.js
│   ├── githubService.js
│   └── announcementService.js
├── utils/                 # Utilities
│   ├── grading.js         # Grading calculation logic
│   ├── validation.js      # Validation
│   └── export.js          # CSV/JSON export
├── hooks/                 # Custom Hooks
│   ├── useStudents.js
│   ├── useGrades.js
│   └── useAuth.js
├── App.jsx                # Main app
└── main.jsx               # Entry point
```

---

### 2.3 Backend Architecture

#### API Structure
```
functions/
├── api/
│   ├── students/
│   │   ├── index.js       # GET /api/students (list)
│   │   ├── [id].js        # GET/PUT/DELETE /api/students/:id
│   │   └── bulk.js        # POST /api/students/bulk (CSV upload)
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
├── _middleware.js         # Auth, CORS, error handling
└── lib/
    ├── db.js              # Database connection
    ├── auth.js            # JWT auth helper
    └── github.js          # GitHub API client
```

---

## 3. Database Design

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
│ announcements   │  (Independent table)
└─────────────────┘

┌─────────────────┐
│ analysis_cache  │  (Independent table)
└─────────────────┘
```

---

### 3.2 Table Schema

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

  -- Checklist (JSONB)
  checklist JSONB DEFAULT '{}',
  website_score INTEGER DEFAULT 0 CHECK (website_score >= 0 AND website_score <= 40),
  website_grade VARCHAR(2),

  -- Other evaluation items
  mini_project1 INTEGER DEFAULT 0 CHECK (mini_project1 >= 0 AND mini_project1 <= 100),
  mini_project2 INTEGER DEFAULT 0 CHECK (mini_project2 >= 0 AND mini_project2 <= 100),
  presentation INTEGER DEFAULT 0 CHECK (presentation >= 0 AND presentation <= 100),
  weekly_progress INTEGER DEFAULT 0 CHECK (weekly_progress >= 0 AND weekly_progress <= 100),
  attendance INTEGER DEFAULT 0 CHECK (attendance >= 0 AND attendance <= 100),

  -- Comment
  comment TEXT,

  -- Auto-analysis result
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

### 3.3 JSONB Structure

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

## 4. API Specification

### 4.1 RESTful API Rules

#### HTTP Methods
- **GET**: Read
- **POST**: Create
- **PUT**: Full update
- **PATCH**: Partial update (optional)
- **DELETE**: Delete

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
- **200**: Success
- **201**: Created
- **400**: Bad request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not found
- **429**: Rate limit exceeded
- **500**: Server error

---

### 4.2 Main API Endpoints

#### Students API

**GET /api/students**
```
Query Parameters:
  - search: string (search term)
  - limit: number (default 100)
  - offset: number (default 0)

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
  "name": "John Doe",
  "githubUrl": "https://github.com/john/project",
  "deployedUrl": "https://john.vercel.app"
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

## 5. Security Requirements

### 5.1 Authentication

#### JWT Token Structure
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

---

### 5.2 Data Validation

#### Input Validation
```javascript
// Student ID: 8 digits
const studentIdRegex = /^\d{8}$/;

// GitHub URL
const githubUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;

// URL
const urlRegex = /^https?:\/\/.+/;
```

#### SQL Injection Prevention
```javascript
// ❌ Vulnerable code
const query = `SELECT * FROM students WHERE id = ${id}`;

// ✅ Safe code (Parameterized Query)
const query = 'SELECT * FROM students WHERE id = $1';
await db.query(query, [id]);
```

---

### 5.3 Rate Limiting

```javascript
// Using Cloudflare Workers KV
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

## 6. Performance Requirements

### 6.1 Frontend Optimization

#### Code Splitting
```javascript
// Dynamic import with React.lazy
const Statistics = React.lazy(() => import('./components/Statistics'));

<Suspense fallback={<Loading />}>
  <Statistics />
</Suspense>
```

---

### 6.2 Backend Optimization

#### Database Indexing
```sql
-- Index frequently queried columns
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

---

## 7. Deployment Requirements

### 7.1 Environment Variables

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

### 7.2 Build Configuration

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

---

## 8. Technical Constraints

### 8.1 Free Tier Constraints
- **Neon DB**: 0.5GB storage, one project only
- **Cloudflare Workers**: 100k req/day
- **GitHub API**: 60 req/h (unauth), 5000 req/h (auth)

### 8.2 Browser Compatibility
- ES6+ support required
- Fetch API usage
- LocalStorage usage

### 8.3 Network
- HTTPS required
- CORS policy compliance
- No WebSocket (serverless constraint)

---

**End of Document**
