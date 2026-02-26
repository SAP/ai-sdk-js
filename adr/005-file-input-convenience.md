# File Input Convenience API

## Status

proposed

## Context

The orchestration package supports multi-modal messages containing files (PDF, CSV, DOCX, MP3) alongside text.

The OpenAPI specification describes `file.file_data` as "Base64 encoded file content or file URL".

In practice, the orchestration service only accepts RFC 2397 data URIs with a non-empty MIME type for inline file content.

<details>
<summary>Example error responses</summary>

Plain base64 string without `data:` prefix:

```json
{
  "error": {
    "request_id": "aa1b6e55-5df4-9533-932d-7961e23ea453",
    "code": 400,
    "message": "400 - Request Body: Invalid file_data format. Must be either a base64 data URI (e.g., 'data:application/pdf;base64,...') or a valid public HTTP/HTTPS URL.",
    "location": "Request Body",
    "headers": { "Content-Type": "application/json" }
  }
}
```

Data URI without MIME type (e.g. `data:;base64,...`):

```json
{
  "error": {
    "request_id": "aa1b6e55-5df4-9533-932d-7961e23ea453",
    "code": 400,
    "message": "400 - Request Body: Invalid file_data format. MIME type is required in data URI (e.g., 'data:application/pdf;base64,...').",
    "location": "Request Body",
    "headers": { "Content-Type": "application/json" }
  }
}
```

Response for unsupported MIME type (claude).

```json5
{
  "error": {
    "request_id": "6226262a-80a9-9072-b9aa-3040fa54db4c",
    "code": 400,
    "message": "400 - LLM Module: Model 'anthropic--claude-4.5-haiku' only supports PDF documents. Please provide a valid PDF file.",
    "location": "LLM Module",
    "intermediate_results": { /*...*/ }
  }
}
```

Response for unsupported MIME type (gemini).

```json5
{
  "error": {
    "request_id": "7a4a3f19-643a-94dd-8b72-f83b1bcb5544",
    "code": 400,
    "message": "400 - LLM Module: Unable to submit request because it has a mimeType parameter with value xx, which is not supported. Update the mimeType and try again. Learn more: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini",
    "location": "LLM Module",
    "intermediate_results": { /*...*/ }
  }
}
```

</details>

Other formats (e.g. plain base64 without the `data:` prefix, or data URIs with an empty MIME type) are rejected.

The required format is:

```
data:<mimeType>;base64,<base64EncodedData>
```

To send an inline file today, users must:

1. Read the file from disk and base64-encode it
2. Know and correctly specify the MIME type
3. Manually concatenate the data URI string

```ts
// Current usage
import { readFile } from 'node:fs/promises';

const base64 = await readFile('./document.pdf', 'base64');
const fileData = `data:application/pdf;base64,${base64}`;

client.chatCompletion({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Summarise this document.' },
        {
          type: 'file',
          file: { file_data: fileData, filename: 'document.pdf' }
        }
      ]
    }
  ]
});
```

This is error-prone and requires knowledge that the SDK could encapsulate:

- The RFC 2397 prefix and the MIME type are mandatory; missing or empty MIME types are rejected by the service.
- Long MIME types (e.g. `application/vnd.openxmlformats-officedocument.wordprocessingml.document` for DOCX) are easy to mistype.

Image inputs are already reasonably ergonomic (`image_url.url` is a plain string) and are not the primary focus of this ADR.

Not all models support all file types, or any file input at all.
The table below shows the current state.
In addition, (input) masking currently only supports PDF.

| Model            | PDF | CSV | DOCX | MP3 |
| ---------------- | :-: | :-: | :--: | :-: |
| claude-4.5-haiku | ✅  | ❌  |  ❌  | ❌  |
| gemini-2.5-flash | ✅  | ✅  |  ❌  | ✅  |
| nova-lite        | ❌  | ❌  |  ❌  | ❌  |
| gpt-5-mini       | ❌  | ❌  |  ❌  | ❌  |
| sonar            | ✅  | ✅  |  ✅  | ❌  |
| mistral-medium   | ❌  | ❌  |  ❌  | ❌  |

Helpful links:

<!-- vale off -->

