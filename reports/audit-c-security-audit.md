# AUDIT-C — Security Audit

**Date**: 2026-06-18
**Auditor**: Penetration Testing Reviewer
**Scope**: Authentication, Authorization, Input Validation, CSRF, Rate Limiting, IDOR, Secrets

---

## Executive Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 4 |
| MEDIUM | 5 |
| LOW | 3 |

---

## ❌ CRITICAL VULNERABILITIES

### C-01: Unrestricted Dev-Login Backdoor (CRITICAL, CVSS 10.0)

**Root Cause**: `AuthController.devLogin()` at line 37-43 accepts any `userId`, `role`, `name` and signs a valid JWT with zero authentication, guards, environment checks, or rate limiting.

```typescript
@Post('dev-login')
@HttpCode(HttpStatus.OK)
async devLogin(@Body() dto: DevLoginDto) {
  const payload = { sub: dto.userId, userId: dto.userId, role: dto.role };
  const accessToken = this.jwtService.sign(payload);
  return { accessToken, user: { id: dto.userId, name: dto.name ?? dto.userId, role: dto.role } };
}
```

**Risk**: Anyone who discovers this endpoint can forge a JWT as `super_admin`, gaining full system access. No production toggle exists.

**Severity**: CRITICAL

**Affected**: `backend/src/auth/auth.controller.ts:37-43`

**Fix**: Gate behind `NODE_ENV !== 'production'` or remove entirely.

### C-02: Two Controllers Have Zero Authentication (CRITICAL, CVSS 9.1)

**Root Cause**: `WaterBalanceController` (entire class) and `SimCardsController.getEligibility()` have no `@UseGuards()` decorators.

**Risk**: Water balance data and SIM eligibility data publicly accessible without any token.

**Severity**: CRITICAL

**Affected**: 
- `backend/src/readings/water-balance/water-balance.controller.ts:7-19`
- `backend/src/sim-cards/sim-cards.controller.ts:89`

**Fix**: Add `@UseGuards(AuthGuard('jwt'), RolesGuard)` to both.

### C-03: RBAC Guards Not Global (CRITICAL, CVSS 8.6)

**Root Cause**: RolesGuard and PermissionsGuard are NOT registered as global `APP_GUARD`. Each controller must manually apply them — and two already missed.

**Risk**: Any new controller or endpoint that omits guards has zero authorization.

**Severity**: CRITICAL

**Affected**: `backend/src/auth/auth.module.ts:30-35`

**Fix**: Register RolesGuard as `APP_GUARD` in `app.module.ts`.

---

## ❌ HIGH VULNERABILITIES

### H-01: Pervasive IDOR — No Resource Ownership (HIGH, CVSS 8.1)

**Root Cause**: Every controller accepts UUID params without verifying the authenticated user owns or is scoped to that resource. An operator can access ANY project, meter, customer, invoice.

**Risk**: Complete lack of tenancy isolation. Cross-tenant data access.

**Severity**: HIGH

**Affected**: Every controller file — all endpoints that take UUID params.

**Fix**: Add `projectScope`/`areas` validation in service layer.

### H-02: Weak JWT Secret with Fallback (HIGH, CVSS 7.5)

**Root Cause**: `JWT_SECRET=dev-jwt-secret-do-not-use-in-production` in `.env`. Fallback `'change-me-in-production'` in `jwt.strategy.ts`.

**Risk**: Anyone with access to `.env` or who guesses the fallback can forge arbitrary JWTs.

**Severity**: HIGH

**Affected**: `backend/.env:9`, `backend/src/auth/jwt.strategy.ts:14`

**Fix**: Generate strong secret, validate at startup, remove fallback.

### H-03: CSRF Guard Dead Code (HIGH, CVSS 7.0)

**Root Cause**: `CsrfGuard` exists but is never imported, provided, or applied anywhere.

**Risk**: No CSRF protection if cookie-based auth is ever used.

**Severity**: HIGH

**Affected**: `backend/src/common/http/csrf.guard.ts` (entire file)

**Fix**: Either register globally or remove dead code.

### H-04: SQL Injection Risk (HIGH, CVSS 7.3)

**Root Cause**: `CustomersController.getStatement()` uses `$queryRawUnsafe` instead of Prisma's type-safe query API.

**Risk**: SQL injection if raw SQL is modified with string concatenation in the future.

**Severity**: HIGH

**Affected**: `backend/src/customers/customers.controller.ts:110-119`

**Fix**: Replace with Prisma type-safe query or `$queryRaw` (without "Unsafe").

---

## ❌ MEDIUM VULNERABILITIES

### M-01: Refresh Token Generates Invalid Access Tokens (MEDIUM)

**Root Cause**: `RefreshTokenService.generateAccessToken()` signs JWT without `role` claim. `JwtStrategy.validate()` requires `role` and throws if missing.

**Fix**: Include `role` in refresh-generated tokens.

### M-02: Idempotency Uses In-Memory Storage (MEDIUM)

**Fix**: Replace `Map` with database-backed store for multi-instance support.

### M-03: Weak Global Rate Limiting (MEDIUM)

**Fix**: Add per-endpoint limits. Reduce global limit from 100/min.

### M-04: Weak Password Policy (MEDIUM)

**Fix**: Increase minimum from 8 to 12 characters.

### M-05: JWT Algorithm Not Specified (MEDIUM)

**Fix**: Use RS256 with key pair instead of default HS256.

---

## ❌ LOW VULNERABILITIES

### L-01: Dev Secrets in .env (gitignored)
### L-02: `areas` Field Dropped in JWT Validate Return
### L-03: `$queryRawUnsafe` Code Smell

---

## Additional Observations

- **Helmet**: ✅ Applied in `main.ts`
- **ThrottlerGuard**: ✅ Global but limits too lenient (100/min)
- **ValidationPipe**: ✅ Global with whitelist, forbidNonWhitelisted, transform
- **ParseUUIDPipe**: ✅ Used on UUID params
- **AuditInterceptor**: ✅ Global APP_INTERCEPTOR
- **Audit decorators**: ✅ Applied on most CUD endpoints
- **Swagger/OpenAPI**: `/api/v1/docs` exposed — should be disabled in production

---

## Conclusion

| Criterion | Result |
|-----------|--------|
| JWT authentication | ✅ Implemented (but dev-login bypass) |
| Role-based authorization | ✅ RolesGuard exists |
| Permission-based authorization | ✅ PermissionsGuard exists (unused) |
| CSRF protection | ❌ Dead code — never applied |
| Rate limiting | ⚠️ Present but too lenient |
| Input validation | ✅ Global ValidationPipe |
| Audit logging | ✅ Global interceptor |
| IDOR protection | ❌ None — pervasive across all controllers |
| Resource ownership checks | ❌ None |
| Secrets management | ⚠️ Dev secrets + fallback |
| Helmet/security headers | ✅ Applied |
| SQL injection risk | ⚠️ One raw query (bound params) |

**SECURITY_CERTIFIED = NO**

**Blockers**:
1. C-01 (CRITICAL): Dev-login backdoor — anyone can get super_admin JWT
2. C-02 (CRITICAL): 2 controllers unprotected
3. C-03 (CRITICAL): Guards not global — pattern failure
4. H-01 (HIGH): Pervasive IDOR — no resource ownership
5. H-02 (HIGH): Weak JWT secret with fallback
6. H-03 (HIGH): CSRF dead code
