import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { applicationNoteService } from '../services/application-note.service';
import type {
  CreateApplicationNoteDTO,
  UpdateApplicationNoteDTO,
} from '../types/dto/application-note.dto';

const NOTES_QUERY_KEY = ['applicationNotes'];

export function useApplicationNotes(applicationId: number) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, applicationId],
    queryFn: () => applicationNoteService.findAllByApplicationId(applicationId),
    enabled: applicationId > 0,
  });
}

export function useCreateApplicationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateApplicationNoteDTO) => applicationNoteService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, data.jobApplicationId] });
      toast.success('Anotação criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar anotação. Tente novamente.');
    },
  });
}

export function useUpdateApplicationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateApplicationNoteDTO }) =>
      applicationNoteService.update(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, data.jobApplicationId] });
      toast.success('Anotação atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar anotação. Tente novamente.');
    },
  });
}

export function useDeleteApplicationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => applicationNoteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
      toast.success('Anotação excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir anotação. Tente novamente.');
    },
  });
}
