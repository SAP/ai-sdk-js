/**
 * Reads scraped model rows from scripts/sap-models.json and patches the
 * LiteralUnion type blocks in packages/core/src/model-types.ts.
 * Run: pnpm tsx scripts/sync-model-types.ts
 */
/* eslint-disable no-console */

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as prettier from 'prettier';
import { ScenarioApi } from '@sap-ai-sdk/ai-api';
import { transformFile } from './util.js';

/** A single row from the SAP Notes model table. */
export interface ModelRow {
  /** The executable ID / access type (vendor). */
  executableId: string;
  /** The model name. */
  model: string;
  /** The model version string (e.g. "2024-11-20"). */
  version: string;
  /** Whether the model is available in Orchestration ('yes'/'no'). */
  availableInOrchestration: string;
  /** Whether the model is deprecated ('yes'/'no'). */
  deprecated: string;
  /** Retirement date if set, empty string otherwise. */
  retirementDate: string;
  /** Suggested replacement model if deprecated, empty string otherwise. */
  suggestedReplacement: string;
  /** Whether the model has been retired ('yes' when retired). */
  retired?: string;
}

const SAP_MODELS_PATH = resolve(import.meta.dirname, 'sap-models.json');

const MODEL_TYPES_PATH = resolve(
  import.meta.dirname,
  '../packages/core/src/model-types.ts'
);

// Models that should never be added to model-types.ts regardless of table state.
// Add model names here when a model has been intentionally removed from the type hints.
const MODEL_EXCLUSION_LIST = new Set<string>([
  'gpt-4o',         // Intentionally removed — deprecated despite having a non-deprecated row
  'gpt-4o-mini',    // Same reason
  'gpt-realtime',   // WebSocket-based, not a standard chat completion model
  'gpt-5.3-codex',  // Responses API only, not a standard chat completion model
  'cohere-reranker' // Re-ranker model, not a chat/embedding model
]);

