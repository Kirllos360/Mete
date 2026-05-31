'use client';

import { Plus, MoreHorizontal, Eye, Pencil, CreditCard, Download, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { usePageStore } from '@/lib/router-store';
import { mockInvoices, mockProjects } from '@/lib/mock-data';
import SmartTable from '@/components/smart-table/SmartTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader, formatCurrency, formatDate } from '@/components/shared/PageHelpers';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const { navigate } = usePageStore();

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'projectName', label: 'Project' },
    { key: 'unitNumber', label: 'Unit', width: '80px', render: (v: string) => v || '-' },
    {
      key: 'meterSerial', label: 'Meter', width: '140px',
      render: (v: string) => <span className="font-mono text-xs">{v}</span>,
    },
    {
      key: 'meterType', label: 'Type', width: '110px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'billingPeriodStart', label: 'Period', width: '170px',
      render: (v: string, row: { billingPeriodEnd: string }) => <span className="text-xs">{formatDate(v)} - {formatDate(row.billingPeriodEnd)}</span>,
    },
    { key: 'consumption', label: 'Usage', width: '70px' },
    { key: 'tariff', label: 'Tariff', width: '70px', render: (v: number) => v.toFixed(2) },
    { key: 'subtotal', label: 'Subtotal', width: '90px', render: (v: number) => formatCurrency(v) },
    { key: 'tax', label: 'Tax', width: '80px', render: (v: number) => formatCurrency(v) },
    {
      key: 'total', label: 'Total', width: '100px',
      render: (v: number) => <span className="font-medium">{formatCurrency(v)}</span>,
    },
    { key: 'paidAmount', label: 'Paid', width: '100px', render: (v: number) => formatCurrency(v) },
    {
      key: 'remainingAmount', label: 'Remaining', width: '100px',
      render: (v: number) => <span className={cn(v > 0 ? 'text-red-500' : 'text-emerald-500')}>{formatCurrency(v)}</span>,
    },
    { key: 'invoiceDate', label: 'Date', width: '90px', sortable: true, render: (v: string) => formatDate(v) },
    { key: 'dueDate', label: 'Due', width: '90px', render: (v: string) => formatDate(v) },
    {
      key: 'status', label: 'Status', sortable: true, width: '120px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'actions', label: '', width: '50px',
      render: (_val: unknown, row: { id: string; invoiceNumber: string; status: string }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('invoice-detail', { id: row.id }); }}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
            {row.status === 'draft' && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Edit invoice'); }}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>}
            {row.status === 'draft' && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Invoice issued'); }}><CreditCard className="h-4 w-4 mr-2" /> Issue</DropdownMenuItem>}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Record payment'); }}><CreditCard className="h-4 w-4 mr-2" /> Record Payment</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Download PDF placeholder'); }}><Download className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem>
            {row.status === 'draft' && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Invoice cancelled'); }} className="text-red-500"><XCircle className="h-4 w-4 mr-2" /> Cancel</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Manage billing invoices and payments"
        action={
          <Button className="gap-2" onClick={() => toast.info('Create Invoice dialog would open')}>
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        }
      />
      <SmartTable
        data={mockInvoices}
        columns={columns}
        filters={[
          {
            key: 'status', label: 'Status', type: 'select',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Issued', value: 'issued' },
              { label: 'Partially Paid', value: 'partially_paid' },
              { label: 'Paid', value: 'paid' },
              { label: 'Overdue', value: 'overdue' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
          {
            key: 'projectId', label: 'Project', type: 'select',
            options: mockProjects.map((p) => ({ label: p.name, value: p.id })),
          },
          {
            key: 'meterType', label: 'Meter Type', type: 'select',
            options: [
              { label: 'Electricity', value: 'electricity' },
              { label: 'Main Water', value: 'main_water' },
              { label: 'Child Water', value: 'child_water' },
            ],
          },
          {
            key: 'overdue', label: 'Overdue Only', type: 'select',
            options: [
              { label: 'Yes', value: 'overdue' },
            ],
          },
        ]}
        searchKeys={['invoiceNumber', 'customerName', 'projectName', 'meterSerial']}
        searchPlaceholder="Search invoices..."
        onRowClick={(row) => navigate('invoice-detail', { id: row.id })}
      />
    </div>
  );
}
