import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { ModuleInfos, init } from 'license-checker';
import { createLogger } from '@sap-cloud-sdk/util';

const logger = createLogger('check-licenses');

// Here all permissive FLOSS licenses are ok, see https://en.wikipedia.org/wiki/Permissive_software_license
// We just added the most common ones here. If one is in the wiki list and not here add it.
const allowedLicenses = [
  'MIT',
  'Apache',
  'ISC',
  'BSD',
  'WTFPL',
  'CC-BY',
  'CC0',
  'Unlicense',
  'Public Domain'
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getLicenses(): Promise<ModuleInfos> {
  return new Promise((resolvePromise, reject) => {
    init(
      {
        start: resolve(__dirname, '..'),
        direct: true,
        summary: true,
        json: true,
        production: true
      },
      function (err, packages: ModuleInfos) {
        if (err) {
          reject(`Could not check licenses. Error: ${err}`);
        }
        resolvePromise(packages);
      }
    );
  });
}

function isAllowedLicense(licenses: string | string[] | undefined): Boolean {
  return Array.isArray(licenses)
    ? isAllowedLicense(licenses.join(','))
    : allowedLicenses.some(allowedLicense => licenses?.includes(allowedLicense));
}

function isSapDependency(dependency: string) {
  // Exclude root package from license check
  if (dependency.startsWith('sap-ai-sdk')) {
    return true;
  }
  const [scope] = dependency.split('/');
  return scope === '@sap' || scope === '@sap-ai-sdk';
}

async function checkLicenses() {
  const licenses = await getLicenses();
  const notAllowedDependencies = Object.entries(licenses)
    .filter(([, licenseInfo]) => !isAllowedLicense(licenseInfo.licenses))
    .filter(([packageName]) => !isSapDependency(packageName));

  if (notAllowedDependencies.length) {
    notAllowedDependencies.forEach(notAllowedDependency => {
      logger.error(
        `Not allowed license ${notAllowedDependency[1].licenses} found for dependency: ${notAllowedDependency[0]}.`
      );
    });
    logger.error(
      'Check if the faulty licenses are in the FLOSS list: https://en.wikipedia.org/wiki/Category:Free_and_open-source_software_licenses and update the check script accordingly.'
    );
    process.exit(1);
  }

  logger.info('License check completed.')
}

checkLicenses();
