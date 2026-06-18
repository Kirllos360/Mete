'use client';

import { create } from 'zustand';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { rolePermissions } from '@/lib/navigation';
import { setToken, clearToken } from '@/lib/api';

// ---- ROLES constant ----

export const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'system_admin', label: 'System Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'area_manager', label: 'Area Manager' },
  { value: 'team_leader', label: 'Team Leader' },
  { value: 'operator', label: 'Operator' },
  { value: 'technician', label: 'Technician' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Support' },
  { value: 'customer', label: 'Customer' },
  { value: 'collector', label: 'Collector' },
  { value: 'meter_reader', label: 'Meter Reader' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'viewer', label: 'Viewer' },
];

// ---- Auth Store ----

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/auth/dev-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, name: user.name }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.accessToken);
      } else {
        setToken(`mock-token-${user.id}`);
      }
    } catch {
      setToken(`mock-token-${user.id}`);
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearToken();
    set({ user: null, isAuthenticated: false });
  },

  switchRole: async (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/auth/dev-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, name: user.name }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.accessToken);
      } else {
        setToken(`mock-token-${user.id}`);
      }
    } catch {
      setToken(`mock-token-${user.id}`);
    }
    set({ user, isAuthenticated: true });
  },
}));

// ---- Helper Functions ----

/**
 * Returns a human-readable label for a given role.
 */
export function getRoleLabel(role: UserRole): string {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

/**
 * Returns Tailwind color classes for role badges.
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-red-500/10 text-red-700 dark:text-red-400',
    system_admin: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
    admin: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    area_manager: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    team_leader: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    operator: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    technician: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
    finance: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    support: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    customer: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
    collector: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    meter_reader: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    inspector: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    supervisor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    accountant: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    viewer: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  };
  return colors[role] ?? 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
}

/**
 * Checks whether a role has permission to access a given navigation href.
 * Supports wildcard patterns like "meters/*" which match the parent
 * path and any child path (e.g. "meters/assign").
 */
export function hasPermission(role: UserRole, href: string): boolean {
  const permissions = rolePermissions[role] ?? [];
  const normalizedHref = href.replace(/^\//, '');

  return permissions.some((perm) => {
    if (perm.endsWith('/*')) {
      const prefix = perm.slice(0, -2); // strip "/*"
      return normalizedHref === prefix || normalizedHref.startsWith(prefix + '/');
    }
    return normalizedHref === perm;
  });
}
