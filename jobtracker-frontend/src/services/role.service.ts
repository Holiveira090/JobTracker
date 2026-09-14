import api from './api';
import type {
  RoleDTO,
  CreateRoleDTO,
  UpdateRoleDTO,
} from '../types/dto/role.dto';

const ROLES_URL = '/Role';

export const roleService = {
  async findAll(): Promise<RoleDTO[]> {
    const { data } = await api.get<RoleDTO[]>(ROLES_URL);
    return data;
  },

  async findById(id: number): Promise<RoleDTO> {
    const { data } = await api.get<RoleDTO>(`${ROLES_URL}/${id}`);
    return data;
  },

  async create(dto: CreateRoleDTO): Promise<RoleDTO> {
    const { data } = await api.post<RoleDTO>(ROLES_URL, dto);
    return data;
  },

  async update(id: number, dto: UpdateRoleDTO): Promise<RoleDTO> {
    const { data } = await api.put<RoleDTO>(`${ROLES_URL}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${ROLES_URL}/${id}`);
  },
};