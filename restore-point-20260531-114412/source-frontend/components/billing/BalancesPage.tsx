'use client';

import { mockBalances } from '@/lib/mock-data';
import { PageHeader, StatCard, formatCurrency } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import SmartTable from '@/components/smart-table/SmartTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Scale, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function BalancesPage() {
  const totalInvoiced = mockBalances.reduce((s, b) => s + b.totalInvoiced, 0);
  const totalPaid = mockBalances.reduce((s, b) => s + b.totalPaid, 0);
  const outstanding = mockBalances.reduce((s, b) => s + b.outstandingBalance, 0);
  const aging0 = mockBalances.reduce((s, b) => s + b.aging0_30, 0);
  const aging31 = mockBalances.reduce((s, b) => s + b.aging31_60, 0);
  const aging61 = mockBalances.reduce((s, b) => s + b.aging61_90, 0);
  const aging90 = mockBalances.reduce((s, b) => s + b.aging90plus, 0);

  const agingData = mockBalances
    .filter((b) => b.outstandingBalance > 0)
    .slice(0, 6)
    .map((b) => ({
      name: b.customerName.split(' ')[0],
      '0-30': b.aging0_30,
      '31-60': b.aging31_60,
      '61-90': b.aging61_90,
      '90+': b.aging90plus,
    }));

  const columns = [
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'customerCode', label: 'Code', width: '120px' },
    { key: 'projectName', label: 'Project' },
    { key: 'totalInvoiced', label: 'Invoiced', width: '120px', render: (v: number) => formatCurrency(v) },
    { key: 'totalPaid', label: 'Paid', width: '110px', render: (v: number) => <span className="text-emerald-500">{formatCurrency(v)}</span> },
    {
      key: 'outstandingBalance', label: 'Outstanding', sortable: true, width: '120px',
      render: (v: number) => (
        <span className={cn('font-medium', v > 0 ? 'text-red-500' : v < 0 ? 'text-blue-500' : 'text-emerald-500')}>
          {formatCurrency(Math.abs(v))}
          {v < 0 ? ' CR' : ''}
        </span>
      ),
    },
    {
      key: 'state', label: 'State', width: '90px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'aging0_30', label: '0-30 Days', width: '100px', render: (v: number) => v > 0 ? formatCurrency(v) : '-' },
    { key: 'aging31_60', label: '31-60 Days', width: '100px', render: (v: number) => v > 0 ? formatCurrency(v) : '-' },
    { key: 'aging61_90', label: '61-90 Days', width: '100px', render: (v: number) => v > 0 ? formatCurrency(v) : '-' },
    { key: 'aging90plus', label: '90+ Days', width: '100px', render: (v: number) => v > 0 ? <span className="text-red-500">{formatCurrency(v)}</span> : '-' },
  ];

  return (
    <div>
      <PageHeader title="Customer Balances" subtitle="View outstanding balances and aging analysis" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Invoiced" value={formatCurrency(totalInvoiced)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<Scale className="h-5 w-5" />} color="text-emerald-500" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={<AlertTriangle className="h-5 w-5" />} color="text-red-500" />
        <StatCard label="Aging 0-30" value={formatCurrency(aging0)} color="text-amber-500" />
        <StatCard label="Aging 31-60" value={formatCurrency(aging31)} color="text-orange-500" />
        <StatCard label="Aging 61-90" value={formatCurrency(aging61)} color="text-red-500" />
        <StatCard label="Aging 90+" value={formatCurrency(aging90)} color="text-red-600" />
      </div>

      {/* Aging Chart */}
      <Card className="glass-card border-border/50 mb-6">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Aging by Customer</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="0-30" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="31-60" stackId="a" fill="#f97316" />
              <Bar dataKey="61-90" stackId="a" fill="#ef4444" />
              <Bar dataKey="90+" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <SmartTable
        data={mockBalances}
        columns={columns}
        searchKeys={['customerName', 'customerCode', 'projectName']}
        searchPlaceholder="Search balances..."
      />
    </div>
  );
}
