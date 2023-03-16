

# evergreendocs

Evergreen Docs is a Github App designed to keep your documentation up-to-date, accurate, and comprehensive, using the context of your repository and the advanced language capabilities of Chat GPT. With its integration with Github, Evergreen Docs has access to all relevant information in your repository, including code, issues, and pull requests, allowing it to automatically update your documentation as your code evolves.

## Installation

To use Evergreen Docs, you will need Node version >=18.0.0 and yarn@3.4.1 package manager.

## Features

- Automatically updates documentation as your code evolves
- Uses advanced language capabilities of Chat GPT
- Integrates with Github to access all relevant information in your repository

## Contribution

We welcome contributions to Evergreen Docs! Please see our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License.

## Packages

### @evergreendocs/api

Evergreen Docs API used for the Evergreen Docs web app and the Evergreen Docs CLI.

Dependencies: @evergreendocs, @trpc/server, zod, @tsconfig/node16-strictest-esm, @types/node, aws-lambda, eslint-config-evergreendocs, typescript.

Scripts:
- dev: "tsc -w --preserveWatchOutput"
- build: "tsc"
- start: "node dist/main.mjs"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

### @evergreendocs/auth

Dependencies: @evergreendocs, @types/node, eslint-config-evergreendocs, typescript.

Scripts:
- build: "tsc"
- start: "node dist/main.mjs"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

### @evergreendocs/github-webhook-ingest

github-webhook-ingest is lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus.

Dependencies: zod, @aws-sdk/client-eventbridge, @evergreendocs, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, vitest.

Scripts:
- build: "tsc"
- start: "node dist/main.mjs"
- test: "vitest run"
- test:watch: "vitest watch"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

### @evergreendocs/web

Evergreen Docs web app. Allows users to manage and customise the Evergreen GitHub app.

Dependencies: @radix-ui, @tabler/icons, @tanstack, @trpc, dayjs, framer-motion, next, next-translate, react, react-dom, react-wrap-balancer, superjson, @babel/core, @evergreendocs, @tailwindcss/typography, @types, @typescript-eslint/eslint-plugin, @vitejs/plugin-react, @vitest/ui, autoprefixer, classnames, eslint-config-evergreendocs, jsdom, next-translate-plugin, postcss, prettier-plugin-tailwindcss, sst, tailwindcss, typescript, vitest.

Scripts:
- dev: "sst env next dev --stage $SST_STAGE"
- build: "next build"
- start: "next start"
- test: "vitest run"
- test:watch: "vitest watch"
- lint: "next lint"

### @evergreendocs/workflow-processor

workflow-processor is a README.md file generator for GitHub repositories. It uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file.

Dependencies: @aws-sdk/client-dynamodb, @evergreendocs, @octokit, electrodb, minimatch, openai, zod, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, vitest.

Scripts:
- build: "tsc"
- start: "node dist/main.mjs"
- test: "vitest run"
- test:watch: "vitest watch"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

### eslint-config-evergreendocs

License: MIT.

Dependencies: eslint, eslint-config-next, eslint-config-prettier, eslint-config-turbo, eslint-plugin-import, eslint-plugin-prettier, eslint-plugin-react, eslint-plugin-unicorn.

### @evergreendocs/services

Dependencies: electrodb, @aws-sdk, @evergreendocs/tsconfig, @types/node, eslint-config-evergreendocs, typescript.

Scripts:
- dev: "tsc -w --preserveWatchOutput"
- build: "tsc"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

### @evergreendocs/stacks

Used to deploy the Evergreen Docs stacks.

Dependencies: zod, @evergreendocs/tsconfig, @types/node, eslint-config-evergreendocs, typescript.

Scripts:
- build: "tsc"
- lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
- console: "sst console"

### @evergreendocs/tsconfig

Dependencies: openid-client.