import { createLogger } from '@sap-cloud-sdk/util';
import { checkApiOfPackage } from './check-public-api.js';

const logger = createLogger('check-public-api');

checkApiOfPackage(process.cwd()).catch(err => {
  logger.error(err);
  process.exit(1);
});
