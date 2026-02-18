/* eslint-disable no-console */
import { readFile, rename, readdir, stat } from 'node:fs/promises';
import { resolve, basename, extname } from 'node:path';
import { deflate, inflate } from 'node:zlib';
import { promisify } from 'node:util';
import { execa } from 'execa';
import { transformFile } from './util.js';

const deflateP = promisify(deflate);
const inflateP = promisify(inflate);

async function getDocPath(): Promise<string> {
  const configContent = await readFile('tsconfig.typedoc.json', 'utf8');
  return resolve(JSON.parse(configContent).typedocOptions.out);
}

async function isDirectory(entryPath: string): Promise<boolean> {
  const stats = await stat(entryPath);
  return stats.isDirectory();
}

const flatten = (arr: any[]): any[] =>
  arr.reduce(
    (prev, curr) =>
      curr instanceof Array ? [...prev, ...flatten(curr)] : [...prev, curr],
    []
  );

async function readDir(absPath: string): Promise<string[]> {
  const entries = await readdir(absPath);
  const paths = await Promise.all(
    entries.map(async (file: string) => {
      const filePath = resolve(absPath, file);
      const isDir = await isDirectory(filePath);
      return isDir ? readDir(filePath) : filePath;
    })
  );
  return flatten(paths);
}

const isHtmlFile = (fileName: string) => extname(fileName) === '.html';
const isSearchJs = (fileName: string) => basename(fileName) === 'search.js';
const isNavigationJs = (fileName: string) =>
  basename(fileName) === 'navigation.js';

async function adjustForGitHubPages(docPath: string) {
  const documentationFilePaths = await readDir(resolve(docPath));
  const htmlPaths = documentationFilePaths.filter(isHtmlFile);

  await adjustSearchJs(documentationFilePaths);
  await adjustNavigationJs(documentationFilePaths);

  await Promise.all(
    htmlPaths.map((filePath: string) =>
      transformFile(filePath, (file: string) =>
        file.replace(/<a href="[^>]*_[^>]*.html[^>]*>/gi, removeUnderlinePrefix)
      )
    )
  );

  await Promise.all(
    htmlPaths.map((filePath: string) => removeUnderlinePrefixFromFileName(filePath))
  );
}

/**
 * Decompresses Base64-encoded deflate compressed data and parses it into a JSON object.
 * @link https://github.com/TypeStrong/typedoc/blob/82449253188582f6b63695fecf608d9887ba1761/src/lib/output/themes/default/assets/typedoc/utils/decompress.ts
 */
async function decompressJson(base64: string) {
  const buffer = Buffer.from(base64, 'base64');
  const decompressed = await inflateP(buffer);
  return JSON.parse(decompressed.toString('utf8'));
}

/**
 * Compresses a JSON-serializable object into a Base64-encoded deflate string.
 * @link https://github.com/TypeStrong/typedoc/blob/82449253188582f6b63695fecf608d9887ba1761/src/lib/utils/compress.ts
 */
async function compressJson(data: any) {
  const gz = await deflateP(Buffer.from(JSON.stringify(data)));
  return gz.toString('base64');
}

async function adjustSearchJs(paths: string[]) {
  const filtered = paths.filter(isSearchJs);
  if (filtered.length !== 1) {
    throw Error(`Expected one 'search.js', but found: ${filtered.length}.`);
  }

  await transformFile(filtered[0], async (file: string) => {
    const dataRegexResult = /window.searchData = "(.*)";/.exec(file);
    if (!dataRegexResult) {
      throw Error(
        `Cannot adjust links in 'search.js'. File content did not match expected pattern.`
      );
    }

    const searchItems = await decompressJson(dataRegexResult[1]);
    searchItems.rows.forEach((s: any) => {
      s.url = removeUnderlinePrefix(s.url);
    });

    const encodedAdjustedData = await compressJson(searchItems);
    return `window.searchData = "${encodedAdjustedData}"`;
  });
}

async function adjustNavigationJs(paths: string[]) {
  const filtered = paths.filter(isNavigationJs);
  if (filtered.length !== 1) {
    throw Error(`Expected one 'navigation.js', but found: ${filtered.length}.`);
  }

  await transformFile(filtered[0], async (file: string) => {
    const dataRegexResult = /window.navigationData = "(.*)"/.exec(file);
    if (!dataRegexResult) {
      throw Error(
        `Cannot adjust links in 'navigation.js'. File content did not match expected pattern.`
      );
    }

    const navigationItems = await decompressJson(dataRegexResult[1]);
    navigationItems
      .filter((n: any) => n.path)
      .forEach((n: any) => {
        n.path = removeUnderlinePrefix(n.path);
        n.children.forEach((c: any) => {
          c.path = removeUnderlinePrefix(c.path);
        });
      });

    const encodedAdjustedData = await compressJson(navigationItems);
    return `window.navigationData = "${encodedAdjustedData}"`;
  });
}

function removeUnderlinePrefix(str: string) {
  const i = str.indexOf('_');
  // Remove the first `_`
  return str.substring(0, i) + str.substring(i + 1);
}

async function removeUnderlinePrefixFromFileName(filePath: string): Promise<void> {
  const newPath = filePath.replace(/_.*.html/gi, function (x) {
    return x.substring(1);
  });
  await rename(filePath, newPath);
}

async function insertCopyright(docPath: string) {
  const allPaths = await readDir(resolve(docPath));
  const filePaths = allPaths.filter(isHtmlFile);

  await Promise.all(
    filePaths.map(async (filePath: string) => {
      const copyrightDiv = `<div class="container"><p>Copyright Ⓒ ${new Date().getFullYear()} SAP SE or an SAP affiliate company. All rights reserved.</p></div>`;
      return transformFile(filePath, (file: string) => {
        const lines = file.split('\n');
        // Insert the copyright div before the line including </footer>
        lines.splice(
          lines.findIndex((line: string) => line.includes('</footer>')),
          0,
          copyrightDiv
        );
        return lines.join('\n');
      });
    })
  );
}

function validateLogs(generationLogs: string) {
  const invalidLinksMessage =
    'Found invalid symbol reference(s) in JSDocs, they will not render as links in the generated documentation.';
  const [, invalidLinks] = generationLogs.split(invalidLinksMessage);
  if (invalidLinks) {
    throw Error(`Error: ${invalidLinksMessage}\n${invalidLinks}`);
  }
}

async function generateDocs() {
  const generationLogs = await execa('typedoc', ['--tsconfig', 'tsconfig.typedoc.json'], {
    cwd: resolve()
  });
  validateLogs(generationLogs.stdout);
  
  const docPath = await getDocPath();
  await adjustForGitHubPages(docPath);
  await insertCopyright(docPath);
}

process.on('unhandledRejection', reason => {
  console.error(`Unhandled rejection at: ${reason}`);
  process.exit(1);
});

generateDocs();