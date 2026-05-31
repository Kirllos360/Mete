import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Customer } from '@/lib/types';

export function useCustomersList(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'customers'],
    queryFn: () => apiGet<Customer[]>(`/projects/${projectId}/customers`),
    enabled: !!projectId,
  });
}
