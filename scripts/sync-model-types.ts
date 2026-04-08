/**
 * Reads scraped model rows from scripts/sap-models.json and patches the
 * LiteralUnion type blocks in packages/core/src/model-types.ts.
 * Run: pnpm tsx scripts/sync-model-types.ts
 */
/* eslint-disable no-console */

import { resolve } from 'node:path';
import { transformFile } from './util.js';

/** A single row from the SAP Notes model table. */
export interface ModelRow {
  /** The executable ID / access type (vendor). */
  executableId: string;
  /** The model name. */
  model: string;
  /** Whether the model is available in Orchestration ('yes'/'no'). */
  availableInOrchestration: string;
  /** Whether the model is deprecated ('yes'/'no'). */
  deprecated: string;
  /** Retirement date if set, empty string otherwise. */
  retirementDate: string;
  /** Suggested replacement model if deprecated, empty string otherwise. */
  suggestedReplacement: string;
}

const SAP_MODELS_PATH = resolve(import.meta.dirname, 'sap-models.json');

const MODEL_TYPES_PATH = resolve(
  import.meta.dirname,
  '../packages/core/src/model-types.ts'
);

// Models that should never be added to model-types.ts regardless of table state.
// Add model names here when a model has been intentionally removed from the type hints.
const MODEL_EXCLUSION_LIST = new Set<string>([
  'gpt-4o',      // Intentionally removed — deprecated despite having a non-deprecated row
  'gpt-4o-mini'  // Same reason
]);

// Maps executableId prefix (lowercase) to the TypeScript type name it belongs to.
// Embedding models are identified by model name containing 'embed'.
const EXECUTABLE_ID_TO_TYPE: Record<string, string> = {
  'azure-openai': 'AzureOpenAiChatModel',
  'aicore-anthropic': 'AwsBedrockChatModel',
  'aicore-amazon': 'AwsBedrockChatModel',
  'aws-bedrock': 'AwsBedrockChatModel',
  'aicore-google': 'GcpVertexAiChatModel',
  'gcp-vertexai': 'GcpVertexAiChatModel',
  'aicore-mistralai': 'AiCoreOpenSourceChatModel',
  'aicore-cohere': 'AiCoreOpenSourceChatModel',
  'aicore-sap': 'AiCoreOpenSourceChatModel',
  'aicore-perplexity': 'PerplexityChatModel',
  'perplexity-ai': 'PerplexityChatModel',
  'aicore-nvidia': 'AiCoreOpenSourceEmbeddingModel'
};

// Embedding overrides: if model name contains 'embed', remap to embedding type.
const EMBEDDING_TYPE_MAP: Record<string, string> = {
  AzureOpenAiChatModel: 'AzureOpenAiEmbeddingModel',
  AwsBedrockChatModel: 'AwsBedrockEmbeddingModel'
};

function resolveTypeName(row: ModelRow): string | null {
  // RPT models share the aicore-sap executableId with sap-abap-1 — distinguish by name.
  if (row.model.toLowerCase().startsWith('sap-rpt-')) {
    return 'SapRptModel';
  }

  const execId = row.executableId.toLowerCase().split('(')[0].trim();

  for (const [prefix, typeName] of Object.entries(EXECUTABLE_ID_TO_TYPE)) {
    if (execId.startsWith(prefix)) {
      const isEmbedding = row.model.toLowerCase().includes('embed');
      if (isEmbedding && EMBEDDING_TYPE_MAP[typeName]) {
        return EMBEDDING_TYPE_MAP[typeName];
      }
      return typeName;
    }
  }

  return null;
}

function isRetiredSoon(retirementDate: string): boolean {
  const normalized = retirementDate.trim().toLowerCase();
  if (!normalized || normalized.startsWith('no ') || normalized === '-') {
    return false;
  }

  // Extract a date from either "YYYY-MM-DD" or "not earlier than YYYY-MM-DD"
  const match = /(\d{4}-\d{2}-\d{2})/.exec(normalized);
  if (!match) {
    return false;
  }

  const retirement = new Date(match[1]);
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

  return retirement <= twoMonthsFromNow;
}

function isRetired(row: ModelRow): boolean {
  // Remove from type hints if:
  // - explicitly deprecated, OR
  // - retirement date (concrete or "not earlier than X") is within the next 2 months
  // Users can always pass the model name as a plain string regardless.
  return (
    row.deprecated?.toLowerCase().includes('yes') === true ||
    isRetiredSoon(row.retirementDate ?? '')
  );
}

function buildLiteralUnionBlock(existingModels: string[], activeModels: Set<string>): string {
  // Preserve existing order, remove retired models, append new ones at the end
  const kept = existingModels.filter(m => activeModels.has(m));
  const added = [...activeModels].filter(m => !existingModels.includes(m));
  const ordered = [...kept, ...added];

  if (ordered.length === 1) {
    return `LiteralUnion<'${ordered[0]}'>`;
  }
  const lines = ordered.map(m => `  | '${m}'`).join('\n');
  return `LiteralUnion<\n${lines}\n>`;
}

function extractCurrentModels(content: string, typeName: string): Set<string> {
  const regex = new RegExp(
    `export type ${typeName} =\\s*LiteralUnion<([\\s\\S]*?)>;`
  );
  const match = regex.exec(content);
  if (!match) {
    return new Set();
  }
  const inner = match[1];
  return new Set(
    [...inner.matchAll(/'([^']+)'/g)].map(m => m[1])
  );
}

