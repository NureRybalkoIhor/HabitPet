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

export const sendOtp = async (email: string): Promise<void> => {
  await apiClient.post('/Auth/send-otp', { email });
};

export const verifyOtp = async (email: string, code: string): Promise<void> => {
  await apiClient.post('/Auth/verify-otp', { email, code });
};

export interface GoogleLoginRequest {
  accessToken: string;
}

export interface GoogleConfigResponse {
  clientId: string;
}

export const getGoogleConfig = async (): Promise<GoogleConfigResponse> => {
  const response = await apiClient.get<GoogleConfigResponse>('/Auth/google-config');
  return response.data;
};

export const googleLogin = async (data: GoogleLoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/Auth/google-login', data);
  return response.data;
};
