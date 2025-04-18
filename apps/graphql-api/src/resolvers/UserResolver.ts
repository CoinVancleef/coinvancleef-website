import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { User, prisma, Role } from 'database';
import { UserInput, UpdateProfileInput } from '../inputs/UserInput';
import { LoginInput } from '../inputs/LoginInput';
import { UserResponse } from '../types/UserResponse';
import { UserModel } from '../types/UserModel';
import { PasswordChangeResponse } from '../types/PasswordChangeResponse';
import { PasswordResetResponse } from '../types/PasswordResetResponse';
import { RequestPasswordResetInput, ResetPasswordInput } from '../inputs/PasswordResetInput';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types/Context';
import {
  generatePasswordResetToken,
  sendPasswordResetEmail,
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from '../services/emailService';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async dbTest(): Promise<string> {
    try {
      // Attempt a simple database query
      await prisma.$queryRaw`SELECT 1`;
      return 'Database connection successful!';
    } catch (error: any) {
      console.error('Database connection test error:', error);
      return `Database connection failed: ${error.message}`;
    }
  }

  @Query(() => [UserModel])
  async users(): Promise<User[]> {
    return prisma.user.findMany();
  }

  @Query(() => UserModel, { nullable: true })
  async user(@Arg('publicUuid') publicUuid: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { public_uuid: publicUuid } });
  }

  @Mutation(() => UserResponse)
  async register(@Arg('data') data: UserInput): Promise<UserResponse> {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

      if (existingUser) {
        return {
          errors: [{ field: 'email', message: 'Email already in use' }],
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: Role.USER,
          danmaku_points: 0,
          twitterHandle: data.twitterHandle || null,
          youtubeChannel: data.youtubeChannel || null,
          twitchChannel: data.twitchChannel || null,
          discord: data.discord || null,
          country: data.country || null,
        },
      });

      // Create token using public_uuid instead of id
      const token = jwt.sign({ userId: user.public_uuid }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1d',
      });

      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);

      // Return more specific error messages based on error type
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return {
          errors: [{ field: 'email', message: 'This email is already in use' }],
        };
      }

      if (error.message.includes('database')) {
        return {
          errors: [
            { field: 'database', message: 'Database connection error. Please try again later.' },
          ],
        };
      }

      if (error.message.includes('validation')) {
        return {
          errors: [{ field: 'validation', message: error.message }],
        };
      }

      return {
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(@Arg('data') data: LoginInput): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({ where: { email: data.email } });

      if (!user) {
        return {
          errors: [{ field: 'email', message: 'User not found' }],
        };
      }

      const valid = await bcrypt.compare(data.password, user.password);

      if (!valid) {
        return {
          errors: [{ field: 'password', message: 'Invalid password' }],
        };
      }

      // Create token using public_uuid instead of id
      const token = jwt.sign({ userId: user.public_uuid }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1d',
      });

      return { user, token };
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message.includes('database')) {
        return {
          errors: [
            { field: 'database', message: 'Database connection error. Please try again later.' },
          ],
        };
      }

      return {
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateProfile(
    @Arg('data') data: UpdateProfileInput,
    @Ctx() ctx: Context,
  ): Promise<UserResponse> {
    try {
      if (!ctx.user) {
        return {
          errors: [{ field: 'auth', message: 'Not authenticated' }],
        };
      }

      // Update the user profile
      const user = await prisma.user.update({
        where: { public_uuid: ctx.user.public_uuid },
        data: {
          name: data.name !== undefined ? data.name : ctx.user.name,
          email: data.email !== undefined ? data.email : ctx.user.email,
          twitterHandle:
            data.twitterHandle !== undefined ? data.twitterHandle : ctx.user.twitterHandle,
          youtubeChannel:
            data.youtubeChannel !== undefined ? data.youtubeChannel : ctx.user.youtubeChannel,
          twitchChannel:
            data.twitchChannel !== undefined ? data.twitchChannel : ctx.user.twitchChannel,
          discord: data.discord !== undefined ? data.discord : ctx.user.discord,
          profilePicture:
            data.profilePicture !== undefined ? data.profilePicture : ctx.user.profilePicture,
        },
      });

      return { user };
    } catch (error: any) {
      console.error('Update profile error:', error);

      if (error.message.includes('database')) {
        return {
          errors: [
            { field: 'database', message: 'Database connection error. Please try again later.' },
          ],
        };
      }

      return {
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }

  @Mutation(() => PasswordChangeResponse)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg('currentPassword') currentPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() ctx: Context,
  ): Promise<PasswordChangeResponse> {
    try {
      if (!ctx.user) {
        return {
          success: false,
          message: 'Not authenticated',
          errors: [{ field: 'auth', message: 'Not authenticated' }],
        };
      }

      // Get the user with the password
      const user = await prisma.user.findUnique({
        where: { public_uuid: ctx.user.public_uuid },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          errors: [{ field: 'auth', message: 'User not found' }],
        };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Current password is incorrect',
          errors: [{ field: 'currentPassword', message: 'Current password is incorrect' }],
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      console.error('Change password error:', error);

      if (error.message.includes('database')) {
        return {
          success: false,
          message: 'Database error',
          errors: [
            { field: 'database', message: 'Database connection error. Please try again later.' },
          ],
        };
      }

      return {
        success: false,
        message: 'An error occurred',
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }

  // Get all users for leaderboard (no sensitive data)
  @Query(() => [UserModel])
  async leaderboard(): Promise<UserModel[]> {
    return prisma.user.findMany({
      orderBy: {
        danmaku_points: 'desc',
      },
      select: {
        public_uuid: true,
        name: true,
        role: true,
        danmaku_points: true,
        totalClears: true,
        lnn: true,
        lnb: true,
        l1cc: true,
        globalRank: true,
        twitterHandle: true,
        youtubeChannel: true,
        twitchChannel: true,
        discord: true,
        country: true,
        profilePicture: true,
        createdAt: true,
      },
    });
  }

  @Mutation(() => PasswordResetResponse)
  async requestPasswordReset(@Arg('email') email: string): Promise<PasswordResetResponse> {
    try {
      console.log(`Password reset requested for email: ${email}`);

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });

      // If no user found, still return success to prevent email enumeration
      if (!user) {
        console.log(`No user found with email: ${email}`);
        return {
          success: true,
          message: 'If an account with that email exists, we have sent a password reset link.',
        };
      }

      console.log(`User found: ${user.id} (${user.email})`);

      // Generate and store a token for the user
      let token;
      try {
        token = await generatePasswordResetToken(user.id);
        console.log(`Token generated successfully`);
      } catch (tokenError) {
        console.error('Error generating reset token:', tokenError);
        return {
          success: false,
          message:
            'There was a problem generating the password reset token. Please try again later.',
          errors: [{ field: 'unknown', message: 'Failed to generate password reset token.' }],
        };
      }

      // Send the reset email
      try {
        const emailSent = await sendPasswordResetEmail(user.email, token);

        if (!emailSent) {
          // Log the issue but don't tell the user (to prevent email enumeration)
          console.warn(`Email sending failed for: ${user.email} - Resend not initialized`);

          // In development, we still want to succeed so we can test with the console link
          if (process.env.NODE_ENV === 'development') {
            console.log(`Development mode: Continuing with password reset despite email failure`);
            return {
              success: true,
              message:
                'If an account with that email exists, we have sent a password reset link. (Check server logs for the link)',
            };
          } else {
            // In production, this is a real failure if emails don't send
            console.error(`Production mode: Password reset failed due to email sending failure`);
            return {
              success: false,
              message:
                'There was a problem sending the password reset email. Please try again later.',
              errors: [{ field: 'email', message: 'Failed to send password reset email.' }],
            };
          }
        }

        console.log(`Password reset email sent successfully to: ${user.email}`);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);

        // In development, we still want to succeed so we can test with the console link
        if (process.env.NODE_ENV === 'development') {
          console.log(`Development mode: Continuing with password reset despite email error`);
          return {
            success: true,
            message:
              'If an account with that email exists, we have sent a password reset link. (Check server logs for the link)',
          };
        }

        return {
          success: false,
          message: 'There was a problem sending the password reset email. Please try again later.',
          errors: [{ field: 'email', message: 'Failed to send password reset email.' }],
        };
      }

      return {
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      };
    } catch (error: any) {
      console.error('Request password reset error:', error);

      return {
        success: false,
        message: 'There was a problem processing your request. Please try again later.',
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }

  @Mutation(() => PasswordResetResponse)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
  ): Promise<PasswordResetResponse> {
    try {
      // Validate token
      const userId = await verifyPasswordResetToken(token);

      if (!userId) {
        return {
          success: false,
          message: 'Invalid or expired password reset token.',
          errors: [{ field: 'token', message: 'Invalid or expired password reset token.' }],
        };
      }

      // Validate password
      if (newPassword.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long.',
          errors: [{ field: 'password', message: 'Password must be at least 6 characters long.' }],
        };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      // Delete the token
      await deletePasswordResetToken(token);

      return {
        success: true,
        message:
          'Your password has been successfully reset. You can now log in with your new password.',
      };
    } catch (error: any) {
      console.error('Reset password error:', error);

      return {
        success: false,
        message: 'There was a problem resetting your password. Please try again later.',
        errors: [
          { field: 'unknown', message: `Error: ${error.message || 'Something went wrong'}` },
        ],
      };
    }
  }
}
