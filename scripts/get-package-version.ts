import { readFile } from 'fs/promises';
import type { PathLike } from 'fs';

/**
 * Retrieves the version from a package.json file.
 * @param pathToRootPackageJson - Optional path to package.json file.
 * @returns Promise containing the version string.
 */
export async function getPackageVersion(
  pathToRootPackageJson?: PathLike
): Promise<string> {
  const packageJson = await readFile(
    pathToRootPackageJson || 'package.json',
    'utf8'
  );
  return JSON.parse(packageJson).version;
}
