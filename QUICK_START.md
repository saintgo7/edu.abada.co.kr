# 빠른 시작 가이드 (Quick Start)

Vibe Grade를 5분 안에 배포하는 가장 빠른 방법입니다.

---

## 🚀 3단계로 배포하기

### 1️⃣ Cloudflare Pages 연결 (2분)

```
1. https://dash.cloudflare.com 접속 및 로그인
2. Workers & Pages → Create application
3. Pages → Connect to Git → GitHub
4. 리포지토리 선택: saintgo7/edu.abada.co.kr

빌드 설정:
  - Framework preset: Vite
  - Build command: npm run build
  - Build output: dist

5. Save and Deploy
```

**완료되면:** `https://vibe-grade.pages.dev` 생성

---

### 2️⃣ 가비아 DNS 설정 (2분)

```
1. https://my.gabia.com 로그인
2. 도메인 관리 → abada.co.kr → DNS 설정

CNAME 레코드 추가:
  - 호스트: edu
  - 값: vibe-grade.pages.dev
  - TTL: 3600

3. 저장
```

**DNS 전파 대기:** 10-30분

---

### 3️⃣ Cloudflare에 도메인 등록 (1분)

```
1. Cloudflare Pages → vibe-grade
2. Custom domains → Set up a custom domain
3. 입력: edu.abada.co.kr
4. Continue

SSL 자동 발급 대기: 5-10분
```

**완료!** `https://edu.abada.co.kr` 접속 가능

---

## 🗄️ 데이터베이스 설정 (5분)

### Neon PostgreSQL

```
1. https://neon.tech 가입
2. New Project → vibe-grade-db
3. Connection String 복사
4. SQL Editor → db/schema.sql 실행
```

### Cloudflare 환경 변수

```
Settings → Environment variables → Production

추가:
  NEON_DATABASE_URL = postgresql://...
  JWT_SECRET = (openssl rand -base64 32)
```

---

## ✅ 테스트

```bash
# Health check
curl https://edu.abada.co.kr/api/health

# 브라우저
https://edu.abada.co.kr
```

---

## 📚 자세한 가이드

- **Cloudflare 설정**: `CLOUDFLARE_SETUP.md`
- **가비아 DNS**: `GABIA_DNS_SETUP.md`
- **배포 계획**: `DEPLOYMENT_PLAN.md`

---

## 🔧 문제 발생 시

1. DNS 전파 확인: `nslookup edu.abada.co.kr`
2. Cloudflare 빌드 로그 확인
3. 환경 변수 재확인

---

**배포 시간:** 총 **15-30분** (DNS 전파 포함)
