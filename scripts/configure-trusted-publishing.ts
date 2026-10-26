/* oxlint-disable no-console */

import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const repository = 'SAP/ai-sdk-js';
const publishPermission = 'createPackage';
const rateLimitDelayMs = 2_000;
const obsoleteWorkflowFile = 'publish.yml';

export interface TrustTarget {
  name: string;
  workflowFile: string;
  environment: string;
}

const trustTargets: TrustTarget[] = [
  {
    name: 'release',
    workflowFile: 'publish-release.yml',
    environment: 'release'
  },
  {
    name: 'canary',
    workflowFile: 'publish-canary.yml',
    environment: 'canary-release'
  }
];

interface WorkspacePackage {
  name?: unknown;
  private?: unknown;
}

export interface TrustConfiguration {
  id?: string;
  type?: string;
  file?: string;
  repository?: string;
  environment?: string;
  permissions?: string[];
}

export type TrustAction = { type: 'create' } | { type: 'revoke'; id: string };
export type RevokeTrustAction = Extract<TrustAction, { type: 'revoke' }>;

interface CommandResult {
  stdout: string;
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  captureStdout = true
): Promise<CommandResult> {
  const {
    promise,
    resolve: resolveCommand,
    reject: rejectCommand
  } = Promise.withResolvers<CommandResult>();
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, PWD: cwd },
    stdio: ['inherit', captureStdout ? 'pipe' : 'inherit', 'inherit']
  });
  let stdout = '';

  child.stdout?.setEncoding('utf8');
  child.stdout?.on('data', chunk => {
    stdout += chunk;
  });
  child.on('error', rejectCommand);
  child.on('close', code => {
    if (code === 0) {
      resolveCommand({ stdout });
    } else {
      rejectCommand(
        new Error(`${command} ${args.join(' ')} exited with code ${code}`)
      );
    }
  });
  return promise;
}

/**
 * Parses the sequence of JSON objects emitted by `npm trust list --json`.
 * npm prints one standalone object per trust relationship instead of one array.
 * @param input - Command stdout.
 * @returns Parsed trust relationships.
 */
export function parseJsonObjectSequence(input: string): TrustConfiguration[] {
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    return [];
  }

  return trimmedInput
    .split(/\r?\n[ \t]*\r?\n/)
    .map(value => JSON.parse(value) as TrustConfiguration);
}

function isManagedConfiguration(
  config: TrustConfiguration,
  target: TrustTarget
): config is TrustConfiguration & { id: string } {
  return (
    config.type === 'github' &&
    config.file === target.workflowFile &&
    typeof config.id === 'string'
  );
}

/**
 * Plans a safe reconciliation of a GitHub trusted publisher.
 * Configurations for other workflows and providers are left untouched.
 * @param configurations - Existing npm trust relationships.
 * @param target - Workflow and environment to reconcile.
 * @param recreate - Whether to replace even an already-matching publisher.
 * @returns Ordered create and revoke operations.
 */
export function getTrustActions(
  configurations: TrustConfiguration[],
  target: TrustTarget,
  recreate = false
): TrustAction[] {
  const managedConfigurations = configurations.filter(config =>
    isManagedConfiguration(config, target)
  );
  if (recreate) {
    return [
      ...managedConfigurations.map(config => ({
        type: 'revoke' as const,
        id: config.id
      })),
      { type: 'create' }
    ];
  }

  const desiredConfigurations = managedConfigurations.filter(
    config =>
      config.repository === repository &&
      config.environment === target.environment &&
      config.permissions?.includes(publishPermission) === true
  );

  if (desiredConfigurations.length > 0) {
    const keep = desiredConfigurations[0];
    return managedConfigurations
      .filter(config => config !== keep)
      .map(config => ({ type: 'revoke', id: config.id }));
  }

  const sameClaims = managedConfigurations.filter(
    config =>
      config.repository === repository &&
      config.environment === target.environment
  );
  const otherStaleConfigurations = managedConfigurations.filter(
    config =>
      config.repository !== repository ||
      config.environment !== target.environment
  );

  return [
    ...sameClaims.map(config => ({ type: 'revoke' as const, id: config.id })),
    { type: 'create' },
    ...otherStaleConfigurations.map(config => ({
      type: 'revoke' as const,
      id: config.id
    }))
  ];
}

