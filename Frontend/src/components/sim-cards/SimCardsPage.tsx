'use client';

import { mockSimCards } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import SmartTable from '@/components/smart-table/SmartTable';
import { formatDate } from '@/components/shared/PageHelpers';

export default function SimCardsPage() {
  const providers = [...new Set(mockSimCards.map((s) => s.provider))];

  const columns = [
    {
      key: 'iccid', label: 'ICCID', sortable: true,
      render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 12)}...{v.slice(-4)}</span>,
    },
    { key: 'msisdn', label: 'MSISDN', sortable: true },
    { key: 'ipAddress', label: 'IP Address', sortable: true, render: (v: string) => v || '-' },
    {
      key: 'ipType', label: 'IP Type', width: '90px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'provider', label: 'Provider', sortable: true },
    {
      key: 'assignedMeterSerial', label: 'Assigned Meter',
      render: (v: string) => v ? <span className="font-mono text-xs">{v}</span> : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'status', label: 'Status', sortable: true, width: '110px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'assignmentStartDate', label: 'Assignment Start', width: '130px',
      render: (v: string) => formatDate(v),
    },
  ];

  return (
    <div>
      <PageHeader title="SIM Cards & IP Addresses" subtitle="Manage SIM cards and IP assignments for meters" />
      <SmartTable
        data={mockSimCards}
        columns={columns}
        filters={[
          {
            key: 'provider', label: 'Provider', type: 'select',
            options: providers.map((p) => ({ label: p, value: p })),
          },
          {
            key: 'status', label: 'Status', type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Available', value: 'available' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'Reusable', value: 'reusable' },
              { label: 'Retired', value: 'retired' },
            ],
          },
          {
            key: 'assigned', label: 'Assignment', type: 'select',
            options: [
              { label: 'Assigned', value: 'assigned' },
              { label: 'Unassigned', value: 'unassigned' },
            ],
          },
        ]}
        searchKeys={['iccid', 'msisdn', 'ipAddress', 'provider', 'assignedMeterSerial']}
        searchPlaceholder="Search SIM cards..."
      />
    </div>
  );
}
