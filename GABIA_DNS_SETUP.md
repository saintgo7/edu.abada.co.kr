# 가비아 DNS 설정 가이드 (CNAME)

Gabia에서 관리하는 `abada.co.kr` 도메인을 Cloudflare Pages에 연결하는 방법입니다.

---

## 📋 준비사항

- [x] 가비아 계정 및 `abada.co.kr` 도메인 소유
- [ ] Cloudflare Pages 프로젝트 생성 완료
- [ ] Cloudflare Pages 임시 URL 확인 (예: `vibe-grade.pages.dev`)

---

## 🔧 1단계: Cloudflare Pages 프로젝트 URL 확인

먼저 Cloudflare Pages에서 자동으로 생성된 URL을 확인합니다.

### Cloudflare Dashboard에서 확인
1. https://dash.cloudflare.com 접속
2. **Workers & Pages** 메뉴
3. **vibe-grade** 프로젝트 클릭
4. 상단에 표시된 URL 확인: `vibe-grade.pages.dev`

💡 **이 URL을 복사해두세요!** (다음 단계에서 사용)

---

## 🌐 2단계: 가비아 DNS 설정

### 2.1 가비아 My가비아 접속
1. https://my.gabia.com 접속
2. 로그인

### 2.2 도메인 관리 페이지 이동
1. 상단 메뉴 → **서비스 관리**
2. **도메인** 탭 클릭
3. `abada.co.kr` 도메인 찾기
4. **관리** 또는 **DNS 관리** 버튼 클릭

### 2.3 DNS 설정 메뉴 진입
1. **DNS 설정** 또는 **DNS 정보** 메뉴 클릭
2. **DNS 레코드 수정** 버튼 클릭

---

## ✏️ 3단계: CNAME 레코드 추가

### 3.1 새 레코드 추가
**DNS 레코드 추가** 버튼 클릭 후 다음 정보 입력:

```
┌─────────────────────────────────────────────┐
│ 레코드 타입:  CNAME                         │
│ 호스트명:     edu                            │
│ 값/타겟:      vibe-grade.pages.dev          │
│ TTL:          3600 (1시간) 또는 기본값      │
└─────────────────────────────────────────────┘
```

### 3.2 상세 입력 방법

| 필드 | 입력값 | 설명 |
|------|--------|------|
| **타입** | `CNAME` | 레코드 타입 선택 |
| **호스트** | `edu` | 서브도메인 이름 |
| **값 (Value)** | `vibe-grade.pages.dev` | Cloudflare Pages URL |
| **TTL** | `3600` | Time To Live (1시간) |

### 3.3 최종 확인
입력 후 다음과 같이 표시되어야 합니다:

```
edu.abada.co.kr  →  CNAME  →  vibe-grade.pages.dev
```

### 3.4 저장
**저장** 또는 **적용** 버튼 클릭

---

## ⏱️ 4단계: DNS 전파 대기

### DNS 전파 시간
- **일반적**: 10분 ~ 1시간
- **최대**: 24-48시간 (드물게)

### 전파 상태 확인 방법

#### 방법 1: nslookup 명령어 (Windows/Linux/Mac)
```bash
nslookup edu.abada.co.kr
```

**성공 시 출력:**
```
Name:    edu.abada.co.kr
Address: vibe-grade.pages.dev
```

#### 방법 2: dig 명령어 (Linux/Mac/WSL)
```bash
dig edu.abada.co.kr CNAME
```

**성공 시 출력:**
```
edu.abada.co.kr.  3600  IN  CNAME  vibe-grade.pages.dev.
```

#### 방법 3: 온라인 DNS 확인 도구
- https://dnschecker.org
- 입력: `edu.abada.co.kr`
- Type: `CNAME`
- 전 세계 DNS 서버에서 전파 상태 확인

---

## 🔐 5단계: Cloudflare Pages에 커스텀 도메인 추가

DNS 설정 후, Cloudflare Pages에 도메인을 등록합니다.

### 5.1 Cloudflare Pages 설정
1. Cloudflare Dashboard → **vibe-grade** 프로젝트
2. **Custom domains** 탭 클릭
3. **Set up a custom domain** 버튼 클릭

### 5.2 도메인 입력
```
Domain: edu.abada.co.kr
```
입력 후 **Continue** 클릭

### 5.3 DNS 확인
Cloudflare가 자동으로 DNS 레코드를 확인합니다:

**✅ 성공 메시지:**
```
✓ DNS record found
edu.abada.co.kr points to vibe-grade.pages.dev
```

**❌ 실패 메시지:**
```
✗ DNS record not found
Please add a CNAME record
```
→ DNS 전파를 더 기다리거나, 가비아 설정을 다시 확인하세요.

### 5.4 SSL/TLS 인증서 자동 발급
Cloudflare가 **무료 SSL 인증서**를 자동으로 발급합니다.

**발급 시간:**
- 일반적: 5-10분
- 최대: 24시간

**상태 확인:**
```
Status: Active
SSL: Provisioned
```

---

## ✅ 6단계: 접속 테스트

### 6.1 브라우저에서 확인
```
https://edu.abada.co.kr
```

