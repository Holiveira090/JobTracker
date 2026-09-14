import api from './api';
import type {
  ApplicationNoteDTO,
  CreateApplicationNoteDTO,
  UpdateApplicationNoteDTO,
} from '../types/dto/application-note.dto';

const NOTES_URL = '/ApplicationNote';

export const applicationNoteService = {
  async findAllByApplicationId(applicationId: number): Promise<ApplicationNoteDTO[]> {
    const { data } = await api.get<ApplicationNoteDTO[]>(`${NOTES_URL}/applications/${applicationId}/notes`);
    return data;
  },

  async create(dto: CreateApplicationNoteDTO): Promise<ApplicationNoteDTO> {
    const { data } = await api.post<ApplicationNoteDTO>(NOTES_URL, dto);
    return data;
  },

  async update(id: number, dto: UpdateApplicationNoteDTO): Promise<ApplicationNoteDTO> {
    const { data } = await api.put<ApplicationNoteDTO>(`${NOTES_URL}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${NOTES_URL}/${id}`);
  },
};