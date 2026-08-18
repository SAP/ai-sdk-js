import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { StructuredToolInterface } from '@langchain/core/tools';

// Native-fetch GitHub tools — replaces the deprecated @modelcontextprotocol/server-github.
// Repo is hardcoded in every URL, so the model can never widen scope: it only ever supplies
// a free-text term, an issue number, or a file path (never owner/repo or a raw `q`).

const GH_API = 'https://api.github.com';
const ALLOWED_REPO = 'SAP/ai-sdk-js';

// GitHub requires a User-Agent — it returns 403 without one. Read token is reused from the
// workflow env (contents:read is enough for search + read; none of these tools write).
async function gh(path: string): Promise<unknown> {
  const res = await fetch(GH_API + path, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'sap-ai-sdk-support-bot'
    }
  });
  if (!res.ok) {
    // The agent loop catches thrown tool errors into a ToolMessage, so this surfaces
    // rate-limit/403 cleanly without leaking more than status + a short snippet.
    throw new Error(
      `GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`
    );
  }
  return res.json();
}

// SEC-3: scope enforced at the API call. The only bypass vector is an injected
// repo:/org:/user: qualifier — `repo:SAP/ai-sdk-js foo OR repo:other bar` leaks the
// other repo's results (verified). Bare OR/AND/NOT never widen scope: the leading
// repo: binds the whole query (dangling/leading OR after stripping also stays scoped).
// So strip only the competing qualifiers and keep boolean operators for richer search.
// GitHub caps AND/OR/NOT at 5 and 422s beyond that, surfacing as a retryable tool error.
function scopedQuery(term: string): string {
  const stripped = (term ?? '')
    .replace(/(?:^|\s)(?:repo|org|user):[^\s]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return `repo:${ALLOWED_REPO} ${stripped}`.trim();
}

const searchIssues = tool(
  async ({ query }) => {
    const q = encodeURIComponent(`${scopedQuery(query)} is:issue`);
    const data = (await gh(`/search/issues?search_type=hybrid&q=${q}`)) as {
      items?: {
        number: number;
        title: string;
        state: string;
        html_url: string;
        repository_url: string;
      }[];
    };
    // Compact projection — raw search JSON overruns the loop's char cap into garbage.
    // SEC-3 defense-in-depth: enforce scope on the RESULTS too, independent of how GitHub
    // parsed the query, so an unforeseen query-syntax trick can't surface a foreign repo.
    const items = (data.items ?? [])
      .filter(i => i.repository_url === `${GH_API}/repos/${ALLOWED_REPO}`)
      .map(i => ({
        number: i.number,
        title: i.title,
        state: i.state,
        url: i.html_url
      }));
    return JSON.stringify(items);
  },
  {
    name: 'github__search_issues',
    description:
      'Search GitHub issues in SAP/ai-sdk-js. Pass keywords only — the repo scope is applied automatically.',
    schema: z.object({
      query: z
        .string()
        .describe('Search keywords, e.g. "streaming getDeltaContent"')
    })
  }
);

const getIssue = tool(
  async ({ issue_number }) => {
    const d = (await gh(`/repos/${ALLOWED_REPO}/issues/${issue_number}`)) as {
      number: number;
      title: string;
      state: string;
      body: string | null;
    };
    return JSON.stringify({
      number: d.number,
      title: d.title,
      state: d.state,
      body: d.body
    });
  },
  {
    name: 'github__get_issue',
    description: 'Fetch a single issue from SAP/ai-sdk-js by its number.',
    schema: z.object({
      issue_number: z.number().describe('The issue number, e.g. 183')
    })
  }
);

const searchCode = tool(
  async ({ query }) => {
    const q = encodeURIComponent(scopedQuery(query));
    const data = (await gh(`/search/code?q=${q}`)) as {
      items?: {
        name: string;
        path: string;
        html_url: string;
        repository?: { full_name: string };
      }[];
    };
    // SEC-3 defense-in-depth: same result-side scope check as search_issues.
    const items = (data.items ?? [])
      .filter(i => i.repository?.full_name === ALLOWED_REPO)
      .map(i => ({
        name: i.name,
        path: i.path,
        url: i.html_url
      }));
    return JSON.stringify(items);
  },
  {
    name: 'github__search_code',
    description:
      'Search code in SAP/ai-sdk-js. Pass keywords only — the repo scope is applied automatically.',
    schema: z.object({
      query: z.string().describe('Search keywords, e.g. "OrchestrationClient"')
    })
  }
);

const getFileContents = tool(
  async ({ path }) => {
    const data = (await gh(`/repos/${ALLOWED_REPO}/contents/${path}`)) as {
      content?: string;
      encoding?: string;
    };
    if (data.encoding === 'base64' && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return JSON.stringify(data);
  },
  {
    name: 'github__get_file_contents',
    description:
      'Read a file from SAP/ai-sdk-js by repo-relative path, e.g. "packages/core/src/model-types.ts".',
    schema: z.object({
      path: z.string().describe('Repo-relative file path')
    })
  }
);

export const githubTools: StructuredToolInterface[] = [
  searchIssues,
  getIssue,
  searchCode,
  getFileContents
] as unknown as StructuredToolInterface[];
