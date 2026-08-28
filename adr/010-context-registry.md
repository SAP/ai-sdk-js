# Context Registry Client

## Status

proposed

## Context

The Context Registry is a service independent of the Tabular AI Orchestration service.
Its current API is split across nine separate OpenApi specifications.
No combined specification is currently available, though an upstream merged specification is planned — its location (AI API or a separate service spec) is still under discussion.
This ADR is therefore blocked on that combined specification.
The specifications cover health, provisioning, a SQL API, and three resources that each ship a synchronous and an asynchronous variant: data destinations, scenario configuration, and tabular artifacts.

The synchronous and asynchronous variants are mutually exclusive deployments.
The asynchronous variant is the target deployment and the only one we need to support in the SDK.
The final merged specification will contain only asynchronous endpoints.

The asynchronous client still requires merging its resource specifications with the common health, provisioning, and SQL API specifications if we want to source from a single specification.
They repeat some type definitions: every resource redefines `ApiError` and `DetailsErrorResponse`, while `ColumnInfo` and `Url` each appear more than once.

Some specifications also contain internal headers (`AI-Main-Tenant`) and internal endpoint references that we should avoid releasing.

### Generated clients

The generated clients are usable but depend on the source specifications.
Their verbose `operationId` names can be replaced with `x-sap-cloud-sdk-operation-name`, making naming a specification concern.
The main usability gap is asynchronous creation: it returns http `202` with a `Location` header, leaving consumers to call `.executeRaw(...)`, parse the header, and implement polling, terminal-state checks, and timeouts.
Consumers also provide the destination and resource-group header unless a helper is added (Question 4).

The SDK design must therefore determine:

- how the (asynchronous) specifications are grouped for generation;
- whether types shared across specifications are duplicated or unified;
- which package boundary communicates the stability of the API;
- how much behavior is added on top of the generated clients;
- how the clients are released relative to the prediction client (see [ADR-009](./009-tabular-orchestration-release-strategy.md)); and
- how internal API elements are excluded or approved for public use.

## Decision

No decision has been accepted yet.
Current recommendations and unresolved questions are recorded below.

## Discussion

### Question 1: Specification Layout

**Recommendation: Option A.** Merge the asynchronous specifications and the common specifications into one self-contained asynchronous specification and generate a single asynchronous client.

The specifications are separate files but not independent APIs; eventually they will be merged or included in one service specification.
Until this is the case, merging via e.g. `@redocly/cli` is a reasonable approach to prepare for an eventual combined specification and to reduce the number of generated clients in the meantime.

#### Option A: Combine specifications before generation

Merge the asynchronous and common specifications (health, provisioning, SQL API) via `@redocly/cli`, then generate one client without waiting for the service team's combined specification.

```text
ctx-registry/
  async-specification.yaml   # asynchronous resources + common specifications
```

An optional synchronous compatibility specification can be produced the same way, from the synchronous and common specifications, if a legacy deployment requires it.

**Pros:** Produces one coherent client surface for the target deployment and keeps the generation input self-contained.

**Cons:** Requires a deterministic merge step and duplicates common definitions in any synchronous compatibility client.
Nonparallel specifications require validation and reconciliation of conflicting or unique schemas.

#### Option B: Wait for an upstream combined specification

**Pros:** Avoids local merge logic and keeps the generated SDK aligned with its source of truth.
**Cons:** Delays the SDK for a specification that has already been requested, and API Hub may still represent the service with multiple specifications.

### Question 2: Package Name

The context registry is mostly vendor-neutral but retains SAP RPT ties and some breaking-change risk.

The RPT ties are concentrated in the scenario-configuration and tabular-artifact resources, which mirror RPT's context-selection model rather than a generic registry:

