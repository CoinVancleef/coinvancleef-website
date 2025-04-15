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

// Load environment variables from multiple locations
// First try the API directory
console.log('Attempting to load env from:', path.resolve(__dirname, '../.env'));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Then try the prisma directory
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found, trying prisma directory');
  dotenv.config({ path: path.resolve(__dirname, '../../../packages/database/prisma/.env') });
}

// Then try the database directory
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found, trying database directory');
  dotenv.config({ path: path.resolve(__dirname, '../../../packages/database/.env') });
}

// Then try the root directory
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found, trying root directory');
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });
}
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found, trying .env.development');
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.development') });
}
if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found, trying .env');
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

// Log environment status
console.log('Database URL configured:', !!process.env.DATABASE_URL);
console.log(
  'Database URL first 20 chars:',
  process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'undefined',
);
console.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);
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
    context: ({ req, res }) => {
      // Return the request and response objects which will be available in resolvers
      return { req, res };
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
