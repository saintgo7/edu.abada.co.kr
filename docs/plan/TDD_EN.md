# TDD (Technical Design Document)
# Technical Design Document

**Project Name**: Vibe Grade - Student Grading Management System
**Version**: 1.0
**Date**: 2025-01-22
**Status**: Draft

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Architecture Design](#2-architecture-design)
3. [Data Models](#3-data-models)
4. [API Design](#4-api-design)
5. [GitHub Auto-Analysis Algorithm](#5-github-auto-analysis-algorithm)
6. [Frontend Design](#6-frontend-design)
7. [Backend Design](#7-backend-design)
8. [Security Design](#8-security-design)
9. [Deployment Strategy](#9-deployment-strategy)
10. [Performance Optimization](#10-performance-optimization)

---

## 1. System Overview

### 1.1 System Purpose
Student website project evaluation and grade management through automatic GitHub repository analysis

### 1.2 Key Features
- Student information management (CRUD)
- Automatic GitHub repository analysis
- Checklist-based grading
- Comprehensive grade calculation and statistics
- Announcement management
- Data export (CSV/JSON)

### 1.3 Technology Stack Summary
```
Frontend:  React 18 + Vite 5
Backend:   Cloudflare Pages Functions
Database:  Neon PostgreSQL (Serverless)
CDN:       Cloudflare
Domain:    edu.abada.co.kr
```

---

## 2. Architecture Design

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Users                                │
│          (Professor / Students / Admins)                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS / DNS
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               Cloudflare Global Network                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │  DNS Service   │  │   CDN Cache    │  │  DDoS Prot.  │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌──────────────────┐
│ Cloudflare Pages│            │  Static Assets   │
│   (React SPA)   │            │  (HTML/CSS/JS)   │
└────────┬────────┘            └──────────────────┘
         │
         │ /api/*
         ▼
┌─────────────────────────────────────────┐
│   Cloudflare Pages Functions            │
│   (Serverless API Endpoints)            │
└──────┬──────────────────┬───────────────┘
       │                  │
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────┐
│ GitHub API   │   │ Neon PostgreSQL │
│ (Analysis)   │   │   (Database)    │
└──────────────┘   └─────────────────┘
```

---

## 3. Data Models

### 3.1 TypeScript Interfaces

```typescript
// Student Model
interface Student {
  id: number;
  studentId: string;
  name: string;
  githubUrl?: string;
  deployedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Grade Model
interface Grade {
  id: number;
  studentId: number;
  checklist: ChecklistItems;
  websiteScore: number;
  websiteGrade: string;
  miniProject1: number;
  miniProject2: number;
  presentation: number;
  weeklyProgress: number;
  attendance: number;
  comment?: string;
  autoAnalysis?: AnalysisResult;
  lastAnalyzedAt?: Date;
  updatedAt: Date;
}

// Analysis Result
interface AnalysisResult {
  pageCount: number;
  hasNavigation: boolean;
  hasResponsive: boolean;
  hasContactForm: boolean;
  hasDarkMode: boolean;
  hasScrollAnimation: boolean;
  hasExternalService: boolean;
  commitCount: number;
  lastCommit: string;
  suggestedChecklist: { [key: string]: boolean };
  confidence: number;
  errors: string[];
}
```

---

## 4. API Design

### 4.1 API Endpoint Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/students | List students | ✓ |
| POST | /api/students | Add student | ✓ |
| PUT | /api/students/:id | Update student | ✓ |
| DELETE | /api/students/:id | Delete student | ✓ |
| POST | /api/students/bulk | CSV bulk upload | ✓ |
| GET | /api/grades/:studentId | Get grade | ✓ |
| PUT | /api/grades/:studentId | Update grade | ✓ |
| POST | /api/github/analyze | Analyze GitHub repo | ✓ |
| GET | /api/announcements | List announcements | - |
| POST | /api/announcements | Create announcement | ✓ |
| GET | /api/export/csv | Export CSV | ✓ |
| POST | /api/auth/login | Login | - |

---

## 5. GitHub Auto-Analysis Algorithm

### 5.1 Analysis Process

```
┌─────────────────────────────────────────┐
│  1. URL Parsing & Validation           │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  2. Cache Check (24 hours)              │
│     - Return cache if exists            │
│     - Continue if not                   │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  3. GitHub API: Repository Tree         │
│     GET /repos/:owner/:repo/git/trees   │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  4. File Classification                 │
│     - Filter HTML files                 │
│     - Filter CSS files                  │
│     - Filter JS files                   │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  5. Page Count Calculation              │
│     - Count .html files                 │
│     - Exclude index.html, +1            │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  6. HTML Content Analysis               │
│     - Download index.html               │
│     - Detect <nav> tag                  │
│     - Detect <form> tag                 │
│     - Detect <meta viewport>            │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  7. CSS Analysis                        │
│     - Search @media queries             │
│     - Search :hover, animation          │
│     - Search dark-mode classes          │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  8. Commit Analysis                     │
│     GET /repos/:owner/:repo/commits     │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  9. Checklist Auto-Suggestion           │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  10. Confidence Calculation             │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  11. Cache Result (24h TTL)             │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  12. Return Result                      │
└─────────────────────────────────────────┘
```

---

### 5.2 Feature Detection Logic

```javascript
function analyzeHtmlFeatures(htmlContent) {
  const features = {
    hasNavigation: false,
    hasContactForm: false,
    hasAnimation: false,
    hasDarkMode: false,
    hasScrollAnimation: false,
    hasExternalService: false
  };

  // Navigation detection
  if (/<nav[\s>]/i.test(htmlContent) ||
      /class="nav/i.test(htmlContent)) {
    features.hasNavigation = true;
  }

  // Contact Form detection
  if (/<form[\s>]/i.test(htmlContent) &&
      /type=["']email["']/i.test(htmlContent)) {
    features.hasContactForm = true;
  }

  // Animation detection
  if (/animation:|@keyframes|transition:/i.test(htmlContent)) {
    features.hasAnimation = true;
  }

  // Dark Mode detection
  if (/dark-mode|data-theme|theme-toggle/i.test(htmlContent)) {
    features.hasDarkMode = true;
  }

  // Scroll Animation detection
  if (/scroll.*reveal|aos-|animate-on-scroll/i.test(htmlContent)) {
    features.hasScrollAnimation = true;
  }

  // External Service detection
  if (/googleapis\.com|cloudflare|cdn\./i.test(htmlContent)) {
    features.hasExternalService = true;
  }

  return features;
}
```

---

## 6. Frontend Design

### 6.1 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Loading.jsx
│   ├── student/
│   │   ├── StudentList.jsx
│   │   ├── StudentForm.jsx
│   │   └── StudentRow.jsx
│   ├── grading/
│   │   ├── GradingPanel.jsx
│   │   ├── Checklist.jsx
│   │   └── AutoAnalyzeButton.jsx
│   └── statistics/
│       ├── GradeChart.jsx
│       └── PieChart.jsx
├── services/
│   ├── api.js
│   ├── studentService.js
│   └── githubService.js
├── utils/
│   ├── grading.js
│   └── export.js
├── App.jsx
└── main.jsx
```

---

### 6.2 Custom Hooks

```typescript
// useStudents.ts
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    const response = await api.get('/students');
    setStudents(response.data.students);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, refetch: fetchStudents };
}

// useGitHubAnalysis.ts
export function useGitHubAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async (url: string) => {
    setAnalyzing(true);
    const response = await api.post('/github/analyze', { url });
    setAnalyzing(false);
    return response.data;
  };

  return { analyze, analyzing };
}
```

---

## 7. Backend Design

### 7.1 API Implementation

```javascript
// functions/api/github/analyze.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { url, forceRefresh } = await request.json();

  try {
    // 1. Parse GitHub URL
    const { owner, repo } = parseGitHubUrl(url);

    // 2. Check cache
    if (!forceRefresh) {
      const cached = await getCachedAnalysis(env, url);
      if (cached) return jsonResponse({ success: true, data: cached });
    }

    // 3. Fetch repository tree
    const tree = await fetchRepoTree(owner, repo, env.GITHUB_TOKEN);

    // 4. Analyze files
    const htmlFiles = tree.filter(f => f.path.endsWith('.html'));
    const pageCount = htmlFiles.length;

    // 5. Fetch and analyze index.html
    const indexContent = await fetchFileContent(owner, repo, 'index.html', env.GITHUB_TOKEN);
    const features = analyzeHtmlFeatures(indexContent);

    // 6. Fetch commits
    const commits = await fetchCommits(owner, repo, env.GITHUB_TOKEN);

    // 7. Generate result
    const result = {
      pageCount,
      ...features,
      commitCount: commits.length,
      lastCommit: commits[0]?.commit.author.date,
      suggestedChecklist: generateChecklistSuggestion({
        pageCount,
        features,
        commitCount: commits.length
      }),
      confidence: calculateConfidence(features),
      errors: []
    };

    // 8. Cache result
    await cacheAnalysisResult(env, url, result);

    return jsonResponse({ success: true, data: result });
  } catch (error) {
    return errorResponse(error);
  }
}
```

---

## 8. Security Design

### 8.1 JWT Authentication

```javascript
// functions/lib/auth.js
import { SignJWT, jwtVerify } from 'jose';

export async function generateJWT(payload, secret) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyJWT(token, secret) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}
```

---

## 9. Deployment Strategy

### 9.1 Deployment Process

```bash
# 1. Local build test
npm run build

# 2. Git push (auto deploy)
git add .
git commit -m "feat: Add feature"
git push origin main

# 3. Cloudflare Pages auto build
# - Runs Vite build
# - Deploys dist/ folder
# - Auto-deploys Functions

# 4. DNS setup (one-time)
# Cloudflare Dashboard → Custom Domain
# Add edu.abada.co.kr

# 5. Verify deployment
curl https://edu.abada.co.kr/api/health
```

---

## 10. Performance Optimization

### 10.1 Frontend Optimization

```javascript
// Code Splitting
const Statistics = lazy(() => import('./components/Statistics'));

<Suspense fallback={<Loading />}>
  <Statistics />
</Suspense>

// Memoization
const gradeDistribution = useMemo(() => {
  return calculateDistribution(students);
}, [students]);
```

---

### 10.2 Backend Optimization

```sql
-- Database Indexing
CREATE INDEX idx_students_search ON students (name, student_id);
CREATE INDEX idx_grades_lookup ON grades (student_id);
```

```javascript
// Caching
async function getCachedAnalysis(url) {
  const result = await db.query(
    'SELECT analysis_result FROM analysis_cache WHERE github_url = $1 AND expires_at > NOW()',
    [url]
  );
  return result.rows[0]?.analysis_result;
}
```

---

**End of Document**
