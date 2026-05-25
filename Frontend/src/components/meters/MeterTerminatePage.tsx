'use client';

import { useState } from 'react';
import { mockMeters, mockSimCards, mockCustomers } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { XCircle, AlertTriangle, Check } from 'lucide-react';

export default function MeterTerminatePage() {
  const [meterId, setMeterId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [releaseSim, setReleaseSim] = useState(false);

  const meter = mockMeters.find((m) => m.id === meterId);
  const sim = meter?.simCardId ? mockSimCards.find((s) => s.id === meter.simCardId) : null;
  const customer = meter?.customerId ? mockCustomers.find((c) => c.id === meter.customerId) : null;
  const activeMeters = mockMeters.filter((m) => m.status === 'active' || m.status === 'offline');

  const handleConfirm = () => {
    if (!meterId) {
      toast.error('Please select a meter');
      return;
    }
    toast.success('Meter terminated successfully!');
  };

  return (
    <div>
      <PageHeader title="Terminate Meter" subtitle="Permanently deactivate a meter connection" />

      <div className="max-w-2xl space-y-6">
        {/* Meter Selector */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><XCircle className="h-4 w-4" /> Select Meter</h3>
            <Select value={meterId} onValueChange={setMeterId}>
              <SelectTrigger><SelectValue placeholder="Select meter to terminate" /></SelectTrigger>
              <SelectContent>
                {activeMeters.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.serialNumber} - {m.brand} ({m.customerName || 'Unassigned'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Meter Details */}
        {meter && (
          <Card className="glass-card border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Meter Details</h3>
              <div className="text-sm space-y-2 p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between"><span className="text-muted-foreground">Serial</span><span className="font-mono">{meter.serialNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><StatusBadge status={meter.meterType} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={meter.status} /></div>
                {customer && <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{customer.name}</span></div>}
                {meter.unitNumber && <div className="flex justify-between"><span className="text-muted-foreground">Unit</span><span>{meter.unitNumber}</span></div>}
                {sim && <div className="flex justify-between"><span className="text-muted-foreground">SIM</span><span>{sim.msisdn}</span></div>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Termination Form */}
        {meter && (
          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Termination Details</h3>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Termination Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Reason</label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter termination reason..." rows={3} />
              </div>
              {sim && (
                <div className="flex items-center gap-2">
                  <Checkbox id="release" checked={releaseSim} onCheckedChange={(v) => setReleaseSim(!!v)} />
                  <label htmlFor="release" className="text-sm">Release SIM ({sim.msisdn}) for reuse</label>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Result Preview */}
        {meter && (
          <Card className="glass-card border-amber-500/30 border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-4 w-4" /> What will happen
              </h3>
              <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
                <li>Meter {meter.serialNumber} will be marked as <strong>terminated</strong></li>
                <li>All automated readings will stop</li>
                <li>{customer ? `Customer ${customer.name} will need a replacement meter` : 'No customer will be affected'}</li>
                {sim && (releaseSim ? <li>SIM {sim.msisdn} will be released for reuse</li> : <li>SIM {sim.msisdn} will remain linked (not recommended)</li>)}
              </ul>
              <Button className="mt-4 gap-2" onClick={handleConfirm}>
                <Check className="h-4 w-4" /> Confirm Termination
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
