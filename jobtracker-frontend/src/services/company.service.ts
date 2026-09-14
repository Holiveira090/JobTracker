import api from './api';
import type {
  CompanyDTO,
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from '../types/dto/company.dto';

const COMPANIES_URL = '/Company';

export const companyService = {
  async findAll(): Promise<CompanyDTO[]> {
    const { data } = await api.get<CompanyDTO[]>(`${COMPANIES_URL}/ByUser`);
    return data;
  },

  async findById(id: number): Promise<CompanyDTO> {
    const { data } = await api.get<CompanyDTO>(`${COMPANIES_URL}/${id}`);
    return data;
  },

  async create(dto: CreateCompanyDTO): Promise<CompanyDTO> {
    const { data } = await api.post<CompanyDTO>(COMPANIES_URL, dto);
    return data;
  },

  async update(id: number, dto: UpdateCompanyDTO): Promise<CompanyDTO> {
    const { data } = await api.put<CompanyDTO>(`${COMPANIES_URL}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${COMPANIES_URL}/${id}`);
  },
};