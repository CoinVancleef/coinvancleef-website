/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    // Handle relative imports in the tests
    '^@/(.*)$': '<rootDir>/src/$1',
    // Map touhou-types to the web app's types
    '^@touhou-types/(.*)$': '<rootDir>/../web/src/touhou-types/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
