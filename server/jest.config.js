/**
 * Jest configuration file for the Node.js/TypeScript server.
 * Ensures compatibility with ts-jest and Supertest (by enabling legacy timers).
 */
module.exports = {
  // Use ts-jest for handling TypeScript files
  preset: 'ts-jest', 
  
  // The test environment that will be used for testing (Node.js environment)
  testEnvironment: 'node',
  
  // Where to look for test files
  roots: ['<rootDir>/src'],
  
  // File patterns to recognize as test files
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // --- Timer Configuration (Fixes Deprecation Warning and Supertest Compatibility) ---
  // We use the modern 'fakeTimers' config, enabling legacy mode for Supertest/Express-rate-limit compatibility.
  fakeTimers: {
    enableGlobally: true, // Apply fake timers everywhere
    legacyFakeTimers: true, // Use the older implementation compatible with Supertest/Express-rate-limit
  },

  // Coverage setup (optional, but good for production-readiness)
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/server.ts', // Exclude simple entry point
    '!src/config/index.ts', // Exclude environment logic (already tested in config.spec.ts)
  ],

  // Setup file for Jest (if necessary, currently not)
  setupFilesAfterEnv: [],
};