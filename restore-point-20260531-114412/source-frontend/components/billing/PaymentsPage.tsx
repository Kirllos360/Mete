'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { mockPayments, mockCustomers } from '@/lib/mock-data';
import SmartTable from '@/components/smart-table/SmartTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader, formatCurrency, formatDate } from '@/components/shared/PageHelpers';

export default function PaymentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    { key: 'paymentNumber', label: 'Payment #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'paymentDate', label: 'Date', sortable: true, width: '110px', render: (v: string) => formatDate(v) },
    {
      key: 'method', label: 'Method', width: '130px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    {
      key: 'amount', label: 'Amount', sortable: true, width: '110px',
      render: (v: number) => <span className="font-medium">{formatCurrency(v)}</span>,
    },
    { key: 'collectedBy', label: 'Collected By', width: '130px' },
    {
      key: 'status', label: 'Status', width: '110px',
      render: (v: string) => <StatusBadge status={v} />,
    },
    { key: 'notes', label: 'Notes', render: (v: string) => v ? <span className="text-xs text-muted-foreground">{v}</span> : '-' },
    {
      key: 'actions', label: '', width: '50px',
      render: (_val: unknown) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('View payment'); }}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Edit payment'); }}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Delete payment'); }} className="text-red-500"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track and manage payment collections"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Customer</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Method</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="online_payment">Online Payment</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
                  <Textarea placeholder="Optional notes..." rows={2} />
                </div>
                <Button className="w-full" onClick={() => { toast.success('Payment recorded!'); setDialogOpen(false); }}>
                  Record Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <SmartTable
        data={mockPayments}
        columns={columns}
        filters={[
          {
            key: 'method', label: 'Method', type: 'select',
            options: [
              { label: 'Cash', value: 'cash' },
              { label: 'Bank Transfer', value: 'bank_transfer' },
              { label: 'Card', value: 'card' },
              { label: 'Online Payment', value: 'online_payment' },
              { label: 'Cheque', value: 'cheque' },
              { label: 'Mobile Wallet', value: 'mobile_wallet' },
            ],
          },
          {
            key: 'status', label: 'Status', type: 'select',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Reversed', value: 'reversed' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ]}
        searchKeys={['paymentNumber', 'customerName', 'invoiceNumber', 'collectedBy']}
        searchPlaceholder="Search payments..."
      />
    </div>
  );
}
