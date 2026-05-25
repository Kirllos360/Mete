'use client';

import React from 'react';
import { Construction } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { usePageStore } from '@/lib/router-store';
import { getPageTitle } from '@/lib/navigation';
import { cn } from '@/lib/utils';

// Map page keys to their href paths
const pageHrefMap: Record<string, string> = {
  dashboard: '/dashboard',
  projects: '/projects',
  project_detail: '/projects',
  locations: '/locations',
  customers: '/customers',
  customer_detail: '/customers',
  meters: '/meters',
  meter_detail: '/meters',
  meter_assign: '/meters/assign',
  meter_replace: '/meters/replace',
  meter_terminate: '/meters/terminate',
  sim_cards: '/sim-cards',
  readings: '/readings',
  reading_new: '/readings/new',
  consumption: '/consumption',
  water_balance: '/water-balance',
  invoices: '/invoices',
  invoice_detail: '/invoices',
  payments: '/payments',
  balances: '/balances',
  reports: '/reports',
  alerts: '/alerts',
  tickets: '/tickets',
  support: '/support',
  settings: '/settings',
};

interface PagePlaceholderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PagePlaceholder({ title, subtitle, className }: PagePlaceholderProps) {
  const currentPage = usePageStore((s) => s.currentPage);

  const href = pageHrefMap[currentPage] ?? '/dashboard';
  const pageInfo = getPageTitle(href);

  const displayTitle = title ?? pageInfo.title;
  const displaySubtitle = subtitle ?? pageInfo.subtitle;

  return (
    <div className={cn('flex flex-col gap-6 animate-fade-in', className)}>
      <PageHeader title={displayTitle} subtitle={displaySubtitle} />

      <div className="flex items-center justify-center py-16">
        <div className="glass-card rounded-xl p-8 max-w-md w-full text-center neon-border animate-slide-up">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Construction className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-sm text-muted-foreground">
            The <span className="text-primary font-medium">{displayTitle}</span> page is under construction.
            Check back later for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
