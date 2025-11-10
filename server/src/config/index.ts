/**
 * Centralized application configuration.
 *
 */

// Function to validate and parse the PORT
const getPort = (): number => {
  const port = process.env.PORT;
  if (port) {
    const parsedPort = parseInt(port, 10);
    if (!isNaN(parsedPort) && parsedPort > 0) {
      return parsedPort;
    }
  }
  // Default to 8080 if not specified or invalid
  return 8080;
};

// Function to validate the NODE_ENV
const getEnv = (): 'development' | 'production' => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return 'production';
  }
  return 'development';
};

// Define the config object
const config = {
  /**
   * The application environment.
   * Defaults to 'development' if not in 'production'.
   */
  NODE_ENV: getEnv(),

  /**
   * The port the server will run on.
   * Reads from process.env.PORT, defaults to 8080.
   */
  PORT: getPort(),

  /**
   * The prefix for all API routes (e.g., /api)
   */
  API: {
    PREFIX: '/',
  },
};

// Export the config as an immutable (frozen) object
export default Object.freeze(config);