- `ContextSelectionStrategy` is a closed enum of `random` and `embedding`, both RPT context-selection strategies; a different provider may not select context the same way, or at all.
- The scenario configuration is built around `tabularArtifacts` referenced by name, an RPT-specific grouping for in-context learning; TabPFN, for example, is stateless and carries its training rows inline per request instead.
- Tabular artifacts carry `csnMetadata` with a `definitionType` of `DOCUMENT`, `REFERENCE`, or `AUTO`, reflecting RPT's CSN (CDS Standard Notation) metadata model; another provider's data intake need not follow CSN.
- The data-destination and SQL-API resources are comparatively neutral (a named data store and a SQL surface), so the RPT coupling is not uniform across the registry.

Because this risk is smaller than for prediction, a vendor-neutral package name is reasonable.

**Recommendation: Option A.1.** Use `@sap-ai-sdk/ctx-registry`.
Note: If the service becomes part of AI_API use the existing `@sap-ai-sdk/ai-api` package instead of creating a new package.

#### Option A: Vendor-neutral package name

- A.1: `@sap-ai-sdk/ctx-registry`
- A.2: `@sap-ai-sdk/tabular-orchestration/ctx-registry`

**Pros:** Describes the service capability and leaves room for multiple prediction providers.

**Cons:** Overstates neutrality if RPT-specific fields or behavior remain in the public contract.

#### Option B: Vendor-specific package name

- B.1: `@sap-ai-sdk/rpt/ctx-registry`
- B.2: `@sap-ai-sdk/tabular-orchestration/rpt/ctx-registry`

**Pros:** Makes current coupling and compatibility expectations explicit.

**Cons:** Requires a rename or sibling package if the service contract becomes more provider-neutral.

### Question 4: Convenience Methods

The question is whether to add convenience methods, especially for polling asynchronous operations, the default surface for this client.

**Recommendation: Option B.2.** Include only targeted helpers for workflows that are cumbersome or unsafe with the generated client, starting with asynchronous polling.

#### Option A: No convenience methods

Ship only the generated client as-is.

**Pros:** Minimizes maintenance and keeps behavior aligned with the specification.

**Cons:** Repeats polling, retry, and terminal-state handling in every consumer.

#### Option B: Add targeted convenience methods

Add helpers for operations not well served by the raw generated client, e.g. polling asynchronous jobs to completion.

- B.1 Postpone convenience methods until a future release, to reduce initial effort and maintenance burden.
- B.2 Add convenience methods in the initial release, to improve developer experience.

**Pros:** Improves common workflows while keeping the handwritten API small.

**Cons:** Requires an explicit contract for timeouts, retries, cancellation, and error propagation.

Asynchronous creation returns http `202 Accepted` and a `Location` URL whose subsequent `GET` requests return http `200`.
The response lifecycle status is `PROCESSING`, `ACTIVE`, or `ERROR`; a helper should follow the location and expose terminal and failure states.
The PoC `pollAsyncResource` helper in `@sap-ai-sdk/core` demonstrates this polling loop with the generated client.

The current specifications only document the `Location` header, and the deployed service does not currently return `Retry-After`.
The helper should therefore default to a configured interval but still honor `Retry-After` for any other services that return it, or if that change is made in the future.

The helper could be a generic utility shipped in `@sap-ai-sdk/core` rather than a ctx-registry-specific function.
The same `202` + `Location` + lifecycle-status pattern is already used by other asynchronous operations in the SDK, for example `VectorApi.createCollection()` in `@sap-ai-sdk/document-grounding`, which returns `202` with a `Location` header and is polled via the collection `status` field.
A shared utility avoids duplicating polling, timeout, and terminal-state logic per service and keeps the contract in one place.

The PoC already implements `pollAsyncResource` in `@sap-ai-sdk/core` and should support cancellation via `AbortSignal`:

