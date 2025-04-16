import jwt from 'jsonwebtoken';
import { prisma, User } from 'database';

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
    const user = await prisma.user.findUnique({
      where: { public_uuid: payload.userId },
    });

    return user;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};