/**
 * Finds GitHub trusted publishers for the removed publish workflow.
 * @param configurations - Existing npm trust relationships.
 * @returns Revoke operations for obsolete publishers.
 */
export function getObsoleteTrustActions(
  configurations: TrustConfiguration[]
): RevokeTrustAction[] {
  return configurations
    .filter(
      (config): config is TrustConfiguration & { id: string } =>
        config.type === 'github' &&
        config.file === obsoleteWorkflowFile &&
        typeof config.id === 'string'
    )
    .map(config => ({ type: 'revoke', id: config.id }));
}

async function getReleasePackages(root: string): Promise<string[]> {
  const { stdout } = await runCommand(
    'pnpm',
    ['list', '--recursive', '--depth=-1', '--json'],
    root
  );
  const workspacePackages = JSON.parse(stdout) as WorkspacePackage[];

  return workspacePackages
    .filter(
      (
        workspacePackage
      ): workspacePackage is WorkspacePackage & { name: string } =>
        workspacePackage.private === false &&
        typeof workspacePackage.name === 'string'
    )
    .map(workspacePackage => workspacePackage.name)
    .sort();
}

async function runNpmTrust(
  args: string[],
  captureStdout = false
): Promise<string> {
  const { stdout } = await runCommand(
    'npm',
    ['trust', ...args],
    tmpdir(),
    captureStdout
  );
  await delay(rateLimitDelayMs);
  return stdout;
}

type CliMode = 'preview' | 'plan' | 'apply';

interface CliOptions {
  help: boolean;
  mode: CliMode;
  recreateAll: boolean;
  recreatePackages: Set<string>;
}

function parseCliOptions(args: string[]): CliOptions {
  let help = false;
  let mode: CliMode = 'preview';
  let recreateAll = false;
  const recreatePackages = new Set<string>();

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--help') {
      help = true;
    } else if (arg === '--plan' || arg === '--apply') {
      const requestedMode = arg.slice(2) as CliMode;
      if (mode !== 'preview' && mode !== requestedMode) {
        throw new Error('--plan and --apply are mutually exclusive.');
      }
      mode = requestedMode;
    } else if (arg === '--recreate') {
      const packageName = args[index + 1];
      if (!packageName || packageName.startsWith('--')) {
        throw new Error('--recreate requires a package name.');
      }
      recreatePackages.add(packageName);
      index++;
    } else if (arg === '--recreate-all') {
      recreateAll = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (recreateAll && recreatePackages.size > 0) {
    throw new Error('--recreate and --recreate-all cannot be combined.');
  }
  if (
    mode === 'preview' &&
    (recreateAll || recreatePackages.size > 0) &&
    !help
  ) {
    throw new Error('--recreate requires --plan or --apply.');
  }

  return { help, mode, recreateAll, recreatePackages };
}

async function runOrPrintTrustCommand(
  args: string[],
  apply: boolean
): Promise<void> {
  console.log(`  $ npm trust ${args.join(' ')}`);
  if (apply) {
    await runNpmTrust(args);
  }
}

async function reconcilePackage(
  packageName: string,
  apply: boolean,
  recreate: boolean
): Promise<void> {
  console.log(`\n${packageName}`);
  const configurations = parseJsonObjectSequence(
    await runNpmTrust(['list', packageName, '--json'], true)
  );
  let hasActions = false;

  for (const action of getObsoleteTrustActions(configurations)) {
    hasActions = true;
    await runOrPrintTrustCommand(
      ['revoke', packageName, '--id', action.id],
      apply
    );
  }

  for (const target of trustTargets) {
    for (const action of getTrustActions(configurations, target, recreate)) {
      hasActions = true;
      if (action.type === 'create') {
        await runOrPrintTrustCommand(
          [
            'github',
            packageName,
            '--repo',
            repository,
            '--file',
            target.workflowFile,
            '--env',
            target.environment,
            '--allow-publish',
            '--yes'
          ],
          apply
        );
      } else {
        await runOrPrintTrustCommand(
          ['revoke', packageName, '--id', action.id],
          apply
        );
      }
    }
  }

  if (!hasActions) {
    console.log('  no changes');
  }
}

