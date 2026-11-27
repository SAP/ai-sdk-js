import { getInput, setOutput } from '@actions/core';
import { getReleasePlan } from '@changesets/get-release-plan';

import { versionPackages } from '../../../scripts/version-packages.ts';

const cwd = process.cwd();
const releasePlan = await getReleasePlan(cwd);
const majorRelease = releasePlan.releases.find(
  release => release.type === 'major'
);
if (majorRelease && majorRelease.newVersion !== getInput('majorVersion')) {
  throw new Error(
    `Set majorVersion to ${majorRelease.newVersion} to confirm the major release.`
  );
}
const version = await versionPackages(cwd, releasePlan);
setOutput('version', version);
