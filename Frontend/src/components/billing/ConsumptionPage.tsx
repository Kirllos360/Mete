'use client';

import { useState } from 'react';
import { mockConsumptionData, mockProjects } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared/PageHelpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SmartTable from '@/components/smart-table/SmartTable';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const highConsumption = [
  { meter: 'EM-2024-0015', customer: 'Port Said Fisheries', consumption: 2000, type: 'Electricity' },
  { meter: 'CW-2024-0004', customer: 'Tarek Nabil', consumption: 1000, type: 'Water' },
  { meter: 'EM-2024-0010', customer: 'Delta Consulting', consumption: 800, type: 'Electricity' },
];

const zeroConsumption = [
  { meter: 'EM-2024-0013', customer: 'Khaled Mansour', consumption: 0, type: 'Electricity' },
];

const missingReadings = [
  { meter: 'EM-2024-0007', customer: 'Dina Shop', lastReading: '2025-01-15', daysAgo: 5 },
  { meter: 'EM-2024-0006', customer: 'El-Masry Trading', lastReading: '2025-01-13', daysAgo: 7 },
];

export default function ConsumptionPage() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div>
      <PageHeader title="Consumption Analytics" subtitle="Monitor and analyze consumption trends" />

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {['daily', 'monthly', 'custom'].map((p) => (
          <Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p)}>
            {p === 'daily' ? 'Daily' : p === 'monthly' ? 'Monthly' : 'Custom Range'}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Electricity Chart */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Electricity Consumption</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="kWh" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Water Chart */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Water Consumption</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Liters" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* By Project */}
      <Card className="glass-card border-border/50 mb-6">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Consumption by Project</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockProjects.slice(0, 5).map((p) => ({ name: p.code, electricity: Math.floor(Math.random() * 50000 + 20000), water: Math.floor(Math.random() * 20000 + 5000) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="electricity" fill="#f59e0b" name="Electricity" radius={[4, 4, 0, 0]} />
              <Bar dataKey="water" fill="#3b82f6" name="Water" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-500">High Consumption</CardTitle></CardHeader>
          <CardContent>
            <SmartTable
              data={highConsumption}
              columns={[
                { key: 'meter', label: 'Meter', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
                { key: 'customer', label: 'Customer' },
                { key: 'consumption', label: 'Usage', width: '80px' },
              ]}
              compact
              searchable={false}
              pageSize={5}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-400">Zero Consumption</CardTitle></CardHeader>
          <CardContent>
            <SmartTable
              data={zeroConsumption}
              columns={[
                { key: 'meter', label: 'Meter', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
                { key: 'customer', label: 'Customer' },
              ]}
              compact
              searchable={false}
              pageSize={5}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-500">Missing Readings</CardTitle></CardHeader>
          <CardContent>
            <SmartTable
              data={missingReadings}
              columns={[
                { key: 'meter', label: 'Meter', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
                { key: 'customer', label: 'Customer' },
                { key: 'lastReading', label: 'Last Reading', width: '110px' },
                { key: 'daysAgo', label: 'Days Ago', width: '80px' },
              ]}
              compact
              searchable={false}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
