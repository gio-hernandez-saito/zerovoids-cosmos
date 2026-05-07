# FSD Reference

## 디렉토리 구조 예시

같은 비즈니스 영역("약관 동의")이 layer 마다 다른 이름으로 나타나는 사례.

```
src/
├── app/
│   ├── providers.tsx
│   ├── router.tsx                  # RouteObject 트리 + loader 등록
│   ├── navigation.guard.ts         # requireAuth / requireGuest 같은 route 진입 조건 loader
│   └── layout.tsx
├── pages/                          # flat per-route slice (그룹 컨테이너 폴더 X)
│   ├── dashboard/
│   │   └── ui/dashboard-page.tsx   # thin URL-adapter — widget 합성만
│   └── agreement/
│       └── ui/agreement-page.tsx   # widget 합성 + navigate 콜백 주입
├── widgets/
│   └── consent-agreement/
│       └── ui/consent-agreement-widget.tsx
│       # 데이터 패칭 (useUserConsents) + loading/empty 분기 + 모두 동의 시 onComplete 콜백
├── features/
│   └── agree-consents/             # 동사+명사 (인터랙션 단위)
│       └── ui/agree-consents-form.tsx
│           # form + entity 의 useUpdateConsents 직접 호출
├── entities/
│   └── consent/                    # 명사 (데이터 도메인)
│       ├── api/
│       │   ├── use-user-consents.ts    # query
│       │   └── use-update-consents.ts  # mutation (BE 호출 + 매핑)
│       └── lib/
│           └── has-unagreed-required.ts  # 도메인 판정 헬퍼
└── shared/
    ├── ui/Button.tsx
    ├── api/
    │   ├── http-client.ts          # axios 인스턴스 / 인터셉터
    │   └── query/                  # QueryClient 설정·keys SSOT
    ├── lib/format.ts
    └── config/constants.ts
```

핵심 관찰:

- 동일 비즈니스 영역(consent) 이 layer 별로 다른 단위 + 다른 이름:
  `entities/consent` (도메인) → `features/agree-consents` (인터랙션) → `widgets/consent-agreement` (UI 블록) → `pages/agreement` (라우트 진입점)
- pages 는 thin: page 안에 `useUserConsents` 같은 데이터 fetch 훅 호출 X
- 데이터 fetch + 화면 분기 + 데이터 의존 redirect 는 widget 이 owning
- mutation hook (`useUpdateConsents`) 은 entity 의 api segment — features 가 BE 직접 호출 안 함

## 새 페이지 구현 순서

FSD 레이어 하위부터 상위로 쌓아 올린다.

1. **shared**: 필요한 공통 유틸 / HTTP client / Query client 설정 확인 (이미 있으면 skip)
2. **entities**: 도메인 단위
   - `api/use-*.ts` — query/mutation 훅 (BE 호출 + FE↔BE 매핑 + 도메인 side effect)
   - `model/` — store / schema / 도메인 타입
   - `lib/` — 도메인 판정 헬퍼 (2+ 사용처일 때)
3. **features**: 사용자 인터랙션 단위 — 폼·다이얼로그·버튼. entity api 훅 호출, BE 직접 호출 X
4. **widgets**: 완결된 UI 블록 — entity + feature 조합. **데이터 fetch + loading/error/empty 분기 + 데이터 의존 redirect 의 owner**
5. **pages**: thin. URL state 마샬링 + widget/feature 합성 + navigate 콜백 주입만
6. **app**: 라우트 등록, route 진입 조건 loader (token 검사·환경 검사 등)

## Layer 선택 기준

| 상황                             | 패턴                                                 |
|--------------------------------|----------------------------------------------------|
| 단순 데이터 표현만 필요                  | `entities` 만으로 충분                                  |
| 사용자 액션/인터랙션이 있음                | `entities` (api/model) + `features` (ui)            |
| 동일 UI, 다른 데이터 소스               | `features` 에서 interface 정의 → `widgets` 에서 adapter 주입 |
| 여러 feature/entity 를 조합한 완결된 UI | `widgets` 에서 조립                                    |
| route 진입점                      | `pages` (thin) — widget/feature 합성만                |

## 자주 잘못 두는 코드 — 올바른 위치

| 코드                                                | ❌ 흔한 위치             | ✅ 올바른 위치                                       |
|---------------------------------------------------|---------------------|------------------------------------------------|
| 데이터 fetch 훅 (`useQuery`)                          | page                | `entities/<domain>/api`                          |
| Mutation 훅 (`useMutation`)                        | feature             | `entities/<domain>/api` (form 이 entity hook 직접 호출) |
| `isLoading` / `isError` 분기                        | page                | widget (데이터 owner = 화면 분기 owner)                 |
| 데이터 의존 redirect ("이미 동의됨 → 자동 navigate")          | page                | widget                                           |
| Route 진입 조건 ("토큰 없으면 /login")                     | page render 안 useEffect | router loader (`requireAuth` 등)               |
| FE 입력 → BE shape 매핑                              | feature             | `entities/<domain>/api` 의 mutationFn 안           |
| zod 검증 schema (도메인 입력 제약)                        | feature/model       | `entities/<domain>/model` (도메인 제약은 entity 책임)    |
| 폼 안 1회 사용 helper                                  | feature/lib         | 인라인 (lib 트리거 = 슬라이스 내 2+ 사용처)                  |

## Anti-patterns (자주 발생)

- **page 안에서 `useQuery` 호출** → 데이터 owner 가 page 가 됨, loading/error 분기도 따라감 → page 두꺼워짐. 데이터 fetch 는 widget 으로 이동.
- **page 안 `useEffect` 로 route 진입 조건 검사 + redirect** ("토큰 없으면 /login") → router loader 로 이동.
- **그룹 컨테이너 폴더** (`pages/auth/login/`, `pages/auth/agreement/` 같은 이중 nesting) → FSD 비표준. layer 직속 sibling-flat.
- **feature 가 BE 직접 호출** (`api.auth.login()` 호출) → entity 의 api hook 우회. `entities/<domain>/api/use-*.ts` 를 통해 호출.
- **`*.store.ts` 파일을 위한 `store/` segment 신설** → store 는 model segment 로. custom segment 금지.
- **단일 사용처 helper 를 `lib/` 로 분리** → FSD 의 lib 정의 ("library code that other modules of this slice need") 위배. 단일 사용처면 인라인.
