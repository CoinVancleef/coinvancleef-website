import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { User, prisma, Role } from 'database';
import { UserInput, UpdateProfileInput } from '../inputs/UserInput';
import { LoginInput } from '../inputs/LoginInput';
import { UserResponse } from '../types/UserResponse';
import { UserModel } from '../types/UserModel';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types/Context';

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
          twitterHandle:
            data.twitterHandle !== undefined ? data.twitterHandle : ctx.user.twitterHandle,
          youtubeChannel:
            data.youtubeChannel !== undefined ? data.youtubeChannel : ctx.user.youtubeChannel,
          twitchChannel:
            data.twitchChannel !== undefined ? data.twitchChannel : ctx.user.twitchChannel,
          discord: data.discord !== undefined ? data.discord : ctx.user.discord,
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
}
