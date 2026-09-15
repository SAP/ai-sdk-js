/* eslint-disable jsdoc/require-jsdoc */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setFailed, info } from '@actions/core';
import { getPackages } from '@manypkg/get-packages';
import { messageTypes } from '../changeset-types.js';
function getPackageName(changelog) {
    return changelog.split('\n')[0].split('/')[1];
}
function splitByVersion(changelog) {
    return changelog
        .split('\n## ')
        .slice(1)
        .map(h2 => {
        const [version, ...content] = h2.split('\n');
        return {
            version,
            content: content.join('\n').trim()
        };
    });
}
function getMessageType(matchedType) {
    if (!matchedType) {
        throw new Error('Missing message type');
    }
    const type = messageTypes.find(({ name, alternatives }) => [name, ...alternatives].includes(matchedType.toLowerCase()));
    if (!type) {
        throw new Error(`Invalid message type: ${matchedType}`);
    }
    return type;
}
function getSummary(matchedSummary) {
    const summary = matchedSummary?.trim();
    if (!summary) {
        throw new Error('Empty or missing summary');
    }
    return summary;
}
function parseContent(content, version, packageName) {
    const contentRegex = /- ((?<commit>.*?):) (\[(?<type>.*?)\])? ?(?<summary>[^]*?)(?=(\n- |\n### |$))/g;
    info(`parsing content for ${packageName} v${version}`);
    return [...content.matchAll(contentRegex)].map(({ groups }) => {
        const type = getMessageType(groups?.type);
        const summary = getSummary(groups?.summary);
        return {
            version,
            summary,
            packageNames: [packageName],
            commit: groups?.commit ? `(${groups.commit})` : '',
            type
        };
    });
}
function parseChangelog(changelog) {
    const packageName = getPackageName(changelog);
    const [latest] = splitByVersion(changelog);
    return parseContent(latest.content, latest.version, packageName).flat();
}
function formatMessagesOfType(messages, type) {
    const formattedMessages = messages
        .filter(msg => msg.type.name === type.name)
        .map(msg => `- [${msg.packageNames.join(', ')}] ${msg.summary} ${msg.commit}${msg.dependencies || ''}`)
        .join('\n');
    return `## ${type.title}\n\n${formattedMessages}`;
}
function mergeMessages(parsedMessages) {
    return parsedMessages.reduce((prev, curr) => {
        const sameMessage = prev.find(msg => msg.summary === curr.summary &&
            msg.dependencies === curr.dependencies &&
            msg.version === curr.version &&
            msg.type.name === curr.type.name);
        if (sameMessage) {
            sameMessage.packageNames.push(curr.packageNames[0]);
            return prev;
        }
        return [...prev, curr];
    }, []);
}
async function formatChangelog(messages) {
    if (!messages.length) {
        throw new Error('No messages found in changelogs');
    }
    return messageTypes
        .filter(type => messages.some(msg => msg.type.name === type.name))
        .map(type => formatMessagesOfType(messages, type))
        .join('\n\n');
}
async function getPublicChangelogs() {
    const { packages } = await getPackages(process.cwd());
    const pathsToPublicLogs = packages
        .filter(({ packageJson }) => !packageJson.private)
        .map(({ relativeDir }) => resolve(relativeDir, 'CHANGELOG.md'));
    info(`changelogs to merge: ${pathsToPublicLogs.join(', ')}`);
    return Promise.all(pathsToPublicLogs.map(async (file) => readFile(file, { encoding: 'utf8' })));
}
async function writeChangelog(changelog) {
    if (!changelog) {
        throw new Error('CHANGELOG environment variable not set.');
    }
    if (!process.env.VERSION) {
        throw new Error('VERSION environment variable not set.');
    }
    const unifiedChangelog = await readFile('CHANGELOG.md', { encoding: 'utf8' });
    await writeFile('CHANGELOG.md', unifiedChangelog.split('\n').slice(0, 30).join('\n') +
        '\n' +
        `# ${process.env.VERSION}` +
        '\n' +
        changelog +
        '\n\n' +
        unifiedChangelog.split('\n').slice(30).join('\n'), { encoding: 'utf8' });
}
export async function mergeChangelogs() {
    const changelogs = await getPublicChangelogs();
    const mergedChangelog = await formatChangelog(mergeMessages(changelogs.map(log => parseChangelog(log)).flat()));
    await writeChangelog(mergedChangelog);
}
mergeChangelogs().catch(error => {
    setFailed(error.message);
});
