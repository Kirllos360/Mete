'use client';

import { useState } from 'react';
import { mockAlerts } from '@/lib/mock-data';
import { PageHeader, StatCard, formatDateTime } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import SmartTable from '@/components/smart-table/SmartTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Bell, AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const total = alerts.length;
  const critical = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length;
  const high = alerts.filter((a) => a.severity === 'high' && !a.acknowledged).length;
  const medium = alerts.filter((a) => a.severity === 'medium' && !a.acknowledged).length;
  const low = alerts.filter((a) => a.severity === 'low' && !a.acknowledged).length;

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success('Alert acknowledged');
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'type', label: 'Type', width: '140px',
      render: (v: string) => <span className="text-xs font-mono">{v.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'severity', label: 'Severity', sortable: true, width: '100px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'description', label: 'Description', render: (v: string) => <span className="text-xs text-muted-foreground line-clamp-1">{v}</span> },
    { key: 'entityLabel', label: 'Entity', width: '150px', render: (v: string) => <span className="text-xs">{v}</span> },
    { key: 'createdAt', label: 'Date', sortable: true, width: '130px', render: (v: string) => formatDateTime(v) },
    {
      key: 'acknowledged', label: 'Ack', width: '60px',
      render: (v: boolean, row: { id: string }) => v ? (
        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
      ) : (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleAcknowledge(row.id); }}>
          Ack
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="System Alerts" subtitle="Monitor and manage system alerts" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={total} icon={<Bell className="h-5 w-5" />} />
        <StatCard label="Critical" value={critical} icon={<AlertCircle className="h-5 w-5" />} color="text-red-500" />
        <StatCard label="High" value={high} icon={<AlertTriangle className="h-5 w-5" />} color="text-orange-500" />
        <StatCard label="Medium" value={medium} color="text-amber-500" />
        <StatCard label="Low" value={low} icon={<Info className="h-5 w-5" />} color="text-blue-500" />
      </div>

      <SmartTable
        data={alerts}
        columns={columns}
        filters={[
          {
            key: 'severity', label: 'Severity', type: 'select',
            options: [
              { label: 'Critical', value: 'critical' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ],
          },
          {
            key: 'acknowledged', label: 'Acknowledged', type: 'select',
            options: [
              { label: 'No', value: 'false' },
              { label: 'Yes', value: 'true' },
            ],
          },
          {
            key: 'type', label: 'Type', type: 'select',
            options: [
              { label: 'Offline Meter', value: 'offline_meter' },
              { label: 'High Consumption', value: 'high_consumption' },
              { label: 'Zero Consumption', value: 'zero_consumption' },
              { label: 'Water Difference', value: 'water_difference' },
              { label: 'Overdue Invoice', value: 'overdue_invoice' },
              { label: 'Communication Failure', value: 'communication_failure' },
              { label: 'SIM/IP Issue', value: 'sim_ip_issue' },
              { label: 'Missing Reading', value: 'missing_reading' },
            ],
          },
        ]}
        searchKeys={['title', 'description', 'entityLabel']}
        searchPlaceholder="Search alerts..."
      />
    </div>
  );
}
