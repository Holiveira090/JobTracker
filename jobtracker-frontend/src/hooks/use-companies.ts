import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { companyService } from '../services/company.service';
import type {
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from '../types/dto/company.dto';

const COMPANIES_QUERY_KEY = ['companies'];

export function useCompanies() {
  return useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: companyService.findAll,
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, id],
    queryFn: () => companyService.findById(id),
    enabled: id > 0,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCompanyDTO) => companyService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success('Empresa criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar empresa. Tente novamente.');
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCompanyDTO }) =>
      companyService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar empresa. Tente novamente.');
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success('Empresa excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir empresa. Tente novamente.');
    },
  });
}