function buildReleaseNote(
  added: string[],
  removed: Array<{ model: string; replacement: string; retirementDate: string }>
): string {
  const parts: string[] = [];

  if (added.length > 0) {
    const names = added.map(m => `\`${m}\``).join(', ');
    parts.push(`Added ${names} to the available model list.`);
  }

  if (removed.length > 0) {
    const descriptions = removed.map(r => {
      let desc = `\`${r.model}\``;
      if (r.retirementDate) {
        desc += ` (retirement date: ${r.retirementDate})`;
      }
      if (r.replacement) {
        desc += ` — use \`${r.replacement}\` instead`;
      }
      return desc;
    });
    const last = descriptions.pop();
    const joined = descriptions.length > 0 ? `${descriptions.join(', ')} and ${last}` : last;
    parts.push(`Remove deprecated model${removed.length > 1 ? 's' : ''} ${joined}.`);
  }

  return parts.join(' ');
}

async function syncModelTypes(): Promise<void> {
  const { readFile } = await import('node:fs/promises');
  let rows: ModelRow[];
  try {
    const raw = await readFile(SAP_MODELS_PATH, 'utf8');
    rows = JSON.parse(raw) as ModelRow[];
  } catch {
    console.error(`Error: could not read or parse ${SAP_MODELS_PATH}.`);
    process.exit(1);
  }

  // Build active model set per type (non-retired, in-scope rows only)
  const typeToActiveModels: Record<string, Set<string>> = {};
  // Track retirement info for removed models (for release notes)
  const retiredInfo: Record<string, { replacement: string; retirementDate: string }> = {};
  // Track rows with no executableId mapping
  const skippedRows: { model: string; executableId: string }[] = [];

  for (const row of rows) {
    if (isRetired(row)) {
      retiredInfo[row.model] ??= {
        replacement: row.suggestedReplacement,
        retirementDate: row.retirementDate
      };
      continue;
    }

    const typeName = resolveTypeName(row);
    if (!typeName) {
      skippedRows.push({ model: row.model, executableId: row.executableId });
      continue;
    }

    const isOrchestration = row.availableInOrchestration.toLowerCase().includes('yes');
    const isAzureOpenAi = row.executableId.toLowerCase().startsWith('azure-openai');
    const isSapRpt = typeName === 'SapRptModel';

    if (!isOrchestration && !isAzureOpenAi && !isSapRpt) {
      continue;
    }

    if (MODEL_EXCLUSION_LIST.has(row.model)) {
      console.error(`Skipping excluded model: ${row.model}`);
      continue;
    }

    typeToActiveModels[typeName] ??= new Set();
    typeToActiveModels[typeName].add(row.model);
  }

  const currentContent = await import('node:fs/promises').then(fs =>
    fs.readFile(MODEL_TYPES_PATH, 'utf8')
  );

  // Compute added/removed per type for release notes
  const allAdded: string[] = [];
  const allRemoved: { model: string; replacement: string; retirementDate: string }[] = [];

  for (const [typeName, activeModels] of Object.entries(typeToActiveModels)) {
    const current = extractCurrentModels(currentContent, typeName);
    for (const m of activeModels) {
      if (!current.has(m)) {
        allAdded.push(m);
      }
    }
    for (const m of current) {
      if (!activeModels.has(m)) {
        allRemoved.push({
          model: m,
          replacement: retiredInfo[m]?.replacement ?? '',
          retirementDate: retiredInfo[m]?.retirementDate ?? ''
        });
      }
    }
  }

  let changed = false;

  await transformFile(MODEL_TYPES_PATH, content => {
    let updated = content;

    for (const [typeName, models] of Object.entries(typeToActiveModels)) {
      if (models.size === 0) {
        continue;
      }

      const existingModels = [...extractCurrentModels(content, typeName)];
      const newBlock = buildLiteralUnionBlock(existingModels, models);
      const regex = new RegExp(
        `(export type ${typeName} =\\s*)LiteralUnion<[\\s\\S]*?>;`,
        'g'
      );
      const next = updated.replace(regex, `$1${newBlock};`);

      if (next !== updated) {
        console.error(`Updated ${typeName}`);
        changed = true;
        updated = next;
      } else {
        console.error(`No change for ${typeName}`);
      }
    }

    return updated;
  });

  if (!changed) {
    console.error('\nNo changes — model-types.ts is already up to date.');
    return;
  }

  console.error(`\nPatched: ${MODEL_TYPES_PATH}`);

  const releaseNote = buildReleaseNote(allAdded, allRemoved);
  if (releaseNote) {
    console.log('\n--- Release Note ---');
    console.log(releaseNote);
    console.log('--------------------');
    await writeChangeset(releaseNote);
  }

  if (skippedRows.length > 0) {
    console.error(
      `\n⚠ Skipped ${skippedRows.length} model${skippedRows.length > 1 ? 's' : ''} — update EXECUTABLE_ID_TO_TYPE in sync-model-types.ts to include ${skippedRows.length > 1 ? 'them' : 'it'}:`
    );
    for (const { model, executableId } of skippedRows) {
      console.error(`  ${model}  (executableId: ${executableId})`);
    }
  }
}

async function writeChangeset(releaseNote: string): Promise<void> {
  const { writeFile } = await import('node:fs/promises');
  const changesetDir = resolve(import.meta.dirname, '../.changeset');
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `model-types-sync-${date}.md`;
  const content = `---\n'@sap-ai-sdk/core': minor\n---\n\n[Improvement] ${releaseNote}\n`;
  await writeFile(resolve(changesetDir, filename), content, 'utf8');
  console.error(`\nChangeset written: .changeset/${filename}`);
}

syncModelTypes().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
