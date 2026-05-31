'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPageTitle } from '@/lib/navigation';
import { usePageStore, type PageKey } from '@/lib/router-store';

// Map page keys to their href paths for breadcrumb generation
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

// Map page keys to parent page keys for breadcrumbs
const parentMap: Partial<Record<PageKey, PageKey>> = {
  project_detail: 'projects',
  customer_detail: 'customers',
  meter_detail: 'meters',
  meter_assign: 'meters',
  meter_replace: 'meters',
  meter_terminate: 'meters',
  reading_new: 'readings',
  invoice_detail: 'invoices',
};

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  const currentPage = usePageStore((s) => s.currentPage);
  const navigate = usePageStore((s) => s.navigate);

  const href = pageHrefMap[currentPage] ?? '/dashboard';
  const pageInfo = getPageTitle(href);

  const displayTitle = title ?? pageInfo.title;
  const displaySubtitle = subtitle ?? pageInfo.subtitle;

  // Build breadcrumb segments
  const parent = parentMap[currentPage];
  const parentHref = parent ? (pageHrefMap[parent] ?? `/${parent}`) : null;
  const parentInfo = parent ? getPageTitle(parentHref) : null;

  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-col gap-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <button
            onClick={() => navigate('dashboard')}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          {parent && parentInfo && (
            <>
              <ChevronRight className="size-3.5" />
              <button
                onClick={() => navigate(parent)}
                className="hover:text-foreground transition-colors"
              >
                {parentInfo.title}
              </button>
            </>
          )}
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{displayTitle}</span>
        </nav>
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{displayTitle}</h1>
          {displaySubtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{displaySubtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
}
