import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { prisma } from 'database';
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

    const user = await prisma.user.findUnique({
      where: { public_uuid: payload.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    context.user = user;

    return next();
  } catch (err: any) {
    console.error('Authentication error:', err.message);
    throw new Error('Not authenticated');
  }
};
