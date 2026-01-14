# 🌌 zerovoids-subagents

> **흩어진 조각들을 우주로 만들다**

현대적인 개발 워크플로우를 위한 체계적인 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/quickstart) Subagent 컬렉션입니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 소개

**zerovoids-subagents**는 개발 경험에서 얻은 파편화된 지식과 패턴을 재사용 가능한 AI 에이전트로 체계화한 프로젝트입니다. 각 Subagent는 특정 작업에 특화되어 있으며, Claude Code가 자동으로 적절한 상황에서 활용합니다.

### 🎯 핵심 철학

- **체계적 구조화**: 산발적인 경험을 일관된 시스템으로 전환
- **실용성 우선**: 실제 프로젝트에서 즉시 사용 가능한 Agent
- **점진적 진화**: 사용 패턴에 따라 자연스럽게 성장하는 구조
- **높은 품질**: 템플릿 기반의 일관된 품질 보장

---

## ✨ 주요 특징

### 🤖 전문화된 Agent
각 Agent는 명확한 역할과 책임을 가지고 있습니다:
- **Core Agents**: 프레임워크에 무관한 범용 Agent
- **Specialized Agents**: 특정 도메인/기술 스택 전문 Agent
- **Meta Agents**: 저장소 자체를 관리하는 Agent

### 🔧 자동화 도구
생산성을 높이는 유틸리티 스크립트 제공:
- `setup`: 프로젝트에 Agent 연결
- `validate`: Agent 품질 검증
- `add-agent`: 새 Agent 빠르게 생성

### 📝 체계적인 문서
- 명확한 아키텍처 설계 문서
- 상세한 컨트리뷰션 가이드
- 진화 과정을 기록하는 변경 로그

### 🎨 일관성 보장
- 템플릿 기반 Agent 작성
- Commit message 규칙 자동 검증 (Husky)
- 품질 게이트를 통한 표준 유지

---

## 🚀 빠른 시작

### 설치

```bash
# 저장소 클론
git clone https://github.com/gio-hernandez-saito/zerovoids-subagents.git
cd zerovoids-subagents

# 의존성 설치 (Git hooks 자동 설정)
npm install
```

### Agent 연결

**프로젝트별 설정:**
```bash
# 특정 프로젝트에 Agent 연결
./bin/setup /path/to/your/project
```

**전역 설정:**
```bash
# 모든 프로젝트에서 사용
./bin/setup --global
```

### 사용

Agent 연결 후, Claude Code가 자동으로 적절한 상황에서 Agent를 활용합니다:

```bash
cd your-project

# 코드 리뷰 요청 → code-reviewer Agent 자동 활성화
claude "최근 변경사항 리뷰해줘"

# 특정 Agent 명시적 호출도 가능
claude "code-reviewer agent를 사용해서 이 컴포넌트를 리뷰해줘"
```

---

## 📚 사용 가능한 Agent

### Core (범용)

| Agent             | 설명           | 주요 기능                     |
|-------------------|--------------|---------------------------|
| **code-reviewer** | 코드 품질 검토 전문가 | 버그 탐지, 베스트 프랙티스 제안, 보안 검토 |

### Meta (저장소 관리)

| Agent                      | 설명        | 주요 기능                  |
|----------------------------|-----------|------------------------|
| **zerovoids-repo-manager** | 저장소 자체 관리 | Agent 검증, 문서 생성, 구조 유지 |

### Specialized (준비 중)

특정 도메인이나 프레임워크에 특화된 Agent를 지속적으로 추가할 예정입니다.

> 💡 **전체 Agent 목록**: [agents/README.md](agents/README.md)에서 확인하세요.

---

## 💡 실전 활용 예시

### 시나리오 1: 코드 리뷰 자동화

```bash
# 변경된 코드 리뷰 요청
claude "PR 전에 코드 리뷰 부탁해"

# code-reviewer Agent가 자동으로:
# - 로직 오류 확인
# - 보안 취약점 검사
# - 성능 이슈 식별
# - 개선 사항 제안
```

### 시나리오 2: 새 Agent 추가

```bash
# 템플릿 기반으로 빠르게 생성
./bin/add-agent react-optimizer specialized

# 자동으로:
# - 템플릿 복사
# - Frontmatter 자동 채우기
# - 에디터 열기
```

### 시나리오 3: 품질 검증

