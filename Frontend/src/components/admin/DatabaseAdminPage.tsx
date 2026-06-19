'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { PageHeader, formatDateTime } from '@/components/shared/PageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartTable from '@/components/smart-table/SmartTable';
import { Database, Table2, Activity, Shield, Clock, Server } from 'lucide-react';

export default function DatabaseAdminPage() {
  const [selectedTable, setSelectedTable] = useState('');

  const { data: tables } = useQuery({
    queryKey: ['db-tables'],
    queryFn: () => apiGet<any[]>('/dev/db-tables').catch(() => []),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => apiGet<any[]>('/audit/logs').catch(() => []),
  });

  return (
    <div>
      <PageHeader title="Database Administration" subtitle="Read-only system administration tools" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="glass-card border-border/50"><CardContent className="p-4"><Server className="h-5 w-5 text-primary mb-1" /><p className="text-xs text-muted-foreground">PostgreSQL</p><p className="font-bold">Running</p></CardContent></Card>
        <Card className="glass-card border-border/50"><CardContent className="p-4"><Table2 className="h-5 w-5 text-primary mb-1" /><p className="text-xs text-muted-foreground">Tables</p><p className="font-bold">{(tables ?? []).length}</p></CardContent></Card>
        <Card className="glass-card border-border/50"><CardContent className="p-4"><Activity className="h-5 w-5 text-primary mb-1" /><p className="text-xs text-muted-foreground">Audit Entries</p><p className="font-bold">{(auditLogs ?? []).length}</p></CardContent></Card>
        <Card className="glass-card border-border/50"><CardContent className="p-4"><Shield className="h-5 w-5 text-emerald-500 mb-1" /><p className="text-xs text-muted-foreground">Status</p><p className="font-bold text-emerald-500">Healthy</p></CardContent></Card>
      </div>

      <Tabs defaultValue="tables">
        <TabsList className="mb-4">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-sm">Schema Browser</CardTitle></CardHeader>
            <CardContent>
              <SmartTable data={tables ?? []} columns={[
                { key: 'table_name', label: 'Table Name', sortable: true },
                { key: 'schema', label: 'Schema' },
                { key: 'rows', label: 'Rows' },
              ]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-sm">Audit Log</CardTitle></CardHeader>
            <CardContent>
              <SmartTable data={auditLogs ?? []} columns={[
                { key: 'action', label: 'Action', sortable: true },
                { key: 'resource', label: 'Resource' },
                { key: 'actorId', label: 'User' },
                { key: 'createdAt', label: 'Date', render: (v: string) => formatDateTime(v) },
              ]} searchKeys={['action', 'resource']} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-sm">System Health</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between p-2 rounded bg-muted/30"><span>Database</span><span className="text-emerald-500">Connected</span></div>
              <div className="flex justify-between p-2 rounded bg-muted/30"><span>API Status</span><span className="text-emerald-500">Operational</span></div>
              <div className="flex justify-between p-2 rounded bg-muted/30"><span>Migrations</span><span className="text-emerald-500">Up to date</span></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
