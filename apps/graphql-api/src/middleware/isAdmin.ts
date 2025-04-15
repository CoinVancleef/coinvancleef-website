import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/Context';

export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.user) {
    throw new Error('Not authenticated');
  }

  if (context.user.role !== 'ADMIN') {
    throw new Error('Not authorized. Admin access required.');
  }

  return next();
};
