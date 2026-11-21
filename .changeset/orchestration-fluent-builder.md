---
"@sap-ai-sdk/orchestration": minor
---

[new] Add an experimental `Orchestration` client with a fluent builder API.
Construct it with connection information only (`new Orchestration(options?)`, where `options` is a `ResourceGroupConfig`, a `DeploymentIdConfig`, or a `{ destination }` object), then choose a configuration source with `config()`, `configRef()`, `configList()`, or `rawConfigJson()` and call `create(body, requestConfig?)` on the returned builder.
`config()` is overloaded on the module configuration it receives: a configuration without a standing prompt template returns a builder whose `create({ prompt })` supplies the template content per call, while a configuration whose prompt is already set — inline or as a remote prompt-registry template reference — returns a builder whose `create` omits `prompt`.
Only the no-prompt `config()` builder accepts a per-call `prompt`, so supplying a prompt to a source that cannot take one is a compile error rather than a runtime throw.
Streaming is enabled with `create({ stream: true })`, whose return type is overloaded on the `stream` flag.
The existing `OrchestrationClient` is unchanged.
