# 기여 가이드

zerovoids-subagents에 관심 가져주셔서 감사합니다! 이 가이드는 고품질 Agent를 만들고 저장소 표준을 유지하는 데 도움을 드립니다.

---

## 🚀 시작하기

### 준비 단계

1. **저장소 Fork**
   - GitHub에서 이 저장소를 Fork합니다

2. **로컬에 Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zerovoids-subagents.git
   cd zerovoids-subagents
   ```

3. **의존성 설치**
   ```bash
   npm install
   # Git hooks가 자동으로 설정됩니다
   ```

4. **작업 진행**
   - main 브랜치에서 직접 작업합니다
   - 브랜치 전략은 사용하지 않습니다

5. **커밋 & PR**
   - 올바른 형식으로 커밋
   - Pull Request 제출

---

## 📝 커밋 메시지 규칙

Git hook을 통해 일관된 커밋 메시지 형식을 강제합니다.

### 형식

```
prefix: 제목

- 내용 1
- 내용 2
- 내용 3
```

### 허용된 Prefix

| Prefix     | 용도              | 예시                              |
|------------|-----------------|---------------------------------|
| `feat`     | 새 기능이나 Agent 추가 | feat: add debugger agent        |
| `fix`      | 버그 수정           | fix: correct template error     |
| `docs`     | 문서 변경           | docs: update architecture guide |
| `refactor` | 기능 변경 없는 리팩토링   | refactor: reorganize agents     |
| `chore`    | 유지보수 작업         | chore: update dependencies      |
| `revert`   | 이전 커밋 되돌리기      | revert: rollback agent changes  |

### 규칙

1. **첫 줄**: `prefix: 제목` (콜론 뒤 띄어쓰기 필수)
2. **두 번째 줄**: 반드시 비어있어야 함
3. **본문**: 각 줄은 `- `(대시 + 띄어쓰기)로 시작

### 올바른 예시

```
feat: add react-optimizer agent

- React 컴포넌트 리렌더링 최적화
- useMemo 사용 제안
- 의존성 배열 검사
```

```
fix: template frontmatter 수정

- created 필드 누락 수정
- 예시 포맷팅 개선
```

### 잘못된 예시

```
feat:add agent          # ❌ 콜론 뒤 띄어쓰기 없음
add agent               # ❌ prefix 없음
feat: add agent
내용 추가               # ❌ 두 번째 줄이 비어있지 않음
feat: add agent

내용 추가               # ❌ '- '로 시작하지 않음
```

### 자동 검증

커밋 시 hook이 자동으로 형식을 검증합니다. 실패 시 친절한 에러 메시지가 표시됩니다.

---

## 🤖 Agent 만들기

### 빠른 생성 (권장)

```bash
./bin/add-agent my-agent-name core

