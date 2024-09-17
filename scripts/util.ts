import { readFile, writeFile } from 'node:fs/promises';

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
