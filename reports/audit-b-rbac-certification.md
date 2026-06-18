# AUDIT-B — RBAC Certification

**Date**: 2026-06-18
**Auditor**: Independent Security Auditor
**Scope**: 16-profile RBAC implementation after T089

---

## Verification Summary

| File | Status |
|------|--------|
| `backend/src/auth/types/role.enum.ts` | ✅ PASS |
| `backend/src/auth/types/permission.enum.ts` | ✅ PASS |
| `backend/src/auth/types/permission-role.mapping.ts` | ✅ PASS (logic) |
| `backend/src/auth/permissions.decorator.ts` | ✅ PASS |
| `backend/src/auth/permissions.guard.ts` | ✅ PASS (logic) |
| `backend/src/auth/roles.guard.ts` | ✅ PASS |
| `backend/src/auth/roles.decorator.ts` | ✅ PASS |
| `backend/src/auth/auth.decorator.ts` | ✅ PASS |
| `backend/src/auth/area.middleware.ts` | ✅ PASS (code) |
| `backend/src/auth/auth.module.ts` | ✅ PASS |
| `backend/src/auth/interfaces/jwt-payload.interface.ts` | ✅ PASS |
| `Frontend/src/lib/types.ts` (UserRole) | ✅ PASS |
| `Frontend/src/lib/action-permissions.ts` | ✅ PASS (syntax) |
| `Frontend/src/lib/navigation.ts` | ✅ PASS |
| `Frontend/src/lib/mock-auth.ts` | ✅ PASS |
| `Frontend/src/components/shared/ProtectedAction.tsx` | ✅ PASS |

---

## ❌ FAILURES

### FAILURE B-1: JWT Strategy Drops `areas` Field (HIGH)

**Root Cause**: `jwt.strategy.ts` line 28-33 returns only `{ sub, userId, role, projectScope }`. The `areas` property from the JWT payload is explicitly excluded from the return object.

```typescript
// jwt.strategy.ts L28-33
return {
  sub: payload.sub,
  userId: payload.userId ?? payload.sub,
  role: payload.role,
  projectScope: payload.projectScope,
  // ❌ areas: payload.areas  -- MISSING
};
```

**Risk**: Area middleware reads `(user as any).areas` which is always `undefined`. Area-based access control is completely non-functional. Every request passes through without any area restriction.

**Severity**: HIGH

**Affected Files**: 
- `backend/src/auth/jwt.strategy.ts` (line 28-33)
- `backend/src/auth/area.middleware.ts` (consumer)

**Fix**: Add `areas: payload.areas` to the return object in `jwt.strategy.ts`.

---

### FAILURE B-2: AreaMiddleware Never Applied (HIGH)

**Root Cause**: The `AreaMiddleware` class is defined but never imported or registered by any NestJS module. Grep for `AreaMiddleware` across `backend/src/` finds only the file's own definition. `app.module.ts`'s `configure()` method registers only `CorrelationMiddleware`.

**Risk**: Area-based access control is entirely dead code. The middleware class exists but never executes.

**Severity**: HIGH

**Affected Files**:
- `backend/src/auth/area.middleware.ts` (defined but orphaned)
- `backend/src/app.module.ts` (line 56-58 — only applies CorrelationMiddleware)

**Fix**: Register `AreaMiddleware` in `app.module.ts`:
```typescript
import { AreaMiddleware } from './auth/area.middleware';
// ...
configure(consumer: MiddlewareConsumer): void {
  consumer.apply(CorrelationMiddleware).forRoutes('*');
  consumer.apply(AreaMiddleware).forRoutes('/api/v1/*');
}
```

---

### FAILURE B-3: Frontend/Backend Authorization Model Mismatch (HIGH)

**Root Cause**: Backend uses explicit permission-matrix (ROLE_PERMISSIONS[role] = Permission[]). Frontend uses hierarchy-level comparison (userLevel >= requiredLevel). These produce different authorization decisions.

