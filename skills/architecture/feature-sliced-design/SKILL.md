---
name: feature-sliced-design
description: Feature-Sliced Design(FSD) 아키텍처 규칙. Layer(app/pages/widgets/features/entities/shared) → Slice → Segment 3단계 구조와 단방향 의존성. "FSD", "feature-sliced", 프론트엔드 디렉토리 구조 작업 시 이 스킬을 사용합니다.
version: 0.1.0
layer: skill
user-invocable: false
external:
  - type: url
    href: https://feature-sliced.design/docs/get-started/overview
    description: FSD 공식 문서
---

## Feature-Sliced Design

프론트엔드 코드를 Layer → Slice → Segment 3단계로 구조화한다.

## Layer

단방향 의존만 허용. 상위 → 하위 참조만 가능, 역방향 금지.

```
app → pages → widgets → features → entities → shared
```

| Layer      | 역할                                                                                       |
|------------|------------------------------------------------------------------------------------------|
| `app`      | 앱 실행 환경. Entrypoint · Routing 인스턴스 · Global Provider/Layout · Global Styles                |
| `pages`    | 라우트 진입점. **thin URL-adapter** — URL state 마샬링 + widgets/features 합성. 데이터 패칭/loading·error 분기/데이터 의존 redirect 는 widget 책임 |
| `widgets`  | 다중 entity/feature 를 조합한 자족적 UI 블록. **데이터 패칭 + loading/error 분기 + 데이터 의존 redirect 의 owner** |
| `features` | 단일 사용자 인터랙션 (폼·다이얼로그·뮤테이션 트리거). entity api 호출로 비즈니스 동작                                     |
| `entities` | 비즈니스 도메인. 데이터 모델 + 도메인 로직 + UI primitive. **BE 호출 + FE↔BE 매핑 owning** (api segment 정의에 mappers 포함) |
| `shared`   | 모든 Layer 에서 재사용되는 횡단 코드. 도메인 로직 없음                                                        |

`app` 과 `shared` 는 Slice 없이 직접 Segment 로 구성한다.

## Slice

Layer 내부를 **single business value 단위**로 나눈다 (FSD 공식: *"A slice should represent a single business value"*).

- 같은 Layer 내 다른 Slice 참조 금지 (slice isolation rule).
- Slice 이름은 표준 강제 없음 — 프로젝트 도메인이 결정.
- **Layer 별 slice granularity 다름** — 같은 비즈니스 영역이 layer 마다 다른 이름으로 나타나는 게 표준. **layer 간 1:1 강제는 안티패턴**.

### Layer 별 명명 규약

| Layer      | Slice 단위                          | 명명             | 예                                                |
|------------|-----------------------------------|----------------|--------------------------------------------------|
| `entities` | 데이터 도메인 (BE 모델 단위)                | 명사             | `auth`, `user`, `consent`, `plant`               |
| `features` | 단일 사용자 인터랙션                       | **동사+명사**      | `login`, `agree-consents`, `edit-plant-profile`  |
| `widgets`  | 합성 UI 블록                          | 명사             | `consent-agreement`, `plant-overview`            |
| `pages`    | 라우트 진입점                           | 명사             | `login`, `agreement`, `dashboard`                |

같은 영역의 layer-cross 사례: `entities/consent` ↔ `features/agree-consents` ↔ `widgets/consent-agreement` ↔ `pages/agreement`.

### Slice 폴더 규칙

- **Layer 직속 sibling-flat**. `pages/auth/login/` 같은 그룹 컨테이너 폴더 금지 (FSD 표준에 컨테이너 개념 없음). routing layout 분기 같은 grouping 은 router 설정이 SSOT.
- 단일 컴포넌트 slice 도 폴더 형태 유지 (일관성).

## Segment

Slice 내부를 코드 역할에 따라 분류.

| Segment   | 포함 내용                                              |
|-----------|----------------------------------------------------|
| `ui/`     | UI 컴포넌트, formatter, styles 등 표현 코드                 |
| `api/`    | request 함수, data types, **mappers** 등 백엔드 통신 로직    |
| `model/`  | schema, interface, store, business logic 등 도메인 모델 |
| `lib/`    | **슬라이스 내 다른 모듈이 import 하는** 라이브러리 코드 (단일 사용처는 인라인) |
| `config/` | configuration, feature flag 등 설정                   |

- `entities` / `features` / `widgets` / `pages` 는 위 5개 segment 만 사용 — custom segment 금지.
- 추가 Segment 는 `app` / `shared` 에서만 정의.
- 모든 Slice 가 모든 Segment 를 가질 필요 없음 — 시점별 도입.

## 의존성 규칙

1. **상위 → 하위만 허용**. `features/` 는 `entities/`, `shared/` 만 import 가능.
2. **같은 레이어 간 참조 금지**. 슬라이스 격리.
3. **Cross-reference 필요 시** 상위 레이어에서 조합하거나 `shared/` 로 내린다.
4. **Public API**: `index.ts` barrel 로 외부 노출 인터페이스 제한. 단 같은 slice 내부 파일끼리는 직접 path 사용 (자기 barrel 순환 회피).
5. **데이터 통신은 entities/api 가 owning**. HTTP client·Query client 설정·인터셉터는 `shared`, **도메인 데이터 패칭/변경(`useQuery`/`useMutation` 호출) 은 `entities/<domain>/api/use-*.ts`**. FE↔BE 매핑도 entity api 책임. `pages`/`features` 가 BE 직접 호출 = 의존 그래프 부정합.

상세 디렉토리 예시 / 새 페이지 구현 순서 / 자주 잘못 두는 코드 / Anti-patterns 는 [REFERENCE.md](REFERENCE.md) 참고.
