# Meter Pulse — Utility Metering & Billing Platform

> **Status**: Development (MVP Phase) | **Tests**: 293/293 passing (35 suites) | **Security**: 14 controls active
> **Last validated**: 2026-05-31 | **Graphify**: 3105 nodes, 241K edges, 117 communities

---

## System Overview

| Component | Tech Stack | Location |
|-----------|-----------|----------|
| **Backend API** | NestJS 10 + TypeScript | `backend/` |
| **Frontend** | Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui | `Frontend/` |
| **Database** | PostgreSQL 16 (Docker) | `backend/docker-compose.yml` |
| **ORM** | Prisma 6 | `backend/prisma/` |
| **Auth** | JWT (passport) + RBAC (7 roles) | `backend/src/auth/` |

---

## Requirements

### Required Software

| Tool | Version | Download | Purpose |
|------|---------|----------|---------|
| **Node.js** | >= 20 | [nodejs.org](https://nodejs.org/) | Backend runtime |
| **Bun** | 1.x | [bun.sh](https://bun.sh/) | Frontend runtime |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) | PostgreSQL container |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **PostgreSQL** | 16 | Via Docker (see above) | Database |

### Optional Tools

| Tool | Version | Download | Purpose |
|------|---------|----------|---------|
| **Python** | 3.11+ | [python.org](https://www.python.org/) | Graphify knowledge graph |
| **Trivy** | Latest | [github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy) | Container vulnerability scanning |
| **Semgrep** | Latest | [semgrep.dev](https://semgrep.dev/) | SAST code analysis |
| **Playwright** | 1.60+ | Via `npx playwright install` | E2E browser tests |
| **Spectral** | 6.x | [stoplight.io/spectral](https://stoplight.io/open-source/spectral) | OpenAPI linting |

---

## Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/Kirllos360/Meter-.git
cd Meter-

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../Frontend
bun install
```

### 2. Start Database

```bash
cd backend
docker compose up -d db
# Verify: docker compose ps  (should show "healthy")
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### 4. Initialize Database Schema

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 5. Run Backend

```bash
cd backend
npm run start:dev
# Backend starts at http://localhost:3001/api/v1
# OpenAPI docs at http://localhost:3001/api/v1/docs
```

### 6. Run Frontend

```bash
cd Frontend
bun run dev
# Frontend starts at http://localhost:3000
```

---

## Key Commands

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run build` | TypeScript compilation |
| `npm run start:dev` | Dev server with watch |
| `npm test` | Run 293 tests (35 suites) |
| `npm run lint` | ESLint with security rules |
| `npx prisma validate` | Validate schema |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Run migrations |
| `npx depcruise src/` | Dependency graph validation |
| `bash scripts/health-check.sh` | Run all health checks |
| `bash scripts/dep-audit.sh` | Dependency vulnerability audit |

### Frontend (`Frontend/`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server on port 3000 |
| `bun run build` | Production build |
| `bun run lint` | ESLint check |
| `bun run test:smoke` | Build + Playwright traversal |

### Knowledge Graph (`graphify/`)

| Command | Description |
|---------|-------------|
| `graphify query "<question>"` | Query knowledge graph |
| `graphify path "<A>" "<B>"` | Find paths between modules |
| `graphify explain "<concept>"` | Explain a concept |
| `graphify update .` | Update graph from code |

---

## Architecture

```
Meter-/
├── backend/                 # NestJS Modular Monolith
│   ├── src/
│   │   ├── auth/            # JWT + RBAC (7 roles)
│   │   ├── audit/           # Append-only audit + security audit
│   │   ├── billing/         # Invoice stubs (T053/T054)
│   │   ├── common/          # Config, DB, HTTP, OpenAPI
│   │   ├── customers/       # Customer CRUD
│   │   ├── idempotency/     # Idempotency-Key support
│   │   ├── meters/          # Meter registration & assignment
│   │   ├── projects/        # Projects, locations, dashboard
│   │   ├── readings/        # Reading ingestion & review queue
│   │   └── sim-cards/       # SIM lifecycle management
│   ├── prisma/              # Schema + 8 migrations
│   └── test/                # 293 tests (35 suites)
├── Frontend/                # Next.js 16 App Router
│   └── src/
│       ├── app/             # Pages & layouts
│       ├── components/      # UI & feature components
│       ├── hooks/           # React Query hooks
│       └── lib/             # API client, types, utils
├── specs/                   # Feature specifications (Speckit)
├── documentation/           # All documentation (5 formats)
├── graphify-out/            # Knowledge graph (3105 nodes)
└── .github/workflows/       # CI pipeline (4 jobs)
```

---

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/health` | GET | None | Health check |
| `/api/v1/meters/{id}/assign` | POST | JWT | Assign meter |
| `/api/v1/meters/{id}/terminate` | POST | JWT | Terminate meter |
| `/api/v1/sim-cards/{id}/eligibility` | GET | JWT | SIM reuse check |
| `/api/v1/readings` | POST | JWT | Create reading |
| `/api/v1/readings/review-queue` | GET | JWT | List flagged readings |
| `/api/v1/invoices/generate` | POST | JWT | Generate invoices |
| `/api/v1/invoices/{id}/issue` | POST | JWT | Issue invoice |
| `/api/v1/invoices/{id}/adjustments` | POST | JWT | Add adjustment |
| `/api/v1/payments` | POST | JWT | Record payment |
| `/api/v1/payments/{id}/reverse` | POST | JWT+Admin | Reverse payment |
| `/api/v1/customers/{id}/statement` | GET | JWT | Customer statement |
| `/api/v1/reports/exports` | POST | JWT | Create report job |
| `/api/v1/reports/exports/{id}` | GET | JWT | Check job status |
| `/api/v1/docs` | GET | None | Swagger UI |

---

## Security Status

| Control | Status | Description |
|---------|--------|-------------|
| JWT Authentication | ✅ Active | Passport JWT strategy, 1h expiry |
| RBAC (7 roles) | ✅ Active | Reflector-based guard |
| Business Audit Log | ✅ Active | Append-only mutation logging |
| Security Audit Log | ✅ Active | Auth/security event logging |
| Correlation IDs | ✅ Active | All requests traceable |
| Idempotency Keys | ✅ Active | Mutation deduplication |
| Input Validation | ✅ Active | class-validator with whitelist |
| Helmet Headers | ✅ Active | 15+ HTTP security headers |
| CORS | ✅ Active | Origin whitelist from env |
| Rate Limiting | ✅ Active | 100 req/min global |
| Security Linting | ✅ Active | 9 eslint-plugin-security rules |
| Request Size Limit | ✅ Active | 1MB max payload |
| CI Pipeline | ✅ Created | `.github/workflows/ci.yml` (4 jobs) |
| Container Build | ✅ Created | Multi-stage Dockerfiles |

*See `documentation/markdown/security-validation-report.md` for full details.*

---

## Documentation Index

| File | Format | Description |
|------|--------|-------------|
| `documentation/markdown/00-index.md` | Markdown | Complete documentation index |
| `documentation/markdown/01-conversation-log.md` | Markdown | Full conversation history |
| `documentation/markdown/02-memory-files.md` | Markdown | Agent memory & task log |
| `documentation/markdown/03-database-schema-overview.md` | Markdown | DB schema documentation |
| `documentation/markdown/16-checkpoint-report.md` | Markdown | Current system validation |
| `documentation/markdown/security-assessment.md` | Markdown | Security posture assessment |
| `documentation/markdown/security-gap-analysis.md` | Markdown | 27 gaps mapped to OWASP/NIST/CIS |
| `documentation/markdown/security-roadmap.md` | Markdown | Phase A-D implementation plan |
| `documentation/markdown/security-validation-report.md` | Markdown | Security implementation validation |
| `ROUTE_OF_DATA.md` | Markdown | Full architecture & data flow map |

---

## Test Suite

| Test Group | Count | Status |
|------------|-------|--------|
| Unit (controllers, services) | ~110 | ✅ All pass |
| Auth (JWT, RBAC, decorator) | 30 | ✅ All pass |
| Audit (service, interceptor, decorator) | 28 | ✅ All pass |
| Integration (reading, SIM) | 10 | ✅ All pass |
| Contract (meter, SIM, reading, invoice) | 69 | ✅ All pass |
| Other (error-envelope, correlation, idempotency) | 20 | ✅ All pass |
| Setup | 12 | ✅ All pass |
| **Total** | **293** | **✅ 100%** |

---

## Restore Points

| Date | Location | Contents |
|------|----------|----------|
| 2026-05-31 | `restore-point-20260531-094024/` | AI_HANDOFF.md, test sweep, safety tools, dependencies |

To continue from a restore point, read `AI_HANDOFF.md` first.

---

## License

Proprietary — EPower Engineering Team
