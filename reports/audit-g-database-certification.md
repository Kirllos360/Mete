# AUDIT-G — Database Certification

**Date**: 2026-06-18
**Auditor**: Database Architect
**Scope**: Prisma schema, migrations, indexes, RBAC tables, foreign keys

---

## Schema Overview

| Schema | Model Count | Purpose |
|--------|-----------|---------|
| `sim_system` | 24 | Current production schema (meters, readings, invoices, etc.) |
| `core` | 17 | v2.0.0 RBAC, areas, users, permissions, audit |
| `features` | 36 | v2.0.0 Tariffs, wallet, settlements, billing cycles, documents |
| `area` | 42 | Per-area client data template |
| **Total** | **119** | |

---

## RBAC Tables (core schema)

| Table | Purpose |
|-------|---------|
| `users` (`CoreUser`) | User accounts with password hash, MFA, status |
| `roles` (`CoreRole`) | Role definitions with name, code, is_system |
| `permissions` (`CorePermission`) | Permission codes with display name, module |
| `role_permissions` (`CoreRolePermission`) | M:M join role→permission |
| `user_role_assignments` (`CoreUserRoleAssignment`) | M:M join user→role with area scope |

✅ Core RBAC tables exist and are fully defined.

---

## Enums

| Schema | Count |
|--------|-------|
| `sim_system` | 24 |
| `core` | 6 |
| `features` | 8 |
| `area` | 19 |
| **Total** | **57** |

✅ All enums defined.

---

## Indexes

| Schema | Count |
|--------|-------|
| `sim_system` | 5 |
| `core` | 5 |
| `features` | 23 |
| `area` | 48 |
| **Total** | **81** |

⚠️ **sim_system indexes are insufficient**: Only 5 indexes on 119 models' core working tables. Missing indexes on `Meter.projectId`, `Reading.meterId`, `Invoice.projectId`, `Customer.projectId`, `Payment.projectId`, and many more.

---

## Migrations

| Count | Latest Migration | Engine |
|-------|-----------------|--------|
| 12 | `20260617185351_area_db_template` | `postgresql` |

✅ 12 migrations, ordered sequentially. `migration_lock.toml` exists with `postgresql` engine.

---

## Findings

### FINDING G-1: Missing Indexes on `sim_system` Tables (HIGH)

**Root Cause**: The active `sim_system` schema (24 tables) has only 5 indexes across 4 models. Foreign keys like `Meter.projectId`, `Reading.meterId`, `Invoice.customerId`, `Customer.projectId`, `Payment.projectId` have NO indexes.

**Risk**: Full table scans on every filtered query as data grows.

**Severity**: HIGH

**Affected**: 
- `Meter` — missing indexes on `projectId`, `status`, `locationId`
- `Reading` — missing indexes on `meterId`, `status`, `projectId`
- `Invoice` — missing indexes on `projectId`, `customerId`, `status`
- `Payment` — missing indexes on `projectId`, `customerId`
- `Customer` — missing index on `projectId`
- `BillingPeriod` — missing index on `projectId+status`
- `TariffPlan` — missing index on `projectId+meterType+status`

**Fix**: Add `@@index` directives on all foreign keys and filtered columns.

### FINDING G-2: `sim_system` Role Enum Does Not Match T089 (HIGH)

**Root Cause**: The `sim_system` schema has NO Role enum. The Role enum used by the backend auth module (`backend/src/auth/types/role.enum.ts`) is a TypeScript enum — it's not represented in the Prisma schema or database. The `core` schema's RBAC tables (`CoreRole`) are disconnected from the running application code.

**Risk**: The 16-profile RBAC exists only in TypeScript code. The database has no role enforcement. The `CoreRole` table is never queried by the application — auth relies entirely on the TypeScript `Role` enum and `ROLE_PERMISSIONS` mapping.

**Severity**: HIGH

**Affected**: 
- `backend/src/auth/types/role.enum.ts` (TypeScript enum, not in DB)
- `backend/prisma/schema.prisma` (CoreRole exists but unused by app)
- No Prisma migration seeds the 16 roles into CoreRole

**Fix**: Create a seed script that inserts the 16 roles into `CoreRole` table, and wire the backend auth to check against database records instead of TypeScript enum.

### FINDING G-3: `@@map` Naming Convention Consistent (PASS)
All 119 models use `snake_case` plural table names via `@@map`. Good.

### FINDING G-4: No @relation Foreign Key Validation in sim_system (MEDIUM)

**Root Cause**: Several `sim_system` models use `String` fields as foreign keys without `@relation` directives, meaning Prisma does not enforce referential integrity at the ORM level for these relationships.

**Risk**: Orphan records possible if manual SQL operations bypass the application layer.

### FINDING G-5: 5 core RBAC Seed Tables Are Empty (MEDIUM)
`CoreRole`, `CorePermission`, `CoreRolePermission`, `CoreUserRoleAssignment`, `CoreArea` — all defined in schema but never seeded with data. No migration populates the 16 roles or 43 permissions.

---

## Conclusion

| Criterion | Result |
|-----------|--------|
| 4 schemas declared in datasource | ✅ YES |
| Total models | 119 |
| RBAC tables in core schema | ✅ YES (5 tables) |
| 16 roles seeded in DB | ❌ NO — only in TypeScript |
| 43 permissions seeded in DB | ❌ NO — only in TypeScript |
| Prisma migrations | ✅ 12 migrations |
| migration_lock.toml | ✅ YES |
| Indexes on sim_system FKs | ❌ NO — only 5 indexes |
| `@@map` convention consistent | ✅ YES |
| `@relation` directives | ⚠️ Partial |

**DATABASE_CERTIFIED = NO**

**Blockers**:
1. G-2 (HIGH): 16-profile RBAC exists only in TypeScript, not in database
2. G-1 (HIGH): Missing indexes on 10+ sim_system foreign keys
3. G-4 (MEDIUM): Missing @relation directives on some FKs
4. G-5 (MEDIUM): Core RBAC seed tables empty
