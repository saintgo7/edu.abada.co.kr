# 개발 계획 문서 (Development Plan Documents)

이 폴더에는 Vibe Grade 프로젝트의 개발 계획 문서들이 포함되어 있습니다.

---

## 📋 문서 목록 (Document List)

### 한글 문서 (Korean Documents)
- **PRD.md** - 제품 요구사항 정의서 (Product Requirements Document)
- **TRD.md** - 기술 요구사항 정의서 (Technical Requirements Document)
- **TDD.md** - 기술 설계 문서 (Technical Design Document)

### 영어 문서 (English Documents)
- **PRD_EN.md** - Product Requirements Document
- **TRD_EN.md** - Technical Requirements Document
- **TDD_EN.md** - Technical Design Document

---

## 📚 문서 개요 (Document Overview)

### 1. PRD (Product Requirements Document)
**목적**: 제품의 기능적 요구사항 정의

**포함 내용**:
- 프로젝트 개요 및 목표
- 사용자 스토리 (User Stories)
- 기능 요구사항 (Functional Requirements)
- 비기능 요구사항 (Non-Functional Requirements)
- 우선순위 및 로드맵
- 리스크 관리

**대상 독자**: 프로젝트 관리자, 개발자, 이해관계자

---

### 2. TRD (Technical Requirements Document)
**목적**: 기술 스택 및 시스템 요구사항 정의

**포함 내용**:
- 기술 스택 (Frontend, Backend, Database)
- 시스템 아키텍처
- 데이터베이스 스키마
- API 명세
- 보안 요구사항
- 성능 요구사항
- 배포 요구사항

**대상 독자**: 개발자, 시스템 아키텍트

---

### 3. TDD (Technical Design Document)
**목적**: 구체적인 구현 설계 및 알고리즘

**포함 내용**:
- 상세 아키텍처 설계
- 데이터 모델 (TypeScript Interfaces)
- API 상세 설계
- GitHub 자동 분석 알고리즘
- 프론트엔드/백엔드 구현 설계
- 보안 설계
- 성능 최적화 전략

**대상 독자**: 개발자, 기술 리더

---

## 🔄 Markdown을 DOCX로 변환하기

Markdown 파일(.md)을 Microsoft Word 문서(.docx)로 변환하려면 **Pandoc**을 사용하세요.

### Pandoc 설치

#### Windows
```bash
# Chocolatey 사용
choco install pandoc

# 또는 공식 설치 파일 다운로드
# https://pandoc.org/installing.html
```

#### macOS
```bash
brew install pandoc
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install pandoc
```

### 변환 명령어

#### 기본 변환
```bash
# 단일 파일 변환
pandoc PRD.md -o PRD.docx

# 모든 한글 문서 변환
pandoc PRD.md -o PRD.docx
pandoc TRD.md -o TRD.docx
pandoc TDD.md -o TDD.docx

# 모든 영어 문서 변환
pandoc PRD_EN.md -o PRD_EN.docx
pandoc TRD_EN.md -o TRD_EN.docx
pandoc TDD_EN.md -o TDD_EN.docx
```

#### 고급 변환 옵션
```bash
# 목차 포함
pandoc PRD.md -o PRD.docx --toc --toc-depth=3

# 사용자 정의 참조 문서 사용 (스타일 템플릿)
pandoc PRD.md -o PRD.docx --reference-doc=custom-template.docx

# 메타데이터 포함
pandoc PRD.md -o PRD.docx \
  --metadata title="제품 요구사항 정의서" \
  --metadata author="Vibe Grade Team" \
  --metadata date="2025-01-22"
```

#### 일괄 변환 스크립트

**convert_all.sh** (Linux/macOS)
```bash
#!/bin/bash

# 한글 문서 변환
for file in PRD TRD TDD; do
  echo "Converting ${file}.md to ${file}.docx..."
  pandoc ${file}.md -o ${file}.docx --toc --toc-depth=3
done

# 영어 문서 변환
for file in PRD_EN TRD_EN TDD_EN; do
  echo "Converting ${file}.md to ${file}.docx..."
  pandoc ${file}.md -o ${file}.docx --toc --toc-depth=3
done

echo "✓ All conversions completed!"
```

**convert_all.bat** (Windows)
```batch
@echo off

REM 한글 문서 변환
FOR %%F IN (PRD TRD TDD) DO (
  echo Converting %%F.md to %%F.docx...
  pandoc %%F.md -o %%F.docx --toc --toc-depth=3
)

REM 영어 문서 변환
FOR %%F IN (PRD_EN TRD_EN TDD_EN) DO (
  echo Converting %%F.md to %%F.docx...
  pandoc %%F.md -o %%F.docx --toc --toc-depth=3
)

echo ✓ All conversions completed!
pause
```

**사용 방법**:
```bash
# Linux/macOS
chmod +x convert_all.sh
./convert_all.sh

# Windows
convert_all.bat
```

---

## 📖 문서 읽기 순서 (Reading Order)

프로젝트를 처음 접하는 경우 다음 순서로 문서를 읽는 것을 권장합니다:

1. **PRD** - 프로젝트가 무엇을 하는지, 왜 필요한지 이해
2. **TRD** - 어떤 기술로 구현하는지, 시스템 구조 이해
3. **TDD** - 구체적으로 어떻게 구현하는지 상세 설계 이해

**개발자**: PRD → TRD → TDD 순서로 모두 읽기
**프로젝트 관리자**: PRD 집중, TRD 요약 읽기
**디자이너**: PRD의 사용자 스토리 부분 집중
**QA/테스터**: PRD의 인수 기준 및 TRD의 API 명세 집중

---

## 🛠️ 문서 편집 및 업데이트

### Markdown 편집 도구
- **VS Code** (추천) - Markdown Preview Enhanced 확장
- **Typora** - WYSIWYG Markdown 편집기
- **Obsidian** - 지식 관리 도구
- **GitHub** - 온라인 편집 및 미리보기

### 문서 버전 관리
모든 문서는 Git으로 버전 관리됩니다:

```bash
# 문서 수정 후
git add docs/plan/
git commit -m "docs: Update PRD with new requirements"
git push origin main
```

### 변경 이력 관리
각 문서 하단의 "변경 이력" 섹션을 업데이트하세요:

```markdown
| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2025-01-22 | 초안 작성 | - |
| 1.1 | 2025-01-23 | GitHub 분석 알고리즘 추가 | - |
```

---

## 📊 문서 통계

| 문서 | 페이지 수 (예상) | 단어 수 (예상) | 섹션 수 |
|------|-----------------|---------------|---------|
| PRD | 20-25 | 8,000-10,000 | 10 |
| TRD | 15-20 | 6,000-8,000 | 10 |
| TDD | 25-30 | 10,000-12,000 | 10 |

---

## 🔗 관련 문서

- **../DEPLOYMENT_PLAN.md** - 배포 계획서
- **../../README.md** - 프로젝트 README
- **../../CLAUDE.md** - Claude 작업 가이드

---

## 📞 문의 (Contact)

문서 관련 질문이나 개선 제안이 있으시면:
- GitHub Issues에 등록
- 팀 채널에 메시지
- 프로젝트 관리자에게 직접 연락

---

## 📝 라이선스

이 문서들은 프로젝트의 일부로 MIT 라이선스 하에 배포됩니다.

---

**마지막 업데이트**: 2025-01-22
**문서 버전**: 1.0
