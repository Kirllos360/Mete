'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Eye, Pencil, AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { usePageStore } from '@/lib/router-store';
import { mockReadings } from '@/lib/mock-data';
import SmartTable from '@/components/smart-table/SmartTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader, formatDate, formatDateTime } from '@/components/shared/PageHelpers';
import { QueryBoundary } from '@/components/shared/QueryBoundary';
import { useReadingsList } from '@/hooks/use-readings';

export default function ReadingsPage() {
  const { navigate } = usePageStore();
  const [tab, setTab] = useState<'all' | 'review'>('all');
  const { data: apiReadings, isLoading, isError, error } = useReadingsList();
  const readings = apiReadings ?? mockReadings;
  const reviewQueue = readings.filter(r => r.status === 'pending_review' || r.status === 'suspicious');

  const columns = [
    {
      key: 'meterSerial', label: 'Meter Serial', sortable: true,
      render: (v: string) => <span className="font-mono text-xs">{v}</span>,
    },
    {
      key: 'meterType', label: 'Type', width: '120px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'customerName', label: 'Customer', render: (v: string) => v || '-' },
    { key: 'unitNumber', label: 'Unit', width: '90px', render: (v: string) => v || '-' },
    { key: 'previousReading', label: 'Previous', width: '100px' },
    { key: 'currentReading', label: 'Current', width: '90px' },
    { key: 'consumption', label: 'Consumption', width: '110px' },
    { key: 'readingDate', label: 'Date', sortable: true, width: '110px', render: (v: string) => formatDate(v) },
    {
      key: 'source', label: 'Source', width: '100px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'status', label: 'Status', width: '120px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'anomaly', label: '', width: '40px',
      render: (v: boolean) => v ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : null,
    },
    { key: 'enteredBy', label: 'Entered By', width: '110px' },
    {
      key: 'actions', label: '', width: '50px',
      render: (_val: unknown, row: { id: string }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('View reading details'); }}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Edit reading'); }}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Meter Readings"
        subtitle="View and manage all meter readings"
        action={
          <Button className="gap-2" onClick={() => navigate('reading-new')}>
            <Plus className="h-4 w-4" /> New Reading
          </Button>
        }
      />
      <div className="flex gap-2 mb-4 border-b border-border">
        <button onClick={() => setTab('all')} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${tab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>All Readings</button>
        <button onClick={() => setTab('review')} className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${tab === 'review' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'} flex items-center gap-1`}>Review Queue {reviewQueue.length > 0 && <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5">{reviewQueue.length}</span>}</button>
      </div>
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <SmartTable
        data={tab === 'review' ? reviewQueue : readings}
        columns={columns}
        filters={[
          {
            key: 'meterType', label: 'Meter Type', type: 'select',
            options: [
              { label: 'Electricity', value: 'electricity' },
              { label: 'Main Water', value: 'main_water' },
              { label: 'Child Water', value: 'child_water' },
            ],
          },
          {
            key: 'status', label: 'Status', type: 'select',
            options: [
              { label: 'Valid', value: 'valid' },
              { label: 'Pending Review', value: 'pending_review' },
              { label: 'Estimated', value: 'estimated' },
              { label: 'Suspicious', value: 'suspicious' },
              { label: 'Corrected', value: 'corrected' },
              { label: 'Rejected', value: 'rejected' },
            ],
          },
          {
            key: 'source', label: 'Source', type: 'select',
            options: [
              { label: 'Automated', value: 'automated' },
              { label: 'Manual', value: 'manual' },
              { label: 'Estimated', value: 'estimated' },
            ],
          },
          {
            key: 'projectId', label: 'Project', type: 'select',
            options: mockProjects.map((p) => ({ label: p.name, value: p.id })),
          },
          {
            key: 'anomaly', label: 'Anomaly Only', type: 'select',
            options: [
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ],
          },
        ]}
        searchKeys={['meterSerial', 'customerName', 'unitNumber', 'enteredBy']}
        searchPlaceholder="Search readings..."
      />
      </QueryBoundary>
    </div>
  );
}
