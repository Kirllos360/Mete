'use client';

import { useState, useMemo } from 'react';
import { usePageStore } from '@/lib/router-store';
import { mockProjects, mockCustomers } from '@/lib/mock-data';
import { PageHeader, StatCard } from '@/components/shared/PageHelpers';
import { QueryBoundary } from '@/components/shared/QueryBoundary';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, ChevronDown, ChevronRight, Building2, Layers, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useProjectsList } from '@/hooks/use-projects';
import { useLocationsList } from '@/hooks/use-locations';
import type { Location } from '@/lib/types';

interface BuildingView {
  id: string;
  name: string;
  floors: number;
  units: number;
  location: Location;
}

interface UnitView {
  id: string;
  floorNumber: number;
  unitNumber: string;
  unitType: string;
  customerId?: string;
  status: string;
  electricityMeterId?: string;
  waterMeterId?: string;
}

export default function LocationsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('PRJ-001');
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);

  const { data: apiProjects, isLoading, isError, error } = useProjectsList();
  const projects = apiProjects ?? mockProjects;

  const { data: apiLocations, isLoading: locLoading } = useLocationsList(selectedProject);

  const buildings: BuildingView[] = useMemo(() => {
    if (apiLocations) {
      return apiLocations
        .filter((l) => l.nodeType === 'building')
        .map((l) => ({
          id: l.id,
          name: l.name,
          floors: 0,
          units: 0,
          location: l
        }));
    }
    return [];
  }, [apiLocations]);

  const units: UnitView[] = useMemo(() => {
    if (apiLocations) {
      return apiLocations
        .filter((l) => l.nodeType === 'unit')
        .map((l) => ({
          id: l.id,
          floorNumber: parseInt(l.code.replace(/\D/g, ''), 10) || 1,
          unitNumber: l.code,
          unitType: 'unit',
          status: l.status
        }));
    }
    return [];
  }, [apiLocations]);

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
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Buildings" value={buildings.length} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Total Units" value={units.length} icon={<Home className="h-5 w-5" />} />
        <StatCard label="Total Floors" value={new Set(units.map((u) => u.floorNumber)).size} icon={<Layers className="h-5 w-5" />} />
      </div>

      {/* Buildings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No buildings in this project.
          </div>
        ) : (
          buildings.map((bldg) => {
            const isExpanded = expandedBuilding === bldg.id;
            const bldgUnits = units.filter((u) => u.id.startsWith(bldg.id.substring(0, 8)));
            const floors = [...new Set(bldgUnits.map((u) => u.floorNumber))].sort((a, b) => a - b);

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
                        <p className="text-xs text-muted-foreground">{floors.length} floors · {bldgUnits.length} units</p>
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
                          const floorUnits = bldgUnits.filter((u) => u.floorNumber === floor);
                          return (
                            <div key={floor}>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Floor {floor}</p>
                              <div className="space-y-1.5">
                                {floorUnits.map((unit) => (
                                  <div key={unit.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 text-xs">
                                    <div>
                                      <span className="font-medium">{unit.unitNumber}</span>
                                      <span className="text-muted-foreground ml-2">{unit.unitType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <StatusBadge status={unit.status} />
                                    </div>
                                  </div>
                                ))}
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
      </QueryBoundary>
    </div>
  );
}
