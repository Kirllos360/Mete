'use client';

import { usePageStore } from '@/lib/router-store';
import { mockCustomers, mockInvoices, mockMeters, mockUnits } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackButton, StatCard, formatCurrency, formatDate } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import SmartTable from '@/components/smart-table/SmartTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Gauge, CreditCard } from 'lucide-react';

export default function CustomerDetailPage() {
  const { pageParams } = usePageStore();
  const customer = mockCustomers.find((c) => c.id === pageParams.id);

  if (!customer) {
    return (
      <div>
        <BackButton fallback="customers" />
        <p className="text-muted-foreground">Customer not found.</p>
      </div>
    );
  }

  const invoices = mockInvoices.filter((i) => i.customerId === customer.id);
  const meters = mockMeters.filter((m) => m.customerId === customer.id);
  const customerUnits = mockUnits.filter((u) => customer.units.includes(u.id));

  return (
    <div>
      <BackButton fallback="customers" />

      {/* Header */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <StatusBadge status={customer.status} />
              <StatusBadge status={customer.customerType} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{customer.code}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {customer.projectName}</span>
            </div>
            {customer.address && <p className="text-xs text-muted-foreground mt-1">{customer.address}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Meters" value={customer.activeMeters} icon={<Gauge className="h-5 w-5" />} />
        <StatCard label="Total Paid" value={formatCurrency(customer.totalPaid)} icon={<CreditCard className="h-5 w-5" />} color="text-emerald-500" />
        <StatCard
          label="Current Balance"
          value={formatCurrency(customer.currentBalance)}
          icon={<CreditCard className="h-5 w-5" />}
          color={customer.currentBalance > 0 ? 'text-red-500' : customer.currentBalance < 0 ? 'text-blue-500' : 'text-emerald-500'}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="meters">Meters</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Customer Info</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Code</span><span>{customer.code}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><StatusBadge status={customer.customerType} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Project</span><span>{customer.projectName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{formatDate(customer.createdAt)}</span></div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Assigned Units</CardTitle></CardHeader>
              <CardContent>
                {customerUnits.length > 0 ? (
                  <div className="space-y-2">
                    {customerUnits.map((u) => (
                      <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 text-sm">
                        <span className="font-medium">{u.unitNumber}</span>
                        <span className="text-muted-foreground text-xs">{u.buildingId.replace('BLD-', '')} · Floor {u.floorNumber}</span>
                        <StatusBadge status={u.status} />
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">No assigned units</p>}
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50 md:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Invoices</CardTitle></CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <div className="space-y-2">
                    {invoices.slice(0, 5).map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 text-sm">
                        <div>
                          <span className="font-medium">{inv.invoiceNumber}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{formatDate(inv.invoiceDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{formatCurrency(inv.total)}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">No invoices</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="units">
          <SmartTable
            data={customerUnits}
            columns={[
              { key: 'unitNumber', label: 'Unit', sortable: true },
              { key: 'unitType', label: 'Type', render: (v: string) => <StatusBadge status={v} /> },
              { key: 'floorNumber', label: 'Floor', width: '80px' },
              { key: 'status', label: 'Status', width: '100px', render: (v: string) => <StatusBadge status={v} /> },
            ]}
            searchPlaceholder="Search units..."
          />
        </TabsContent>

        <TabsContent value="meters">
          <SmartTable
            data={meters}
            columns={[
              { key: 'serialNumber', label: 'Serial', sortable: true },
              { key: 'meterType', label: 'Type', width: '120px', render: (v: string) => <StatusBadge status={v} /> },
              { key: 'brand', label: 'Brand' },
              { key: 'lastReading', label: 'Last Reading', width: '120px', render: (v: number) => v ? v.toLocaleString() : '-' },
              { key: 'status', label: 'Status', width: '100px', render: (v: string) => <StatusBadge status={v} /> },
            ]}
            searchPlaceholder="Search meters..."
            searchKeys={['serialNumber', 'brand']}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <SmartTable
            data={invoices}
            columns={[
              { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
              { key: 'billingPeriodStart', label: 'Period', width: '180px', render: (v: string, row: { billingPeriodEnd: string }) => `${formatDate(v)} - ${formatDate(row.billingPeriodEnd)}` },
              { key: 'consumption', label: 'Usage', width: '80px' },
              { key: 'total', label: 'Total', width: '100px', render: (v: number) => formatCurrency(v) },
              { key: 'paidAmount', label: 'Paid', width: '100px', render: (v: number) => formatCurrency(v) },
              { key: 'status', label: 'Status', width: '120px', render: (v: string) => <StatusBadge status={v} /> },
            ]}
            searchPlaceholder="Search invoices..."
          />
        </TabsContent>

        <TabsContent value="payments"><div className="text-center py-12 text-muted-foreground">No payment records found.</div></TabsContent>
        <TabsContent value="balance"><div className="text-center py-12 text-muted-foreground">No balance records found.</div></TabsContent>
        <TabsContent value="tickets"><div className="text-center py-12 text-muted-foreground">No tickets found.</div></TabsContent>
        <TabsContent value="notes"><div className="text-center py-12 text-muted-foreground">No notes found.</div></TabsContent>
      </Tabs>
    </div>
  );
}
