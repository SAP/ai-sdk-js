import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

/**
 * @internal
 */
export const loadEnv = (): void => {
  // Pick .env file from e2e root directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
};
