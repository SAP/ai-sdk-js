import { vi, describe, it, expect, afterEach } from 'vitest';
import { fs, vol } from 'memfs';

vi.mock('fs/promises', () => fs.promises);

import { getPackageVersion } from './get-package-version.ts';

describe('get package version', () => {
  afterEach(() => {
    vol.reset();
  });

  it('returns the version of the package json in the same directory', async () => {
    vol.fromJSON({ 'package.json': '{ "version": "1.2.3" }' });
    await expect(getPackageVersion()).resolves.toEqual('1.2.3');
  });

  it('returns the version of a designated package json', async () => {
    vol.fromJSON({ 'dir/package.json': '{ "version": "4.5.6" }' });
    await expect(getPackageVersion('dir/package.json')).resolves.toEqual(
      '4.5.6'
    );
  });
});
