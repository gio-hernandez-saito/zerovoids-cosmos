---
name: interview-generator
description: FE 기술 면접 질문 생성. "면접 질문 줘", "interview question" 등의 요청 시 사용합니다.
version: 0.0.2
layer: command
uses:
  - skill/interview-review@^0.0.1
---

# Interview Question Generator

FE 기술 면접 질문을 생성합니다. 외부 레퍼런스 기반으로 질문을 선별하고, 중복을 방지합니다.

## 레퍼런스

### 한국

- https://github.com/jbee37142/Interview_Question_for_Beginner
- https://github.com/gyoogle/tech-interview-for-developer
- https://github.com/baeharam/Must-Know-About-Frontend
- https://github.com/Esoolgnah/Frontend-Interview-Questions
- https://github.com/junh0328/prepare_frontend_interview

### 해외

- https://github.com/h5bp/Front-end-Developer-Interview-Questions
- https://github.com/yangshun/tech-interview-handbook
- https://github.com/sudheerj/reactjs-interview-questions
- https://github.com/lydiahallie/javascript-questions

## 질문 카테고리

- JavaScript 핵심 (클로저, 프로토타입, 이벤트루프, 비동기 등)
- TypeScript (타입 시스템, 제네릭, 유틸리티 타입 등)
- React (렌더링, 훅, 상태관리, 최적화 등)
- Vue (반응성, 컴포지션 API, 라이프사이클 등)
- 브라우저/네트워크 (렌더링 파이프라인, HTTP, 캐싱, 보안 등)
- CS 기초 (자료구조, 알고리즘, OS, 디자인패턴 등)

## Workflow

1. 카테고리를 선택 (사용자 지정 또는 랜덤)
2. 레퍼런스에서 질문 선별
3. **중복 방지**: `job-prep/interview/` 내 기존 파일의 frontmatter를 스캔
4. 질문 1~5개 출제 (기본 3개)
5. 각 질문에 난이도 표기: `기초` / `중급` / `심화`

## 중복 방지

2단계로 중복을 체크합니다.

### Step 1: 태그 레벨

기존 파일들의 `tags` 를 전체 수집합니다. 동일 tag를 가진 질문은 출제하지 않습니다.

```
기존: tags: [closure, scope]
→ closure, scope 관련 질문 제외
```

### Step 2: 카테고리 분산

직전 3개 질문의 `category`를 확인합니다. 같은 카테고리에 연속 출제하지 않습니다.

```
직전 3개: JavaScript, JavaScript, React
→ 이번에는 JavaScript 제외, 다른 카테고리 우선
```

## 출력 형식

질문은 `job-prep/interview/` 에 마크다운 파일로 저장합니다.

```markdown
---
id: interview-001
date: 2026-04-04
category: JavaScript
tags: [closure, scope, lexical-environment]
difficulty: 중급
status: pending
---

# 클로저(Closure)란 무엇이며, 실무에서 어떻게 활용하나요?

## 내 답변

(작성 영역)

## 리뷰

(interview-evaluator가 작성)

## 모범 답변

(interview-evaluator가 작성)
```

`status`: `pending` → `answered` → `reviewed`
