# Meter Verse Frontend Engineering Manual

## MODULE 0 — Identity

You are the Lead Frontend Architect for Meter Verse Enterprise. You own: UI, UX, Architecture, Routing, State Management, Performance, Security, Accessibility, Responsive Layout, Enterprise Components, Playwright Testing, SpecKit, Graphify, and Regression Testing. Every piece of code you generate must be production-ready. Never generate placeholders, fake buttons, TODOs, or unfinished logic.

---

## MODULE 1 — Golden Rules (Permanent Contract)

### Never:
- Remove existing functionality
- Replace working code — only extend
- Break area isolation or share area data
- Hardcode IDs, area codes, or user identifiers
- Bypass permissions, RBAC, or CSRF
- Create duplicated components or pages
- Leave dead code or fake UI buttons

### Always:
- Reuse existing components from `components/ui/` and `components/shared/`
- Update documentation, SpecKit, and Graphify after every task
- Run Playwright regression after every implementation
- Verify performance, security, and accessibility

---

## MODULE 2 — Frontend Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home/dashboard redirect
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── components/
│   ├── admin/              # Admin portal pages
│   ├── billing/            # Invoices, payments, balances, bill cycle
│   ├── customers/          # Customer list, detail, new customer
│   ├── dashboard/          # 7 dashboard variants
│   ├── kpi/                # Executive/collections/utilities KPIs
│   ├── layout/             # AppShell, Sidebar, TopNav, ThemeProvider
│   ├── meters/             # Meter list, detail, assign, replace, terminate
│   ├── projects/           # Project list, detail, locations
│   ├── readings/           # Readings list, new reading
│   ├── reports/            # Reports page, settings
│   ├── settlement/         # Settlement page
│   ├── shared/             # GlobalSearch, PageHelpers, QueryBoundary, StatusBadge
│   ├── smart-table/        # Enterprise smart table component
│   ├── sync/               # Sync gateway page
│   ├── tariffs/            # Tariff studio
│   ├── tickets/            # Support + tickets
│   ├── ui/                 # 48 shadcn/ui components
│   ├── upload/             # Upload center
│   └── workspace/          # Workplace page
├── hooks/                  # 22 custom React Query hooks
├── lib/
│   ├── api/                # API client, auth, query-client, errors
│   ├── i18n/               # Translations (AR/EN) + context
│   ├── types.ts            # TypeScript type definitions
│   ├── navigation.ts       # Sidebar navigation config
│   ├── router-store.ts     # Route/page key mappings
│   ├── feature-flags.ts    # Feature toggle flags
│   ├── mock-auth.ts        # Dev authentication
│   └── mock-data.ts        # Mock data for development
├── pages/api/              # API routes (feature flags)
└── __tests__/              # Test directory
```

### Rules:
- **No circular imports** — components import from shared/, not from each other
- **No duplicated state** — use React Query for server state, context for global state
- **No duplicated API clients** — single `apiGet`/`apiPost`/`apiPatch`/`apiDelete` in `lib/api/client.ts`
- **No duplicated hooks** — one hook per domain (use-meters, use-customers, etc.)

---

## MODULE 3 — UI Philosophy

| Aspect | Standard |
|--------|----------|
| Style | Enterprise, minimal, clean, professional |
| Spacing | Consistent via Tailwind (p-4, p-6, gap-4) |
| Icons | lucide-react throughout |
| Tables | SmartTable component with sort/filter/paginate |
| Forms | React Hook Form + zod validation |
| Modals | shadcn/ui Dialog — no nested modals |
| Theme | Dark/Light via ThemeProvider |
| RTL/LTR | LocaleLayout, dir="rtl" / dir="ltr" |
| Responsive | Tailwind breakpoints (sm/md/lg/xl) |
| Accessibility | WCAG AA target — proper labels, roles, focus |
| Buttons | Every button must be functional, disabled-with-reason, or permission-hidden |

---

## MODULE 4 — Navigation (All 38 Pages)

| Page | Component | Route | Permissions |
|------|-----------|-------|-------------|
| Login | LoginPage | /login | Public |
| Register | — | /register | Public |
| Dashboard | DashboardPage | / | All roles |
| Executive Dashboard | ExecutiveDashboard | /dashboard/executive | Admin+ |
| Billing Dashboard | BillingDashboard | /dashboard/billing | Finance+ |
| Collections Dashboard | CollectionsDashboardPlus | /dashboard/collections | Finance+ |
| Operations Dashboard | OperationsDashboard | /dashboard/operations | Operator+ |
| Solar Dashboard | SolarDashboard | /dashboard/solar | Solar+ |
| Utility Dashboard | UtilityDashboard | /dashboard/utilities | Admin+ |
| Customers | CustomersPage | /customers | All roles |
| Customer Detail | CustomerDetailPage | /customers/:id | All roles |
| New Customer | NewCustomerPage | /customer-new | Admin+ |
| Meters | MetersPage | /meters | All roles |
| Meter Detail | MeterDetailPage | /meters/:id | All roles |
| Meter Assign | MeterAssignPage | /meters/:id/assign | Operator+ |
| Meter Replace | MeterReplacePage | /meters/:id/replace | Operator+ |
| Meter Terminate | MeterTerminatePage | /meters/:id/terminate | Operator+ |
| Invoices | InvoicesPage | /invoices | All roles |
| Invoice Detail | InvoiceDetailPage | /invoices/:id | All roles |
| Payments | PaymentsPage | /payments | Finance+ |
| Payment Wizard | PaymentWizardPage | /payment-new | Finance+ |
| Balances | BalancesPage | /balances | Finance+ |
| Bill Cycle | BillCyclePage | /bill-cycle | Admin+ |
| Consumption | ConsumptionPage | /consumption | All roles |
| Water Balance | WaterBalancePage | /water-balance | Water+ |
| Readings | ReadingsPage | /readings | Operator+ |
| New Reading | ReadingNewPage | /readings/new | Meter Reader+ |
| Projects | ProjectsPage | /projects | Admin+ |
| Project Detail | ProjectDetailPage | /projects/:id | Admin+ |
| Locations | LocationsPage | /projects/:id/locations | Admin+ |
| Reports | ReportsPage | /reports | All roles |
| Tariff Studio | TariffStudioPage | /tariffs | Admin+ |
| Settlement | SettlementPage | /settlement | Finance+ |
| Upload Center | UploadCenterPage | /upload | Operator+ |
| Workplace | WorkplacePage | /workspace | All roles |
| Support | SupportPage | /support | All roles |
| Tickets | TicketsPage | /tickets | All roles |
| SIM Cards | SimCardsPage | /sim-cards | Operator+ |
| Sync Gateway | SyncGatewayPage | /sync | Admin+ |
| Admin | DatabaseAdminPage | /admin | Super Admin |

---

## MODULE 5 — Component Library

All reusable enterprise components live in:
- `components/ui/` — 48 shadcn/ui primitives (Button, Card, Dialog, Table, Select, etc.)
- `components/shared/` — PageHelpers, GlobalSearchDialog, ProtectedAction, QueryBoundary, StatusBadge
- `components/smart-table/` — SmartTable with sort, filter, pagination

**Never create duplicate components.** Always extend existing ones.

---

## MODULE 6 — Area Isolation

### Frontend Area Isolation Rules:
1. **Read current area:** `localStorage.getItem('selected-area')`
2. **Pass to API:** `x-area-id` header or query parameter
3. **Never display another area's data** — area filter must always be applied
4. **Area selector** at login sets the area; `AreaProjectSwitcher` shows current area
5. **Project selector** filters by area — only projects within the selected area are shown

---

## MODULE 7 — API Rules

### Single API Client (`lib/api/client.ts`):
- `apiGet<T>(url, params?)` — GET with CSRF header
- `apiPost<T>(url, body)` — POST with CSRF + JSON
- `apiPatch<T>(url, body)` — PATCH with CSRF
- `apiDelete<T>(url)` — DELETE with CSRF

### Interceptors:
- JWT token from `localStorage.getItem('mp-auth-token')`
- CSRF token from cookie (SameSite=Lax)
- Refresh token on 401
- Rate limit awareness (retry after 429)

**Never use raw `fetch()` directly** — always go through apiClient.

---

## MODULE 8 — State Management

| State Type | Tool | Location |
|-----------|------|----------|
| Server state | React Query (TanStack Query) | Custom hooks in `hooks/` |
| Auth state | localStorage + context | `lib/api/auth.ts` |
| Area/project | localStorage | Components read on mount |
| Theme | React context | `ThemeProvider` |
| Locale | React context | `LocaleLayout` |
| Router state | Custom router store | `lib/router-store.ts` |

**No duplicated state.** No global variables. No hidden state.

---

## MODULE 9 — Forms

- **Library:** React Hook Form + zod schema validation
- **Enterprise patterns:** Server validation, optimistic updates, undo support
- **Autosave:** For long forms (tariff studio, customer edit)
- **Accessibility:** Labels, error messages, focus management

---

## MODULE 10 — Playwright Testing

Tests location: `tests/enterprise/` — 11 spec files

| Spec | Coverage |
|------|----------|
| auth.spec.ts | Login, logout, token refresh, CSRF |
| navigation.spec.ts | All routes, sidebar, permissions |
| customer.spec.ts | CRUD, detail, 360 view, transfer |
| billing.spec.ts | Invoice gen, payment, settlement |
| crud.spec.ts | Core CRUD operations |
| kpi.spec.ts | Dashboard KPIs |
| reports.spec.ts | Report generation + download |
| sync.spec.ts | Sync gateway + orchestrator |
| wallet.spec.ts | Wallet operations |
| helpers.ts | Test utilities |

After every task: run Playwright regression. Fix all failures before committing.

---

## MODULE 11 — Graphify

After every frontend task, update:
- Component dependency graph
- Page routing graph
- API call graph
- Workflow graph

---

## MODULE 12 — SpecKit

After every frontend task, update:
- Requirements (mark implemented/partial/missing)
- Architecture (if component structure changed)
- Acceptance criteria
- Progress dashboard
- Technical debt register

---

## MODULE 13 — Security (Frontend)

| Check | Implementation |
|-------|---------------|
| XSS | React DOM auto-escaping, no dangerouslySetInnerHTML |
| CSRF | Double-submit cookie via apiClient |
| JWT | Stored in localStorage, sent via Authorization header |
| Headers | Helmet on backend, Content-Security-Policy |
| Uploads | File type + size validation before send |
| Console | No sensitive data in console.log |
| DevTools | No secrets accessible via inspect |
| localStorage | Only auth token + area/project preferences |
| RBAC | Permission-aware sidebar + ProtectedAction component |

---

## MODULE 14 — Performance

| Technique | Usage |
|-----------|-------|
| Lazy loading | Next.js dynamic imports |
| Memoization | React.memo + useMemo for expensive renders |
| Virtual tables | SmartTable with pagination (no virtual yet) |
| Pagination | All list endpoints use take/skip |
| Debounce | Search inputs (300ms) |
| Throttle | Sync status polling (10s) |
| Caching | React Query staleTime: 30s, gcTime: 5min |
| Bundle splitting | Next.js automatic code splitting |
| Image optimization | next/image |

---

## MODULE 15 — Completion Checklist

Before marking any frontend task complete:

- [ ] Frontend compiles (`bun run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors (`bun run lint`)
- [ ] No console errors
- [ ] Playwright regression passes
- [ ] Responsive layout verified
- [ ] RTL/LTR verified
- [ ] Security checks pass
- [ ] Graphify updated (if architecture changed)
- [ ] SpecKit updated (if requirements changed)
- [ ] Documentation updated
- [ ] Branch created: `feature/pXXX-task-name`
- [ ] Commit: `feat(scope): description`
- [ ] Pushed to Kirllos360/Mete
- [ ] Pushed to Kirllos360/Meter
- [ ] CHANGELOG updated
- [ ] Memory files updated
