---
name: commit
description: 변경사항을 분석해 Conventional Commits 형식으로 커밋합니다. "커밋해줘", "commit", "커밋 만들어줘" 등의 요청 시 이 스킬을 사용합니다.
version: 0.0.2
layer: command
disable-model-invocation: true
uses:
  - skill/commit-message@^0.0.1
---

# Commit

변경사항을 분석해 컨벤션에 맞는 커밋 메시지를 작성하고 커밋을 수행한다.
메시지 포맷은 `skill-convention-commit-message` 의 규칙을 따른다.

## Workflow

사용자가 제공한 컨텍스트 양에 따라 분기한다.

### Case 1: "커밋해줘" (설명 없음)

1. `git status` 와 `git diff --cached` (또는 stage 가 비어있으면 `git diff`) 로 변경 전체 파악
2. 변경을 분석해 `skill-convention-commit-message` 포맷으로 커밋 메시지 초안 작성
3. 커밋 전 사용자에게 메시지 검토 요청

### Case 2: "prettier에 endOfLine 추가한 거 커밋해줘" (설명 있음)

1. 사용자 설명을 메시지 베이스로 사용
2. `git diff` 로 설명이 실제 변경과 일치하는지 검증, 필요 시 디테일 보강
3. `skill-convention-commit-message` 포맷으로 메시지 작성 후 바로 커밋
   - 설명이 충분히 명확하면 검토 단계 생략

## Rules

- 한 커밋은 한 논리적 변경 단위 — 여러 관심사가 섞이면 분리 제안
- 단, 항상 type 별로 쪼갤 필요는 없음. 커밋 메시지의 목적은 변경 의도 전달이지 변경 유형 분류가 아님
- secrets 포함 파일(.env, token, credential 등) 절대 커밋 금지
- 사용자가 한국어로 대화하면 body 는 한국어로 작성. type/scope/subject 는 영어 유지
