import { resolve } from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fs, vol } from 'memfs';

vi.mock('fs/promises', () => fs.promises);

import { getPackageVersion } from './get-package-version.ts';

describe('get package version', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('returns the version of the package json in the same directory', async () => {
    vol.fromJSON({ 'package.json': '{ "version": "1.2.3" }' });
    expect(await getPackageVersion()).toEqual('1.2.3');
  });

  it('returns the version of a designated package json', async () => {
    vol.fromJSON({ [resolve('dir', 'package.json')]: '{ "version": "4.5.6" }' });
    expect(await getPackageVersion(resolve('dir', 'package.json'))).toEqual(
      '4.5.6'
    );
  });
});
