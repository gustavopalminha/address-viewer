import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import helmetParameters from './middleware/helmet';
import { apiLimiter } from './middleware/apiRateLimiter';

/**
 * Creates and configures the Express application instance.
 * @returns The Express application.
 */
const createApp = (): Express => {
  const app = express();

  // Production Requirement: Security middleware
  app.use(helmet(helmetParameters));
  app.use(helmet.xFrameOptions({ action: 'deny' }));

  // --- CONDITIONAL RATE LIMITER ---
  // Only apply the rate limiter when in 'production'
  // NOTE: This check runs every time createApp() is called,
  // which is necessary for testing different environments. [cite: 56]
  if (config.NODE_ENV === 'production') {
    app.use(apiLimiter);
  }

  app.use(cors());

  // Production Requirement: Logging [cite: 60]
  app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'short'));

  // Setup JSON
  app.use(express.json());

  // Mount API routes
  app.use(config.API.PREFIX, apiRoutes);

  // Global error handler (Production readiness)
  app.use(errorHandler);
  
  return app;
};

// Export the factory function, not the app instance
export default createApp;