# AUDIT-D — API Certification

**Date**: 2026-06-18
**Auditor**: Independent Technical Auditor
**Scope**: All 53 API endpoints — auth, permissions, DTO validation, error handling

---

## Endpoint Inventory

### Summary Statistics

| Metric | Count |
|--------|-------|
| Total endpoints | 53 |
| Endpoints with auth guard | 48 |
| Endpoints WITHOUT auth guard | 5 |
| Endpoints using `@Auth()` composite decorator | 0 |
| Endpoints using `@Roles()` only | 48 |
| Endpoints using `@Permissions()` | 0 |
| Endpoints with `@Audit()` | 16 |
| Controllers analyzed | 12 |

---

## Endpoint Table

| # | Method | Route | Controller | Auth | Allowed Roles | Audit |
|---|--------|-------|-----------|------|-------------|-------|
| 1 | GET | `/api/v1/health` | AppController.health() | **NONE** | public | — |
| 2 | POST | `/api/v1/auth/refresh` | AuthController.refresh() | **NONE** | public | — |
| 3 | POST | `/api/v1/auth/dev-login` | AuthController.devLogin() | **NONE** | public | — |
| 4 | POST | `/api/v1/invoices/generate` | BillingController.generateInvoices() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE | — |
| 5 | POST | `/api/v1/invoices/:id/issue` | BillingController.issueInvoice() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE | — |
| 6 | POST | `/api/v1/invoices/:id/adjustments` | BillingController.addAdjustment() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE | — |
| 7 | POST | `/api/v1/payments` | BillingController.createPayment() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE | — |
| 8 | POST | `/api/v1/tariffs` | BillingController.createTariff() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | — |
| 9 | GET | `/api/v1/tariffs` | BillingController.listTariffs() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 10 | POST | `/api/v1/periods` | BillingController.createPeriod() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | — |
| 11 | GET | `/api/v1/periods` | BillingController.listPeriods() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 12 | GET | `/api/v1/invoices` | BillingController.listInvoices() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 13 | GET | `/api/v1/invoices/:id` | BillingController.getInvoice() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 14 | POST | `/api/v1/projects/:projectId/customers` | CustomersController.create() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 15 | GET | `/api/v1/projects/:projectId/customers` | CustomersController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 16 | GET | `/api/v1/projects/:projectId/customers/:id` | CustomersController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 17 | PATCH | .../customers/:id | CustomersController.update() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 18 | DELETE | .../customers/:id | CustomersController.remove() | ✅ JWT+Roles | ADMIN, SUPER_ADMIN | ✅ |
| 19 | GET | .../customers/:id/statement | CustomersController.getStatement() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT, CUSTOMER | — |
| 20 | POST | `/api/v1/meters` | MetersController.create() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 21 | GET | `/api/v1/meters` | MetersController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 22 | GET | `/api/v1/meters/:id` | MetersController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 23 | PATCH | `/api/v1/meters/:id` | MetersController.update() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 24 | DELETE | `/api/v1/meters/:id` | MetersController.remove() | ✅ JWT+Roles | SUPER_ADMIN | ✅ |
| 25 | POST | `/api/v1/meters/:meterId/assign` | MetersController.assignMeter() | ✅ JWT+Roles | OPERATOR, ADMIN | ✅ |
| 26 | POST | `/api/v1/meters/:meterId/terminate` | MetersController.terminateMeter() | ✅ JWT+Roles | OPERATOR, ADMIN | ✅ |
| 27 | GET | `/api/v1/payments` | PaymentsController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 28 | GET | `/api/v1/payments/:id` | PaymentsController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 29 | POST | `/api/v1/payments/:id/reverse` | PaymentsController.reverse() | ✅ JWT+Roles | SUPER_ADMIN | ✅ |
| 30 | POST | `/api/v1/projects` | ProjectsController.create() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 31 | GET | `/api/v1/projects` | ProjectsController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 32 | GET | `/api/v1/projects/:id` | ProjectsController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 33 | PATCH | `/api/v1/projects/:id` | ProjectsController.update() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 34 | DELETE | `/api/v1/projects/:id` | ProjectsController.remove() | ✅ JWT+Roles | SUPER_ADMIN | ✅ |
| 35 | GET | .../dashboard/kpis | DashboardController.getKpis() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 36 | GET | .../dashboard/consumption | DashboardController.getConsumption() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 37 | GET | .../dashboard/activity | DashboardController.getActivity() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, SUPPORT | — |
| 38 | POST | .../locations | LocationsController.create() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 39 | GET | .../locations | LocationsController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 40 | GET | .../locations/:id | LocationsController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 41 | PATCH | .../locations/:id | LocationsController.update() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 42 | DELETE | .../locations/:id | LocationsController.remove() | ✅ JWT+Roles | ADMIN, SUPER_ADMIN | ✅ |
| 43 | POST | `/api/v1/readings` | ReadingsController.create() | ✅ JWT+Roles | OPERATOR, TECHNICIAN, ADMIN, SUPER_ADMIN | ✅ |
| 44 | GET | `/api/v1/readings` | ReadingsController.findAll() | ✅ JWT+Roles | OPERATOR, TECHNICIAN, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 45 | GET | `/api/v1/readings/review-queue` | ReadingsController.listReviewQueue() | ✅ JWT+Roles | OPERATOR, TECHNICIAN, ADMIN, SUPER_ADMIN | — |
| 46 | GET | `/api/v1/readings/:id` | ReadingsController.findOne() | ✅ JWT+Roles | OPERATOR, TECHNICIAN, ADMIN, SUPER_ADMIN, FINANCE, SUPPORT | — |
| 47 | GET | .../water-balance | WaterBalanceController.getWaterBalance() | **NONE** | **unprotected** | — |
| 48 | POST | `/api/v1/sim-cards` | SimCardsController.create() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 49 | GET | `/api/v1/sim-cards` | SimCardsController.findAll() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 50 | GET | `/api/v1/sim-cards/:id` | SimCardsController.findOne() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, SUPPORT | — |
| 51 | PATCH | `/api/v1/sim-cards/:id` | SimCardsController.update() | ✅ JWT+Roles | OPERATOR, ADMIN, SUPER_ADMIN | ✅ |
| 52 | DELETE | `/api/v1/sim-cards/:id` | SimCardsController.remove() | ✅ JWT+Roles | SUPER_ADMIN | ✅ |
| 53 | GET | .../sim-cards/:simId/eligibility | SimCardsController.getEligibility() | **NONE** | **unprotected** | — |

