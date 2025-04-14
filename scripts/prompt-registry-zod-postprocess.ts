import fs from 'fs';
import path from 'path';

const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.zod.ts'));

for (const file of files) {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Patch .zod' → .zod.js'
  content = content.replace(/\.zod'/g, ".zod.js'");

  // Patch .and(...) → .passthrough() in specific file
  if (file === 'prompt-template-spec.zod.ts') {
    content = content.replace(
      /\.and\(z\.record\(z\.record\(z\.any\(\)\)\)\);/,
      '.passthrough();'
    );
  }

  // Add multiline /** @internal */ before each export const
  content = content.replace(
    /^(export const )/gm,
    `/**\n * @internal\n **/\n$1`
  );

  fs.writeFileSync(filePath, content);
  console.log(`✔ Patched ${file}`);
}
