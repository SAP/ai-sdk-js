# Client API Facade

## Status

proposed

## Context

SAP Cloud SDK for AI generates client from OpenAPI specifiation of each service.
For packages like `ai-api`, `document-grounding`, and `prompt-registry`, the generated clients are directly used.
However, for packages like `foundation-models` and `orchestration`, only the generated types are used, and the client is implemented manually to provide more convenient features.

Currently, all generated types in `foundation-models` and `orchestration` packages are exported publicly. 
It means that if the schema in OpenAPI specification changes, we need to add wrappers or aliases, or deprecate the old types to avoid breaking changes.
This can sometimes be tricky as those changed types might directly be used in the public client APIs and could lead to deprecation of the APIs in order to fully support the upcoming new features.

## Decision

For manual-written client, proper wrappers are needed and only necessary types are exported publicly.
Generated types should only be exported via `internal.js`.

The following content should

- either be explicitly wrapped / copied into a type file and imported from there
- or be created in a separate file in case of a class.

- Types of **parameters** of all public functions / methods.
- Types of **return values** of all public functions / methods.
- Types of **(error) responses** of all public functions / methods.
- Types of **publicly exported objects** and **public fields**.

For frequently customer-used types, we need to discuss case by case.
Especially how we export them, e.g., by creating aliases or accepting direct exports of generated types if not changed frequently.
This can be types of different messages, tools or any other objects which might be created as a separate variable instead of the inline approach due to reuse or clean code reasons.

For types used in `sample-code` and documentation: **TBD**

For `@sap-ai-sdk/orchestration`, additionally:

- Types of all modules used in `OrchestrationModuleConfig` interface.

# Discussion

We need to decide if we categorize types used in `sample-code` or documentation as frequently used types if they can only be imported from internal after applying the above general strategy.

## Option A

We exceptionally export them.

## Option B

We accept that user sometimes needs to import from internal.