```bash
# 모든 Agent 규칙 준수 여부 확인
./bin/validate

# 자동으로:
# - Frontmatter 완전성 체크
# - 네이밍 규칙 검증
# - 내용 품질 검사
```

---

## 📂 저장소 구조

```
zerovoids-subagents/
├── agents/              # Agent 정의 파일
│   ├── _template.md    # Agent 작성 템플릿
│   ├── core/          # 범용 Agent
│   ├── specialized/   # 특화 Agent
│   └── meta/         # 메타 Agent
├── bin/               # 유틸리티 스크립트
│   ├── setup         # 프로젝트 연결
│   ├── validate      # Agent 검증
│   └── add-agent     # Agent 생성
├── profiles/          # Agent 조합 프리셋
├── docs/             # 문서
│   ├── architecture.md      # 설계 철학
│   ├── evolution-log.md     # 변경 이력
│   └── commit-guidelines.md # 커밋 가이드
└── examples/         # 활용 예시
```

**각 디렉토리의 역할:**
- `agents/`: Agent의 시스템 프롬프트와 설정
- `bin/`: 개발 생산성을 높이는 CLI 도구
- `profiles/`: 프로젝트 타입별 Agent 조합
- `docs/`: 설계 결정과 진화 과정 기록

---

## 🛠️ Agent 작성하기

### 빠른 생성

```bash
# 새 Agent 생성
./bin/add-agent my-agent-name core

# 템플릿이 자동으로 생성되고 에디터가 열립니다
```

### 수동 작성

1. `agents/_template.md`를 복사
2. 적절한 카테고리로 이동
3. Frontmatter와 시스템 프롬프트 작성
4. `./bin/validate`로 검증

### 작성 가이드

Agent 작성 시 중요한 요소:

**✅ 명확한 Description**
```yaml
description: Use PROACTIVELY when [구체적 상황]. Expert in [전문 분야].
```

**✅ 구체적인 예시**
- 실제 사용 시나리오 포함
- 입력과 출력 명시
- 에지 케이스 고려

**✅ 명시적인 제한사항**
- Agent가 하지 말아야 할 것
- 다른 Agent에게 위임할 상황
- 범위 밖의 작업

> 📖 **상세 가이드**: [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

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

> 📐 **설계 철학 상세**: [docs/architecture.md](docs/architecture.md)

---

## 🤝 기여하기

기여를 환영합니다! 다음 과정을 따라주세요:

### 기여 프로세스

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zerovoids-subagents.git
   cd zerovoids-subagents
   npm install
   ```

2. **Agent 작성**
   ```bash
   ./bin/add-agent your-agent-name category
   # 템플릿을 채우고 작성
   ```

3. **검증**
   ```bash
   ./bin/validate
   # 모든 검증 통과 확인
   ```

4. **커밋**
   ```bash
   git commit -m "feat: add your-agent-name agent
   
   - Agent의 주요 기능
   - 해결하는 문제"
   ```

5. **Pull Request**
   - 명확한 설명 작성
   - 테스트 결과 포함

### 커밋 규칙

우리는 간단하고 명확한 커밋 메시지 규칙을 따릅니다:

```
prefix: 제목

- 세부 내용 1
- 세부 내용 2
```

**허용된 Prefix**: `feat`, `fix`, `docs`, `refactor`, `chore`, `revert`

> 📝 **상세 가이드**: [CONTRIBUTING.md](CONTRIBUTING.md) 참고

---

## 📊 프로젝트 현황

- **Agent 수**: 2개 (Core 1개, Meta 1개)
- **문서**: 완비
- **자동화**: Setup, Validation 구현
- **품질 보증**: Commit hook, Template 적용

### 로드맵 (예시)

- [ ] Frontend 특화 Agent (React, Vue, Design System)
- [ ] Mobile 특화 Agent (React Native, Native Module)
- [ ] Infrastructure Agent (Monorepo, CI/CD)
- [ ] GitHub Actions 통합
- [ ] 사용 통계 수집 및 분석

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

---

## 🙏 감사의 말

이 프로젝트는 개발 과정에서 마주친 수많은 문제와 해결 과정을 체계화한 결과입니다. 경험을 재사용 가능한 형태로 만들어 다른 개발자들에게도 도움이 되기를 바랍니다.

---

<p>

**Made with ❤️ by [@zerovoids](https://github.com/gio-hernandez-saito)**

</p>

<p><em>흩어진 조각에서 질서 있는 우주를 만드는 여정</em></p>

---

**Last Updated**: 2026-01-14
