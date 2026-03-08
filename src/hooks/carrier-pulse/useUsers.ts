'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, postApi, patchApi, deleteApi } from '@/lib/carrier-pulse/api';

interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  brands: Brand[];
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  brand_ids: number[];
}

interface UpdateUserPayload {
  id: number;
  name?: string;
  role?: string;
  is_active?: boolean;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['cp-users'],
    queryFn: () => fetchApi<User[]>('/users'),
  });
}

export function useUser(userId: number | null) {
  return useQuery<User>({
    queryKey: ['cp-users', userId],
    queryFn: () => fetchApi<User>(`/users/${userId}`),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => postApi('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateUserPayload) => patchApi(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteApi(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-users'] });
    },
  });
}

export function useAssignBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, brandId }: { userId: number; brandId: number }) =>
      postApi(`/users/${userId}/brands`, { brand_id: brandId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-users'] });
    },
  });
}

export function useUnassignBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, brandId }: { userId: number; brandId: number }) =>
      deleteApi(`/users/${userId}/brands/${brandId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-users'] });
    },
  });
}
