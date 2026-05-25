'use client';

import { useState } from 'react';
import { usePageStore } from '@/lib/router-store';
import { mockProjects, mockBuildings, mockUnits, mockCustomers } from '@/lib/mock-data';
import { PageHeader, StatCard } from '@/components/shared/PageHelpers';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, ChevronDown, ChevronRight, Building2, Layers, Home } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LocationsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('PRJ-001');
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);

  const buildings = mockBuildings.filter((b) => b.projectId === selectedProject);

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Hierarchical view of projects, buildings, floors, and units"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.info('Add Building dialog would open')}>
              <Plus className="h-4 w-4" /> Building
            </Button>
          </div>
        }
      />

      {/* Project Selector */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">Select Project</label>
        <Select value={selectedProject} onValueChange={(v) => { setSelectedProject(v); setExpandedBuilding(null); }}>
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Buildings" value={buildings.length} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Total Units" value={buildings.reduce((s, b) => s + b.units, 0)} icon={<Home className="h-5 w-5" />} />
        <StatCard label="Total Floors" value={buildings.reduce((s, b) => s + b.floors, 0)} icon={<Layers className="h-5 w-5" />} />
      </div>

      {/* Buildings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No buildings in this project.
          </div>
        ) : (
          buildings.map((bldg) => {
            const bUnits = mockUnits.filter((u) => u.buildingId === bldg.id);
            const isExpanded = expandedBuilding === bldg.id;
            const floors = [...new Set(bUnits.map((u) => u.floorNumber))].sort((a, b) => a - b);

            return (
              <Card key={bldg.id} className="glass-card border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedBuilding(isExpanded ? null : bldg.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">{bldg.name}</p>
                        <p className="text-xs text-muted-foreground">{bldg.floors} floors · {bldg.units} units</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/50 p-4 space-y-3 max-h-80 overflow-y-auto">
                      {floors.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">No units in this building</p>
                      ) : (
                        floors.map((floor) => {
                          const floorUnits = bUnits.filter((u) => u.floorNumber === floor);
                          return (
                            <div key={floor}>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Floor {floor}</p>
                              <div className="space-y-1.5">
                                {floorUnits.map((unit) => {
                                  const customer = unit.customerId
                                    ? mockCustomers.find((c) => c.id === unit.customerId)
                                    : null;
                                  return (
                                    <div key={unit.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 text-xs">
                                      <div>
                                        <span className="font-medium">{unit.unitNumber}</span>
                                        <span className="text-muted-foreground ml-2">
                                          {unit.unitType}
                                        </span>
                                        {customer && (
                                          <span className="text-muted-foreground ml-2">· {customer.name}</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                          {unit.electricityMeterId && '⚡'} {unit.waterMeterId && '💧'}
                                        </span>
                                        <StatusBadge status={unit.status} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