**Example Contradictions**:
| Scenario | Backend (truth) | Frontend (UI) | Result |
|----------|----------------|---------------|--------|
| system_admin → user:manage | ✅ Has USER_MANAGE | ❌ needs super_admin (100 > 90) | Frontend hides authorized action |
| customer → payment:read | ✅ Has PAYMENT_READ | ❌ needs viewer (10 > 5) | Frontend hides authorized action |
| customer → ticket:manage | ✅ Has TICKET_MANAGE | ❌ needs operator (55 > 5) | Frontend hides authorized action |
| admin → notification:send | ✅ Has NOTIFICATION_SEND | ❌ needs system_admin (90 > 80) | Frontend hides authorized action |

5 roles (supervisor, support, collector, meter_reader, inspector, customer) are never used as ACTION_MINIMUM_ROLE targets.

**Risk**: Frontend shows/hides UI inconsistently with backend authorization. Privileged users see missing buttons; unauthorized users see buttons that 403.

**Severity**: HIGH

**Affected Files**:
- `Frontend/src/lib/action-permissions.ts` (entire hierarchy model)
- `backend/src/auth/types/permission-role.mapping.ts` (backend matrix counterpart)

**Fix**: Replace frontend hierarchy model with permission-matrix model matching backend exactly.

---

### FAILURE B-4: team_leader < operator Permission Contradiction (MEDIUM)

**Root Cause**: Team_leader (hierarchy 65) has fewer write permissions than operator (hierarchy 55):
- Missing from team_leader: CUSTOMER_WRITE, METER_ASSIGN, INVOICE_WRITE, INVOICE_ISSUE, PAYMENT_WRITE, SIM_WRITE

**Risk**: Role design inconsistency — a team leader cannot do what an operator can.

**Severity**: MEDIUM

**Affected Files**: `backend/src/auth/types/permission-role.mapping.ts` (lines 61-86)

**Fix**: Review team_leader vs operator permission assignments.

---

### FAILURE B-5: JWT_EXPIRES_IN Number Coercion (LOW)

**Root Cause**: `auth.module.ts` line 24 wraps config value in `Number()`:
```typescript
expiresIn: Number(config.get<string>('JWT_EXPIRES_IN', '3600'))
```
If .env sets `JWT_EXPIRES_IN=1h`, `Number('1h')` returns `NaN`.

**Risk**: Silent misconfiguration — tokens may not expire.

**Severity**: LOW

**Affected Files**: `backend/src/auth/auth.module.ts` (line 24)

**Fix**: Remove `Number()` wrapper.

---

## ⚠️ WARNINGS

### WARNING B-1: No Tests for PermissionsGuard (MEDIUM)
`PermissionsGuard` has zero unit tests. The `ROLE_PERMISSIONS` mapping correctness is untested.

### WARNING B-2: Unsafe `as any` Casts in area.middleware.ts (LOW)
Lines 8 and 16 use `(req as any)` instead of `RequestWithUser` interface.

### WARNING B-3: Dev-Login Endpoint Unrestricted (LOW)
`POST /auth/dev-login` generates valid JWT for any role with any userId, no auth required.

### WARNING B-4: Thin Functional Test Coverage (LOW)
`endpoint-access.spec.ts` only tests 5 endpoints out of 53.

---

## Conclusion

| Criterion | Result |
|-----------|--------|
| 16 roles in Role enum | ✅ YES |
| 43 permissions in Permission enum | ✅ YES |
| All 16 roles mapped in permission-role.mapping | ✅ YES |
| PermissionsGuard logic correct | ✅ YES |
| Auth() composite decorator works | ✅ YES |
| RolesGuard + PermissionsGuard registered in module | ✅ YES |
| AreaMiddleware code correct | ✅ YES (but dead code) |
| JWT carries areas field | ❌ NO — field dropped |
| AreaMiddleware applied to routes | ❌ NO — never registered |
| Frontend UserRole matches backend | ⚠️ PARTIAL — hierarchy model diverges |
| Frontend navigation covers 16 roles | ✅ YES |
| Frontend mock-auth covers 16 roles | ✅ YES |
| Tests for PermissionsGuard | ❌ NO |

**RBAC_CERTIFIED = NO**

**Blockers**:
1. B-1 (HIGH): JWT strategy drops `areas` — area access control broken
2. B-2 (HIGH): AreaMiddleware never applied — dead code
3. B-3 (HIGH): Frontend/backend auth model mismatch — inconsistent UX
4. B-4 (MEDIUM): team_leader/operator role contradiction
5. B-5 (LOW): JWT_EXPIRES_IN NaN risk
