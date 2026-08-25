# Context Registry Client

## Status

proposed

## Context

The tabular orchestration context registry SDK is generated from nine separate OpenApi specifications.
No combined specification is currently available.
The specifications cover health, provisioning, a SQL API, and three resources that each ship a synchronous and an asynchronous variant: data destinations, scenario configuration, and tabular artifacts.

The synchronous and asynchronous variants are not part of a shared API; they are mutually exclusive alternative deployments of the same service.
Because the variants are mutually exclusive deployments, merging both into a single client was never coherent.

Targeting the asynchronous variant does not remove all merge work.
The asynchronous client is still assembled from several specifications (the asynchronous resources plus the common health, provisioning, and SQL API specifications).
Those specifications repeat type definitions — for example every resource specification redefines `ApiError` and `DetailsErrorResponse`, and `ColumnInfo` and `Url` each appear in more than one specification.

Some specifications also contain internal headers (`AI-Main-Tenant`) and internal endpoint references that we should avoid releasing.

### Generated clients

The generated clients are usable but low-level, and their quality depends on the source specifications.
Verbose default operation names follow each `operationId`.
They can be replaced with `x-sap-cloud-sdk-operation-name` in the specification, so naming is a specification concern rather than a client-design concern.
The main usability gap is the asynchronous workflow: creation returns http `202` with a `Location` header.
With the raw client, consumers must call `.executeRaw(...)`, parse the header, and implement polling, terminal-state checks, and timeouts themselves.
Consumers also provide the destination and resource-group header unless a helper is added (see Question 4).

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

The specifications are currently published as separate files, but they are not independent APIs.
Eventually they will be merged into one specification, or included in a single combined specification for the service.

#### Option A: Combine specifications before generation

Merge the asynchronous specifications with the common specifications (health, provisioning, SQL API) into one asynchronous specification, then generate a single client.
This allows generating early clients without needing to wait for a combined specification from the service team.

```text
ctx-registry/
  async-specification.yaml   # asynchronous resources + common specifications
```

An optional synchronous compatibility specification can be produced the same way, from the synchronous and common specifications, if a legacy deployment requires it.

**Pros:** Produces one coherent client surface for the target deployment and keeps the generation input self-contained.

**Cons:** Requires a deterministic merge step and duplicates the common definitions into any optional synchronous compatibility client.
The merge is riskier where specifications are not parallel: same-named schemas that differ between specifications, or types present in only one specification, must be reconciled rather than merged without validation.

#### Option B: Wait for an upstream combined specification

**Pros:** Avoids local merge logic and keeps the generated SDK aligned with its source of truth.
**Cons:** Delays SDK availability and has not been provided despite having already been requested some time ago.
Even if published on API Hub, the service may still be represented by multiple specifications.

### Question 2: Package Name

The context registry is mostly vendor-neutral but has some ties to SAP RPT's design, with a risk of breaking changes.
This risk is smaller than with the prediction client, so it is within reason to release a vendor-neutral package name.

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

Generated SDKs are low-level by nature.
The question is whether to layer convenience methods on top, especially for polling asynchronous operations, which are the default surface for this client.

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

The asynchronous creation contract is http `202 Accepted` with a `Location` header identifying the resource URL to poll.
Subsequent `GET` requests to that URL return http `200` while the resource exists.
Progress is represented by the response body's lifecycle status (`PROCESSING`, `ACTIVE`, or `ERROR`).
A helper should preserve this contract, follow the returned polling location, and make terminal and failure states explicit.
The PoC's `wait-for-async-resource.mts` helper demonstrates this polling loop with the generated client.

The exact helper API is still open:

```ts
// Note: Subject to change
const artifact = await pollAsyncResource({
  read: () => client.get(pollingLocation),
  isComplete: (current) => current.status === "ACTIVE",
  getFailure: (current) => (current.status === "ERROR" ? current.errorMessage : undefined),
  intervalMs: 2_000,
  timeoutMs: 120_000,
  signal,
});

// It would also make sense to provide an async generator for streaming progress updates:
for await (const current of watchAsyncResource(options)) {
  console.log(current.status);
}
```

#### Option C: Add a full set of convenience methods

Add helpers for all operations, including those already well-supported by the generated client.

- C.1 Postpone convenience methods until a future release, to reduce initial effort and maintenance burden.
- C.2 Add convenience methods in the initial release, to improve developer experience.

**Pros:** Provides a consistent handwritten experience across the complete API.

**Cons:** Duplicates generated functionality and significantly increases initial effort, maintenance, and the cost of specification changes.

