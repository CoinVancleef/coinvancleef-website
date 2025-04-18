import 'reflect-metadata';
// @ts-ignore
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ClearEntryResolver } from './resolvers/ClearEntryResolver';
import cors from 'cors';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from 'database';
import { getUserFromToken } from './utils/auth';

// Load environment variables from multiple locations
// First try the API directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Then try the prisma directory
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../packages/database/prisma/.env') });
}

// Then try the database directory
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../packages/database/.env') });
}

// Then try the root directory
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });
}
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.development') });
}
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

if (!process.env.JWT_SECRET) {
  console.warn(
    'Warning: JWT_SECRET is not set. Using fallback secret. This is not secure for production.',
  );
}

async function bootstrap() {
  // Create Express application
  const app = express();

  // Enable CORS
  app.use(cors());

  // Build TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [UserResolver, ClearEntryResolver],
    emitSchemaFile: true,
    validate: false,
    // Skip checking duplicate types
    skipCheck: true,
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      // Get token from authorization header
      const token = req.headers.authorization || '';

      // Get user from token if available
      let user;
      try {
        user = await getUserFromToken(token);
      } catch (error) {
        // Log error but continue without user
        console.error('Error retrieving user from token:', error);
      }

      // Return context with prisma and user if available
      return {
        req,
        res,
        prisma,
        user,
      };
    },
  });

  await server.start();

  // Apply middleware
  server.applyMiddleware({ app });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

bootstrap().catch(console.error);
