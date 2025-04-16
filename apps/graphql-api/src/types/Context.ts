import { PrismaClient, User } from 'database';
import { Request, Response } from 'express';

// Define a User type that matches the structure expected in the context

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  user?: User;
}
