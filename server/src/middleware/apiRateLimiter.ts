import rateLimit, { MemoryStore } from 'express-rate-limit';

// 1. Create the store instance
// We must create it explicitly so we can export it and
// call .shutdown() on it in our tests.
const apiLimiterStore = new MemoryStore();

// 2. Create the limiter and pass the store
const apiLimiter = rateLimit({
  store: apiLimiterStore, // <-- Pass the store here
  windowMs: 1 * 60 * 1000,
  max: 25,
  message: {
    message: 'Too many requests from this IP, please try again after a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Export both the limiter and the store as named exports
export { apiLimiter, apiLimiterStore };