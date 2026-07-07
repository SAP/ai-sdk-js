/**
 * Helper script for the update-models-dev skill.
 * Merges sap-models.json + landscape API data and writes TOML files to a local models.dev clone.
 * Usage: pnpm tsx scripts/sync-models-dev.ts <models-dev-dir>
 */
/* eslint-disable no-console */

import { existsSync } from 'node:fs';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { parse as parseToml } from 'smol-toml';
import { ScenarioApi } from '@sap-ai-sdk/ai-api';

export interface SapModel {
  executableId: string;
  model: string;
  version: string;
  availableInOrchestration: string;
  deprecated: string;
  retirementDate: string;
  suggestedReplacement: string;
  retired?: string;
}

export interface ApiCostEntry {
  inputCost?: string;
  outputCost?: string;
  tier?: string;
  tierDescription?: string;
}

export interface ApiModelVersion {
  name: string;
  isLatest: boolean;
  deprecated: boolean;
  retirementDate?: string;
  contextLength?: number;
  inputTypes?: string[];
  capabilities?: string[];
  cost?: ApiCostEntry[];
  streamingSupported?: boolean;
  orchestrationCapabilities?: string[];
}

export interface ApiModel {
  model: string;
  executableId: string;
  description: string;
  versions: ApiModelVersion[];
  displayName?: string;
  provider?: string;
  allowedScenarios?: { scenarioId: string; executableId: string }[];
}

export interface MergedModel {
  model: string;
  executableId: string;
  availableInOrchestration: boolean;
  deprecated: boolean;
  retired: boolean;
  retirementDate: string;
  suggestedReplacement: string;
  isEmbedding: boolean;
  description?: string;
  contextLength?: number;
  inputTypes?: string[];
  capabilities?: string[];
  cost?: ApiCostEntry[];
  sapCost?: SapModelCost;
}

const SAP_MODELS_PATH = resolve(import.meta.dirname, 'sap-models.json');
const SAP_MODEL_COSTS_PATH = resolve(import.meta.dirname, 'sap-model-costs.json');

export interface SapCostTierEntry {
  val: number;
  threshold: number | null;
  op: string | null;
}

export type SapCostValue = number | { tiers: SapCostTierEntry[] };

export interface SapModelCost {
  input?: SapCostValue;
  output?: SapCostValue;
  cacheRead?: SapCostValue;
  cacheWrite?: SapCostValue;
}

export async function loadSapModelCosts(): Promise<Map<string, SapModelCost>> {
  if (!existsSync(SAP_MODEL_COSTS_PATH)) return new Map();
  const raw = await readFile(SAP_MODEL_COSTS_PATH, 'utf8');
  return new Map(Object.entries(JSON.parse(raw) as Record<string, SapModelCost>));
}

export async function loadSapModels(): Promise<SapModel[]> {
  const raw = await readFile(SAP_MODELS_PATH, 'utf8');
  return JSON.parse(raw) as SapModel[];
}

export async function fetchApiModels(): Promise<Map<string, ApiModel>> {
  const envPath = resolve(import.meta.dirname, '../sample-code/.env');
  if (existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // ignore
    }
  }

  if (!process.env['AICORE_SERVICE_KEY']) {
    console.error('⚠ AICORE_SERVICE_KEY not set — skipping API enrichment. Capabilities and cost will be omitted.');
    return new Map();
  }

  const result = await ScenarioApi.scenarioQueryModels('foundation-models', {
    'AI-Resource-Group': 'default'
  }).execute().catch((err: unknown) => {
    console.error('⚠ Landscape API call failed:', err);
    return null;
  });

  if (!result?.resources?.length) {
    console.error('⚠ Landscape API returned no resources — proceeding without API data.');
    return new Map();
  }

  const map = new Map<string, ApiModel>();
  for (const r of result.resources) {
    if (r.model) {
      map.set(r.model, r as ApiModel);
    }
  }
  return map;
}

export function mergeModels(sapModels: SapModel[], apiMap: Map<string, ApiModel>, costMap: Map<string, SapModelCost>): MergedModel[] {
  const seen = new Set<string>();
  const result: MergedModel[] = [];
  for (const sap of sapModels) {
    if (seen.has(sap.model)) {
      console.error(`⚠ Duplicate model name in sap-models.json, skipping: ${sap.model}`);
      continue;
    }
    seen.add(sap.model);
    const availableInOrchestration = !!sap.availableInOrchestration;
    if (!availableInOrchestration) {
      console.error(`⚠ Non-orchestration model (will skip if new): ${sap.model}`);
    }
    const api = apiMap.get(sap.model);
    const latestVersion = api?.versions?.find(v => v.isLatest) ?? api?.versions?.[0];
    result.push({
      model: sap.model,
      executableId: sap.executableId,
      availableInOrchestration,
      deprecated: sap.deprecated?.toLowerCase().includes('yes') ?? false,
      retired: sap.retired?.toLowerCase().includes('yes') ?? false,
      retirementDate: sap.retirementDate,
      suggestedReplacement: sap.suggestedReplacement,
      isEmbedding: sap.model.toLowerCase().includes('embed'),
      description: api?.description,
      contextLength: latestVersion?.contextLength,
      inputTypes: latestVersion?.inputTypes,
      capabilities: latestVersion?.capabilities,
      cost: latestVersion?.cost,
      sapCost: costMap.get(sap.model),
    });
  }
  return result;
}

