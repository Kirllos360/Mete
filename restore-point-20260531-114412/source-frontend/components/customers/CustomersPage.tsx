'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { usePageStore } from '@/lib/router-store';
import { mockCustomers, mockProjects } from '@/lib/mock-data';
import SmartTable from '@/components/smart-table/SmartTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader } from '@/components/shared/PageHelpers';
import { QueryBoundary } from '@/components/shared/QueryBoundary';
import { cn } from '@/lib/utils';
import { useProjectsList } from '@/hooks/use-projects';
import { useCustomersList } from '@/hooks/use-customers';

export default function CustomersPage() {
  const { navigate } = usePageStore();
  const [projectFilter, setProjectFilter] = useState<string>('');
  const { data: apiProjects, isLoading, isError, error } = useProjectsList();
  const projects = apiProjects ?? mockProjects;
  const { data: apiCustomers } = useCustomersList(projectFilter);
  const customers = apiCustomers ?? mockCustomers;

  const columns = [
    { key: 'code', label: 'Code', sortable: true, width: '120px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone', width: '140px' },
    { key: 'email', label: 'Email', render: (v: string) => <span className="text-xs">{v}</span> },
    {
      key: 'customerType', label: 'Type', sortable: true, width: '120px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'projectName', label: 'Project', sortable: true },
    { key: 'activeMeters', label: 'Meters', width: '80px' },
    {
      key: 'currentBalance', label: 'Balance', sortable: true, width: '110px',
      render: (v: number) => (
        <span className={cn(v > 0 ? 'text-red-500' : v < 0 ? 'text-blue-500' : 'text-emerald-500', 'font-medium')}>
          {v.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true, width: '100px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'actions', label: 'Actions', width: '60px',
      render: (_val: unknown, row: { id: string; name: string }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('customer-detail', { id: row.id }); }}>
              <Eye className="h-4 w-4 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Edit customer: ' + row.name); }}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Delete customer: ' + row.name); }} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage customer accounts and billing"
        action={
          <Button className="gap-2" onClick={() => toast.info('Add Customer dialog would open')}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        }
      />
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      {/* Project Selector */}
      <div className="mb-4">
        <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v)}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SmartTable
        data={customers}
        columns={columns}
        filters={[
          {
            key: 'balanceState', label: 'Balance', type: 'select',
            options: [
              { label: 'Positive (Owed)', value: 'positive' },
              { label: 'Zero', value: 'zero' },
              { label: 'Credit', value: 'credit' },
            ],
          },
          {
            key: 'status', label: 'Status', type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Suspended', value: 'suspended' },
            ],
          },
        ]}
        searchKeys={['name', 'code', 'phone', 'email']}
        searchPlaceholder="Search customers..."
        onRowClick={(row) => navigate('customer-detail', { id: row.id })}
      />
      </QueryBoundary>
    </div>
  );
}
