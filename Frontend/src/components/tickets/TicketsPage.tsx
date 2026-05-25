'use client';

import { useState } from 'react';
import { mockTickets } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import SmartTable from '@/components/smart-table/SmartTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Plus, LayoutList, Table2 } from 'lucide-react';
import { formatDateTime } from '@/components/shared/PageHelpers';

const statusColumns = [
  { status: 'open', label: 'Open', color: 'border-slate-500/30' },
  { status: 'in_progress', label: 'In Progress', color: 'border-amber-500/30' },
  { status: 'waiting', label: 'Waiting', color: 'border-amber-500/30' },
  { status: 'resolved', label: 'Resolved', color: 'border-emerald-500/30' },
  { status: 'closed', label: 'Closed', color: 'border-slate-500/30' },
];

export default function TicketsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    { key: 'ticketNumber', label: '#', sortable: true, width: '130px', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'customerName', label: 'Customer', render: (v: string) => v || '-' },
    { key: 'meterSerial', label: 'Meter', width: '140px', render: (v: string) => v ? <span className="font-mono text-xs">{v}</span> : '-' },
    {
      key: 'priority', label: 'Priority', sortable: true, width: '100px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'assigneeName', label: 'Assignee', width: '130px', render: (v: string) => v || '-' },
    { key: 'createdAt', label: 'Created', sortable: true, width: '130px', render: (v: string) => formatDateTime(v) },
    {
      key: 'status', label: 'Status', sortable: true, width: '110px',
      render: (v: string) => <StatusBadge status={v} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Support Tickets"
        subtitle="Manage support tickets and issues"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Create Ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Ticket</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                  <Input placeholder="Ticket subject" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                  <Textarea placeholder="Describe the issue..." rows={3} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => { toast.success('Ticket created!'); setDialogOpen(false); }}>
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <Button variant={view === 'kanban' ? 'default' : 'outline'} size="sm" className="gap-1" onClick={() => setView('kanban')}>
          <LayoutList className="h-4 w-4" /> Kanban
        </Button>
        <Button variant={view === 'table' ? 'default' : 'outline'} size="sm" className="gap-1" onClick={() => setView('table')}>
          <Table2 className="h-4 w-4" /> Table
        </Button>
      </div>

      {view === 'table' ? (
        <SmartTable
          data={mockTickets}
          columns={columns}
          filters={[
            { key: 'status', label: 'Status', type: 'select', options: statusColumns.map((s) => ({ label: s.label, value: s.status })) },
            { key: 'priority', label: 'Priority', type: 'select', options: [
              { label: 'Critical', value: 'critical' }, { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' },
            ]},
          ]}
          searchKeys={['ticketNumber', 'subject', 'customerName', 'assigneeName']}
          searchPlaceholder="Search tickets..."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statusColumns.map((col) => {
            const tickets = mockTickets.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className={cn('rounded-xl border p-4 min-h-[300px]', col.color, 'glass-card')}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <span className="text-xs bg-muted rounded-full px-2 py-0.5">{tickets.length}</span>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="border-border/50 bg-background/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{ticket.ticketNumber}</span>
                          <StatusBadge status={ticket.priority} />
                        </div>
                        <p className="text-sm font-medium line-clamp-2 mb-2">{ticket.subject}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{ticket.customerName || '-'}</span>
                          <span>{ticket.assigneeName || '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {tickets.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No tickets</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
