import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { applicationService } from '../services/application.service';
import type {
  CreateJobApplicationDTO,
  UpdateJobApplicationDTO,
} from '../types/dto/application.dto';

const APPLICATIONS_QUERY_KEY = ['applications'];

export function useApplications() {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: applicationService.findAll,
  });
}

export function useApplication(id: number) {
  return useQuery({
    queryKey: [...APPLICATIONS_QUERY_KEY, id],
    queryFn: () => applicationService.findById(id),
    enabled: id > 0,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateJobApplicationDTO) => applicationService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.success('Candidatura criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar candidatura. Tente novamente.');
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateJobApplicationDTO }) =>
      applicationService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.success('Candidatura atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar candidatura. Tente novamente.');
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => applicationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.success('Candidatura excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir candidatura. Tente novamente.');
    },
  });
}
