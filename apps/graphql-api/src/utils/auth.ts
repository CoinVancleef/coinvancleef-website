import jwt from 'jsonwebtoken';
import { prisma, User, Role } from 'database';
import { toBigInt } from './prismaHelpers';

/**
 * Get user from JWT token
 * @param authorization Authorization header value (Bearer token)
 * @returns User if found, null otherwise
 */
export const getUserFromToken = async (authorization: string): Promise<User | null> => {
  if (!authorization) {
    return null;
  }

  try {
    // Extract token from "Bearer token" format
    const token = authorization.startsWith('Bearer ') ? authorization.substring(7) : authorization;

    if (!token) {
      return null;
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    if (!payload || !payload.userId) {
      return null;
    }

    // Find user by public UUID
    const prismaUser = await prisma.user.findUnique({
      where: { public_uuid: payload.userId },
    });

    if (!prismaUser) return null;

    // Convert to match our User type
    const user: User = {
      ...prismaUser,
      // Ensure enums match our expected types
      role: prismaUser.role as unknown as Role,
    };

    return user;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};
