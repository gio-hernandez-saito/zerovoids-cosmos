# 🌌 zerovoids-subagents

> **흩어진 조각들을 우주로 만들다**

현대적인 개발 워크플로우를 위한 체계적인 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/quickstart) Subagent 컬렉션입니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 소개

**zerovoids-subagents**는 개발 경험에서 얻은 파편화된 지식과 패턴을 재사용 가능한 AI 에이전트로 체계화한 프로젝트입니다. 각 Subagent는 특정 작업에 특화되어 있으며, Claude Code가 자동으로 적절한 상황에서 활용합니다.

### 🎯 핵심 철학

- **체계적 구조화**: 산발적인 경험을 일관된 시스템으로 전환
- **실용성 우선**: 실제 프로젝트에서 즉시 사용 가능한 Agent
- **점진적 진화**: 사용 패턕에 따라 자연스럽게 성장하는 구조
- **높은 품질**: 일관된 품질 보장

---

## 📂 현재 상태

이 프로젝트는 실제 사용에서 필요한 것들을 만들어가는 초기 단계입니다.

### 구조
```
zerovoids-subagents/
├── docs/
│   └── commit-guidelines.md  # 커밋 메시지 규칙
├── .husky/                    # Git hooks (자동 검증)
├── package.json
├── LICENSE
└── README.md
```

### 포함된 것
- **Commit Guidelines**: 일관된 커밋 메시지 규칙 ([docs/commit-guidelines.md](docs/commit-guidelines.md))
- **Git Hooks**: Husky를 통한 커밋 메시지 자동 검증
- **기본 설정**: package.json, .gitignore

### 다음 단계
Agent는 실제 프로젝트 작업 중 필요할 때마다 추가될 예정입니다.

---

## 🎨 설계 원칙

### 1. 명확성 > 영리함
각 Agent는 즉시 이해 가능해야 합니다. 복잡한 추상화보다 명확한 구체화를 선호합니다.

### 2. 전문성 > 범용성
하나를 잘하는 10개의 Agent가 모든 것을 대충 하는 1개의 Agent보다 낫습니다.

### 3. 조합 가능성
작은 Agent들을 조합해 복잡한 워크플로우를 구성할 수 있어야 합니다.

### 4. 진화 가능성
완벽한 구조를 처음부터 만들려 하지 않습니다. 실제 사용 패턴에 따라 자연스럽게 진화합니다.

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

---

**Last Updated**: 2026-01-15
