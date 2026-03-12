import path from 'path';
import dotenv from 'dotenv';

/**
 * @internal
 */
export const loadEnv = (): void => {
  // Pick .env file from e2e root directory
  dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') });
};
