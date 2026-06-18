'use client';
import { useState, useEffect } from 'react';
import { useT } from '@/lib/i18n/context';
import { PageHeader } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import SmartTable from '@/components/smart-table/SmartTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/api';

export default function SettingsPage() {
  const t = useT();
  const { theme, setTheme } = useTheme();
  const qc = useQueryClient();
  const { data: settingsData } = useQuery({ queryKey: ['settings'], queryFn: () => apiGet<Record<string, string>>('/settings') });
  const s = settingsData ?? {};
  const [vals, setVals] = useState<Record<string, string>>({});

  useEffect(() => { if (Object.keys(s).length > 0 && Object.keys(vals).length === 0) setVals(s); }, [s]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) => apiPatch('/settings', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); toast.success('Settings saved'); },
    onError: () => { toast.error('Failed to save'); },
  });

  const set = (k: string, v: string) => setVals((prev) => ({ ...prev, [k]: v }));
  const save = (section: string) => {
    const filtered: Record<string, string> = {};
    Object.entries(vals).filter(([k]) => k.startsWith(section)).forEach(([k, v]) => { filtered[k] = v; });
    saveMutation.mutate(filtered);
  };

  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => apiGet<any[]>('/users').catch(() => []) });
  const users = usersData ?? [];

  return (
    <div>
      <PageHeader title={t('settings.title')} subtitle={t('settings.system')} />
      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="general">{t('settings.preferences')}</TabsTrigger>
          <TabsTrigger value="roles">{t('settings.team')}</TabsTrigger>
          <TabsTrigger value="reading">{t('readings.title')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="theme">{t('settings.theme')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="glass-card border-border/50 max-w-lg">
            <CardHeader><CardTitle className="text-sm">{t('settings.system')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Company Name</Label><Input value={vals['company_name'] ?? s['company_name'] ?? 'Meter Verse'} onChange={(e) => set('company_name', e.target.value)} className="mt-1" /></div>
              <div><Label>{t('login.email')}</Label><Input value={vals['company_email'] ?? s['company_email'] ?? ''} onChange={(e) => set('company_email', e.target.value)} className="mt-1" /></div>
              <div><Label>{t('customers.phone')}</Label><Input value={vals['company_phone'] ?? s['company_phone'] ?? ''} onChange={(e) => set('company_phone', e.target.value)} className="mt-1" /></div>
              <Button onClick={() => save('company_')}>{saveMutation.isPending ? 'Saving...' : t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-sm">{t('settings.team')}</CardTitle></CardHeader>
            <CardContent>
              <SmartTable data={users} columns={[
                { key: 'name', label: t('customers.name'), sortable: true },
                { key: 'email', label: t('login.email') },
                { key: 'role', label: t('nav.role'), render: (v: string) => <StatusBadge status={v} /> },
              ]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading">
          <Card className="glass-card border-border/50 max-w-lg">
            <CardHeader><CardTitle className="text-sm">Reading Thresholds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Max Consumption (kWh)</Label><Input type="number" value={vals['reading_max'] ?? s['reading_max'] ?? '500'} onChange={(e) => set('reading_max', e.target.value)} className="mt-1" /></div>
              <div><Label>Water Difference %</Label><Input type="number" value={vals['water_diff_pct'] ?? s['water_diff_pct'] ?? '10'} onChange={(e) => set('water_diff_pct', e.target.value)} className="mt-1" /></div>
              <Button onClick={() => save('reading_')}>{saveMutation.isPending ? 'Saving...' : t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card border-border/50 max-w-lg">
            <CardHeader><CardTitle className="text-sm">{t('settings.notifications')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Email Notifications</Label><Switch checked={vals['notif_email'] === 'true'} onCheckedChange={(v) => set('notif_email', String(v))} /></div>
              <div className="flex items-center justify-between"><Label>SMS Notifications</Label><Switch checked={vals['notif_sms'] === 'true'} onCheckedChange={(v) => set('notif_sms', String(v))} /></div>
              <div className="flex items-center justify-between"><Label>Critical Alerts</Label><Switch checked={vals['notif_critical'] === 'true'} onCheckedChange={(v) => set('notif_critical', String(v))} /></div>
              <Button onClick={() => save('notif_')}>{saveMutation.isPending ? 'Saving...' : t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card className="glass-card border-border/50 max-w-lg">
            <CardHeader><CardTitle className="text-sm">{t('settings.theme')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <Button key={t} variant={theme === t ? 'default' : 'outline'} onClick={() => setTheme(t)} className="capitalize">{t}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
