# Meter AI Handoff Restore Point

**Created**: 2026-05-31 09:40 UTC
**Previous restore point**: This is the first structured restore point.

## Quick Start

```bash
cd D:\meter\Meter-\backend
npm install           # already installed — skip if node_modules/ exists
npx prisma generate   # generate Prisma client
npm test              # 287/287 tests should pass
npm run build         # should compile clean
npm run lint          # ESLint should pass
npx prettier --check . # Prettier should pass
```

## Project Tree (Top-Level)

```
Meter-/
├── backend/               # NestJS backend (main work area)
│   ├── src/               # Source code
│   ├── test/              # Tests (unit, integration, contract)
│   │   ├── unit/          # Unit tests
│   │   ├── integration/   # Integration tests
│   │   └── contract/      # Contract tests (OpenAPI-driven)
│   ├── prisma/            # Prisma schema + migrations
│   └── package.json
├── Frontend/              # React frontend (bun-based)
│   ├── src/               # React source
│   └── package.json
├── specs/                 # OpenAPI specs
│   └── 001-metering-billing-platform/
│       ├── openapi.yaml   # Main API spec
│       └── tasks.md       # Task tracking (T001-T054+)
├── documentation/
│   └── markdown/          # Project docs
└── scripts/               # Safety/utility scripts (to be created)
```

## Key Branch / Git State

See `git-log.txt`, `git-status.txt`, `git-diff-stat.txt` in this directory.

## Current Test Suite Status

**287 / 287 tests passing** (100%, 34 suites). Test log: `test-output-20260531-0941.txt` in this directory.

Breakdown:
- **Unit tests**: Customers (2 suites, 12 tests), Meters (2 suites, 16 tests), SIM Cards (2 suites, 13 tests), Projects (2 suites, 12 tests), Locations (2 suites, 12 tests), Dashboard (2 suites, 5 tests), Readings (1 suite, 3 tests), Thresholds (1 suite, 4 tests)
- **Integration tests**: Reading Validation (7 tests), SIM Reuse Lifecycle (6 tests)
- **Contract tests**: Setup/Health (9 tests), Meter Assign (13 tests), Meter Terminate (13 tests), SIM Eligibility (7 tests), Reading Create (13 tests), Reading Review Queue (7 tests), Invoice Generate (9 tests), Invoice Issue (7 tests), Invoice Adjustment (8 tests)
- **Auth/Infra tests**: JWT Strategy (9 tests), Roles Guard (13 tests), Roles Decorator (5 tests), Audit Decorator (4 tests), Audit Interceptor (10 tests), Audit Service (4 tests), Correlation Middleware (7 tests), Idempotency (4 tests), Error Envelope (10 tests)

## Completed Tasks (from tasks.md)

| Task | Description | Status |
|------|-------------|--------|
| T001 | Project scaffolding | ✅ |
| T002 | OpenAPI contract spec | ✅ |
| T003 | Ingress controller / reverse proxy | ✅ |
| T004 | PG + Redis + MinIO infra | ✅ |
| T005 | Authentication & RBAC | ✅ |
| T006 | RBAC middleware | ✅ |
| T007 | Customer CRUD | ✅ |
| T008 | Meter CRUD | ✅ |
| T009 | SIM card CRUD | ✅ |
| T010 | Project CRUD | ✅ |
| T011 | Meter assign/unassign | ✅ |
| T012 | Meter termination | ✅ |
| T013 | SIM eligibility / cooldown | ✅ |
| T014 | Meter-Location relationship | ✅ |
| T015 | Location ownership via Project | ✅ |
| T016 | Reading ingestion | ✅ |
| T017 | Consumption calc & validation | ✅ |
| T018 | Suspicious/pending_review logic | ✅ |
| T019 | Duplicate reading detection | ✅ |
| T020 | Prisma P2002 → 422 mapping | ✅ |
| T021 | Billing stubs (Invoice CRUD) | ✅ |
| T022 | Audit logging foundation | ✅ |
| T023 | Audit interceptor + correlation | ✅ |
| T024 | Idempotency key support | ✅ |
| T025 | SIM eligibility endpoint | ✅ |
| T026 | JWT strategy: sub/role validation | ✅ |
| T027 | RolesGuard: RBAC enforcement | ✅ |
| T028 | ErrorEnvelope: uniform error shape | ✅ |
| T029 | SimEligibility schema in spec | ✅ |
| T030 | MeterAssignment schema in spec | ✅ |
| T031 | POST /meters/{meterId}/assign | ✅ |
| T032 | MeterAssignRequest/OER/ConflictError | ✅ |
| T033 | POST /meters/{meterId}/terminate | ✅ |
| T034 | MeterTerminateRequest schema | ✅ |
| T035 | SimReuseResult schema (simReusable) | ✅ |
| T036 | Integration: SIM reuse lifecycle | ✅ |
| T037 | Dashboard KPIs | ✅ |
| T038 | Consumption trends | ✅ |
| T039 | Recent activity | ✅ |
| T040 | Project thresholds | ✅ |
| T041 | Thresholds CRUD | ✅ |
| T042 | Project-Location tree CRUD | ✅ |
| T043 | Location CRUD endpoints | ✅ |
| T044 | Threshold profiles (Service) | ✅ |
| T045 | Reading validation thresholds (integration) | ✅ |
| T046 | Integration: duplicate detection + P2002 | ✅ |
| T047 | ReadingCreateRequest & contract spec | ✅ |
| T048 | GET /readings/review-queue | ✅ |
| T053 | POST /invoices/generate (stub) | ✅ |
| T054 | POST /invoices/{id}/issue + adjustments | ✅ |

