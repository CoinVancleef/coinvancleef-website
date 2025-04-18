/**
 * Application startup script that ensures environment variables are loaded
 * based on the current NODE_ENV setting.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Figure out which environment to load
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Starting application in ${NODE_ENV} mode`);

// Load the appropriate .env file
let envFile = `.env.${NODE_ENV}`;

// If the environment-specific file doesn't exist, fall back to .env
if (!fs.existsSync(path.resolve(process.cwd(), envFile))) {
  console.log(`No ${envFile} found, falling back to .env`);
  envFile = '.env';
}

// Load environment variables
console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: envFile });

// Also load .env.local for overrides if it exists
if (fs.existsSync(path.resolve(process.cwd(), '.env.local'))) {
  console.log('Loading local overrides from .env.local');
  dotenv.config({ path: '.env.local', override: true });
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_APP_URL',
  'FRONTEND_URL',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error(`Please check your ${envFile} and .env.local files.`);
  process.exit(1);
}

// Start the application
console.log('Environment loaded successfully, starting application...');
try {
  // Use the appropriate start command based on your package.json
  execSync('npm run start:original', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}