# 카테고리 옵션: core, specialized, meta
```

자동으로:
- 템플릿 복사
- Frontmatter 날짜 자동 입력
- 에디터 열기
- 검증 가이드 제공

### 수동 생성

1. `agents/_template.md` 복사
2. 적절한 카테고리로 이동
3. `your-agent-name.md`로 이름 변경
4. Frontmatter와 시스템 프롬프트 작성
5. `./bin/validate`로 검증

### 제출 전 체크리스트

Agent를 제출하기 전에 다음 항목을 확인하세요:

#### 📋 필수 항목

- [ ] **명확한 이름** (소문자-하이픈 형식, 예: `react-hook-optimizer`)
- [ ] **완전한 Frontmatter** (name, description, created, updated 모두 포함)
- [ ] **구체적인 Description** 
  - 20자 이상
  - "Use PROACTIVELY when..." 형식 권장
  - 트리거 조건 명확히 명시
- [ ] **명확한 책임 정의**
  - 주요 책임 (Primary Responsibilities)
  - 부수적 책임 (Secondary Responsibilities)
- [ ] **구체적인 사용 예시** (최소 2개)
  - 실제 사용 시나리오
  - 입력과 예상 출력
- [ ] **명시적인 제한사항**
  - 하지 말아야 할 것
  - 다른 Agent에게 위임할 상황
- [ ] **적절한 카테고리 선택** (core/specialized/meta)

#### 🧪 품질 검증

- [ ] **`./bin/validate` 통과** (에러 0개, 경고 최소화)
- [ ] **로컬 테스트 완료**
  - 실제 프로젝트에 연결해서 테스트
  - Claude Code가 Agent를 올바르게 호출하는지 확인
  - 예상된 동작 수행 확인
- [ ] **중복 확인**
  - 기존 Agent와 과도하게 겹치지 않는지
  - 차별화된 가치가 있는지

#### 📝 선택 항목 (해당 시)

- [ ] **관련 Agent 명시** (함께 사용하면 좋은 Agent)
- [ ] **Tool 제한** (보안/안전상 필요한 경우만)
- [ ] **Model 지정** (기본 sonnet이 아닌 경우만)
- [ ] **사용 통계** (기존 Agent 개선 시)

---

## ✅ 품질 기준

### Description 작성법

Description은 **가장 중요한 부분**입니다. Claude Code가 이를 보고 Agent 사용 여부를 결정합니다.

**✅ 좋은 예시:**
```yaml
description: Use PROACTIVELY when TypeScript files are modified. Expert in type safety, generics, and TypeScript best practices for large codebases.
```

명확한 트리거 + 전문 분야 + 구체적 범위

**❌ 나쁜 예시:**
```yaml
description: TypeScript helper
```

모호하고 트리거 조건이 불명확함

### 네이밍 규칙

**Agent 이름:**
- 소문자만 사용
- 공백은 하이픈(-)으로
- 구체적이고 서술적으로
- 범용 용어 지양 (helper, utils, manager)

**✅ 좋은 이름:**
- `react-hook-optimizer` - 명확하고 구체적
- `api-security-auditor` - 역할과 범위 명확
- `database-migration-validator` - 정확한 기능 표현

**❌ 나쁜 이름:**
- `helper` - 너무 범용적
- `typescript-util` - 모호함
- `frontend-stuff` - 비전문적

### 카테고리 선택

적절한 카테고리를 선택하세요:

#### `core/` - 범용 Agent
프레임워크나 기술 스택에 무관하게 사용 가능

**예시:**
- code-reviewer (모든 언어)
- debugger (일반적 디버깅)
- test-writer (테스트 작성 일반론)

#### `specialized/` - 특화 Agent
특정 도메인이나 프레임워크 전용

**예시:**
- react-optimizer (React 전용)
- sql-query-builder (SQL 전용)
- docker-troubleshooter (Docker 전용)

#### `meta/` - 메타 Agent
이 저장소 자체를 관리

**예시:**
- repo-manager (저장소 관리)
- agent-creator (Agent 생성 도우미)

**💡 확신이 없다면 `specialized/`로 시작하세요. 나중에 재분류 가능합니다.**

---

## 🧪 Agent 테스트

### 로컬 테스트

1. **테스트 프로젝트에 연결**
   ```bash
   ./bin/setup /path/to/test-project
   ```

2. **Claude Code로 테스트**
   ```bash
   cd /path/to/test-project
   claude "Agent를 트리거할 수 있는 명령"
   ```

3. **동작 확인**
   - Claude Code가 Agent를 호출했는가?
   - 예상대로 작동하는가?
   - 출력이 유용한가?
   - 에지 케이스는 어떻게 처리하는가?

### 검증

```bash
./bin/validate
```

모든 에러와 경고를 수정한 후 제출하세요.

---

## 📚 문서화

### Agent 카탈로그

`agents/README.md`는 자동 생성됩니다. 수동으로 편집하지 마세요.

### Evolution Log

저장소 구조나 새로운 패턴을 도입하는 경우 `docs/evolution-log.md`에 기록하세요:

```markdown
## 2026-01-14: Database 카테고리 추가

**이유**: Database 관련 Agent가 5개로 증가하여 전용 서브디렉토리 필요

**변경사항**:
- `specialized/database/` 생성
- sql-optimizer, migration-validator 등 5개 Agent 이동
- profiles 업데이트

