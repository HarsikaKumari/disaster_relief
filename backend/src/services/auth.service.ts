import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';
import { generateOTP, getOTPExpiryTime, isOTPExpired } from '../utils/otp';
import { sendEmail, getOTPEmailTemplate, getWelcomeEmailTemplate } from '../utils/email';
import {
  RegisterInput,
  LoginInput,
  VerifyOTPInput,
  SendOTPInput,
  ResendOTPInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
} from '../types/auth.types';

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5');
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '3');

export class AuthService { 
    
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { name, email, phone, password, role } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          message: 'Email already registered. Please login or use a different email.',
        };
      }
      if (existingUser.phone === phone) {
        return {
          success: false,
          message: 'Phone number already registered. Please use a different number.',
        };
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const otp = generateOTP(6);
    const otpExpiresAt = getOTPExpiryTime(OTP_EXPIRY_MINUTES);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || 'CITIZEN',
        otp,
        otpExpiresAt,
        isVerified: false,
      },
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Account - Disaster Relief Platform',
        html: getOTPEmailTemplate(otp, name),
      });
    } catch (error) {
      console.error('Email send error:', error);
    }

    return {
      success: true,
      message: 'Registration successful. Please check your email for OTP verification.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        profileImage: user.profileImage || undefined,
      },
    };
  }

  async sendOTP(data: SendOTPInput): Promise<AuthResponse> {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found with this email.',
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: 'Account is already verified. Please login.',
      };
    }

    if (user.lastOtpSentAt) {
      const timeSinceLastOTP = Date.now() - user.lastOtpSentAt.getTime();
      if (timeSinceLastOTP < 60000) { // 60 seconds
        const remainingSeconds = Math.ceil((60000 - timeSinceLastOTP) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
        };
      }
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return {
        success: false,
        message: 'Too many invalid OTP attempts. Please request a new OTP after some time.',
      };
    }

    const otp = generateOTP(6);
    const otpExpiresAt = getOTPExpiryTime(OTP_EXPIRY_MINUTES);

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
        lastOtpSentAt: new Date(),
      },
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Your OTP Verification Code - Disaster Relief',
        html: getOTPEmailTemplate(otp, user.name),
      });
    } catch (error) {
      console.error('Email send error:', error);
    }

    return {
      success: true,
      message: 'OTP sent successfully to your email.',
    };
  }

  async verifyOTP(data: VerifyOTPInput): Promise<AuthResponse> {
    const { email, otp } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: 'Account is already verified. Please login.',
      };
    }
    if (user.otp !== otp) {
      await prisma.user.update({
        where: { email },
        data: {
          otpAttempts: user.otpAttempts + 1,
        },
      });

      const remainingAttempts = OTP_MAX_ATTEMPTS - (user.otpAttempts + 1);
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      };
    }

    if (!user.otpExpiresAt || isOTPExpired(user.otpExpiresAt)) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    const verifiedUser = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    const token = generateToken({
      id: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Disaster Relief Platform! 🎉',
        html: getWelcomeEmailTemplate(verifiedUser.name),
      });
    } catch (error) {
      console.error('Welcome email send error:', error);
    }

    return {
      success: true,
      message: 'Account verified successfully! Welcome aboard.',
      token,
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        phone: verifiedUser.phone,
        role: verifiedUser.role,
        isVerified: verifiedUser.isVerified,
        isActive: verifiedUser.isActive,
        profileImage: verifiedUser.profileImage || undefined,
      },
    };
  }

  async resendOTP(data: ResendOTPInput): Promise<AuthResponse> {
    return this.sendOTP(data);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      };
    }

    if (!user.isVerified) {
      const otp = generateOTP(6);
      const otpExpiresAt = getOTPExpiryTime(OTP_EXPIRY_MINUTES);

      await prisma.user.update({
        where: { email },
        data: {
          otp,
          otpExpiresAt,
          lastOtpSentAt: new Date(),
        },
      });

      try {
        await sendEmail({
          to: email,
          subject: 'Verify Your Account - Disaster Relief Platform',
          html: getOTPEmailTemplate(otp, user.name),
        });
      } catch (error) {
        console.error('Email send error:', error);
      }

      return {
        success: false,
        message: 'Account not verified. A new OTP has been sent to your email.',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        profileImage: user.profileImage || undefined,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<AuthResponse> {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found with this email.',
      };
    }

    const resetToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresAt,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - Disaster Relief Platform',
        html: `
          <div style="font-family: system-ui; max-width: 500px; margin: 0 auto; background: #FFFFFF; padding: 40px; border-radius: 16px;">
            <h2 style="color: #4F5844;">Reset Your Password</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" style="background: #4F5844; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
            </div>
            <p style="color: #7D8478; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Reset email send error:', error);
    }

    return {
      success: true,
      message: 'Password reset link sent to your email.',
    };
  }

  async resetPassword(data: ResetPasswordInput): Promise<AuthResponse> {
    const { token, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired reset token. Please request a new one.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    };
  }

  async logout(_token: string): Promise<AuthResponse> {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success (client will remove token)
    return {
      success: true,
      message: 'Logout successful.',
    };
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export default new AuthService();