import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * @internal
 */
export async function transformFile(
  filePath: string,
  transformFn: (file: string) => Promise<string> | string
): Promise<void> {
  const file = await readFile(filePath, { encoding: 'utf8' });
  const transformedFile = await transformFn(file);
  await writeFile(filePath, transformedFile, { encoding: 'utf8' });
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
  const { includeDir = () => true, includeFile = () => true } = opts || {};
  const files = await readdir(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);

    try {
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory() && includeDir(filePath)) {
        await transformFilesInDirectory(filePath, transformFn, opts); // Recursive traversal for directories
      } else if (fileStats.isFile() && includeFile(filePath)) {
        await transformFile(filePath, transformFn);
      }
    } catch (err) {
      throw new Error(`Error processing ${filePath}: ${err}`);
    }
  }
}