**성공 시:**
- Vibe Grade 웹사이트 로드
- 주소창에 자물쇠 🔒 아이콘 (HTTPS)

### 6.2 API 엔드포인트 테스트
```bash
curl https://edu.abada.co.kr/api/health
```

**예상 응답:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0"
  }
}
```

### 6.3 HTTPS 리디렉션 확인
HTTP로 접속 시 자동으로 HTTPS로 리디렉션되는지 확인:
```
http://edu.abada.co.kr → https://edu.abada.co.kr
```

---

## 🔍 문제 해결 (Troubleshooting)

### 문제 1: "DNS record not found" 오류
**원인**: DNS 전파가 완료되지 않음

**해결 방법:**
1. 10-30분 더 대기
2. 가비아 DNS 설정 재확인:
   - 호스트명: `edu` (정확히)
   - 값: `vibe-grade.pages.dev` (끝에 점 없음)
   - 타입: `CNAME`
3. nslookup으로 전파 확인

---

### 문제 2: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"
**원인**: SSL 인증서가 아직 발급 중

**해결 방법:**
1. 5-10분 더 대기
2. Cloudflare Dashboard → Custom domains에서 상태 확인
3. 상태가 "Provisioning"이면 대기, "Active"이면 완료

---

### 문제 3: 가비아에서 CNAME 값 입력 시 오류
**오류 메시지**: "CNAME 레코드는 다른 레코드와 공존할 수 없습니다"

**원인**: `edu.abada.co.kr`에 이미 A 레코드가 있음

**해결 방법:**
1. 기존 `edu` 호스트의 A 레코드 삭제
2. 그 다음 CNAME 레코드 추가
3. 또는 다른 서브도메인 사용 (예: `grade.abada.co.kr`)

---

### 문제 4: "www" 서브도메인도 연결하고 싶을 때
`www.edu.abada.co.kr`도 작동하게 하려면:

**가비아 DNS 설정에 추가:**
```
타입: CNAME
호스트: www.edu
값: vibe-grade.pages.dev
TTL: 3600
```

**또는 Cloudflare에서 Redirect 설정**

---

## 📊 DNS 레코드 최종 확인

설정이 완료되면 가비아 DNS 관리 화면에서 다음과 같이 보여야 합니다:

```
┌──────────────────┬──────┬────────────────────────┬──────┐
│ 호스트           │ 타입 │ 값                     │ TTL  │
├──────────────────┼──────┼────────────────────────┼──────┤
│ @                │ A    │ (기존 IP)              │ 3600 │
│ www              │ A    │ (기존 IP)              │ 3600 │
│ edu              │ CNAME│ vibe-grade.pages.dev   │ 3600 │
└──────────────────┴──────┴────────────────────────┴──────┘
```

---

## 🔄 대체 방법: Cloudflare로 DNS 전체 이전 (선택사항)

더 나은 성능과 관리를 원한다면 **도메인 전체를 Cloudflare로 이전**할 수 있습니다.

### 장점
- ✅ 더 빠른 DNS 응답
- ✅ 무료 CDN 및 DDoS 보호
- ✅ DNS 관리가 Cloudflare 한 곳에서
- ✅ 더 많은 DNS 레코드 및 기능

### 단점
- ❌ 가비아의 네임서버를 변경해야 함
- ❌ 설정이 약간 복잡

### 이전 방법 (관심 있으면 참고)
1. Cloudflare에 도메인 추가
2. Cloudflare가 제공하는 네임서버 확인
3. 가비아에서 네임서버 변경
4. 전파 대기 (24-48시간)

**현재로서는 CNAME 방식이 더 간단하고 충분합니다.**

---

## 📝 체크리스트

설정 완료를 위한 체크리스트:

- [ ] Cloudflare Pages 프로젝트 생성 완료
- [ ] Cloudflare Pages URL 확인 (`vibe-grade.pages.dev`)
- [ ] 가비아 My가비아 로그인
- [ ] DNS 설정 페이지 접속
- [ ] CNAME 레코드 추가 (edu → vibe-grade.pages.dev)
- [ ] DNS 전파 확인 (nslookup 또는 dnschecker.org)
- [ ] Cloudflare Pages에 커스텀 도메인 추가
- [ ] SSL 인증서 발급 완료 확인
- [ ] `https://edu.abada.co.kr` 접속 테스트
- [ ] API 엔드포인트 테스트

---

## 🎯 예상 소요 시간

| 단계 | 시간 |
|------|------|
| 가비아 DNS 설정 | 5분 |
| DNS 전파 대기 | 10분 ~ 1시간 |
| Cloudflare 도메인 추가 | 3분 |
| SSL 인증서 발급 | 5-10분 |
| **총 예상 시간** | **30분 ~ 1.5시간** |

---

## 📞 추가 도움

설정 중 문제가 발생하면:
1. 가비아 고객센터: 1544-4659
2. Cloudflare 공식 문서: https://developers.cloudflare.com/pages/
3. 이 프로젝트 GitHub Issues

---

**작성일**: 2025-01-22
**최종 업데이트**: 2025-01-22