export interface ExistingToml {
  name?: string;
  description?: string;
  family?: string;
  release_date?: string;
  last_updated?: string;
  knowledge?: string;
  open_weights?: boolean;
  attachment?: boolean;
  reasoning?: boolean;
  reasoning_options?: unknown[];
  temperature?: boolean;
  tool_call?: boolean;
  structured_output?: boolean;
  status?: string;
  [key: string]: unknown;
}

export function parseSimpleToml(content: string): ExistingToml {
  if (!content.trim()) return {};
  const parsed = parseToml(content) as Record<string, unknown>;
  const result: ExistingToml = {};
  for (const [key, val] of Object.entries(parsed)) {
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      for (const [subKey, subVal] of Object.entries(val as Record<string, unknown>)) {
        result[`${key}.${subKey}`] = subVal;
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}

const openWeightsTrue = ['aicore-mistralai', 'aicore-cohere'];
const openWeightsFalse = [
  'azure-openai', 'aws-bedrock', 'gcp-vertexai', 'aicore-anthropic',
  'aicore-amazon', 'aicore-google', 'aicore-sap', 'perplexity-ai',
  'aicore-perplexity', 'aicore-nvidia'
];
// Model name substrings that indicate open weights
const openWeightsNameHints = ['llama', 'mistral', 'qwen', 'phi', 'falcon', 'gemma', 'command'];

export function resolveOpenWeights(
  executableId: string,
  modelName: string,
  existing?: boolean
): { value: boolean; guessed: boolean } {
  if (existing !== undefined) return { value: existing, guessed: false };
  const execLower = executableId.toLowerCase();
  for (const prefix of openWeightsTrue) {
    if (execLower.startsWith(prefix)) return { value: true, guessed: false };
  }
  for (const prefix of openWeightsFalse) {
    if (execLower.startsWith(prefix)) return { value: false, guessed: false };
  }
  // Fall back to model name heuristic
  const nameLower = modelName.toLowerCase();
  const hintMatch = openWeightsNameHints.some(h => nameLower.includes(h));
  return { value: hintMatch, guessed: true };
}

export interface TierEntry {
  size: number;
  input: number;
  output: number;
}

// API costs are in SAP Capacity Units (CU) per 1000 tokens; treat as USD for models.dev.
// Converts to per-1M-token with 4dp precision.
function toPerMillion(perThousand: string): number {
  return Math.round(parseFloat(perThousand) * 1000 * 10000) / 10000;
}

export function resolveCost(
  cost: ApiCostEntry[]
): { single?: { input: number; output: number }; tiers?: TierEntry[]; guessedTierBoundary?: boolean } {
  const tiered = cost.some(c => c.tier !== undefined);
  if (!tiered) {
    const inputEntry = cost.find(c => c.inputCost !== undefined);
    const outputEntry = cost.find(c => c.outputCost !== undefined);
    if (!inputEntry?.inputCost || !outputEntry?.outputCost) return {};
    return {
      single: {
        input: toPerMillion(inputEntry.inputCost),
        output: toPerMillion(outputEntry.outputCost)
      }
    };
  }

  // Group by tier number
  const tierMap = new Map<string, { input?: number; output?: number; size?: number; guessed?: boolean }>();
  let guessedBoundary = false;

  for (const entry of cost) {
    const tierKey = entry.tier ?? '1';
    const existing = tierMap.get(tierKey) ?? {};
    if (entry.tierDescription && !existing.size) {
      const kMatch = /(\d+)k\s+tokens/i.exec(entry.tierDescription);
      const fullMatch = /(\d[\d,]*)\s+tokens/i.exec(entry.tierDescription);
      if (kMatch) {
        existing.size = parseInt(kMatch[1]) * 1000;
      } else if (fullMatch) {
        existing.size = parseInt(fullMatch[1].replace(/,/g, ''));
      } else if (/greater than/i.test(entry.tierDescription)) {
        existing.size = 0;
      } else {
        existing.size = 200000;
        existing.guessed = true;
        guessedBoundary = true;
      }
    }
    if (entry.inputCost) existing.input = toPerMillion(entry.inputCost);
    if (entry.outputCost) existing.output = toPerMillion(entry.outputCost);
    tierMap.set(tierKey, existing);
  }

  const tiers: TierEntry[] = [];
  for (const [, t] of tierMap) {
    if (t.input !== undefined && t.output !== undefined && t.size !== undefined) {
      tiers.push({ size: t.size, input: t.input, output: t.output });
    }
  }
  tiers.sort((a, b) => a.size - b.size);
  return { tiers, guessedTierBoundary: guessedBoundary };
}

// Maps executableId prefix → canonical vendor dir in models/
// Models accessed via a hosting layer use the underlying model's vendor dir.
const executableIdToVendor: Record<string, string> = {
  'azure-openai': 'openai',       // OpenAI models served via Azure
  'aicore-anthropic': 'anthropic',
  'aicore-amazon': '',            // no models/amazon dir
  'aws-bedrock': '',              // resolved per model name below
  'gcp-vertexai': 'google',
  'aicore-google': 'google',
  'aicore-mistralai': 'mistral',
  'aicore-cohere': 'cohere',
  'aicore-nvidia': 'nvidia',
  'aicore-opensource': '',        // resolved per model name below
  'perplexity-ai': 'perplexity',
  'aicore-perplexity': 'perplexity',
  'aicore-alephalpha': '',        // no canonical dir
  'aicore-ibm': '',               // no canonical dir
  'aicore-sap': '',               // SAP-proprietary, no canonical dir
};

// For executableIds that route multiple vendors, map model name prefix → vendor dir
const modelNameToVendor: Record<string, string> = {
  'anthropic--': 'anthropic',
  'amazon--': '',
  'meta--': 'meta',
  'deepseek-ai--': 'deepseek',
  'mistralai--': 'mistral',
  'cohere--': 'cohere',
  'nvidia--': 'nvidia',
};

function resolveVendorDir(executableId: string, modelName: string): string {
  const execLower = executableId.toLowerCase().split('(')[0].trim();
  if (execLower) {
    for (const [prefix, dir] of Object.entries(executableIdToVendor)) {
      if (execLower.startsWith(prefix)) {
        if (dir !== '') return dir;
        // Empty means per-model resolution
        for (const [namePrefix, nameDir] of Object.entries(modelNameToVendor)) {
          if (modelName.startsWith(namePrefix)) return nameDir;
        }
        return '';
      }
    }
  }
  // Fall back to model name when executableId is absent/unknown
  for (const [namePrefix, nameDir] of Object.entries(modelNameToVendor)) {
    if (modelName.startsWith(namePrefix)) return nameDir;
  }
  return '';
}

export interface CanonicalMeta {
  baseModel?: string;
  family?: string;
  knowledge?: string;
  release_date?: string;
  reasoning?: boolean;
  guessed: boolean;
}

export async function lookupCanonicalMeta(
  modelName: string,
  executableId: string,
  modelsDevDir: string
): Promise<CanonicalMeta> {
  // base_model must reference the models/ vendor dir (used by the validator)
  const vendorDir = resolveVendorDir(executableId, modelName);
  if (!vendorDir) return { guessed: false };

  const canonicalDir = join(modelsDevDir, 'models', vendorDir);
  if (!existsSync(canonicalDir)) return { guessed: false };

  const files = await readdir(canonicalDir).catch(() => [] as string[]);

  // Strip vendor prefix from model name to get the base name
  let baseName = modelName;
  for (const namePrefix of Object.keys(modelNameToVendor)) {
    if (modelName.startsWith(namePrefix)) {
      baseName = modelName.slice(namePrefix.length);
      break;
    }
  }

  // Build lookup candidates: try original name, dot→hyphen variant, and hyphen→dot variant
  function buildLookupCandidates(name: string): string[] {
    const lower = name.toLowerCase();
    const withHyphens = lower.replace(/\./g, '-');
    const withDots = lower.replace(/-(\d)/g, '.$1');
    return [lower, withHyphens, withDots].filter((v, i, arr) => arr.indexOf(v) === i);
  }

  const candidates = buildLookupCandidates(baseName);
  const match = candidates.flatMap(candidate => [
    files.find(f => f === `${candidate}.toml`),
    files.find(f => f.startsWith(`${candidate}-`) && f.endsWith('.toml')),
    files.find(f => f.startsWith(candidate) && f.endsWith('.toml')),
  ]).find(Boolean);

  if (!match) return { guessed: false };

  const canonicalId = match.replace(/\.toml$/, '');
  const content = await readFile(join(canonicalDir, match), 'utf8');
  const parsed = parseSimpleToml(content);
  return {
    baseModel: `${vendorDir}/${canonicalId}`,
    family: parsed.family as string | undefined,
    knowledge: parsed.knowledge as string | undefined,
    release_date: parsed.release_date as string | undefined,
    reasoning: parsed.reasoning as boolean | undefined,
    guessed: false,
  };
}

function formatTomlValue(v: unknown): string {
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  if (Array.isArray(v)) return `[${v.map(formatTomlValue).join(', ')}]`;
  if (v !== null && typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => `${k} = ${formatTomlValue(val)}`)
      .join(', ');
    return `{ ${entries} }`;
  }
  return String(v);
}

export function resolveReasoningComment(executableId: string, reasoningOptions: unknown): string | undefined {
  if (!reasoningOptions) return undefined;
  const opts = reasoningOptions as { type?: string; values?: string[]; min?: number }[];
  const hasEffort = opts.some(o => o.type === 'effort');
  const hasBudget = opts.some(o => o.type === 'budget_tokens');
  const effortValues = opts.find(o => o.type === 'effort')?.values ?? [];
  const budgetMin = opts.find(o => o.type === 'budget_tokens')?.min;
  const exec = executableId.toLowerCase();

  if (exec.startsWith('aws-bedrock') || exec.startsWith('aicore-anthropic')) {
    if (hasEffort && hasBudget) {
      const maxEffort = effortValues[effortValues.length - 1];
      return `# Bedrock Claude 4.6 prefers $.thinking.type = "adaptive" plus $.output_config.effort = "${effortValues.join('"|"')}"; manual enabled budget_tokens >= 1024 is deprecated. Converse prefixes both paths with $.additionalModelRequestFields. https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking (accessed 2026-06-25)`
        + (maxEffort === 'max' ? '' : '');
    }
    if (hasEffort && !hasBudget) {
      return `# Bedrock Claude 4.7 uses $.thinking.type = "adaptive" and $.output_config.effort; manual budget_tokens is rejected. Converse prefixes both paths with $.additionalModelRequestFields. https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking (accessed 2026-06-25)`;
    }
    if (hasBudget && !hasEffort) {
      return `# Bedrock Invoke body: $.thinking = {"type":"enabled","budget_tokens":N} or {"type":"disabled"}, with N >= ${budgetMin} and N < $.max_tokens. Bedrock Converse nests that object at $.additionalModelRequestFields.thinking. https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html#converse-additional-model-request-fields (accessed 2026-06-25)`;
    }
  }

  if (exec.startsWith('azure-openai') || exec.startsWith('azure')) {
    const values = effortValues.join('"|"');
    const hasNone = effortValues.includes('none');
    const offNote = hasNone ? `"none" is off.` : `there is no explicit off value for original gpt-5.`;
    return `# Azure OpenAI deployment adapter: raw Chat uses top-level $.reasoning_effort = "${values}"; ${offNote} https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/reasoning (accessed 2026-06-25)`;
  }

  if (exec.startsWith('gcp-vertexai') || exec.startsWith('aicore-google')) {
    const hasToggle = opts.some(o => o.type === 'toggle');
    const min = opts.find(o => o.type === 'budget_tokens')?.min;
    const max = (opts.find(o => o.type === 'budget_tokens') as { max?: number } | undefined)?.max;
    if (min === 0) {
      return `# Vertex Gemini adapter: $.generationConfig.thinkingConfig.thinkingBudget is 0 (off), -1 (dynamic), or 1..${max}. https://cloud.google.com/vertex-ai/generative-ai/docs/thinking (accessed 2026-06-25)`;
    }
    if (hasToggle || min === undefined) {
      return `# Vertex Gemini adapter: $.generationConfig.thinkingConfig.thinkingBudget is -1 (dynamic) or ${min ?? 128}..${max ?? 32768}; 0/off is unsupported. https://cloud.google.com/vertex-ai/generative-ai/docs/thinking (accessed 2026-06-25)`;
    }
    return `# Vertex Gemini adapter: $.generationConfig.thinkingConfig.thinkingBudget is 0 (off), -1 (dynamic), or ${min}..${max}. https://cloud.google.com/vertex-ai/generative-ai/docs/thinking (accessed 2026-06-25)`;
  }

  return undefined;
}

export function buildToml(fields: Record<string, unknown>, executableId = ''): string {
  const lines: string[] = [];

  const topLevelOrder = [
    'name', 'base_model', 'description', 'family', 'release_date', 'last_updated',
    'status', 'attachment', 'reasoning', 'reasoning_options', 'temperature', 'tool_call',
    'structured_output', 'knowledge', 'open_weights',
  ];

  for (const key of topLevelOrder) {
    if (fields[key] !== undefined) {
      if (key === 'reasoning_options') {
        const comment = resolveReasoningComment(executableId, fields[key]);
        if (comment) lines.push(comment);
      }
      lines.push(`${key} = ${formatTomlValue(fields[key])}`);
    }
  }

  // [cost] section — single tier, or base tier when tiered pricing applies
  const tiers = fields['cost.tiers'] as TierEntry[] | undefined;
  const hasCostFields = fields['cost.input'] !== undefined
    || fields['cost.cache_read'] !== undefined
    || fields['cost.cache_write'] !== undefined
    || tiers?.length;
  if (hasCostFields) {
    lines.push('');
    lines.push('[cost]');
    if (fields['cost.input'] !== undefined) lines.push(`input = ${fields['cost.input']}`);
    if (fields['cost.output'] !== undefined) lines.push(`output = ${fields['cost.output']}`);
    if (fields['cost.cache_read'] !== undefined) lines.push(`cache_read = ${fields['cost.cache_read']}`);
    if (fields['cost.cache_write'] !== undefined) lines.push(`cache_write = ${fields['cost.cache_write']}`);
    if (tiers?.length) {
      if (fields['cost.input'] !== undefined) {
        // cost.input/output hold the base; tiers are all overrides
        for (const tier of tiers) {
          lines.push('');
          lines.push('[[cost.tiers]]');
          lines.push(`tier = { type = "context", size = ${tier.size} }`);
          lines.push(`input = ${tier.input}`);
          lines.push(`output = ${tier.output}`);
        }
      } else {
        // tiers-only: first entry is base, rest are overrides
        const [base, ...overrides] = tiers;
        lines.push(`input = ${base.input}`);
        lines.push(`output = ${base.output}`);
        for (const tier of overrides) {
          lines.push('');
          lines.push('[[cost.tiers]]');
          lines.push(`tier = { type = "context", size = ${tier.size} }`);
          lines.push(`input = ${tier.input}`);
          lines.push(`output = ${tier.output}`);
        }
      }
    }
  }

  // [limit] section
  if (fields['limit.context'] !== undefined) {
    lines.push('');
    lines.push('[limit]');
    lines.push(`context = ${fields['limit.context']}`);
    if (fields['limit.output'] !== undefined) lines.push(`output = ${fields['limit.output']}`);
  }

  // [modalities] section
  if (fields['modalities.input'] !== undefined) {
    lines.push('');
    lines.push('[modalities]');
    const inp = (fields['modalities.input'] as string[]).map(v => `"${v}"`).join(', ');
    lines.push(`input = [${inp}]`);
    lines.push('output = ["text"]');
  }

  // Pass through any remaining array-of-tables keys (e.g. benchmarks, weights) not handled above
  const handledKeys = new Set([
    ...topLevelOrder,
    'cost.input', 'cost.output', 'cost.cache_read', 'cost.cache_write', 'cost.tiers',
    'limit.context', 'limit.output', 'modalities.input',
  ]);
  for (const [key, val] of Object.entries(fields)) {
    if (handledKeys.has(key) || val === undefined) continue;
    if (Array.isArray(val)) {
      for (const item of val as Record<string, unknown>[]) {
        lines.push('');
        lines.push(`[[${key}]]`);
        for (const [k, v] of Object.entries(item)) {
          if (v !== undefined) lines.push(`${k} = ${formatTomlValue(v)}`);
        }
      }
    }
  }

  return lines.join('\n') + '\n';
}

const today = new Date().toISOString().slice(0, 10);

export interface TranslatedModel {
  id: string;
  toml: string;
  isNew: boolean;
  changedFields: string[];
  guesses: string[];
}

export async function translateModel(
  merged: MergedModel,
  modelsDevDir: string,
  existing: ExistingToml
): Promise<TranslatedModel> {
  const guesses: string[] = [];
  const changedFields: string[] = [];
  const tomlPath = join(modelsDevDir, 'providers/sap-ai-core/models', `${merged.model}.toml`);
  const isNew = !existsSync(tomlPath);

  // Canonical metadata — use base_model when a models/ entry exists
  const canonical = await lookupCanonicalMeta(merged.model, merged.executableId, modelsDevDir);
  const hasBaseModel = !!canonical.baseModel;
  // Only write inline facts when no base_model — they're inherited otherwise
  const family = hasBaseModel ? undefined : (existing.family ?? canonical.family);
  const knowledge = hasBaseModel ? undefined : (existing.knowledge ?? canonical.knowledge);
  const release_date = hasBaseModel ? undefined : (existing.release_date ?? canonical.release_date);
  if (!hasBaseModel && !family) guesses.push('family — no canonical match');
  if (!hasBaseModel && !knowledge) guesses.push('knowledge — no canonical match');

  // Capabilities — for inline models all boolean fields are required; for base_model they're inherited
  const caps = new Set(merged.capabilities?.map(c => c.toLowerCase()) ?? []);
  // For inline models (no base_model), reasoning/tool_call/attachment are required booleans — default conservatively
  const tool_call = merged.isEmbedding
    ? (!hasBaseModel ? false : undefined)
    : existing.tool_call ?? (caps.has('tool_calling') || caps.has('function_calling') || (!hasBaseModel ? true : undefined));
  const reasoning = merged.isEmbedding
    ? (!hasBaseModel ? false : undefined)
    : existing.reasoning ?? (caps.has('thinking') || (!hasBaseModel ? false : undefined));
  const temperature = merged.isEmbedding
    ? (!hasBaseModel ? false : undefined)
    : existing.temperature ?? (!hasBaseModel ? true : undefined);
  const structured_output = merged.isEmbedding ? undefined
    : existing.structured_output ?? (caps.has('structured_outputs') || undefined);
  const attachment = merged.isEmbedding
    ? (!hasBaseModel ? false : undefined)
    : existing.attachment ?? (caps.has('image_understanding') || (merged.inputTypes !== undefined && merged.inputTypes.some(t => t !== 'text')) || (!hasBaseModel ? false : undefined));

  // Modalities — merge API data with existing to avoid downgrading (e.g. pdf support)
  const existingInputModalities = existing['modalities.input'] as string[] | undefined;
  const apiInputModalities: string[] = ['text'];
  if (merged.inputTypes?.includes('image')) apiInputModalities.push('image');
  if (merged.inputTypes?.includes('document')) apiInputModalities.push('pdf');
  // Union: keep anything in existing, add anything new from API
  const inputModalities = existingInputModalities
    ? [...new Set([...existingInputModalities, ...apiInputModalities])]
    : apiInputModalities;

  // open_weights
  const ow = resolveOpenWeights(merged.executableId, merged.model, existing.open_weights);
  if (ow.guessed) guesses.push(`open_weights="${ow.value}" — guessed from model name`);

  // Cost — prefer SAP Note published pricing, fall back to landscape API, then existing TOML
  let costFields: Record<string, unknown> = {};
  const per1M = (per1k: number) => Math.round(per1k * 1000 * 10000) / 10000;
  const flatCost = (v: SapCostValue | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? per1M(v) : undefined;
  const isTiered = (v: SapCostValue | undefined): v is { tiers: SapCostTierEntry[] } =>
    typeof v === 'object' && v !== null && 'tiers' in v;

  if (merged.sapCost) {
    const c = merged.sapCost;
    // Check if input is tiered — if so, build cost.tiers
    if (isTiered(c.input) && isTiered(c.output)) {
      // Sort: lower threshold first = base tier, higher = override tier
      const inTiers = c.input.tiers.slice().sort((a, b) => (a.threshold ?? Infinity) - (b.threshold ?? Infinity));
      const outTiers = c.output.tiers.slice().sort((a, b) => (a.threshold ?? Infinity) - (b.threshold ?? Infinity));
      // Base tier (lowest price = smallest context)
      costFields['cost.input'] = per1M(inTiers[0].val);
      costFields['cost.output'] = per1M(outTiers[0].val);
      // Upper tier(s) as [[cost.tiers]]
      const tiers: TierEntry[] = inTiers.slice(1).map((t, i) => ({
        size: t.threshold ?? 200000,
        input: per1M(t.val),
        output: per1M(outTiers[i + 1]?.val ?? outTiers[outTiers.length - 1].val),
      }));
      if (tiers.length) costFields['cost.tiers'] = tiers;
      // Tiered cache_read
      if (isTiered(c.cacheRead)) {
        const crTiers = c.cacheRead.tiers.slice().sort((a, b) => (a.threshold ?? Infinity) - (b.threshold ?? Infinity));
        costFields['cost.cache_read'] = per1M(crTiers[0].val);
      } else if (c.cacheRead !== undefined) {
        costFields['cost.cache_read'] = flatCost(c.cacheRead);
      }
    } else {
      if (c.input !== undefined) costFields['cost.input'] = flatCost(c.input);
      // Embedding models have no output cost — write 0 so the validator is satisfied
      costFields['cost.output'] = c.output !== undefined ? flatCost(c.output) : (merged.isEmbedding ? 0 : undefined);
      if (c.cacheRead !== undefined) costFields['cost.cache_read'] = flatCost(c.cacheRead);
      if (c.cacheWrite !== undefined) costFields['cost.cache_write'] = flatCost(c.cacheWrite);
    }
  } else if (merged.cost?.length) {
    const resolved = resolveCost(merged.cost);
    if (resolved.guessedTierBoundary) guesses.push('tier boundary assumed from description');
    if (resolved.single) {
      costFields = { 'cost.input': resolved.single.input, 'cost.output': resolved.single.output };
    } else if (resolved.tiers) {
      costFields = { 'cost.tiers': resolved.tiers };
    }
  }
  // Fall back to existing TOML cost when neither SAP Note nor API has data
  if (!costFields['cost.input'] && !costFields['cost.tiers']) {
    if (existing['cost.input'] !== undefined) costFields['cost.input'] = existing['cost.input'];
    if (existing['cost.output'] !== undefined) costFields['cost.output'] = existing['cost.output'];
  }
  if (!costFields['cost.cache_read'] && existing['cost.cache_read'] !== undefined) costFields['cost.cache_read'] = existing['cost.cache_read'];
  if (!costFields['cost.cache_write'] && existing['cost.cache_write'] !== undefined) costFields['cost.cache_write'] = existing['cost.cache_write'];
  // smol-toml parses [[cost.tiers]] as { tier: { type, size }, input, output } — normalize to TierEntry.
  if (!costFields['cost.tiers'] && !costFields['cost.input'] && Array.isArray(existing['cost.tiers'])) {
    const rawTiers = existing['cost.tiers'] as { tier?: { size?: number }; input?: number; output?: number }[];
    const normalized: TierEntry[] = rawTiers
      .filter(t => t.tier?.size !== undefined && t.input !== undefined && t.output !== undefined)
      .map(t => ({ size: t.tier!.size!, input: t.input!, output: t.output! }));
    if (normalized.length) costFields['cost.tiers'] = normalized;
  }

  // Status — models.dev "deprecated" means no longer served by the provider's public API (= retired in SAP terms)
  const status = merged.retired ? 'deprecated' : undefined;

  const fields: Record<string, unknown> = {
    name: merged.model,
    ...(canonical.baseModel ? { base_model: canonical.baseModel } : {}),
    // Description required for inline models — use API data, existing value, or flag as guess
    ...(!canonical.baseModel ? { description: merged.description ?? existing.description ?? (() => { guesses.push('description — not available'); return merged.model; })() } : {}),
    ...(family ? { family } : {}),
    ...(release_date
      ? { release_date }
      : (!hasBaseModel ? (() => {
          const fallback = existing.last_updated ?? today;
          guesses.push(`release_date — not available, defaulted to ${fallback}`);
          return { release_date: fallback };
        })() : {})),
    last_updated: existing.last_updated ?? today,
    ...(status ? { status } : {}),
    // Capability fields: write when base_model is absent (inline) OR when we have
    // authoritative API data that may differ from the canonical entry
    ...(attachment !== undefined && (!canonical.baseModel || merged.inputTypes !== undefined) ? { attachment } : {}),
    ...(!canonical.baseModel && reasoning !== undefined ? { reasoning } : {}),
    // For base_model entries with reasoning: preserve existing reasoning_options, or inject universal
    // effort scale for Bedrock/Vertex. Azure/OpenAI already have correct options in their base model.
    ...(existing['reasoning_options'] !== undefined
      ? { reasoning_options: existing['reasoning_options'] }
      : (() => {
          if (!canonical.baseModel || !canonical.reasoning) return {};
          const exec = merged.executableId.toLowerCase();
          if (exec.startsWith('aws-bedrock') || exec.startsWith('aicore-anthropic')) {
            return { reasoning_options: [{ type: 'budget_tokens', min: 1024 }] };
          }
          if (exec.startsWith('gcp-vertexai') || exec.startsWith('aicore-google')) {
            guesses.push('reasoning_options — defaulted to Vertex toggle+budget_tokens, verify min/max');
            return { reasoning_options: [{ type: 'toggle' }, { type: 'budget_tokens', min: 0, max: 24576 }] };
          }
          // Azure/OpenAI and others: effort scale
          guesses.push('reasoning_options — defaulted to effort scale, verify none/minimal support');
          return { reasoning_options: [{ type: 'effort', values: ['none', 'minimal', 'low', 'medium', 'high'] }] };
        })()),
    ...(temperature !== undefined && !canonical.baseModel ? { temperature } : {}),
    ...(tool_call !== undefined && (!canonical.baseModel || caps.size > 0) ? { tool_call } : {}),
    ...(structured_output !== undefined && (!canonical.baseModel || caps.size > 0) ? { structured_output } : {}),
    ...(knowledge ? { knowledge } : {}),
    open_weights: ow.value,
    ...costFields,
    // limit: context + output both required for inline models
    ...(!hasBaseModel || merged.contextLength ? { 'limit.context': merged.contextLength ?? existing['limit.context'] ?? 131072 } : {}),
    ...(existing['limit.output'] !== undefined
      ? { 'limit.output': existing['limit.output'] }
      : (!hasBaseModel ? { 'limit.output': 4096 } : {})),
    'modalities.input': inputModalities,
    // Pass through hand-authored array-of-tables (benchmarks, weights, etc.)
    ...(existing['benchmarks'] !== undefined ? { benchmarks: existing['benchmarks'] } : {}),
    ...(existing['weights'] !== undefined ? { weights: existing['weights'] } : {}),
  };

  const toml = buildToml(fields, merged.executableId);

  return { id: merged.model, toml, isNew, changedFields, guesses };
}

export interface SyncSummary {
  created: TranslatedModel[];
  updated: TranslatedModel[];
  deprecated: TranslatedModel[];
  unchanged: TranslatedModel[];
}

export async function writeFiles(
  translations: TranslatedModel[],
  modelsDevDir: string
): Promise<void> {
  const modelsDir = join(modelsDevDir, 'providers/sap-ai-core/models');
  await mkdir(modelsDir, { recursive: true });
  for (const t of translations) {
    await writeFile(join(modelsDir, `${t.id}.toml`), t.toml, 'utf8');
  }
}

export function printSummary(summary: SyncSummary): void {
  const allModels = [...summary.created, ...summary.updated, ...summary.deprecated, ...summary.unchanged];
  console.error('\nSAP AI Core → models.dev sync\n');
  console.error(`  Created:    ${summary.created.length}${summary.created.length ? '  (' + summary.created.map(t => t.id).join(', ') + ')' : ''}`);
  console.error(`  Updated:    ${summary.updated.length}${summary.updated.length ? '  (' + summary.updated.map(t => t.id).join(', ') + ')' : ''}`);
  console.error(`  Deprecated: ${summary.deprecated.length}${summary.deprecated.length ? '  (' + summary.deprecated.map(t => t.id).join(', ') + ')' : ''}`);
  console.error(`  Unchanged:  ${summary.unchanged.length}`);

  const allGuesses = allModels.flatMap(t => t.guesses.map(g => `    ${t.id}: ${g}`));
  if (allGuesses.length) {
    console.error('\n  Guessed fields (please verify):');
    for (const g of allGuesses) console.error(g);
  }
}

async function main(): Promise<void> {
  const modelsDevDir = process.env['MODELS_DEV_DIR'] ?? process.argv[2];
  if (!modelsDevDir) {
    console.error('Usage: pnpm tsx scripts/sync-models-dev.ts <models-dev-dir>');
    console.error('Or set MODELS_DEV_DIR env var.');
    process.exit(1);
  }
  if (!existsSync(modelsDevDir)) {
    console.error(`Error: directory not found: ${modelsDevDir}`);
    process.exit(1);
  }

  const [sapModels, apiMap, costMap] = await Promise.all([loadSapModels(), fetchApiModels(), loadSapModelCosts()]);
  const merged = mergeModels(sapModels, apiMap, costMap);

  const oldContentMap = new Map<string, string>();
  const translations: TranslatedModel[] = [];
  for (const m of merged) {
    const tomlPath = join(modelsDevDir, 'providers/sap-ai-core/models', `${m.model}.toml`);
    const existingContent = existsSync(tomlPath) ? await readFile(tomlPath, 'utf8') : '';
    oldContentMap.set(m.model, existingContent);
    const existing = parseSimpleToml(existingContent);
    const translated = await translateModel(m, modelsDevDir, existing);
    translations.push(translated);
  }

  const mergedByModel = new Map(merged.map(m => [m.model, m]));

  const created: TranslatedModel[] = [];
  const updated: TranslatedModel[] = [];
  const unchanged: TranslatedModel[] = [];

  for (const t of translations) {
    const oldContent = oldContentMap.get(t.id) ?? '';
    const m = mergedByModel.get(t.id)!;
    if (t.isNew) {
      if (!m.availableInOrchestration) {
        console.error(`⚠ Skipping non-orchestration model not yet in models.dev: ${t.id}`);
        continue;
      }
      if (m.deprecated || m.retired) {
        console.error(`⚠ Skipping deprecated/retired model not yet in models.dev: ${t.id}`);
        continue;
      }
      created.push(t);
    } else if (oldContent !== t.toml) {
      updated.push(t);
    } else {
      unchanged.push(t);
    }
  }

  const deprecated = translations.filter(t => t.toml.includes('status = "deprecated"'));

  const summary: SyncSummary = { created, updated, deprecated, unchanged };

  printSummary(summary);
  await writeFiles([...created, ...updated], modelsDevDir);

  const output = { translations: translations.map(t => ({ id: t.id, toml: t.toml })) };
  process.stdout.write(JSON.stringify(output));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
