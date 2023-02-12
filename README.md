# evergreendocs

:evergreen_tree: Evergreen Docs is a Github App that automatically updates your documentation when you push to your main branch. You manage your integration through a web app and a config file in your repository.

## Overview

Evergreen Docs is a Github App that automatically updates your documentation when you push to your main branch. You manage your integration through a web app and a config file in your repository.

## Installation

To install evergreendocs, you will need Node version >=18.0.0 and yarn@3.4.1.

## Features

- @evergreendocs/api
  - Evergreen Docs API used for the Evergreen Docs web app and the Evergreen Docs CLI
  - Dependencies: @aws-sdk, @prisma/client, @trpc/server, zod, @evergreendocs/tsconfig, @faker-js/faker, @tsconfig/node16-strictest-esm, @types/node, aws-sdk-client-mock, eslint-config-evergreendocs, prisma, ts-node, tsc-watch, typescript
  - Scripts:
    - dev: "tsc-watch --onSuccess "node ./dist/main.mjs""
    - build: "tsc"
    - start: "node dist/main.mjs"
    - test: "AWS_ACCESS_KEY_ID=fake AWS_SECRET_ACCESS_KEY=fake node --loader ts-node/esm --test ./**/users.test.ts"
    - test:watch: "node --test --watch"
    - lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
    - prisma:generate: "prisma generate"
    - prisma:push: "prisma db push"
    - prisma:migrate: "prisma migrate dev"
    - prisma:seed: "prisma db seed"
- @evergreendocs/documentum
  - Documentum is a README.md file generator for GitHub repositories. It uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file
  - Dependencies: @octokit, minimatch, openai, zod, @aws-sdk/client-secrets-manager, @evergreendocs/tsconfig, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, vitest
  - Scripts:
    - build: "tsc"
    - start: "node dist/main.mjs"
    - test: "vitest run"
    - test:watch: "vitest watch"
    - lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
- @evergreendocs/sunrise
  - Sunrise ia lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus
  - Dependencies: zod, @aws-sdk, @evergreendocs/tsconfig, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, vitest
  - Scripts:
    - build: "tsc"
    - start: "node dist/main.mjs"
    - test: "vitest run"
    - test:watch: "vitest watch"
    - lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
- @evergreendocs/web
  - Evergreen Docs web app. Allows users to manage and customise the Evergreen GitHub app
  - Dependencies: @emotion, @mantine, @next/font, @tabler/icons, @tanstack, @trpc, cookie, fastify, next, react, react-dom, @babel/core, @evergreendocs, @testing-library, @types, @typescript-eslint/eslint-plugin, @vitejs/plugin-react, @vitest/ui, cross-fetch, eslint-config-evergreendocs, jsdom, msw, typescript, vitest
  - Scripts:
    - dev: "next dev"
    - build: "next build"
    - start: "next start"
    - test: "vitest run"
    - test:watch: "vitest watch"
    - lint: "next lint"
- eslint-config-evergreendocs
  - License: MIT
  - Dependencies: eslint, eslint-config-next, eslint-config-prettier, eslint-config-turbo, eslint-plugin-import, eslint-plugin-prettier, eslint-plugin-react, eslint-plugin-unicorn
- @evergreendocs/stacks
  - Used to deploy the Evergreen Docs stacks
  - Dependencies: zod, @evergreendocs/tsconfig, @types/node, eslint-config-evergreendocs, typescript
  - Scripts:
    - build: "tsc"
    - lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
    - console: "sst console"
- @evergreendocs/tsconfig

## Contribution

We welcome contributions to evergreendocs! Please read our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

evergreendocs is released under the MIT license. See [LICENSE](LICENSE) for more information.