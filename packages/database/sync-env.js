/**
 * Synchronizes the appropriate environment file to Prisma's directory
 * Works on both Windows and Unix systems
 */
const fs = require('fs');
const path = require('path');

// Determine which environment to use
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Setting up Prisma environment for: ${NODE_ENV}`);

// Define source and target paths
const rootDir = path.resolve(__dirname, '../..');
const sourceFile = path.resolve(rootDir, `.env.${NODE_ENV}`);
const fallbackFile = path.resolve(rootDir, '.env');
const targetFile = path.resolve(__dirname, 'prisma/.env');

// Function to copy file contents
function syncEnvFile(source, target) {
  try {
    if (!fs.existsSync(source)) {
      console.error(`Source file not found: ${source}`);
      return false;
    }

    // Read source file
    const content = fs.readFileSync(source, 'utf8');

    // Write to target file
    fs.writeFileSync(target, content);
    console.log(`✓ Environment synced: ${source} → ${target}`);
    return true;
  } catch (error) {
    console.error(`Error syncing environment file: ${error.message}`);
    return false;
  }
}

// Try to sync the environment-specific file, fall back to .env
if (!syncEnvFile(sourceFile, targetFile) && !syncEnvFile(fallbackFile, targetFile)) {
  console.error('❌ Failed to sync any environment file to Prisma');
  process.exit(1);
}

console.log('✓ Prisma environment setup complete');
