'use client';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { usePageStore } from '@/lib/router-store';
import { PageHeader, StatCard, formatCurrency } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/context';
import { Users, Gauge, Activity, Bell, Receipt, TrendingUp, Scale, DollarSign, ArrowUpRight, Building2, Droplets, Zap, Sun, Thermometer, Shield } from 'lucide-react';

export default function ExecutiveDashboard() {
  const t = useT();
  const { navigate } = usePageStore();
  const { data: coll } = useQuery({ queryKey: ['coll-dash'], queryFn: () => apiGet<any>('/collections/dashboard') });
  const { data: aging } = useQuery({ queryKey: ['coll-aging'], queryFn: () => apiGet<any>('/collections/aging') });
  const { data: meters } = useQuery({ queryKey: ['meters'], queryFn: () => apiGet<any[]>('/meters') });
  const metersList = meters ?? [];
  const c = coll ?? {};
  const a = aging ?? {};

  const activeMeters = metersList.filter((m: any) => m.status === 'active').length;
  const offlineMeters = metersList.filter((m: any) => m.status === 'offline').length;

  return (
    <div>
      <PageHeader title="Executive Dashboard" subtitle="CEO-level platform overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Collection Rate" value={`${c.collectionRate ?? 0}%`} icon={<TrendingUp className="h-5 w-5" />} onClick={() => navigate('collections')} />
        <StatCard label="Outstanding" value={formatCurrency(c.outstanding ?? 0)} icon={<Scale className="h-5 w-5" />} onClick={() => navigate('collections')} />
        <StatCard label="Monthly Collections" value={formatCurrency(c.monthCollections ?? 0)} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Today" value={formatCurrency(c.todayCollections ?? 0)} icon={<ArrowUpRight className="h-5 w-5" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-sm">Aging Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Current</span><span className="font-mono">{formatCurrency(a.current ?? 0)}</span></div>
              <div className="flex justify-between"><span>1-30 Days</span><span className="font-mono">{formatCurrency(a.days1to30 ?? 0)}</span></div>
              <div className="flex justify-between"><span>31-60 Days</span><span className="font-mono">{formatCurrency(a.days31to60 ?? 0)}</span></div>
              <div className="flex justify-between"><span>61-90 Days</span><span className="font-mono">{formatCurrency(a.days61to90 ?? 0)}</span></div>
              <div className="flex justify-between"><span>120+ Days</span><span className="font-mono text-red-500">{formatCurrency(a.days120plus ?? 0)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-sm">Meter Health</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Total Meters</span><span>{metersList.length}</span></div>
              <div className="flex justify-between"><span>Active</span><span className="text-emerald-500">{activeMeters}</span></div>
              <div className="flex justify-between"><span>Offline</span><span className="text-red-500">{offlineMeters}</span></div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('meters')}>View All Meters</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
