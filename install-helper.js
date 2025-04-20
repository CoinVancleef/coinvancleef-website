#!/usr/bin/env node

// This is a helper script to work around pnpm + Node 20 compatibility issues
// See: https://github.com/pnpm/pnpm/issues/6499

const fs = require('fs');
const { execSync } = require('child_process');

// Ensure .npmrc exists with the right settings
try {
  const npmrcContent = `
engine-strict=false
node-linker=hoisted
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
fetch-retries=10
fetch-retry-mintimeout=60000
fetch-retry-maxtimeout=180000
use-node-fetch=true
prefer-frozen-lockfile=false
network-concurrency=1
registry=https://registry.npmjs.org/
`;

  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('Created compatible .npmrc file');

  // Try installing with npm if pnpm fails
  try {
    console.log('Attempting installation with pnpm...');
    execSync('pnpm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('pnpm install failed. Falling back to npm...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error in install helper:', error);
  process.exit(1);
}
