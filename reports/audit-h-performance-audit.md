# AUDIT-H — Performance Audit

**Date**: 2026-06-18
**Auditor**: Independent Performance Reviewer
**Scope**: Query patterns, pagination, indexes, payload size, bundle size

---

## Findings Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 4 |
| MEDIUM | 4 |
| LOW | 2 |

---

## ❌ CRITICAL FINDINGS

### H-C1: N+1 in ReadingsService.toDto() (CRITICAL)
**File**: `backend/src/readings/readings.service.ts` (lines 14-51)
**Issue**: Every reading returned by `findAll()` or `listReviewQueue()` triggers an individual `meter.findUnique()` query via `toDto()`. With 500 readings = 501 database queries.
**Fix**: Batch-fetch all meter IDs with a single `findMany`, build a lookup map.

### H-C2: N+1 in WaterBalanceService (CRITICAL)
**File**: `backend/src/readings/water-balance/water-balance.service.ts` (lines 45-65)
**Issue**: Per-child-meter aggregate queries in a loop. 50 child meters = 50 aggregate queries.
**Fix**: Use `groupBy` or batch with `meterId: { in: childIds }`.

### H-C3: No Pagination on ANY List Endpoint (CRITICAL)
**Issue**: ALL list endpoints (13 identified) return unbounded result sets. No `page`/`skip`/`limit` query params. As data grows, these queries will consume increasing memory and time.
**Fix**: Add pagination to every `@Get()` list endpoint.

---

## ❌ HIGH FINDINGS

### H-H1: N+1 in Invoice Generation (HIGH)
**File**: `backend/src/billing/billing.controller.ts` (lines 71-130)
**Issue**: Per-meter tariff lookup + per-reading invoice line insert in loops.
**Fix**: Batch tariff lookups, use `createMany`.

### H-H2: Missing Indexes on 10+ Foreign Keys (HIGH)
**Affected**: Meter (projectId, status), Reading (meterId, status), Invoice (projectId, customerId), Payment (projectId, customerId), Customer (projectId), and 5+ more.
**Fix**: Add `@@index([column])` on every foreign key and frequently-filtered column.

### H-H3: PaymentService Manual Join (HIGH)
**File**: `backend/src/payments/payments.service.ts` (lines 21-22)
**Issue**: Separate `paymentAllocation.findMany` instead of `include: { allocations: true }`.
**Fix**: Use Prisma `include`.

### H-H4: @prisma/client in Frontend Dependencies (HIGH)
**File**: `Frontend/package.json` (line 22)
**Issue**: Prisma ORM (~5-8MB) is bundled into frontend despite being a backend-only concern.
**Fix**: Remove `@prisma/client` and `prisma` from frontend deps.

---

## ❌ MEDIUM FINDINGS

### H-M1: Dead Fields in ReadingResponseDto
### H-M2: rawPayload (JSON) Returned in List Queries
### H-M3: Raw SQL via $queryRawUnsafe in Customer Statement
### H-M4: Per-Row Invoice Line Inserts Instead of createMany

---

## ❌ LOW FINDINGS

### H-L1: No Prisma Query Logging/Monitoring
### H-L2: No Date Filter on Consumption Trend Query

---

## Conclusion

| Criterion | Result |
|-----------|--------|
| N+1 query patterns analyzed | ✅ 3 found |
| Pagination on list endpoints | ✅ 13 missing |
| Database indexes reviewed | ✅ 10+ missing |
| Bundle size analyzed | ✅ 5-8MB frontend bloat found |
| Prisma query patterns | ✅ N+1 in services, missing include |

**PERFORMANCE_CERTIFIED = NO**

**Blockers**:
1. H-C1: N+1 in ReadingsService — scales with reading count
2. H-C2: N+1 in WaterBalanceService — scales with child meter count
3. H-C3: No pagination — O(n) unbounded queries
4. H-H2: Missing indexes — full table scans
5. H-H4: Frontend bundle bloat — 5-8MB unnecessary
