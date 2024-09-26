# Contributing

## How to contribute

When contributing to this repository, please first discuss the changes you wish to make through an issue, email, or any other method with the owners of this repository.

All members of the project community must abide by the [SAP Open Source Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md).
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting [a project maintainer](.reuse/dep5).

Once you are ready to make a change, please test it appropriately, create a pull request and describe your change in the pull request. The owners of the repository will review your changes as soon as possible.

## Project Structure

This project contains multiple packages, that are managed using pnpm workspaces.
Productive packages are located in the `packages` directory, test packages are located in the `tests` directory. 
Some of the packages are interdependent, therefore pnpm install won't work from within those packages. Run `pnpm install` in the root directory instead.

## Testing

All (new) functionality shall be covered by tests.

### Jest Runner Set-up

If you're using the Jest Runner extension in Visual Studio Code, you'll need to add the following settings to your `settings.json` file before running the tests from VSCode:

```
 "jestrunner.debugOptions": {
    "runtimeArgs": ["--experimental-vm-modules"]
  },
  "jestrunner.jestCommand": "NODE_OPTIONS=--experimental-vm-modules node 'node_modules/jest/bin/jest.js'",
```

You can run our tests either with the commands covered in the following sections or using the jest runnner extension directly from the IDE.

### Unit Tests

Unit tests test specific modules of a package, units that are tested for behavior.
You can run all unit tests by executing:

```bash
$ pnpm test:unit
```

To run unit tests for a specific package add the workspace name to the command. For the ai-api package this would be:

```bash
$ pnpm ai-api test
```

### Type Tests

As this project is written in TypeScript, it will be consumable by other TypeScript projects. We use `tsd` to test that our resulting API meets our expectations.
The type tests are located at [`tests/type-tests`](./tests/type-tests).

To run the type tests, execute:

```bash
$ pnpm test:type
```

### E2E tests (locally)

The E2E tests are based on a locally running server providing a REST interface using OpenAPI.
This server is used by the E2E tests located at [tests/e2e-tests](./test-packages/e2e-tests).

**Attention** The imports in the E2E tests use the root packages e.g. `@sap-ai-sdk/ai-api` to mimic the way a customer would use it.
So if you made code changes in one of the packages you need to run `pnpm compile` to make the changes take effect.

Before running the E2E tests, ensure that you have a `.env` file located in `tests/e2e-tests` folder.

Inside the `.env` file, define an `AICORE_SERVICE_KEY` variable and initialize it with the service binding of `aicore`. You can obtain this binding from the `VCAP_SERVICES` environment variable or from the service key defined in your BTP subaccount.

To run the tests, use the following command:

```
pnpm test:e2e
```

## Linting

To fix all linting issues, run:

```bash
$ pnpm lint:fix
```

## Contributing Code or Documentation

You are welcome to contribute code in order to fix a bug or to implement a new feature that is logged as an issue.

The following rule governs code contributions:

- Contributions must be licensed under the [Apache 2.0 License](./LICENSE)
- Due to legal reasons, contributors will be asked to accept a Developer Certificate of Origin (DCO) when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## Contributing with AI-generated Code

As artificial intelligence evolves, AI-generated code is becoming valuable for many software projects, including open-source initiatives. While we recognize the potential benefits of incorporating AI-generated content into our open-source projects there a certain requirements that need to be reflected and adhered to when making contributions.

Please see our [Guideline for AI-generated code contributions to SAP Open Source Software Projects](https://github.com/SAP/.github/blob/main/CONTRIBUTING_USING_GENAI.md) for more details.
