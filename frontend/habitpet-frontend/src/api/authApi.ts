import apiClient from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  birthday: string;
  sex: string;
}

export interface AuthResponse {
  token: string;
  expires: string;
  userId: number;
  username: string;
}

export interface ResetPasswordRequest {
  token?: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/Auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/Auth/register', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post('/Auth/reset-password', data);
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await apiClient.post('/Auth/forgot-password', data);
};