```ts
import { pollAsyncResource } from '@sap-ai-sdk/core';

const artifact = await pollAsyncResource({
  read: () => TabularArtifactsApi.getTabularArtifact(artifactId, { 'ai-resource-group': rg }).execute(dest),
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

#### Option B.3: Polling integrated into the OpenApi request builder

Add a `.poll(options)` method directly to the `OpenApiRequestBuilder` returned by each generated operation so that consumers chain polling onto the creation call without a separate import.

The `202` response includes a `Location` header; the request builder already holds the destination context needed to resolve it.
A `.poll()` method could capture the `Location` from the raw response, construct the corresponding GET builder, and delegate to `pollAsyncResource` under the hood:

```ts
const artifact = await TabularArtifactsApi
  .createTabularArtifact(body, { 'ai-resource-group': rg })
  .poll({
    isComplete: r => r.status === 'ACTIVE',
    getFailure: r => r.status === 'ERROR' ? r.errorMessage : undefined,
    maxAttempts: 60,
    intervalMs: 2_000
  })
  .execute(dest);
```

**Pros:** Discovery is co-located with the create operation — consumers cannot miss polling; no separate import required; destination and headers do not need to be threaded through manually.

**Cons:** Couples polling logic to the code-generated request builder layer, which currently contains no behavior beyond http execution.
Every generated client would inherit a new method, increasing the API surface even for operations that are not asynchronous.
The builder must know which generated GET operation corresponds to the `Location` URL, requiring either convention-based routing or explicit annotation in the specification via `x-sap-cloud-sdk-*` extensions.
The approach is harder to test in isolation than a plain function.

#### Option B.4: User-driven polling helpers

Rather than hiding polling inside a utility or the request builder, provide primitives that return intermediate state and leave the polling loop to the consumer.

Two shapes are possible:

**B.4a — async generator (`watchAsyncResource`)**: yields each poll result as it arrives so the caller can react to intermediate states, log progress, or break:

```ts
import { watchAsyncResource } from '@sap-ai-sdk/core';

for await (const current of watchAsyncResource({
  read: () => TabularArtifactsApi.getTabularArtifact(id, { 'ai-resource-group': rg }).execute(dest),
  intervalMs: 2_000,
  signal
})) {
  console.log('status:', current.status);
  if (current.status === 'ACTIVE') break;
  if (current.status === 'ERROR') throw new Error(current.errorMessage);
}
```

**B.4b — Manual state check**: the consumer calls the generated GET operation directly on a timer of their choosing; the SDK only provides the terminal-state constants or a thin type guard:

```ts
import { isTerminalState } from '@sap-ai-sdk/core';

while (true) {
  const artifact = await TabularArtifactsApi.getTabularArtifact(id, { 'ai-resource-group': rg }).execute(dest);
  if (isTerminalState(artifact)) break;
  await sleep(2_000);
}
```

**Pros:** Full control over back-off, cancellation, logging, and early exit; no hidden timeout or retry behavior to discover; async generator form composes naturally with `AbortSignal` and structured concurrency.

**Cons:** Every consumer must re-implement loop control for the common case; the ergonomic gap over `pollAsyncResource` is largest when the only goal is "wait for completion".
Progress reporting and early-exit during polling are likely rare in practice; the added API surface and maintenance cost may not be justified by actual usage.

B.4a (async generator) has a structural tension with `Retry-After`.
A demand-driven generator fires the next `read` when the consumer calls `next()`, so the inter-poll delay is controlled by the consumer, not the generator.
There is no natural place inside the generator to honour a server-supplied `Retry-After` hint without sleeping *before* yielding — at which point the generator is no longer truly demand-driven and is indistinguishable from `pollAsyncResource` with a generator wrapper.
The only escape is to yield a `{ value, retryAfter }` envelope and push the sleep back to the caller, but that recreates the loop-control burden the generator was meant to remove.
A third option is to cache the `Retry-After` hint internally and sleep silently when `next()` is called before the hint expires, preserving demand-driven semantics from the outside.

#### Option C: Add a full set of convenience methods

Add helpers for all operations, including those already well-supported by the generated client.

- C.1 Postpone convenience methods until a future release, to reduce initial effort and maintenance burden.
- C.2 Add convenience methods in the initial release, to improve developer experience.

**Pros:** Provides a consistent handwritten experience across the complete API.

**Cons:** Duplicates generated functionality and significantly increases initial effort, maintenance, and the cost of specification changes.
