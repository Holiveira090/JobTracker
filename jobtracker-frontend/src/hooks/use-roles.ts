import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/role.service';
import type {
  CreateRoleDTO,
  UpdateRoleDTO,
} from '../types/dto/role.dto';

const ROLES_QUERY_KEY = ['roles'];

export function useRoles() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: roleService.findAll,
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, id],
    queryFn: () => roleService.findById(id),
    enabled: id > 0,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRoleDTO) => roleService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateRoleDTO }) =>
      roleService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}