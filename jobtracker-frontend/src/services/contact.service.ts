import api from './api';
import type {
  ContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
} from '../types/dto/contact.dto';

const CONTACTS_URL = '/Contact';

export const contactService = {
  async findAll(): Promise<ContactDTO[]> {
    const { data } = await api.get<ContactDTO[]>(`${CONTACTS_URL}/ByUser`);
    return data;
  },

  async findById(id: number): Promise<ContactDTO> {
    const { data } = await api.get<ContactDTO>(`${CONTACTS_URL}/${id}`);
    return data;
  },

  async findByCompanyId(companyId: number): Promise<ContactDTO[]> {
    const { data } = await api.get<ContactDTO[]>(`${CONTACTS_URL}/Company/${companyId}`);
    return data;
  },

  async create(dto: CreateContactDTO): Promise<ContactDTO> {
    const { data } = await api.post<ContactDTO>(CONTACTS_URL, dto);
    return data;
  },

  async update(id: number, dto: UpdateContactDTO): Promise<ContactDTO> {
    const { data } = await api.put<ContactDTO>(`${CONTACTS_URL}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${CONTACTS_URL}/${id}`);
  },
};