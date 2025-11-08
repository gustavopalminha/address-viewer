// We save the original process.env
const originalEnv = process.env;

describe('Application Configuration', () => {
  // Before each test, reset modules and restore environment
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  // After all tests, restore the original environment
  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default port 81 if PORT is not set', async () => {
    delete process.env.PORT;
    // We must 'require' inside the test to load the new env
    const config = (await import('./index')).default;
    expect(config.PORT).toBe(81);
  });

  it('should return correct port from process.env.PORT', async () => {
    process.env.PORT = '3000';
    const config = (await import('./index')).default;
    expect(config.PORT).toBe(3000);
  });

  it('should return "development" if NODE_ENV is not "production"', async () => {
    delete process.env.NODE_ENV;
    const config = (await import('./index')).default;
    expect(config.NODE_ENV).toBe('development');
  });

  it('should return "production" if NODE_ENV is "production"', async () => {
    process.env.NODE_ENV = 'production';
    const config = (await import('./index')).default;
    expect(config.NODE_ENV).toBe('production');
  });

  it('should have a api prefix', async () => {
    const config = (await import('./index')).default;
    expect(config.API.PREFIX).toBe('/');
  });
});