// Models that should always be included regardless of retirement date.
const MODEL_INCLUSION_LIST = new Set<string>([
  'sap-abap-1' // Only ABAP model available; keep until explicitly removed
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

// Per-model type overrides for models whose executableId is missing in SAP Notes.
const MODEL_NAME_TO_TYPE: Record<string, string> = {
  'mistralai--mistral-medium-instruct': 'AiCoreOpenSourceChatModel',
  'mistralai--mistral-small': 'AiCoreOpenSourceChatModel',
  'mistralai--mistral-small-instruct': 'AiCoreOpenSourceChatModel'
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

  return MODEL_NAME_TO_TYPE[row.model] ?? null;
}

function isRetiredSoon(retirementDate: string): boolean {
  const normalized = retirementDate.trim().toLowerCase();
  if (!normalized || normalized.startsWith('no ') || normalized === '-') {
    return false;
  }

  // "not earlier than X" is a lower bound, not a confirmed retirement date — skip it
  if (normalized.startsWith('not earlier than')) {
    return false;
  }

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
  if (MODEL_INCLUSION_LIST.has(row.model)) {
    return false;
  }
  // Remove from type hints if:
  // - explicitly retired (moved to retired models table), OR
  // - explicitly deprecated, OR
  // - concrete retirement date is within the next 2 months
  // "not earlier than X" dates are lower bounds and are not treated as confirmed retirement dates.
  // Users can always pass the model name as a plain string regardless.
  return (
    row.retired?.toLowerCase().includes('yes') === true ||
    row.deprecated?.toLowerCase().includes('yes') === true ||
    isRetiredSoon(row.retirementDate ?? '')
  );
}

function modelPrefix(model: string): string {
  const vendorSep = model.indexOf('--');
  if (vendorSep !== -1) {
    return model.slice(0, vendorSep + 2);
  }
  return /^[a-z-]+/.exec(model)?.[0] ?? model;
}

function buildLiteralUnionBlock(existingModels: string[], activeModels: Set<string>): string {
  // Preserve existing order, remove retired models, append new ones at the end
  const kept = existingModels.filter(m => activeModels.has(m));
  const added = [...activeModels].filter(m => !existingModels.includes(m));
  // Stable sort by prefix to group same-vendor models together.
  const ordered = [...kept, ...added].sort((a, b) =>
    modelPrefix(a).localeCompare(modelPrefix(b))
  );

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
  removed: { model: string; replacement: string; retirementDate: string; isRetiredFromTable: boolean }[]
): string {
  const parts: string[] = [];

  if (added.length) {
    const names = added.map(m => `\`${m}\``).join(', ');
    parts.push(`Added ${names} to the available model list.`);
  }

  const retired = removed.filter(r => r.isRetiredFromTable);
  const deprecated = removed.filter(r => !r.isRetiredFromTable);

  for (const group of [
    { items: retired, label: 'retired' },
    { items: deprecated, label: 'deprecated' }
  ]) {
    if (!group.items.length) {
      continue;
    }
    const descriptions = group.items.map(r => {
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
    const joined = descriptions.length ? `${descriptions.join(', ')} and ${last}` : last;
    parts.push(`Remove ${group.label} model${group.items.length > 1 ? 's' : ''} ${joined}.`);
  }

  return parts.join(' ');
}

interface ActiveModelMap {
  typeToActiveModels: Record<string, Set<string>>;
  retiredInfo: Record<string, { replacement: string; retirementDate: string; isRetiredFromTable: boolean }>;
  skippedRows: { model: string; executableId: string }[];
}

function buildActiveModelMap(rows: ModelRow[]): ActiveModelMap {
  const typeToActiveModels: Record<string, Set<string>> = {};
  const retiredInfo = Object.fromEntries(
    rows
      .filter(isRetired)
      .map(r => [
        r.model,
        {
          replacement: r.suggestedReplacement,
          retirementDate: r.retirementDate,
          isRetiredFromTable: r.retired?.toLowerCase().includes('yes') === true
        }
      ])
  );
  const skippedRows: { model: string; executableId: string }[] = [];

  for (const row of rows) {
    if (isRetired(row)) {
      continue;
    }

    if (MODEL_EXCLUSION_LIST.has(row.model)) {
      console.error(`Skipping excluded model: ${row.model}`);
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

    typeToActiveModels[typeName] ??= new Set();
    typeToActiveModels[typeName].add(row.model);
  }

  return { typeToActiveModels, retiredInfo, skippedRows };
}

async function patchModelTypes(
  typeToActiveModels: Record<string, Set<string>>
): Promise<boolean> {
  let changed = false;

  await transformFile(MODEL_TYPES_PATH, async content => {
    let updated = content;
    const sorted = Object.entries(typeToActiveModels).sort(([a], [b]) => a.localeCompare(b));
    for (const [typeName, models] of sorted) {
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
    const options = await prettier.resolveConfig(MODEL_TYPES_PATH);
    return prettier.format(updated, options || undefined);
  });

  return changed;
}

async function syncModelTypes(): Promise<void> {
  let rows: ModelRow[];
  try {
    const raw = await readFile(SAP_MODELS_PATH, 'utf8');
    rows = JSON.parse(raw) as ModelRow[];
  } catch {
    console.error(`Error: could not read or parse ${SAP_MODELS_PATH}.`);
    process.exit(1);
  }

  const { typeToActiveModels, retiredInfo, skippedRows } = buildActiveModelMap(rows);
  const currentContent = await readFile(MODEL_TYPES_PATH, 'utf8');

  const allAdded = Object.entries(typeToActiveModels).flatMap(([typeName, activeModels]) => {
    const current = extractCurrentModels(currentContent, typeName);
    return [...activeModels].filter(m => !current.has(m));
  });

  const allRemoved = Object.entries(typeToActiveModels).flatMap(([typeName, activeModels]) => {
    const current = extractCurrentModels(currentContent, typeName);
    return [...current]
      .filter(m => !activeModels.has(m))
      .map(m => ({
        model: m,
        replacement: retiredInfo[m]?.replacement ?? '',
        retirementDate: retiredInfo[m]?.retirementDate ?? '',
        isRetiredFromTable: retiredInfo[m]?.isRetiredFromTable ?? false
      }));
  });

  const changed = await patchModelTypes(typeToActiveModels);

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

  if (skippedRows.length) {
    console.error(
      `\n⚠ Skipped ${skippedRows.length} model${skippedRows.length > 1 ? 's' : ''} — update EXECUTABLE_ID_TO_TYPE in sync-model-types.ts to include ${skippedRows.length > 1 ? 'them' : 'it'}:`
    );
    for (const { model, executableId } of skippedRows) {
      console.error(`  ${model}  (executableId: ${executableId})`);
    }
  }

  await checkLandscapeAvailability(typeToActiveModels);

  const retiredModels = rows.filter(r => r.retired === 'yes');
  if (retiredModels.length) {
    console.error(`\n--- Retired Models (${retiredModels.length}) ---`);
    for (const r of retiredModels) {
      const note = r.suggestedReplacement ? ` → ${r.suggestedReplacement}` : '';
      console.error(`  ${r.model}${note}`);
    }
  }
}

async function checkLandscapeAvailability(
  typeToActiveModels: Record<string, Set<string>>
): Promise<void> {
  const envPath = resolve(import.meta.dirname, '../sample-code/.env');
  if (existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch (err) {
      console.error('\n⚠ Found sample-code/.env but failed to load it:', err);
    }
  }

  if (!process.env['AICORE_SERVICE_KEY']) {
    console.error('\n⚠ Skipping landscape check — AICORE_SERVICE_KEY not set.');
    return;
  }

  const syncedModels = new Set(
    Object.values(typeToActiveModels).flatMap(s => [...s])
  );

  const modelList = await ScenarioApi.scenarioQueryModels('foundation-models', {
    'AI-Resource-Group': 'default'
  }).execute().catch((err: unknown) => {
    console.error('\n⚠ Landscape check skipped — API request failed:', err);
    return null;
  });

  if (!modelList?.resources?.length) {
    console.error('\n⚠ Landscape check skipped — unexpected response: missing resources.');
    return;
  }

  // Include Azure OpenAI and RPT models directly; all others require orchestration access
  const isSdkSupportedModel = (r: (typeof modelList.resources)[number]) =>
    r.model &&
    (r.executableId === 'azure-openai' ||
      r.model.startsWith('sap-rpt-') ||
      r.allowedScenarios?.some(s => s.scenarioId === 'orchestration'));

  const landscapeModels = new Set(
    modelList.resources.filter(isSdkSupportedModel).map(r => r.model)
  );

  const missing = [...syncedModels].filter(m => !landscapeModels.has(m));
  if (missing.length) {
    console.error(
      `\n⚠ ${missing.length} model(s) not available in your landscape:\n  ${missing.join('\n  ')}`
    );
  } else {
    console.log('\n✓ All synced models are available in your landscape.');
  }
}

async function writeChangeset(releaseNote: string): Promise<void> {
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