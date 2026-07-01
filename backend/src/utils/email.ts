import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;
 console.log("email : "+process.env.SMTP_USER)
const getTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const transporter = getTransporter();
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Disaster Relief <noreply@disasterrelief.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''),
  });
};

// OTP Email Template
export const getOTPEmailTemplate = (otp: string, name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #FAF3EB; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 40px; box-shadow: 0 8px 32px rgba(79, 88, 68, 0.12); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 700; color: #4F5844; }
        .otp-code { font-size: 48px; font-weight: 700; color: #4F5844; letter-spacing: 12px; text-align: center; padding: 16px; background: #F8F6F2; border-radius: 12px; margin: 20px 0; }
        .info { color: #50584C; font-size: 14px; line-height: 1.6; text-align: center; }
        .footer { text-align: center; margin-top: 30px; color: #7D8478; font-size: 12px; border-top: 1px solid #E8E3DC; padding-top: 20px; }
        .highlight { color: #4F5844; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ Disaster Relief</div>
          <p style="color: #7D8478; font-size: 14px; margin-top: 4px;">Coordination Platform</p>
        </div>
        
        <h2 style="text-align: center; color: #2B2F2A; font-weight: 600;">OTP Verification</h2>
        
        <p class="info">Hello <span class="highlight">${name}</span>,</p>
        <p class="info">Please use the following One-Time Password (OTP) to verify your account:</p>
        
        <div class="otp-code">${otp}</div>
        
        <p class="info">This OTP is valid for <strong>5 minutes</strong>.</p>
        <p class="info" style="font-size: 13px; color: #7D8478;">If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
          <p>© 2026 Disaster Relief Coordination Platform</p>
          <p>Making a difference when it matters most.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome Email Template
export const getWelcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Disaster Relief</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #FAF3EB; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 40px; box-shadow: 0 8px 32px rgba(79, 88, 68, 0.12); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 700; color: #4F5844; }
        .cta-btn { display: inline-block; background: #4F5844; color: #FFFFFF; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .footer { text-align: center; margin-top: 30px; color: #7D8478; font-size: 12px; border-top: 1px solid #E8E3DC; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ Disaster Relief</div>
        </div>
        <h2 style="text-align: center; color: #2B2F2A;">Welcome, ${name}! 👋</h2>
        <p style="color: #50584C; text-align: center; line-height: 1.6;">
          Your account has been successfully verified. You're now part of a community dedicated to saving lives during disasters.
        </p>
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-btn">Go to Dashboard</a>
        </div>
        <div class="footer">
          <p>© 2026 Disaster Relief Coordination Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
};