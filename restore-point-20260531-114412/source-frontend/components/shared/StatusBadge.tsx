'use client';

import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-500',
  confirmed: 'bg-emerald-500/15 text-emerald-500',
  paid: 'bg-emerald-500/15 text-emerald-500',
  valid: 'bg-emerald-500/15 text-emerald-500',
  resolved: 'bg-emerald-500/15 text-emerald-500',
  offline: 'bg-red-500/15 text-red-500',
  overdue: 'bg-red-500/15 text-red-500',
  rejected: 'bg-slate-500/15 text-slate-400',
  cancelled: 'bg-slate-500/15 text-slate-400',
  closed: 'bg-slate-500/15 text-slate-400',
  draft: 'bg-slate-500/15 text-slate-400',
  available: 'bg-blue-500/15 text-blue-500',
  assigned: 'bg-blue-500/15 text-blue-500',
  issued: 'bg-amber-500/15 text-amber-500',
  in_progress: 'bg-amber-500/15 text-amber-500',
  partially_paid: 'bg-amber-500/15 text-amber-500',
  medium: 'bg-amber-500/15 text-amber-500',
  waiting: 'bg-amber-500/15 text-amber-500',
  faulty: 'bg-orange-500/15 text-orange-500',
  suspicious: 'bg-orange-500/15 text-orange-500',
  corrected: 'bg-orange-500/15 text-orange-500',
  replaced: 'bg-orange-500/15 text-orange-500',
  critical: 'bg-red-500/15 text-red-500',
  terminated: 'bg-rose-500/15 text-rose-500',
  suspended: 'bg-rose-500/15 text-rose-500',
  reversed: 'bg-rose-500/15 text-rose-500',
  retired: 'bg-blue-500/15 text-blue-400',
  pending: 'bg-slate-500/15 text-slate-400',
  pending_review: 'bg-amber-500/15 text-amber-500',
  estimated: 'bg-blue-500/15 text-blue-500',
  open: 'bg-slate-500/15 text-slate-400',
  reusable: 'bg-blue-500/15 text-blue-500',
  old: 'bg-slate-500/15 text-slate-400',
  low: 'bg-blue-500/15 text-blue-400',
  high: 'bg-orange-500/15 text-orange-500',
  inactive: 'bg-slate-500/15 text-slate-400',
  completed: 'bg-blue-500/15 text-blue-500',
  archived: 'bg-amber-500/15 text-amber-500',
  occupied: 'bg-emerald-500/15 text-emerald-500',
  vacant: 'bg-slate-500/15 text-slate-400',
  maintenance: 'bg-amber-500/15 text-amber-500',
  residential: 'bg-emerald-500/15 text-emerald-500',
  commercial: 'bg-blue-500/15 text-blue-500',
  government: 'bg-violet-500/15 text-violet-500',
  industrial: 'bg-orange-500/15 text-orange-500',
  positive: 'bg-red-500/15 text-red-500',
  zero: 'bg-emerald-500/15 text-emerald-500',
  credit: 'bg-blue-500/15 text-blue-500',
  electricity: 'bg-amber-500/15 text-amber-500',
  main_water: 'bg-blue-500/15 text-blue-500',
  child_water: 'bg-cyan-500/15 text-cyan-500',
  static: 'bg-emerald-500/15 text-emerald-500',
  dynamic: 'bg-amber-500/15 text-amber-500',
  cash: 'bg-emerald-500/15 text-emerald-500',
  bank_transfer: 'bg-blue-500/15 text-blue-500',
  card: 'bg-violet-500/15 text-violet-500',
  online_payment: 'bg-cyan-500/15 text-cyan-500',
  cheque: 'bg-amber-500/15 text-amber-500',
  mobile_wallet: 'bg-pink-500/15 text-pink-500',
  manual: 'bg-amber-500/15 text-amber-500',
  automated: 'bg-blue-500/15 text-blue-500',
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const display = label || status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const color = statusColors[status] || 'bg-slate-500/15 text-slate-400';
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', color)}>
      {display}
    </span>
  );
}

export function getStatusColor(status: string): string {
  return statusColors[status] || 'bg-slate-500/15 text-slate-400';
}
