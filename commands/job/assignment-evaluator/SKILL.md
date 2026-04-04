---
name: assignment-evaluator
description: 과제 전형 결과물 평가. "과제 평가해줘", "review assignment" 등의 요청 시 사용합니다.
version: 0.0.2
layer: command
uses:
  - skill/assignment-review@^0.0.1
---

# Assignment Evaluator

사용자의 과제 전형 결과물을 skill/assignment-review 기준으로 평가합니다.

## Workflow

1. `job-prep/assignments/` 에서 `status: submitted` 인 과제를 찾음 (또는 사용자가 지정)
2. README.md의 요구사항과 실제 구현을 대조
3. 전체 코드를 읽고 skill/assignment-review 평가 척도에 따라 리뷰
4. 리뷰 결과를 해당 과제 디렉토리에 `REVIEW.md`로 작성
5. README.md의 `status`를 `reviewed`로 업데이트

## Rules

- 평가는 반드시 skill/assignment-review의 6개 항목 + ★ 점수로 출력
- 실제 면접관 관점으로 평가 (합격/불합격 판단 포함)
- 좋은 점을 먼저 언급한 뒤 개선점 제시
- 코드를 직접 읽고 구체적인 라인/파일을 언급하며 피드백

## REVIEW.md 구조

```markdown
# 리뷰: {과제명}

## 평가

| 항목 | 점수 | 코멘트 |
|------|------|--------|
| 코드 품질 | ★★★★½ | ... |
| 아키텍처 | ★★★★ | ... |
| 기능 완성도 | ★★★★★ | ... |
| UX/UI | ★★★½ | ... |
| 성능 | ★★★★ | ... |
| 문서/커밋 | ★★★★½ | ... |

**종합**: ★★★★¼ (6개 항목 평균)

## 합격 판정

(합격 / 조건부 합격 / 불합격) + 근거

## 잘한 점
- ...

## 개선 포인트
- 파일명:라인 — 구체적 피드백
- ...

## 실제 면접에서 받을 수 있는 질문
1. 이 구조를 선택한 이유?
2. 성능 개선한다면 어디부터?
3. ...
```