---

## ❌ FAILURES

### FAILURE D-1: WaterBalanceController — No Auth (CRITICAL)
**Route**: `GET /api/v1/projects/:projectId/water-balance`
**Root Cause**: Controller class has no class-level `@UseGuards()`, and method has no guards either.
**Risk**: Water balance data (consumption, variance, thresholds) is publicly accessible.
**Fix**: Add `@UseGuards(AuthGuard('jwt'), RolesGuard)` at class level.

### FAILURE D-2: SimCardsController.getEligibility — No Auth (CRITICAL)
**Route**: `GET /api/v1/sim-cards/:simId/eligibility`
**Root Cause**: Other 5 methods in the controller apply guards at method level, but `getEligibility()` does not.
**Risk**: SIM card eligibility data is publicly accessible.
**Fix**: Add `@UseGuards(AuthGuard('jwt'), RolesGuard)` to method or move guards to class level.

### FAILURE D-3: `@Auth()` Composite Decorator Never Used (MEDIUM)
**Root Cause**: The `Auth()` composite decorator exists at `auth.decorator.ts` but 0 of 53 endpoints use it. All endpoints use the older `@UseGuards(AuthGuard('jwt'), RolesGuard)` + separate `@Roles()` pattern.
**Risk**: New endpoints will not benefit from the cleaner composite pattern. Inconsistency.
**Fix**: Migrate controllers to use `@Auth({ roles: [...] })`.

### FAILURE D-4: `@Permissions()` Decorator Never Used (MEDIUM)
**Root Cause**: PermissionsGuard and Permissions decorator exist but 0 endpoints use them.
**Risk**: Granular permission checking (beyond role level) is entirely untested and unused.
**Fix**: Add `@Permissions()` to endpoints that need sub-role authorization.

### FAILURE D-5: BillingController Route Ambiguity (LOW)
**Root Cause**: BillingController at `@Controller()` (no prefix) handles routes like `payments`, `tariffs`, `periods`, `invoices`. Separate controllers (PaymentsController at `@Controller('payments')`) also handle these paths.
**Risk**: Route confusion and potential conflicts.

### FAILURE D-6: Auth/Refresh Endpoints Have No Rate Limiting (MEDIUM)
**Root Cause**: `POST /auth/refresh` and `POST /auth/dev-login` have no guards, no rate limiting.
**Risk**: Brute force attacks on token refresh, unauthorized JWT generation.

---

## Conclusion

| Criterion | Result |
|-----------|--------|
| Total endpoints | 53 |
| Endpoints with auth | 48 (90.6%) |
| Endpoints without auth | 5 (9.4%) |
| Endpoints using `@Permissions()` | 0 |
| Endpoints using `@Auth()` | 0 |
| DTO validation on write endpoints | ✅ Most |
| `@Audit()` on CUD endpoints | 16/25 (64%) |

**API_CERTIFIED = NO**

**Blockers**:
1. D-1 (CRITICAL): WaterBalanceController unprotected
2. D-2 (CRITICAL): SimCardsController.getEligibility unprotected
3. D-3 (MEDIUM): `@Auth()` decorator unused
4. D-4 (MEDIUM): `@Permissions()` decorator unused
5. D-5 (LOW): Route ambiguity in billing
6. D-6 (MEDIUM): No rate limiting on auth endpoints
