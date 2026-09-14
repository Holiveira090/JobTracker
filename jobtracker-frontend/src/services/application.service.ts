import api from './api';
import type {
  JobApplicationDTO,
  CreateJobApplicationDTO,
  UpdateJobApplicationDTO,
} from '../types/dto/application.dto';

const APPLICATIONS_URL = '/JobApplication';

export const applicationService = {
  async findAll(): Promise<JobApplicationDTO[]> {
    const { data } = await api.get<JobApplicationDTO[]>(`${APPLICATIONS_URL}/ByUser`);
    return data;
  },

  async findById(id: number): Promise<JobApplicationDTO> {
    const { data } = await api.get<JobApplicationDTO>(`${APPLICATIONS_URL}/${id}`);
    return data;
  },

  async create(dto: CreateJobApplicationDTO): Promise<JobApplicationDTO> {
    const { data } = await api.post<JobApplicationDTO>(APPLICATIONS_URL, dto);
    return data;
  },

  async update(id: number, dto: UpdateJobApplicationDTO): Promise<JobApplicationDTO> {
    const { data } = await api.put<JobApplicationDTO>(`${APPLICATIONS_URL}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${APPLICATIONS_URL}/${id}`);
  },
};