import { readdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import { join, sep } from 'node:path';

const repoRootPath = realpath(join(import.meta.dirname, '..')).then(
  path => path + sep
);

async function validatePathInRepo(path: string): Promise<string> {
  const [canonicalPath, canonicalRepoRootPath] = await Promise.all([
    realpath(path),
    repoRootPath
  ]);

  if (!canonicalPath.startsWith(canonicalRepoRootPath)) {
    throw new Error(`Access denied: ${path} is outside the repository root.`);
  }

  return canonicalPath;
}

async function transformCanonicalFile(
  filePath: string,
  transformFn: (file: string) => Promise<string> | string
): Promise<void> {
  const file = await readFile(filePath, { encoding: 'utf8' });
  const transformedFile = await transformFn(file);
  await writeFile(filePath, transformedFile, { encoding: 'utf8' });
}

async function transformFilesInCanonicalDirectory(
  dirPath: string,
  transformFn: (file: string) => Promise<string> | string,
  opts?: {
    includeDir?: (dirPath: string) => boolean;
    includeFile?: (filePath: string) => boolean;
  }
): Promise<void> {
  const { includeDir = () => true, includeFile = () => true } = opts || {};
  const files = await readdir(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);

    try {
      const canonicalPath = await validatePathInRepo(filePath);
      const fileStats = await stat(canonicalPath);

      if (fileStats.isDirectory() && includeDir(canonicalPath)) {
        await transformFilesInCanonicalDirectory(
          canonicalPath,
          transformFn,
          opts
        );
      } else if (fileStats.isFile() && includeFile(canonicalPath)) {
        await transformCanonicalFile(canonicalPath, transformFn);
      }
    } catch (err) {
      throw new Error(`Error processing ${filePath}: ${err}`, { cause: err });
    }
  }
}

/**
 * @internal
 */
export async function transformFile(
  filePath: string,
  transformFn: (file: string) => Promise<string> | string
): Promise<void> {
  await transformCanonicalFile(await validatePathInRepo(filePath), transformFn);
}

/**
 * @internal
 */
export async function transformFilesInDirectory(
  dirPath: string,
  transformFn: (file: string) => Promise<string> | string,
  opts?: {
    includeDir?: (dirPath: string) => boolean;
    includeFile?: (filePath: string) => boolean;
  }
): Promise<void> {
  await transformFilesInCanonicalDirectory(
    await validatePathInRepo(dirPath),
    transformFn,
    opts
  );
}
