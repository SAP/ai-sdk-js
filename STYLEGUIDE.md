# Style Guide <!-- omit in toc -->

The SAP Cloud SDK for AI follows the style guide from the SAP Cloud SDK for JavaScript:

- [**SAP Cloud SDK code style guide**](https://github.com/SAP/cloud-sdk-js/blob/main/STYLEGUIDE.md)
- [**SAP Cloud SDK documentation style guide**](https://github.com/SAP/cloud-sdk/blob/main/STYLEGUIDE.md)

#### Table of Contents

- [Code Style Guide Rule Overrides](#code-style-guide-rule-overrides)
  - [Tests](#tests)
    - [Use .test in test file names](#use-test-in-test-file-names)

## Code Style Guide Rule Overrides

The rules below differ from the SAP Cloud SDK for JavaScript.

### Tests

#### Use .test in test file names

Use `.test` not `.spec` to differentiate test files.

❌ Examples of **incorrect** code:

```ts
/* Don't use .spec.ts */
test - file.spec.ts;
```

✅ Examples of **correct** code:

```ts
/* Use .test.ts */
test - file.test.ts;
```
