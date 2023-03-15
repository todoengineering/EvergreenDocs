

# evergreendocs

Evergreen Docs is a Github App designed to keep your documentation up-to-date, accurate, and comprehensive, using the context of your repository and the advanced language capabilities of Chat GPT. With its integration with Github, Evergreen Docs has access to all relevant information in your repository, including code, issues, and pull requests, allowing it to automatically update your documentation as your code evolves.

## Installation

To use Evergreen Docs, you must have Node version >=18.0.0 and yarn@3.4.1 installed. Once you have these dependencies, you can install the necessary packages by running:

```
yarn install
```

## Features

Evergreen Docs includes the following packages:

- @evergreendocs/api: Evergreen Docs API used for the Evergreen Docs web app and the Evergreen Docs CLI
- @evergreendocs/auth: Authentication package for Evergreen Docs
- @evergreendocs/github-webhook-ingest: Lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus
- @evergreendocs/web: Evergreen Docs web app. Allows users to manage and customise the Evergreen GitHub app
- @evergreendocs/workflow-processor: README.md file generator for GitHub repositories. It uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file
- eslint-config-evergreendocs: ESLint configuration for Evergreen Docs
- @evergreendocs/services: Services package for Evergreen Docs
- @evergreendocs/stacks: Used to deploy the Evergreen Docs stacks
- @evergreendocs/tsconfig: TypeScript configuration for Evergreen Docs

## Contribution

If you would like to contribute to Evergreen Docs, please follow these steps:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes and commit them
4. Push your changes to your forked repository
5. Create a pull request to merge your changes into the main repository

## License

The eslint-config-evergreendocs package is licensed under the MIT license. All other packages are licensed under the Apache License, Version 2.0. See the LICENSE file for more information.