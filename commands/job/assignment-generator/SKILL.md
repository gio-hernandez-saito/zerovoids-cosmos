---
name: assignment-generator
description: FE 과제 전형 생성. "과제 하나 줘", "assignment" 등의 요청 시 사용합니다.
version: 0.0.2
layer: command
uses:
  - skill/assignment-review@^0.0.1
---

# Assignment Generator

FE 과제 전형 문제를 생성합니다. 실제 기업 과제 전형 스타일로 출제하며 중복을 방지합니다.

## 레퍼런스

### 한국

- https://github.com/jojoldu/junior-recruit-scheduler

### 해외

- https://github.com/florinpop17/app-ideas
- https://github.com/sadanandpai/frontend-mini-challenges

## 과제 유형

- SPA 구현 (투두앱, 게시판, 대시보드 등)
- API 연동 (REST/GraphQL 데이터 페칭 + UI 구현)
- 컴포넌트 라이브러리 (디자인 시스템 일부 구현)
- 리팩토링 (기존 코드 개선)
- 데이터 시각화 (차트, 테이블, 인터랙션)

## Workflow

1. 과제 유형 선택 (사용자 지정 또는 랜덤)
2. **중복 방지**: `job-prep/assignments/` 내 기존 과제 frontmatter를 스캔
3. 요구사항 명세서 생성
4. 난이도 표기: `기초` (4시간) / `중급` (1~2일) / `심화` (3~5일)

## 중복 방지

기존 과제의 `tags`를 전체 수집합니다. 핵심 주제가 겹치는 과제는 출제하지 않습니다.

```
기존: tags: [state-management, crud, todo]
→ 투두앱/CRUD 중심 과제 제외, 다른 주제 우선
```

## 출력 형식

과제는 `job-prep/assignments/` 에 디렉토리로 생성합니다.

```
job-prep/assignments/
└── 001_과제명/
    ├── README.md        ← 요구사항 명세서
    └── (사용자가 구현)
```

```markdown
---
id: assignment-001
date: 2026-04-04
type: SPA 구현
tags: [state-management, crud, filtering, pagination]
difficulty: 중급
time_limit: 1~2일
stack: React, TypeScript
status: pending
---

# 과제: {과제명}

## 배경
(왜 이 과제를 내는지, 어떤 상황인지 시나리오)

## 요구사항

### 필수
- ...

### 선택 (가산점)
- ...

## 기술 조건
- 프레임워크: React 또는 Vue (택 1)
- 언어: TypeScript 필수
- 스타일: 자유
- 상태관리: 자유
- 테스트: 선택

## 평가 기준 요약
(skill/assignment-review 6개 항목 안내)

## 제출
완료 후 assignment-evaluator로 평가를 요청하세요.
```

`status`: `pending` → `in-progress` → `submitted` → `reviewed`
