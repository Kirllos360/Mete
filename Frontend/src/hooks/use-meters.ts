import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Meter } from '@/lib/types';

export function useMetersList() {
  return useQuery({
    queryKey: ['meters'],
    queryFn: () => apiGet<Meter[]>('/meters'),
  });
}

export function useMeterDetail(id: string) {
  return useQuery({
    queryKey: ['meters', id],
    queryFn: () => apiGet<Meter>(`/meters/${id}`),
    enabled: !!id,
  });
}
