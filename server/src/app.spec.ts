import { Request, Response } from 'express';
import request from 'supertest';

// NOTE: We import createApp, the factory function, not the instance
import createApp from './app'; 
import { apiLimiterStore } from './middleware/apiRateLimiter'; 

// --- Mock the Config Module (Guaranteed Environment Control) ---
// This ensures that when app.ts imports config, it gets the environment
// we dictate for the current test.
jest.mock('./config', () => ({
  __esModule: true,
  default: {
    // We start in development/test mode
    NODE_ENV: 'development', 
    API: {
      PREFIX: '/api',
    },
    PORT: 8080,
  },
}));

// --- Mock the Controller (REQUIRED to skip business logic and force a 200) ---
// This ensures the real router (api.ts) calls this mock, which guarantees 200.
jest.mock('./controllers/searchController', () => ({
  // We mock the exported function to simply send a success status
  searchAddresses: (_req: Request, res: Response) => res.status(200).json([]),
}));


// --- Global Teardown ---
afterAll(() => {
  jest.useRealTimers();
  apiLimiterStore.shutdown();
});

describe('App Middleware', () => {
  
  // Use the actual search route for testing the limiter
  const testPath = '/api/search/testquery'; 

  // --- Test 1: Standard Middleware (404) ---
  it('should return 404 for a non-existent route', async () => {
    // We create a new app instance just for this basic test
    const app = createApp();
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
  });

  // --- Test 2: Standard Middleware (Security Headers) ---
  it('should set production security headers (Helmet)', async () => {
    // We create a new app instance just for this basic test
    const app = createApp();
    const res = await request(app).get('/');

    // Check for core CSP header
    expect(res.headers['content-security-policy']).toBe(
      "default-src 'none'"
    );
    // Check for X-Frame-Options
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  // --- Block 3: Rate Limiting (Development) ---
  describe('Rate Limiting (Development)', () => {
    
    beforeAll(() => {
        // Reset the store
        apiLimiterStore.resetAll();
        // Config is already mocked to 'development' by default
    });

    it('should NOT rate limit requests in development (30 requests allowed)', async () => {
      const app = createApp();
      const agent = request(app);
      const expectedStatus = 200; 

      // Request limit is 25. We test 30 requests.
      const requests = [];
      for (let i = 0; i < 30; i++) {
        requests.push(agent.get(testPath));
      }
      
      // All 30 requests should be allowed because apiLimiter is skipped.
      const responses = await Promise.all(requests);
      responses.forEach((res) => expect(res.status).toBe(expectedStatus));
    });
  });

  // --- Block 4: Rate Limiting (Production) ---
  describe('Rate Limiting (Production)', () => {
    // We must re-mock the config *before* the app is created
    beforeAll(async () => {
        jest.resetModules(); // Force config module to reload

        // Re-mock config to return 'production'
        jest.doMock('./config', () => ({
          __esModule: true,
          default: {
            NODE_ENV: 'production', 
            API: { PREFIX: '/api' },
            PORT: 8080,
          },
        }));

        // Use fake timers to manipulate time window
        jest.useFakeTimers();
        apiLimiterStore.resetAll();
    });
    
    afterAll(() => {
        jest.useRealTimers();
    });

    it('should allow 25 requests but block the 26th in a minute', async () => {
      // Import the fresh app instance *inside* the isolated context
      const { default: createAppIsolated } = await import('./app');
      const app = createAppIsolated();
      const agent = request(app);

      const expectedStatus = 200; // Expected from the mocked controller
      const maxRequests = 25;

      // --- Make 25 successful requests ---
      const requests = [];
      for (let i = 0; i < maxRequests; i++) {
        requests.push(agent.get(testPath));
      }
      
      const responses = await Promise.all(requests);
      responses.forEach((res) => expect(res.status).toBe(expectedStatus));

      // --- Make the 26th request (should be blocked) ---
      const blockedRes = await agent.get(testPath);
      expect(blockedRes.status).toBe(429); // 429 Too Many Requests
      expect(blockedRes.body.message).toContain('Too many requests');

      // --- Fast-forward time by 1 minute ---
      jest.advanceTimersByTime(60 * 2000);
      
      // --- Make a 27th request (should be allowed again) ---
      const newRes = await agent.get(testPath);
      expect(newRes.status).toBe(expectedStatus);

    });
  });
});