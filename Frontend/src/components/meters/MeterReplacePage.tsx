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
import { formatDate } from '@/components/shared/PageHelpers';
import { ArrowRightLeft, Check } from 'lucide-react';

export default function MeterReplacePage() {
  const [currentMeterId, setCurrentMeterId] = useState('');
  const [newMeterId, setNewMeterId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [preserveHistory, setPreserveHistory] = useState(true);

  const currentMeter = mockMeters.find((m) => m.id === currentMeterId);
  const assignedMeters = mockMeters.filter((m) => m.status === 'active' || m.status === 'offline');
  const availableMeters = currentMeter
    ? mockMeters.filter((m) => m.status === 'available' && m.meterType === currentMeter.meterType)
    : [];

  const handleConfirm = () => {
    if (!currentMeterId || !newMeterId) {
      toast.error('Please select both meters');
      return;
    }
    toast.success('Meter replaced successfully!');
  };

  return (
    <div>
      <PageHeader title="Replace Meter" subtitle="Replace an existing meter with a new one" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Meter */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Current Meter</h3>
            <Select value={currentMeterId} onValueChange={(v) => { setCurrentMeterId(v); setNewMeterId(''); }}>
              <SelectTrigger><SelectValue placeholder="Select current meter" /></SelectTrigger>
              <SelectContent>
                {assignedMeters.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.serialNumber} - {m.brand} ({m.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentMeter && (
              <div className="mt-4 p-4 rounded-lg bg-muted/30 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Serial</span><span className="font-mono">{currentMeter.serialNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><StatusBadge status={currentMeter.meterType} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Brand/Model</span><span>{currentMeter.brand} {currentMeter.model}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{currentMeter.customerName || '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Unit</span><span>{currentMeter.unitNumber || '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Reading</span><span>{currentMeter.lastReading?.toLocaleString() || '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={currentMeter.status} /></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Meter */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">New Meter</h3>
            <Select value={newMeterId} onValueChange={setNewMeterId}>
              <SelectTrigger><SelectValue placeholder="Select new meter" /></SelectTrigger>
              <SelectContent>
                {availableMeters.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.serialNumber} - {m.brand} {m.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableMeters.length === 0 && currentMeter && (
              <p className="text-xs text-muted-foreground mt-2">No available meters of type: {currentMeter.meterType}</p>
            )}

            {availableMeters.length > 0 && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Replacement Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Reason</label>
                  <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for replacement..." rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="preserve" checked={preserveHistory} onCheckedChange={(v) => setPreserveHistory(!!v)} />
                  <label htmlFor="preserve" className="text-sm">Preserve reading history</label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {currentMeter && newMeterId && (
        <Card className="glass-card border-border/50 mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" /> Replacement Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">From</p>
                <p className="font-mono">{currentMeter.serialNumber}</p>
                <p>{currentMeter.brand} {currentMeter.model}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">To</p>
                <p className="font-mono">{availableMeters.find((m) => m.id === newMeterId)?.serialNumber}</p>
                <p>{availableMeters.find((m) => m.id === newMeterId)?.brand} {availableMeters.find((m) => m.id === newMeterId)?.model}</p>
              </div>
            </div>
            <Button className="mt-4 gap-2" onClick={handleConfirm}>
              <Check className="h-4 w-4" /> Confirm Replacement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
