import * as crypto from 'crypto';
import { prisma } from 'database';
import { Resend } from 'resend';

// Track if Resend is initialized
let resend: Resend | null = null;
const isDev = process.env.NODE_ENV === 'development';

// Initialize the email service
export function initializeEmailService(): boolean {
  // Check for environment variables first
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing. Password reset emails will not be sent.');
    return false;
  }

  if (!fromEmail) {
    console.warn('⚠️ RESEND_FROM_EMAIL is not set. Using default sender email.');
  }

  try {
    // Initialize Resend
    resend = new Resend(apiKey);

    // Test the API key in development only
    if (isDev) {
      resend.emails
        .send({
          from: fromEmail || 'Coinvancleef <noreply@mail.coinvancleef.com>',
          to: 'test@example.com', // This email isn't actually sent
          subject: 'API Test',
          text: 'This is a test',
        })
        .then(() => {
          console.log('✅ Resend email service initialized successfully');
        })
        .catch(err => {
          console.error('❌ Resend API test failed:', err.message);
        });
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Resend:', error);
    return false;
  }
}

// Generate a unique token for password reset
export async function generatePasswordResetToken(userId: bigint): Promise<string> {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');

  // Calculate expiration time (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  try {
    // Store token in database
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    throw error;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // If Resend is not initialized, just log the link
  if (!resend) {
    console.error('❌ Resend not initialized. Cannot send password reset email.');

    // For development, log the reset link and continue
    if (isDev) {
      console.log('\n==================================');
      console.log('📧 PASSWORD RESET LINK (DEV MODE)');
      console.log('==================================');
      console.log('For user:', email);
      console.log('Reset Link:', resetUrl);
      console.log('==================================\n');
      return true;
    }

    return false;
  }

  try {
    // Email data
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'Coinvancleef <noreply@mail.coinvancleef.com>',
      to: email,
      subject: 'Reset Your Password - Coinvancleef',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Password Reset Request</h2>
          <p>You recently requested to reset your password for your Coinvancleef account. Use the button below to reset it. <strong>This password reset link is only valid for 1 hour.</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block;">Reset Your Password</a>
          </div>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p>For security, this request was received from the Coinvancleef website. If you have any concerns, please contact support.</p>
          <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">© Coinvancleef</p>
          <p style="color: #6b7280; font-size: 12px;">If the button above doesn't work, copy and paste this link into your browser: ${resetUrl}</p>
        </div>
      `,
    };

    // Send the email
    const response = await resend.emails.send(emailData);

    // Only log success message in development
    if (isDev && response?.data?.id) {
      console.log(`✅ Password reset email sent to ${email}`);
    }

    // In development, always log the reset link as backup
    if (isDev) {
      console.log(`📧 Password reset link (backup): ${resetUrl}`);
    }

    return true;
  } catch (error) {
    console.error(
      '❌ Error sending password reset email:',
      error instanceof Error ? error.message : error,
    );

    // In development, log the link for testing
    if (isDev) {
      console.log('\n==================================');
      console.log('📧 PASSWORD RESET LINK (FALLBACK)');
      console.log('==================================');
      console.log('For user:', email);
      console.log('Reset Link:', resetUrl);
      console.log('==================================\n');
      return true;
    }

    return false;
  }
}

// Verify a password reset token
export async function verifyPasswordResetToken(token: string): Promise<bigint | null> {
  try {
    // Find the token in the database
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return null;
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return null;
    }

    return resetToken.userId;
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    return null;
  }
}

// Delete a password reset token after it's been used
export async function deletePasswordResetToken(token: string): Promise<boolean> {
  try {
    await prisma.passwordResetToken.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    console.error('Error deleting password reset token:', error);
    return false;
  }
}
