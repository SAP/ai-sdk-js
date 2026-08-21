# Context Registry SDK

## Status

proposed

## Context

The tabular orchestration context registry SDK is generated from nine separate OpenApi specifications; no combined specification is currently available.
The specifications split across health, data destinations (sync/async), provisioning, scenario configuration (sync/async), SQL API, and tabular artifact (sync/async).

Several of the specifications share type definitions, leading to duplication in the generated output.
Some specifications also contain internal headers (`AI-Main-Tenant`) and internal endpoint references that we should avoid releasing.

The SDK design must therefore determine:

- how the specifications are grouped for generation;
- whether shared schemas are duplicated or unified;
- which package boundary communicates the stability of the API;
- how much behavior is added on top of the generated clients;
- how the clients are released; and
- how internal API elements are excluded or approved for public use.

## Decision

No decision has been accepted yet.
Current recommendations and unresolved questions are recorded below.

## Discussion

### Question 1: Specification Layout

**Recommendation: Option B.2.** Generate one synchronous and one asynchronous client from two merged specifications.

If upstream later provides an authoritative combined specification, replacing a locally merged contract may still cause breaking changes.
Keeping the merge deterministic and limiting it to two output surfaces should make that transition easier to assess.

#### Option A: Separate package per specification

Generate one SDK per specification and re-export all of them from a single npm package, potentially using subpath exports.

**Pros:**

- Straightforward to implement; no changes to the specifications required.
- Each generated client remains traceable to one upstream specification.

**Cons:**

- Many entry points; consumers must know which subpath to import from.
- Cross-specification workflows require several client surfaces.
- Shared schemas remain duplicated.

#### Option B: Combine specifications before generation

Merge compatible specifications before generation.

Merging all nine specifications into one document is not directly possible with the evaluated tooling (`@redocly/cli`) because the synchronous and asynchronous operations are structurally incompatible.

##### Option B.1

```text
ctx-registry/
  common-specification.yaml   # definitions without async counterparts
  sync-specification.yaml
  async-specification.yaml
```

**Pros:** Makes shared definitions explicit and gives them a single source within the local merge process.

**Cons:** Adds a third generated input that must be resolved correctly by tools and consumers; it does not match an upstream artifact.

##### Option B.2

```text
ctx-registry/
  sync-specification.yaml
  async-specification.yaml
```

Definitions used by both variants are included in each merged specification.

**Pros:** Produces only two coherent client surfaces and keeps generation inputs self-contained.

**Cons:** Duplicates shared definitions across the sync and asynchronous clients and requires a deterministic merge step.

#### Option C: Wait for an upstream combined specification

**Pros:** Avoids local merge logic and keeps the generated SDK aligned with its source of truth.
**Cons:** Delays SDK availability and has not been provided despite having already been requested some time ago.
Even if published on API Hub, multiple specifications may still be uploaded there.

### Question 2: Shared Types Across Specifications

**Recommendation: Option C.**
The PoC already normalizes structurally identical schemas across synchronous and asynchronous resource pairs, then consolidates identical generated schema files into one shared schema directory.

The merge step considers a schema shared only when its complete referenced-schema closure is also shared.
The generation step fails if two variants emit different content for the same schema filename.
The full generation pipeline succeeds with the current specifications.

#### Option A: Accept duplication

No changes to the specifications; duplicated types coexist in the generated output.

**Pros:** Simple and preserves the source specifications.

**Cons:** Increases type surface and can hide incompatibilities between schemas that appear equivalent.

#### Option B: Use OpenApi `$ref` to share types across specifications

**Pros:** Removes duplication and makes incompatibilities visible during generation.

**Cons:** Requires upstream specification changes and generator support for cross-file references.

#### Option C: Normalize and consolidate during local generation

Before generation, detect structurally identical sync/async schemas and normalize their component names in both merged specifications.
After generation, move identical emitted schema files into a shared directory and rewrite both clients to import from it.

**Pros:** Avoids upstream specification changes, has been demonstrated by this PoC, and fails generation when same-named generated schemas differ between variants.

**Cons:** Adds custom merge and post-generation logic.
Structural equality cannot prove semantic equivalence, and newly introduced resource pairs must be added to the normalization configuration.

The implementation is the more durable reference than an embedded code sample:

- `merge-ctx-registry.mjs` detects closed sets of structurally identical schemas and normalizes their names.
- `generate-ctx-registry-clients.mjs` consolidates generated schemas and rejects divergent same-named files.

### Question 3: Package Name

The context registry is mostly vendor-neutral but has some ties to SAP RPT's design, with a risk of breaking changes.

**Recommendation: Option A.1.** Use `@sap-ai-sdk/ctx-registry`.

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
The question is whether to layer convenience methods on top, particularly for polling asynchronous operations.

**Recommendation: Option B.2.** Include only targeted helpers for workflows that are cumbersome or unsafe with the generated client, starting with asynchronous polling.

#### Option A: No convenience methods

Ship only the generated client as-is.

**Pros:** Minimizes maintenance and keeps behavior aligned with the specification.

**Cons:** Repeats polling, retry, and terminal-state handling in every consumer.

#### Option B: Add targeted convenience methods

Add helpers for operations poorly supported by the raw generated client, e.g. polling asynchronous jobs to completion.

- B.1 Postpone convenience methods until a future release, to reduce initial effort and maintenance burden.
- B.2 Add convenience methods in the initial release, to improve developer experience.

**Pros:** Improves common workflows while keeping the handwritten API small.

**Cons:** Requires an explicit contract for timeouts, retries, cancellation, and error propagation.

The asynchronous creation contract is http `202 Accepted` with a `Location` header identifying the resource URL to poll.
Subsequent `GET` requests to that URL return http `200` while the resource exists; progress is represented in the response body's lifecycle status (`PROCESSING`, `ACTIVE`, or `ERROR`).
A helper should preserve this contract, follow the returned polling location, and make terminal and failure states explicit.

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

### Question 5: Release Strategy

**Recommendation: Option A.** Release the generated clients together after testing each specification group independently.

#### Option A: Release all generated clients together

Single coordinated release for all nine specifications.

**Pros:** Gives consumers one compatible version and one upgrade event.

**Cons:** One delayed or unstable specification can block the entire release.

#### Option B: Progressive per-specification releases

Release clients incrementally, enabling E2E testing of each before moving to the next.

**Pros:** Enables earlier feedback and isolates integration issues.

**Cons:** Consumers may need multiple release-cycle upgrades, and temporarily incompatible client versions may coexist.

### Question 6: Public Surface Filtering

The owners of the upstream specifications must clean internal headers and endpoints before publication.

#### Option A: Remove internal elements during the merge

Maintain an explicit allowlist or patch that removes unsupported headers and endpoints from generated public clients.

**Pros:** Prevents accidental exposure and can unblock generation before upstream specifications change.

**Cons:** Creates a local contract delta that must be reviewed whenever specifications change.

#### Option B: Require corrected upstream specifications

Do not publish until upstream specifications contain only supported public elements or explicitly mark internal elements for filtering.

**Pros:** Keeps the generated SDK aligned with its source of truth.

**Cons:** Makes the release dependent on upstream changes and their schedule.

#### Option C: Expose the specifications unchanged

Generate internal headers and endpoints as part of the public client.

**Pros:** Requires no filtering or upstream changes.

**Cons:** Creates an unsupported public surface and risks exposing internal implementation details.
This option is not recommended.
