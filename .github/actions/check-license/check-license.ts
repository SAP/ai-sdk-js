import { setFailed, info } from '@actions/core';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);

interface BlueOakLicense {
  id: string;
  url: string;
}
interface BlueOakCategory {
  name: string;
  licenses: BlueOakLicense[];
}
interface PackageInfo {
  name: string;
  versions: string[];
}

const blueOakList: BlueOakCategory[] = require('@blueoak/list');

const ALLOWED_STATUSES = new Set(['Model', 'Gold', 'Silver', 'Bronze']);

const ADDITIONAL_ALLOWED = new Set([
  '(BSD-3-Clause OR GPL-2.0)',
  'CC-BY-3.0',
  'CC-BY-4.0'
]);

const ALLOWED_LICENSES = new Set([
  ...blueOakList
    .filter(({ name }) => ALLOWED_STATUSES.has(name))
    .flatMap(({ licenses }) => licenses)
    .map(({ id }) => id),
  ...ADDITIONAL_ALLOWED
]);

// Packages with no license field that are known to be safe
const ALLOWED_UNKNOWN = [
  'spawndamnit',
  'callsite',
  'opencode-linux-x64',
  'opencode-linux-x64-baseline',
  'opencode-linux-x64-baseline-musl',
  'opencode-linux-x64-musl'
];

function isSapDependency(name: string): boolean {
  const [scope] = name.split('/');
  return scope === '@sap' || scope === '@sap-cloud-sdk' || scope === '@sap-ai-sdk';
}

function isAllowedPackage(license: string, pkg: PackageInfo): boolean {
  return (
    isSapDependency(pkg.name) ||
    (license === 'Unknown' && ALLOWED_UNKNOWN.includes(pkg.name)) ||
    ALLOWED_LICENSES.has(license)
  );
}

function packageInfoToString(pkg: PackageInfo): string {
  const suffix =
    pkg.versions.length > 1
      ? `{${pkg.versions.join(', ')}}`
      : (pkg.versions[0] ?? '<unknown>');
  return `${pkg.name}@${suffix}`;
}

const json = execFileSync('pnpm', ['licenses', 'list', '--prod', '--json'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024
});

const licenseMap: Record<string, PackageInfo[]> = JSON.parse(json);

const disallowed = Object.entries(licenseMap).flatMap(([license, packages]) =>
  packages
    .filter(pkg => !isAllowedPackage(license, pkg))
    .map(pkg => ({ license, pkg }))
);

if (disallowed.length) {
  const messages = disallowed.map(
    ({ license, pkg }) =>
      `Disallowed license "${license}" used by: ${packageInfoToString(pkg)}`
  );
  setFailed(`Found ${disallowed.length} disallowed licenses:\n${messages.join('\n')}`);
} else {
  info('All production dependency licenses are acceptable.');
}
