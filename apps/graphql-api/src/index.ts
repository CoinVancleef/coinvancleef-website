// Load environment variables first
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Determine which environment file to load based on NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

// Define paths to look for environment files
const envPaths = [
  // Environment-specific file in root
  path.resolve(__dirname, `../../../.env.${NODE_ENV}`),
  // Fallback to regular .env in root
  path.resolve(__dirname, '../../../.env'),
  // Local overrides
  path.resolve(__dirname, '../../../.env.local'),
];

// Try to load environment variables from each path
let loadedEnv = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    if (isDev) console.log(`Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
    loadedEnv = true;
  }
}

// Now load all other dependencies
import 'reflect-metadata';
// @ts-ignore
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ClearEntryResolver } from './resolvers/ClearEntryResolver';
import cors from 'cors';
import { prisma } from 'database';
import { getUserFromToken } from './utils/auth';
import { initializeEmailService } from './services/emailService';

// Check for crucial environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is missing');
  console.error('   The GraphQL API cannot start without a database connection.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️ Warning: JWT_SECRET is not set. Using fallback secret. This is not secure for production.',
  );
}

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ Warning: RESEND_API_KEY is not set. Email functionality will be limited.');
}

async function bootstrap() {
  // Create Express application
  const app = express();

  // Enable CORS
  app.use(cors());

  // Initialize email service
  const emailServiceInitialized = initializeEmailService();
  if (!emailServiceInitialized && isDev) {
    console.warn('Email service not initialized. Password reset functionality will be limited.');
  }

  // Build TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [UserResolver, ClearEntryResolver],
    emitSchemaFile: isDev, // Only emit schema file in development
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
    if (isDev) {
      console.log(`GraphQL playground: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Environment: ${NODE_ENV}`);
    }
  });
}

bootstrap().catch(console.error);
