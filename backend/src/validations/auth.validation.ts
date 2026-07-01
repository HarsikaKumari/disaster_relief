import { z } from 'zod';

// Register Validation
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
  role: z.enum(['CITIZEN', 'VOLUNTEER', 'NGO', 'ADMIN']).optional().default('CITIZEN'),
});

// Login Validation
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Send OTP Validation
export const sendOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Verify OTP Validation
export const verifyOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

// Resend OTP Validation
export const resendOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Forgot Password Validation
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Reset Password Validation
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
});