export async function configureTrustedPublishing(
  args = process.argv.slice(2),
  root = resolve(import.meta.dirname, '..')
): Promise<void> {
  const options = parseCliOptions(args);
  if (options.help) {
    console.log(
      `Usage: pnpm trust:publishing [--plan | --apply] [--recreate <package>...] [--recreate-all]\n\nWithout a mode, lists the local public pnpm workspace packages and managed workflows without contacting npm.\n--plan reads npm and prints the exact commands without writing.\n--apply reads npm and executes the required commands.\n--recreate <package> forces replacement of matching release and canary publishers for one package. Repeat it for additional packages.\n--recreate-all forces replacement for every public workspace package.\n\nManaged GitHub publishers for ${repository}:\n${trustTargets.map(target => `  ${target.workflowFile} (${target.environment})`).join('\n')}\n\nEach package is read before any write. Already-matching configurations are retained unless explicitly recreated. Stale managed configurations are replaced, and obsolete GitHub configurations for ${obsoleteWorkflowFile} are revoked. Other workflow filenames and providers remain unchanged.\n\nWARNING: npm trust list does not expose expiry state. Use --recreate only for configurations known to be expired or invalid. Every recreated configuration must successfully publish within two days.\n\nRegistry-aware modes require npm 11.15.0 or newer and an npm account with package write access and 2FA enabled.\nRun npm --prefix /dev/null login first. On the initial authentication, allow npm to skip 2FA for the next five minutes.\nGranular access tokens with bypass-2FA are not supported by npm trust.`
    );
    return;
  }

  const packages = await getReleasePackages(root);
  const packageNames = new Set(packages);
  const unknownRecreatePackages = [...options.recreatePackages].filter(
    packageName => !packageNames.has(packageName)
  );
  if (unknownRecreatePackages.length > 0) {
    throw new Error(
      `Cannot recreate packages outside the public workspace: ${unknownRecreatePackages.join(', ')}`
    );
  }

  const verb =
    options.mode === 'apply'
      ? 'Reconciling'
      : options.mode === 'plan'
        ? 'Planning changes for'
        : 'Would reconcile';
  console.log(
    `${verb} ${packages.length} public workspace packages for ${repository}:`
  );
  trustTargets.forEach(target =>
    console.log(`  ${target.workflowFile} (${target.environment})`)
  );
  console.log(`  revoke obsolete ${obsoleteWorkflowFile} configurations`);
  packages.forEach(packageName => console.log(`  ${packageName}`));

  if (options.mode === 'preview') {
    console.log(
      '\nRun pnpm trust:publishing --plan to read npm and print exact changes.'
    );
    return;
  }
  if (packages.length === 0) {
    throw new Error('No public pnpm workspace packages found.');
  }

  if (options.recreateAll || options.recreatePackages.size > 0) {
    console.warn(
      '\nWARNING: Explicit recreation revokes matching publishers even when they appear valid. npm does not expose expiry state.'
    );
  }
  if (options.mode === 'apply') {
    console.warn(
      '\nWARNING: Every newly created configuration must complete a successful publish within two days or it expires. Ensure both release and canary publishing can run within that window.'
    );
  }

  console.log(
    '\nAuthenticating with npm. Allow npm to skip 2FA for the next five minutes.'
  );
  await runNpmTrust(['list', packages[0]]);

  for (const packageName of packages) {
    await reconcilePackage(
      packageName,
      options.mode === 'apply',
      options.recreateAll || options.recreatePackages.has(packageName)
    );
  }
}

if (process.argv[1] === import.meta.filename) {
  configureTrustedPublishing().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
