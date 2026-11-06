/* eslint-disable jsdoc/require-jsdoc */
import { info } from '@actions/core';

import { messageTypes, type MessageType } from './changeset-types.ts';

export interface Change {
  packageNames: string[];
  commit: string;
  type: MessageType;
  version: string;
  summary: string;
  dependencies?: string;
}

function getMessageType(matchedType: string | undefined): MessageType {
  if (!matchedType) {
    throw new Error('Missing message type');
  }
  const type = messageTypes.find(({ name, alternatives }) =>
    [name, ...alternatives].includes(matchedType.toLowerCase())
  );
  if (!type) {
    throw new Error(`Invalid message type: ${matchedType}`);
  }
  return type;
}

function getSummary(matchedSummary: string | undefined): string {
  const summary = matchedSummary?.trim();
  if (!summary) {
    throw new Error('Empty or missing summary');
  }
  return summary;
}

export function parseContent(
  content: string,
  version: string,
  packageName: string
): Change[] {
  const entryRegex = /(?:^|\n)- (?<entry>[^]*?)(?=\n- |\n### |$)/g;
  const messageRegex =
    /^(?:(?<commit>[a-f0-9]+): )?\[(?<type>[^\]]*)\] ?(?<summary>[^]*)$/;

  info(`parsing content for ${packageName} v${version}`);

  return [...content.matchAll(entryRegex)].flatMap(({ groups }) => {
    const entry = groups?.entry?.trim();
    if (/^Updated dependencies(?: \[[^\]\n]+\])?(?:\n|$)/.test(entry || '')) {
      return [];
    }

    const messageGroups = entry?.match(messageRegex)?.groups;
    const type = getMessageType(messageGroups?.type);
    const summary = getSummary(messageGroups?.summary);
    return [
      {
        version,
        summary,
        packageNames: [packageName],
        commit: messageGroups?.commit ? `(${messageGroups.commit})` : '',
        type
      }
    ];
  });
}
