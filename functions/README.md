# Cloudflare Pages Functions

이 폴더는 Cloudflare Pages Functions (서버리스 API)를 포함합니다.

## 📁 폴더 구조

```
functions/
├── _middleware.js          # 전역 미들웨어 (CORS, 에러 처리)
└── api/
    ├── health.js           # Health check endpoint
    ├── students/           # 학생 관리 API (구현 예정)
    ├── grades/             # 성적 관리 API (구현 예정)
    ├── github/             # GitHub 분석 API (구현 예정)
    ├── announcements/      # 공지사항 API (구현 예정)
    └── auth/               # 인증 API (구현 예정)
```

## 🚀 현재 구현된 엔드포인트

### GET /api/health
시스템 상태 확인

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2025-01-22T03:00:00.000Z",
    "environment": {
      "database": "configured",
      "authentication": "configured",
      "githubApi": "configured (authenticated)"
    },
    "message": "Vibe Grade API is running"
  }
}
```

## 🔧 로컬 개발

```bash
# 로컬 Functions 서버 실행
npx wrangler pages dev dist

# 또는 빌드와 함께
npm run build && npx wrangler pages dev dist
```

## 📝 다음 구현 예정

- [ ] Students API (CRUD)
- [ ] Grades API (CRUD, 자동 분석)
- [ ] GitHub Analysis API
- [ ] Announcements API
- [ ] Authentication API

## 📚 참고 문서

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Functions Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Middleware](https://developers.cloudflare.com/pages/platform/functions/middleware/)