- [OpenAI Responses SDK-API for PDF](https://developers.openai.com/api/docs/guides/file-inputs#uploading-files)
- [Langchain PDF input](https://docs.langchain.com/oss/javascript/langchain/messages#multimodal)
- [Vercel AI SDK PDF input](https://ai-sdk.dev/providers/ai-sdk-providers/openai#pdf-support)
- Other providers mostly split base64 encoding and MIME type management into separate properties, without requiring users to manually construct data URIs.
- [RFC 2397 - The "data" URL scheme](https://datatracker.ietf.org/doc/html/rfc2397)
- [RFC 6838 - Media Types](https://datatracker.ietf.org/doc/html/rfc6838)
- [MDN Web Docs - Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [MDN Web Docs - MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
<!-- vale on -->

## Proposed Decision

Accept a structured `{ data: string; mimeType: string }` shape for `file_data` in the SDK (Option D) and serialize it to the required RFC 2397 data URI string at request-construction time.

### Type Definitions

```ts
interface FileData {
  data: string; // Base64-encoded file content, potentiall also allow raw binary types like `Buffer` as returned by `fs.readFile` in Node.js
  mimeType: string; // RFC 2045 MIME type (e.g., 'application/pdf')
}

interface FileContent {
  // RFC 2397 data URI string or structured FileData object
  file_data: string | FileData; 
  // Some models require a filename
  // Orchestration will generate one if not provided
  // We should document that providing a filename is recommended.
  filename?: string; 
}
```

Optionally add SDK helpers as follow-ups:

- `buildFileContent(base64, mimeType, filename?)` (Option F), as a lightweight convenience wrapper around Option D.
- `fileContentFromPath(path, options?)` (Option E) as a Node.js-only helper, isolated from the main ESM entry point.

## Discussion

## Option A: Expose as-is, but validate and document the required RFC 2397 format

Keep the raw string API unchanged and improve documentation.

To improve the experience add validation and helpful error messages for common issues.

**Pros:**

- Zero API surface change; no new code to maintain.

**Cons:**

- Repeated boilerplate and runtime-only errors for formatting/MIME issues.

## Option B: Expose as-is, but sniff content-type from bare base64 and data URIs without content types

Accept a plain base64 string or a data URI without a MIME type, and attempt to sniff the content type from the binary data.
This would be a best-effort heuristic and would require a fallback (e.g. defaulting to `application/octet-stream`) for unsupported or ambiguous types.

**Pros:**

- Does not require new input types or helpers.

**Cons:**

- Content-type sniffing can be unreliable and may lead to incorrect types, especially for non-binary files (CSV).
- Increases implementation complexity for a format the service currently rejects.

---

## Option C: Accept `File` / `Blob`

Extend `file_data` to accept a `File` or `Blob` in addition to a plain string.
The SDK encodes the binary data to base64 and assembles the data URI internally.

`File` and `Blob` are globally available in Node 20+ (the minimum supported LTS) and natively in all modern browsers.

```ts
// Hypothetical usage
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('./document.pdf', { type: 'application/pdf' });

// There is no built-in helper for reading to `File` directly, but `openAsBlob` may return `File` in the future.
// If using `File`, ensure `type` is set, since the service requires a MIME type.
const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
client.chatCompletion({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Summarise this document.' },
        { type: 'file', file }
      ]
    }
  ]
});
```

**Pros:**

- Native cross-platform type for binary data with MIME type and filename metadata.
- Aligned with Parquet file handling in the RPT client SDK.

**Cons:**

- Still needs base64 encoding in the SDK
- Manual content-type management when creating `File`/`Blob` instances, easy to forget or get wrong.
- Also requires validation and helpful error messages for missing/empty MIME types.
- Users will need to know correct MIME types

---

## Option D: Structured `{ data: string; mimeType: string }` pair

Accept a structured object in addition or instead of the raw string, letting the SDK assemble the data URI.

```ts
// Hypothetical usage
const base64 = await readFile('./document.pdf', 'base64');

client.chatCompletion({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Summarise this document.' },
        {
          type: 'file',
          file: {
            file_data: { data: base64, mimeType: 'application/pdf' },
            filename: 'document.pdf'
          }
        }
      ]
    }
  ]
});
```

**Pros:**

- Removes RFC 2397 string formatting errors
- Makes the MIME type explicit

**Cons:**

- Still requires manual file reading + base64.
- Orchestration service explicitly did not implement this API shape.
- Users will need to know correct MIME types

**Alternative**: Support `format` propertiy with common file types (e.g. `pdf`, `csv`, `docx`, `mp3`) and infer MIME types internally.


---

## Option E: Helper function `fileContentFromPath(path, options?)`

A Node.js convenience helper that reads a file from disk, base64-encodes it, and returns a ready-to-use `FileContent` object.
MIME type is inferred from the file extension for supported types; an explicit override is always available.

```ts
// Hypothetical usage
import { fileContentFromPath } from '@sap-ai-sdk/orchestration';

client.chatCompletion({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Summarise this document.' },
        { type: 'file', file: await fileContentFromPath('./document.pdf') }
      ]
    }
  ]
});

// With explicit MIME type
const file = await fileContentFromPath('./data.bin', {
  mimeType: 'application/pdf',
  filename: 'report.pdf'
});
```

**Alternative**: Build full `file` message content.

**Pros:**

- Best UX for the common Node.js “read from disk” case.

**Cons:**

- MIME detection is no cure-all.
- Discoverability
- Does not prevent misuse of the underlying `file_data` field with incorrect formats.

---

## Option F: Helper function `buildFileContent(base64, mimeType, filename?)`

A minimal, cross-platform utility that takes a base64 string and MIME type and returns a ready-to-use file object.

```ts
// Hypothetical usage
import { buildFileContent } from '@sap-ai-sdk/orchestration';

const base64 = await readFile('./document.pdf', 'base64');

client.chatCompletion({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Summarise this document.' },
        {
          type: 'file',
          file: buildFileContent(base64, 'application/pdf', 'document.pdf')
        }
      ]
    }
  ]
});
```

**Alternative**: Build full `file` message content.

**Pros:**

- Eliminates RFC 2397 formatting errors

**Cons:**

- Users still read + base64-encode the file.
- Discoverability.
- Does not prevent misuse of the underlying `file_data` field with incorrect formats.
