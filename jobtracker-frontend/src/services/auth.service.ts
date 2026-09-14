import api from './api';
import type { UserRegisterDTO, UserLoginDTO, UserResponseDTO, LoginResponse } from '../types/dto/auth.dto';

// Decodificar JWT payload (base64url) sem dependências externas
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1]);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export const authService = {
  async login(dto: UserLoginDTO): Promise<LoginResponse & { user: { id: number; email: string } }> {
    const { data } = await api.post<LoginResponse>('/Users/login', dto);
    localStorage.setItem('jwt_token', data.token);

    // Extrair userId do JWT token (nameid claim)
    const payload = decodeJwtPayload(data.token);
    const rawId = payload?.['nameid'];
    const userId = rawId != null && rawId !== '' ? Number(rawId) : null;
    const email = payload?.['email'] ? String(payload['email']) : dto.email;

    // Armazenar informações do usuário logado
    if (userId !== null) {
      localStorage.setItem('user_id', String(userId));
      localStorage.setItem('user_email', email);
    }

    return { ...data, user: { id: userId ?? 0, email } };
  },

  async register(dto: UserRegisterDTO): Promise<UserResponseDTO> {
    // Primeiro registrar
    await api.post<UserResponseDTO>('/Users/register', dto);
    // Depois fazer login automático para obter o token
    const loginResult = await authService.login(dto);
    return loginResult.user;
  },

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  },

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  },

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? Number(id) : null;
  },

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
