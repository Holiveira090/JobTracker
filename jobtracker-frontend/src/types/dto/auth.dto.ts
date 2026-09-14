export interface UserRegisterDTO {
  email: string;
  password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
}

export interface LoginResponse {
  token: string;
}