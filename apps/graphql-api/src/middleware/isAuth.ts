import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { prisma } from 'database';
import { Context } from '../types/Context';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  console.log('Auth Header:', authorization);

  if (!authorization) {
    console.log('No authorization header provided');
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    console.log('Token extracted:', token ? token.substring(0, 15) + '...' : 'no token');

    if (!token) {
      console.log('No token found in authorization header');
      throw new Error('No token provided');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    console.log('Token payload:', payload);

    const user = await prisma.user.findUnique({
      where: { public_uuid: payload.userId },
    });

    if (!user) {
      console.log(`User not found with public_uuid: ${payload.userId}`);
      throw new Error('User not found');
    }

    console.log(`User authenticated: ${user.email}`);
    context.user = user;

    return next();
  } catch (err: any) {
    console.error('Authentication error:', err.message);
    throw new Error('Not authenticated');
  }
};
