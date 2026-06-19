'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SmartTable from '@/components/smart-table/SmartTable';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, DollarSign, Activity } from 'lucide-react';

const UTILITIES = ['electricity', 'water', 'chilled_water', 'solar', 'settlement', 'gas'];
const CHARGE_MODES = ['FLAT', 'PER_UNIT', 'STEPS', 'STATIC', 'ZERO'];

export default function TariffStudioPage() {
  const qc = useQueryClient();
  const [activeUtil, setActiveUtil] = useState('electricity');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTariff, setEditTariff] = useState<any>(null);
  const [form, setForm] = useState({ tariffCode: '', tariffName: '', description: '', utilityType: 'electricity' });

  const { data: tariffs } = useQuery({
    queryKey: ['tariffs-studio', activeUtil],
    queryFn: () => apiGet<any[]>(`/tariffs?utility=${activeUtil}`).catch(() => []),
  });
  const list = tariffs ?? [];

  const createMutation = useMutation({
    mutationFn: () => apiPost('/tariffs', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tariffs-studio'] }); toast.success('Tariff created'); setDialogOpen(false); setForm({ tariffCode: '', tariffName: '', description: '', utilityType: activeUtil }); },
    onError: () => toast.error('Failed to create tariff'),
  });

  return (
    <div>
      <PageHeader title="Tariff Studio" subtitle="Create and manage tariff structures" action={
        <Button className="gap-2" onClick={() => { setEditTariff(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> New Tariff</Button>
      } />
      <Tabs defaultValue="electricity" onValueChange={setActiveUtil}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          {UTILITIES.map(u => <TabsTrigger key={u} value={u} className="capitalize">{u.replace(/_/g, ' ')}</TabsTrigger>)}
        </TabsList>
        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-sm">{activeUtil.replace(/_/g, ' ')} Tariffs</CardTitle></CardHeader>
          <CardContent>
            <SmartTable data={list} columns={[
              { key: 'tariffCode', label: 'Code', sortable: true },
              { key: 'tariffName', label: 'Name', sortable: true },
              { key: 'description', label: 'Description' },
              { key: 'isActive', label: 'Status', render: (v: boolean) => v ? 'Active' : 'Inactive' },
            ]} />
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Tariff</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Tariff Code" value={form.tariffCode} onChange={e => setForm({...form, tariffCode: e.target.value})} />
            <Input placeholder="Tariff Name" value={form.tariffName} onChange={e => setForm({...form, tariffName: e.target.value})} />
            <Input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.tariffCode || !form.tariffName}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
