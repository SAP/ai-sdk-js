# SAP Cloud SDK for AI v2 Upgrade Guide

This document guides you through upgrading from version 1.x to version 2.x of the SAP Cloud SDK for AI packages.
It covers all breaking changes and migration steps required for the upgrade.
Version 2.x introduces significant structural changes to align with updated service APIs.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [How to Upgrade](#how-to-upgrade)
- [Breaking Changes](#breaking-changes)
  - [`@sap-ai-sdk/orchestration`](#sap-ai-sdkorchestration)

## How to Upgrade

Update all SAP Cloud SDK for AI packages to version 2.x in your `package.json` file:

```diff
{
  "dependencies": {
-   "@sap-ai-sdk/ai-api": "^1.x.x",
-   "@sap-ai-sdk/core": "^1.x.x",
-   "@sap-ai-sdk/document-grounding": "^1.x.x",
-   "@sap-ai-sdk/foundation-models": "^1.x.x",
-   "@sap-ai-sdk/langchain": "^1.x.x",
-   "@sap-ai-sdk/orchestration": "^1.x.x",
-   "@sap-ai-sdk/prompt-registry": "^1.x.x",
+   "@sap-ai-sdk/ai-api": "^2.x.x",
+   "@sap-ai-sdk/core": "^2.x.x",
+   "@sap-ai-sdk/document-grounding": "^2.x.x",
+   "@sap-ai-sdk/foundation-models": "^2.x.x",
+   "@sap-ai-sdk/langchain": "^2.x.x",
+   "@sap-ai-sdk/orchestration": "^2.x.x",
+   "@sap-ai-sdk/prompt-registry": "^2.x.x"
  }
}
```

## Breaking Changes

### `@sap-ai-sdk/orchestration`

#### Module Configuration Structure

The most significant change is the consolidation of `llm` and `templating` modules into a single `promptTemplating` module.

**v1:**
```typescript
const config = {
  llm: {
    model_name: 'gpt-4o',
    model_params: {}
  },
  templating: {
    template: [
      { role: 'user', content: 'What is the capital of {{?country}}?' }
    ]
  }
};
```

**v2:**
```typescript
const config = {
  promptTemplating: {
    model: {
      name: 'gpt-4o',
      params: {}
    },
    prompt: {
      template: [
        { role: 'user', content: 'What is the capital of {{?country}}?' }
      ]
    }
  }
};
```

#### Parameter Name Changes

Several parameter names have been updated for consistency.

##### Input Parameters
**v1:**
```typescript
orchestrationClient.chatCompletion({
  inputParams: { country: 'France' }
});
```

**v2:**
```typescript
orchestrationClient.chatCompletion({
  placeholderValues: { country: 'France' }
});
```

##### Model Configuration
**v1:**
```typescript
llm: {
  model_name: 'gpt-4o',
  model_params: { temperature: 0.7 }
}
```

**v2:**
```typescript
promptTemplating: {
  model: {
    name: 'gpt-4o',
    params: { temperature: 0.7 }
  }
}
```

#### Streaming Configuration

The streaming configuration has been updated to reflect the new module structure.

**v1:**
```typescript
streamOptions: {
  llm: { include_usage: true }
}
```

**v2:**
```typescript
streamOptions: {
  promptTemplating: { include_usage: true }
}
```

#### Grounding Configuration

The grounding configuration structure has been updated to use `placeholders` instead of separate `input_params` and `output_param`.

**v1:**
```typescript
buildDocumentGroundingConfig({
  input_params: ['groundingInput'],
  output_param: 'groundingOutput',
  filters: [...]
})
```

**v2:**
```typescript
buildDocumentGroundingConfig({
  placeholders: {
    input: ['groundingInput'],
    output: 'groundingOutput'
  },
  filters: [...]
})
```

#### Removed Functions

The deprecated `buildAzureContentFilter()` function has been removed in v2.
Use `buildAzureContentSafetyFilter()` instead.

**v1:**
```typescript
// This function is deprecated and removed in v2
const filter = buildAzureContentFilter({
  Hate: 'ALLOW_SAFE',
  Violence: 'ALLOW_SAFE_LOW_MEDIUM'
});
```

**v2:**
```typescript
// Use this function instead
const filter = buildAzureContentSafetyFilter({
  hate: 'ALLOW_SAFE',
  violence: 'ALLOW_SAFE_LOW_MEDIUM'
});
```

#### Azure Content Filter Changes

The Azure content filter property names have been updated to use lowercase with underscores.

**v1:**
```typescript
buildAzureContentSafetyFilter({
  Hate: 'ALLOW_SAFE',
  SelfHarm: 'ALLOW_SAFE_LOW',
  Sexual: 'ALLOW_SAFE_LOW_MEDIUM',
  Violence: 'ALLOW_ALL'
})
```

**v2:**
```typescript
buildAzureContentSafetyFilter({
  hate: 'ALLOW_SAFE',
  self_harm: 'ALLOW_SAFE_LOW',
  sexual: 'ALLOW_SAFE_LOW_MEDIUM',
  violence: 'ALLOW_ALL'
})
```
