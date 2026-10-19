# Context Registry Client

## Status

decided

## Context

The Context Registry is an independent service from Tabular AI Orchestration.
Its authoritative OpenApi specification is now available and is the implementation baseline for the SDK.
It supersedes the nine earlier specifications that split synchronous and asynchronous variants across data destinations, scenario configuration, tabular artifacts, and common APIs.

The SDK must generate from the authoritative specification rather than locally combine or normalize the superseded specifications.
This contract determines the public resources, schemas, headers, and endpoints.

### Generated client

Generate the client from the authoritative specification and release it experimentally without waiting for a complete handwritten API.

Asynchronous creation returns a `202 Accepted` response with a `Location` header.
Consumers can use the generated client to inspect that response and implement any service-specific follow-up themselves in the experimental release.

The package boundary is `@sap-ai-sdk/context-registry`; the specification defines its public API elements.

## Decision

Name the package `@sap-ai-sdk/context-registry`.
Release the generated asynchronous client as an experimental package without waiting for a convenience layer.

Convenience methods, including polling helpers, are follow-up work.
They are intentionally outside the first experimental release so that the service contract can be validated through real usage before the SDK commits to polling, retry, timeout, and cancellation behavior.

## Discussion

### Question 1: Specification Layout

**Decision: use the authoritative specification as provided.**

The final upstream specification defines how asynchronous resources and common APIs are grouped, which schemas are public, and how shared types are represented.
Do not locally merge or normalize the superseded specifications.

### Question 2: Package Name

The context registry is mostly vendor-neutral but retains SAP RPT ties and some breaking-change risk.

The RPT ties are concentrated in the scenario-configuration and tabular-artifact resources, which mirror RPT's context-selection model rather than a generic registry:

- `ContextSelectionStrategy` is a closed enum of `random` and `embedding`, both RPT context-selection strategies; a different provider may not select context the same way, or at all.
- The scenario configuration is built around `tabularArtifacts` referenced by name, an RPT-specific grouping for in-context learning; TabPFN, for example, is stateless and carries its training rows inline per request instead.
- Tabular artifacts carry `csnMetadata` with a `definitionType` of `DOCUMENT`, `REFERENCE`, or `AUTO`, reflecting RPT's CSN (CDS Standard Notation) metadata model; another provider's data intake need not follow CSN.
- The data-destination and SQL-API resources are comparatively neutral (a named data store and a SQL surface), so the RPT coupling is not uniform across the registry.

Because this risk is smaller than for prediction, a vendor-neutral package name is reasonable.

**Decision: Option A.1.** Use the standalone package `@sap-ai-sdk/context-registry`; it will not be part of `@sap-ai-sdk/ai-api`.

#### Option A: Vendor-neutral package name

- A.1: `@sap-ai-sdk/context-registry`
- A.2: `@sap-ai-sdk/tabular-orchestration/context-registry`

**Pros:** Describes the service capability and leaves room for multiple prediction providers.

**Cons:** Overstates neutrality if RPT-specific fields or behavior remain in the public contract.

#### Option B: Vendor-specific package name

- B.1: `@sap-ai-sdk/rpt/context-registry`
- B.2: `@sap-ai-sdk/tabular-orchestration/rpt/context-registry`

**Pros:** Makes current coupling and compatibility expectations explicit.

**Cons:** Requires a rename or sibling package if the service contract becomes more provider-neutral.

### Question 4: Convenience Methods

**Decision: defer convenience methods to follow-up work.** The first experimental release ships the generated client only.
The polling analysis below is retained for a later release because asynchronous creation returns a `202 Accepted` response with a `Location` URL and requires service-specific decisions about intervals, terminal states, retries, timeouts, and cancellation.

#### Option A: No convenience methods

Ship only the generated client as-is.

**Pros:** Minimizes maintenance and keeps behavior aligned with the specification.

**Cons:** Consumers implement any required polling and terminal-state handling themselves.

#### Option B: Add targeted convenience methods in a later release

Add helpers only for workflows that remain cumbersome or unsafe with the generated client, starting with asynchronous polling if real usage justifies it.

<details>
<summary>Click to expand the discussion of options</summary>

**Pros:** Improves common workflows while keeping the handwritten API small.

**Cons:** Requires an explicit contract for timeouts, retries, cancellation, and error propagation.

Asynchronous creation returns a `202 Accepted` response with a `Location` URL.
Subsequent `GET` requests to this URL return a `200 OK` response.
The response lifecycle status is `PROCESSING`, `ACTIVE`, or `ERROR`.

The specification documents the `Location` header, but the deployed service does not return `Retry-After`.
A follow-up helper should use a configured interval by default and honor `Retry-After` if the service adds it.

The helper could be a generic utility shipped in `@sap-ai-sdk/core`, rather than a context-registry-specific function.
The same `202` + `Location` + lifecycle-status pattern is already used by other asynchronous operations in the SDK, such as `VectorApi.createCollection()` in `@sap-ai-sdk/document-grounding`.

The PoC `pollAsyncResource` helper in `@sap-ai-sdk/core` demonstrates one possible polling loop and should support cancellation through `AbortSignal`.

