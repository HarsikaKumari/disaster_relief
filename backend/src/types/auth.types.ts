export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'CITIZEN' | 'VOLUNTEER' | 'NGO' | 'ADMIN';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOTPInput {
  email: string;
  otp: string;
}

export interface SendOTPInput {
  email: string;
}

export interface ResendOTPInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    profileImage?: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}