**T049–T052, T055+**: Not yet started.

## Architecture Summary

```
Request → Ingress → Auth (JWT) → RolesGuard → Controller → Service → Prisma (Postgres)
                                                                  → Audit Interceptor
                                                                  → Idempotency (Redis)
                                                                  → ErrorEnvelope Filter
```

### Auth Flow
- JWT extracted from `Authorization: Bearer <token>` by `JwtStrategy`
- `passport-jwt` validates token, attaches `{ sub, role, projectScope }` to `req.user`
- `RolesGuard` checks `@Roles('admin')` decorator metadata against `req.user.role`
- Roles: `super_admin`, `project_admin`, `operator`, `technician`, `finance`, `support`, `customer`

### Key Middleware
1. **CorrelationMiddleware** — injects `x-correlation-id` header, accessible via `getCorrelationId()`
2. **IdempotencyInterceptor** — checks/sets idempotency keys in Redis
3. **AuditInterceptor** — logs mutations (POST/PUT/PATCH/DELETE) with before/after snapshots
4. **AllExceptionsFilter** — wraps all errors into `ErrorEnvelope` shape

### Contract Test Architecture
- Test startup via `setup.ts` → `Test.createTestingModule` with `PrismaService` auto-mocked
- Each contract test: loads OpenAPI spec → validates request/response schemas → makes HTTP call → validates response
- `authPost/get/put/patch/delete` helpers in `setup.ts` attach JWT `authHeader`
- `jest.prisma.ts` provides auto-mocked `PrismaService` with `createMockDb()`

### OpenAPI Spec
- File: `specs/001-metering-billing-platform/openapi.yaml`
- Loaded in tests via `js-yaml`, dereferenced via `json-refs`
- Schema validation via `@apidevtools/swagger-parser` + `class-validator`
- Operations validated against spec: request body, response codes, parameter schemas

### SIM Reuse Lifecycle
- `SIM → assigned → terminated → cooldown? → reusable`
- `cooldownUntil` field on SIM card
- `getEligibility()`: checks active assignment, cooldown expiry, SIM availability
- `terminateMeter()` → sets `simReusable: true/false` + `simStatus` on `MeterTerminateResult`
- Integration tests mock `PrismaService` date comparisons

### Reading Validation
- `consumptionValue = currentReadingValue - previousReadingValue`
- Thresholds from `ProjectThreshold` or defaults (±50% of avg, min/max caps)
  - `negative → suspicious`
  - `over threshold → pending_review`
  - `normal → valid`
- `P2002` unique constraint → `422 Unprocessable Entity`
- `meterId + readingAt + source` must be unique

## Pending / Not Yet Run

These tools from the 18-tool requirement were not executed:
- `npx depcruise` (dependency cruiser)
- `npx semgrep` (SAST)
- `npx trivy` (vuln scanner)
- `npx spectral` (API lint)
- `npx playwright` (E2E)
- `npx typedoc` (docs gen)

### Graphify Status
- **AST extraction**: ✅ Completed on 135 code files (15.4s, 3799 nodes, 2460 edges)
- **Semantic extraction**: ❌ Failed — DeepSeek API `Insufficient Balance` (HTTP 402)
- Output directory: `graphify-out/` exists with JSON/HTML/audit report

## Error Code Registry (Alert System)

Format: `ERR-<TASK-ID>-<NNN>`

| Error Code | Description |
|-----------|-------------|
| ERR-T048-001 | Review queue GET returns non-200 |
| ERR-T045-001 | UUID format mismatch in reading validation |
| ERR-T045-002 | Class-validator rejects valid UUID v4 |
| ERR-P2002-001 | Prisma unique constraint not caught |
| ERR-AUTH-001 | JWT validation rejects valid token |
| ERR-BUILD-001 | `npm run build` compilation failure |
| ERR-LINT-001 | ESLint violation |
| ERR-TEST-001 | Any test suite failure during sweep |

## How to Continue Work

1. **Read this file** to understand current state
2. **Run `npm test`** to verify 287/287 baseline
3. **Check `tasks.md`** for next unstarted task (T049+)
4. **Check `specs/.../openapi.yaml`** for endpoint definitions
5. **Use contract tests** as spec-first driver for new endpoints
6. **Run `scripts/health-check.sh`** before/after changes (once created)
7. **Run `scripts/backup-state.sh`** before risky changes (once created)

## Contact / Escalation

For admin escalation during errors, reference the error code and contact the project maintainer with the full test output log.