```ts
import { pollAsyncResource } from '@sap-ai-sdk/core';

const artifact = await pollAsyncResource({
  read: () =>
    TabularArtifactsApi.getTabularArtifact(artifactId, {
      'ai-resource-group': rg
    }).execute(dest),
  isComplete: current => current.status === 'ACTIVE',
  getFailure: current =>
    current.status === 'ERROR' ? current.errorMessage : undefined,
  maxAttempts: 60,
  intervalMs: 2_000,
  signal
});

// An async generator covers progress-reporting use cases:
for await (const current of watchAsyncResource(options)) {
  console.log(current.status);
}
```

The helper should accept a `Retry-After` value from both the initial `202` and each polling response and use it as the next interval when present, so that service-driven retry delays are respected automatically if the service starts sending them.

#### Follow-up option B.1: Polling integrated into the OpenApi request builder

Add a `.poll(options)` method directly to the `OpenApiRequestBuilder` returned by each generated operation so that consumers chain polling onto the creation call without a separate import.

The `202` response includes a `Location` header; the request builder already holds the destination context needed to resolve it.
A `.poll()` method could capture the `Location` from the raw response, construct the corresponding GET builder, and delegate to `pollAsyncResource` under the hood:

```ts
const artifact = await TabularArtifactsApi.createTabularArtifact(body, {
  'ai-resource-group': rg
})
  .poll({
    isComplete: r => r.status === 'ACTIVE',
    getFailure: r => (r.status === 'ERROR' ? r.errorMessage : undefined),
    maxAttempts: 60,
    intervalMs: 2_000
  })
  .execute(dest);
```

**Pros:** Discovery is co-located with the create operation — consumers cannot miss polling; no separate import required; destination and headers do not need to be threaded through manually.

**Cons:** Couples polling logic to the code-generated request builder layer, which has no behavior beyond http execution.
Every generated client would inherit an additional method, increasing the API surface even for operations that are not asynchronous.
The builder must know which generated GET operation corresponds to the `Location` URL, requiring either convention-based routing or explicit annotation in the specification via `x-sap-cloud-sdk-*` extensions.
The approach is harder to test in isolation than a plain function.
The best target for polling helpers may be a generic utility in `@sap-ai-sdk/core`, rather than the general request builder from SAP Cloud SDK.
Even this design could be specific to the context-registry and prompt-registry use cases.
It might be incompatible with other later asynchronous operations in the SDK.

#### Follow-up option B.2: User-driven polling helpers

Rather than hiding polling inside a utility or the request builder, provide primitives that return intermediate state and leave the polling loop to the consumer.

Two shapes are possible:

**B.2a — async generator (`watchAsyncResource`)**: yields each poll result as it arrives so the caller can react to intermediate states, log progress, or break:

```ts
import { watchAsyncResource } from '@sap-ai-sdk/core';

for await (const current of watchAsyncResource({
  read: () =>
    TabularArtifactsApi.getTabularArtifact(id, {
      'ai-resource-group': rg
    }).execute(dest),
  intervalMs: 2_000,
  signal
})) {
  console.log('status:', current.status);
  if (current.status === 'ACTIVE') break;
  if (current.status === 'ERROR') throw new Error(current.errorMessage);
}
```

**B.2b — Manual state check**: the consumer calls the generated GET operation directly on a timer of their choosing; the SDK only provides the terminal-state constants or a thin type guard:

```ts
import { isTerminalState } from '@sap-ai-sdk/core';

while (true) {
  const artifact = await TabularArtifactsApi.getTabularArtifact(id, {
    'ai-resource-group': rg
  }).execute(dest);
  if (isTerminalState(artifact)) break;
  await sleep(2_000);
}
```

**Pros:** Full control over back-off, cancellation, logging, and exit conditions.
There is no hidden timeout or retry behavior to discover.
The async generator form composes naturally with `AbortSignal` and structured concurrency.

**Cons:** Every consumer must re-implement loop control for the common case; the ergonomic gap over `pollAsyncResource` is largest when the only goal is "wait for completion".
Progress reporting and exiting before completion during polling are likely rare in practice.
The added API surface and maintenance cost may not be justified by actual usage.

B.2a (async generator) has a structural tension with `Retry-After`.
A demand-driven generator fires the next `read` when the consumer calls `next()`, so the inter-poll delay is controlled by the consumer, not the generator.
There is no natural place inside the generator to honor a server-supplied `Retry-After` hint without sleeping _before_ yielding — at which point the generator is no longer truly demand-driven and is indistinguishable from `pollAsyncResource` with a generator wrapper.
The only escape is to yield a `{ value, retryAfter }` envelope and push the sleep back to the caller, but that recreates the loop-control burden the generator was meant to remove.
A third option is to cache the `Retry-After` hint internally and delay the next `next()` call until the hint expires.
This keeps the delay out of the yielded value.

</details>

#### Follow-up option C: Add a full set of convenience methods

Add helpers for all operations, including those already well-supported by the generated client.

- C.1 Postpone convenience methods until a later release, to reduce initial effort and maintenance burden.
- C.2 Add convenience methods in the initial release, to improve developer experience.

**Pros:** Provides a consistent handwritten experience across the complete API.

**Cons:** Duplicates generated functionality and significantly increases initial effort, maintenance, and the cost of specification changes.
