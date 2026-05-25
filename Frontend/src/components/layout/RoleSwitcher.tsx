'use client';

import React from 'react';
import { useAuthStore, ROLES, getRoleColor, getRoleLabel } from '@/lib/mock-auth';
import type { UserRole } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function RoleSwitcher() {
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);

  if (!user) return null;

  const handleRoleChange = (value: string) => {
    switchRole(value as UserRole);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={user.role} onValueChange={handleRoleChange}>
        <SelectTrigger size="sm" className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Switch role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Badge
        variant="outline"
        className={cn('text-[10px] px-1.5 py-0 h-5 border-0', getRoleColor(user.role))}
      >
        {getRoleLabel(user.role)}
      </Badge>
    </div>
  );
}