**영향**: 조직 개선, Database Agent 찾기 쉬워짐
```

---

## 🎯 Pull Request 가이드

### PR 제목

커밋 메시지 규칙과 동일한 형식:

- `feat: add react-performance-optimizer agent`
- `fix: correct code-reviewer frontmatter`
- `docs: improve agent writing guide`
- `refactor: reorganize specialized agents`

### PR 설명

다음 항목을 포함하세요:

**템플릿:**
```markdown
## 무엇을

[Agent/변경사항]을 추가/수정했습니다.

## 왜

이 Agent는 [문제]를 [방법]으로 해결합니다.

## 테스트

- 테스트 프로젝트: [프로젝트 이름/유형]
- 트리거 방법: [명령/상황]
- 결과: [생성된 출력]

## 예시

[스크린샷 또는 출력 예시]

## 체크리스트

- [ ] 네이밍 규칙 준수
- [ ] Frontmatter 완전함
- [ ] 예시 포함
- [ ] 검증 통과
- [ ] 로컬 테스트 완료
```

---

## 👀 코드 리뷰 프로세스

### 검토 항목

리뷰어는 다음을 확인합니다:

1. **명확성**: Agent의 목적이 즉시 이해되는가?
2. **구체성**: 명확하고 집중된 범위를 가지는가?
3. **품질**: 시스템 프롬프트가 포괄적이고 유용한가?
4. **예시**: 구체적인 사용 예시가 있는가?
5. **테스트**: 실제 사용 환경에서 테스트되었는가?

### 피드백 대응

리뷰 시 다음을 요청할 수 있습니다:

- 더 구체적인 Description
- 추가 예시
- 명확한 경계/제한사항
- 더 나은 네이밍
- 재분류

**이는 정상적인 과정입니다!** 고품질 Agent를 위한 것입니다.

---

## 💡 베스트 프랙티스

### 시스템 프롬프트 작성

**✅ 해야 할 것:**
- Agent의 전문성을 구체적으로 명시
- 구체적인 예시 포함
- 명확한 경계 정의
- 추천 이유 설명
- 구조화된 작성 (bullet points 활용)

**❌ 하지 말아야 할 것:**
- 모호하거나 범용적인 설명
- 컨텍스트에 대한 가정
- 기존 Agent와 과도한 중복
- 불필요한 복잡성

### Tool 선택

제한이 필요한 경우만 명시하세요:

```yaml
# 모든 도구 상속 (권장)
tools: Bash, Read, Write
```
```yaml
# 안전을 위한 제한
tools: Read  # 읽기 전용 Agent
```

### Model 선택

**Sonnet (기본값, 권장):**
```yaml
model: sonnet
```
대부분의 경우 사용. 빠르고 효율적.

**Opus (복잡한 추론):**
```yaml
model: opus
```
아키텍처 결정, 복잡한 버그 분석 등.

**Haiku (간단한 작업):**
```yaml
model: haiku
```
문법 체크, 포맷팅 등 단순 작업.

**Inherit (상속):**
```yaml
model: inherit
```
상위 설정에서 가져옴.

---

## 🤝 커뮤니티

### 질문이 있나요?

- `question` 라벨로 이슈 생성
- 기존 이슈를 먼저 확인하세요
- 구체적으로 질문하세요

### 제안이 있나요?

- `enhancement` 라벨로 이슈 생성
- 사용 사례를 설명하세요
- 제안하는 Agent나 기능을 설명하세요

### 버그를 발견했나요?

- `bug` 라벨로 이슈 생성
- 재현 단계를 포함하세요
- 환경 정보를 공유하세요

---

## 🌟 행동 강령

- 존중하고 건설적으로 대화하기
- 작업에 집중하고 사람을 공격하지 않기
- 신규 기여자를 환영하기
- 선의를 가정하기
- 생산적인 토론 유지하기

---

## 📄 라이선스

기여함으로써, 귀하의 기여가 MIT License 하에 라이선스됨에 동의합니다.

---

<p>

**zerovoids-subagents를 더 나은 프로젝트로 만드는 데 도움을 주셔서 감사합니다!**

</p>

<p><em>모든 기여는 크기와 관계없이 소중합니다.</em></p>

---

**Last Updated**: 2026-01-14
