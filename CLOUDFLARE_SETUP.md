# Cloudflare Pages 설정 가이드

이 가이드는 Vibe Grade 프로젝트를 Cloudflare Pages에 배포하는 방법을 설명합니다.

---

## 📋 사전 준비사항

- [x] GitHub 계정 및 리포지토리 (https://github.com/saintgo7/edu.abada.co.kr)
- [ ] Cloudflare 계정 (https://dash.cloudflare.com)
- [ ] Neon PostgreSQL 계정 (https://neon.tech)

---

## 1단계: Cloudflare Pages 프로젝트 생성

### 1.1 Cloudflare 대시보드 접속
1. https://dash.cloudflare.com 접속
2. 로그인 (계정 없으면 무료 가입)

### 1.2 Pages 프로젝트 생성
1. 왼쪽 메뉴에서 **Workers & Pages** 클릭
2. **Create application** 버튼 클릭
3. **Pages** 탭 선택
4. **Connect to Git** 클릭

### 1.3 GitHub 연동
1. **GitHub** 선택
2. GitHub 계정 인증 (처음이면)
3. **saintgo7/edu.abada.co.kr** 리포지토리 선택
4. **Begin setup** 클릭

### 1.4 빌드 설정
다음과 같이 입력:

```
Project name: vibe-grade
Production branch: main

Build settings:
  Framework preset: Vite
  Build command: npm run build
  Build output directory: dist
  Root directory: /
```

**Environment variables (나중에 추가 가능, 지금은 비워도 됨)**

5. **Save and Deploy** 클릭

### 1.5 첫 배포 대기
- 첫 배포는 2-5분 소요
- 빌드 로그를 확인하여 성공 여부 체크
- 성공하면 임시 URL 생성: `vibe-grade.pages.dev`

---

## 2단계: Neon PostgreSQL 설정

### 2.1 Neon 계정 생성
1. https://neon.tech 접속
2. **Sign up** (GitHub 계정으로 가입 가능)

### 2.2 프로젝트 생성
1. **New Project** 클릭
2. 프로젝트 설정:
   ```
   Project name: vibe-grade-db
   PostgreSQL version: 16 (최신)
   Region: US East (Ohio) - 또는 가까운 지역
   ```
3. **Create project** 클릭

### 2.3 Connection String 복사
1. 대시보드에서 **Connection string** 확인
2. **Connection string** 형식 예시:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/vibe_grade?sslmode=require
   ```
3. 이 문자열을 **안전하게 저장** (나중에 Cloudflare에 추가)

### 2.4 데이터베이스 스키마 생성
1. Neon 대시보드에서 **SQL Editor** 클릭
2. 다음 SQL 실행 (스키마는 다음 단계에서 생성 예정):
   ```sql
   -- 데이터베이스가 준비되었는지 확인
   SELECT version();
   ```

---

## 3단계: Cloudflare 환경 변수 설정

### 3.1 Cloudflare Pages 설정으로 이동
1. Cloudflare Dashboard → **Workers & Pages**
2. **vibe-grade** 프로젝트 클릭
3. **Settings** 탭 클릭
4. **Environment variables** 메뉴 클릭

### 3.2 환경 변수 추가

**Production 환경 변수:**

| Variable name | Value | 비고 |
|---------------|-------|------|
| `NEON_DATABASE_URL` | `postgresql://...` | Neon에서 복사한 Connection String |
| `JWT_SECRET` | (생성 필요) | 아래 명령어로 생성 |
| `GITHUB_TOKEN` | (선택사항) | GitHub Personal Access Token |
| `DOMAIN` | `edu.abada.co.kr` | 도메인 이름 |

**JWT_SECRET 생성 방법:**
```bash
# Linux/macOS/WSL
openssl rand -base64 32

# 출력 예: vK3m9p2nL5qR8sT1uV4wX6yZ0aB2cD4eF6gH8iJ0k=
```

### 3.3 변수 저장
1. 각 변수를 **Production** 환경에 추가
2. **Save** 클릭
3. (선택사항) **Preview** 환경에도 동일하게 추가

---

## 4단계: 도메인 연결

### 4.1 Custom Domain 추가
1. Cloudflare Pages 프로젝트에서 **Custom domains** 탭 클릭
2. **Set up a custom domain** 클릭
3. 도메인 입력: `edu.abada.co.kr`
4. **Continue** 클릭

### 4.2 DNS 설정
Cloudflare가 자동으로 DNS 레코드를 제안합니다:

**옵션 A: abada.co.kr이 이미 Cloudflare에 있는 경우**
- Cloudflare가 자동으로 CNAME 레코드 추가
- 몇 분 내 적용

**옵션 B: 다른 DNS 제공업체 사용 중**
1. 현재 DNS 관리 페이지 접속
2. 다음 CNAME 레코드 추가:
   ```
   Type: CNAME
   Name: edu
   Target: vibe-grade.pages.dev
   TTL: Auto or 3600
   ```

### 4.3 SSL/TLS 활성화
- Cloudflare가 **자동으로 무료 SSL 인증서** 발급
- 보통 5-10분 소요
- 완료되면 `https://edu.abada.co.kr` 접속 가능

---

## 5단계: 배포 확인

### 5.1 웹사이트 접속
```bash
# 임시 URL
https://vibe-grade.pages.dev

# 커스텀 도메인 (설정 완료 후)
https://edu.abada.co.kr
```

### 5.2 배포 로그 확인
1. Cloudflare Pages → **vibe-grade** 프로젝트
2. **Deployments** 탭 클릭
3. 최신 배포 클릭하여 로그 확인

### 5.3 API 엔드포인트 테스트
```bash
# Health check (구현 후)
curl https://edu.abada.co.kr/api/health

# 또는 브라우저에서
https://edu.abada.co.kr/api/health
```

---

## 6단계: 자동 배포 설정 (이미 완료됨)

GitHub에 코드를 푸시하면 **자동으로 Cloudflare Pages가 빌드 및 배포**합니다.

```bash
# 코드 수정 후
git add .
git commit -m "feat: Add new feature"
git push origin main

# Cloudflare가 자동으로:
# 1. GitHub webhook 감지
# 2. npm run build 실행
# 3. dist/ 폴더 배포
# 4. 2-5분 내 배포 완료
```

---

## 🔧 추가 설정 (선택사항)

### Cloudflare Analytics 활성화
1. Pages 프로젝트 → **Analytics** 탭
2. **무료로 제공되는 트래픽 분석** 확인 가능

### Build 설정 수정
1. Pages 프로젝트 → **Settings** → **Builds & deployments**
2. Build command, output directory 수정 가능

### Preview Deployments
- `main` 브랜치 외의 모든 브랜치는 자동으로 Preview 배포
- PR마다 고유한 미리보기 URL 생성
- 예: `https://abc123.vibe-grade.pages.dev`

---

## 🐛 문제 해결

### 문제 1: 빌드 실패
**에러**: `npm ERR! Missing script: "build"`

**해결**:
```bash
# package.json에 build 스크립트 확인
{
  "scripts": {
    "build": "vite build"
  }
}
```

### 문제 2: 환경 변수 인식 안 됨
**해결**:
1. Cloudflare Dashboard → Environment variables 다시 확인
2. **Production** 환경에 추가했는지 확인
3. 재배포 필요 (Settings → Deployments → Retry deployment)

### 문제 3: 도메인 SSL 인증서 대기 중
**해결**:
- 보통 5-10분 소요
- 최대 24시간까지 걸릴 수 있음
- DNS 전파 확인: https://dnschecker.org

### 문제 4: API 404 오류
**해결**:
- Functions 폴더가 아직 구현되지 않았을 수 있음
- 다음 단계에서 API 구현 예정

---

## 📊 무료 Tier 제한

| 항목 | 무료 한도 |
|------|----------|
| 빌드 횟수 | 500 builds/month |
| Bandwidth | Unlimited |
| Requests | Unlimited |
| Build 시간 | 20분/build |
| Functions | 100,000 req/day |

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub 리포지토리 연결 완료
- [ ] Cloudflare Pages 프로젝트 생성
- [ ] Neon PostgreSQL 데이터베이스 생성
- [ ] 환경 변수 설정 완료
- [ ] 첫 배포 성공 (vibe-grade.pages.dev 접속 가능)
- [ ] 커스텀 도메인 설정 (edu.abada.co.kr)
- [ ] SSL 인증서 활성화
- [ ] API 엔드포인트 테스트 (구현 후)

---

## 🎯 다음 단계

1. **데이터베이스 스키마 생성**: SQL 파일 실행
2. **API Functions 구현**: `functions/` 폴더 구조 생성
3. **Frontend API 연동**: 환경 변수 설정
4. **테스트 및 디버깅**: 실제 데이터로 테스트

---

**문서 작성일**: 2025-01-22
**마지막 업데이트**: 2025-01-22

문제가 발생하면 이 문서를 참고하거나 Cloudflare 공식 문서를 확인하세요:
- https://developers.cloudflare.com/pages/
