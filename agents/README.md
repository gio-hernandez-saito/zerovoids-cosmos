# Agent 목록

> 이 문서는 사용 가능한 모든 Agent의 목록을 제공합니다.

## 📊 통계

- **전체 Agent 수**: 2개
- **Core**: 1개
- **Specialized**: 0개
- **Meta**: 1개

---

## Core Agents

범용적으로 사용 가능한 Agent들입니다.

### [code-reviewer](core/code-reviewer.md)

코드 품질 검토 전문가

**주요 기능:**
- 버그 및 로직 오류 탐지
- 보안 취약점 검사
- 성능 이슈 식별
- 베스트 프랙티스 제안

**사용 시점:**
- 코드 변경 후 리뷰가 필요할 때
- Pull Request 전 품질 확인
- 리팩토링 검증

---

## Specialized Agents

특정 도메인이나 프레임워크에 특화된 Agent들입니다.

*준비 중...*

---

## Meta Agents

저장소 자체를 관리하는 Agent들입니다.

### [zerovoids-repo-manager](meta/zerovoids-repo-manager.md)

저장소 구조 및 품질 관리 전문가

**주요 기능:**
- Agent 파일 검증
- 문서 자동 생성
- 구조 일관성 유지
- 품질 표준 관리

**사용 시점:**
- zerovoids-subagents 저장소 작업 시
- Agent 추가/수정 시
- 구조 변경 시

---

## Agent 추가하기

새로운 Agent를 추가하고 싶으신가요?

```bash
# 빠른 생성
./bin/add-agent your-agent-name category

# 카테고리: core, specialized, meta
```

자세한 내용은 [CONTRIBUTING.md](../CONTRIBUTING.md)를 참고하세요.

---

**Last Updated**: 2026-01-14
