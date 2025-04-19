import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { prisma, Role, User } from 'database';
import { Context } from '../types/Context';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    const prismaUser = await prisma.user.findUnique({
      where: { public_uuid: payload.userId },
    });

    if (!prismaUser) {
      throw new Error('User not found');
    }

    // Convert Prisma User to our expected User type for context
    const user: User = {
      ...prismaUser,
      // Ensure role is the expected type
      role: prismaUser.role as unknown as Role,
    };

    context.user = user;

    return next();
  } catch (err: any) {
    console.error('Authentication error:', err.message);
    throw new Error('Not authenticated');
  }
};
