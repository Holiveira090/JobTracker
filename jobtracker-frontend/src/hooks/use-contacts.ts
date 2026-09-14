import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactService } from '../services/contact.service';
import type {
  CreateContactDTO,
  UpdateContactDTO,
} from '../types/dto/contact.dto';

const CONTACTS_QUERY_KEY = ['contacts'];

export function useContacts() {
  return useQuery({
    queryKey: CONTACTS_QUERY_KEY,
    queryFn: contactService.findAll,
  });
}

export function useContact(id: number) {
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, id],
    queryFn: () => contactService.findById(id),
    enabled: id > 0,
  });
}

export function useContactsByCompany(companyId: number) {
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, 'company', companyId],
    queryFn: () => contactService.findByCompanyId(companyId),
    enabled: companyId > 0,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateContactDTO) => contactService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      toast.success('Contato criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar contato. Tente novamente.');
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateContactDTO }) =>
      contactService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      toast.success('Contato atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar contato. Tente novamente.');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      toast.success('Contato excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir contato. Tente novamente.');
    },
  });
}
