export interface RoleDTO {
  id: number;
  name: string;
  userId: number[];
}

export interface CreateRoleDTO {
  name: string;
  userId?: number[];
}

export interface UpdateRoleDTO {
  id: number;
  name: string;
  userId?: number[];
}