
# Evergreen Docs

Evergreen Docs is a Github App designed to keep your documentation up-to-date, accurate, and comprehensive, using the context of your repository and the advanced language capabilities of Chat GPT. With its integration with Github, Evergreen Docs has access to all relevant information in your repository, including code, issues, and pull requests, allowing it to automatically update your documentation as your code evolves.

## Installation

```
yarn add @evergreendocs/api
```

## Features

-   [@evergreendocs/api](#evergreendocsapi)
    -   [Description](#description)
    -   [Dependencies](#dependencies)
    -   [Scripts](#scripts)
-   [@evergreendocs/documentum](#evergreendocsdocumentum)
    -   [Description](#description-1)
    -   [Dependencies](#dependencies-1)
    -   [Scripts](#scripts-1)
-   [@evergreendocs/sunrise](#evergreendocssunrise)
    -   [Description](#description-2)
    -   [Dependencies](#dependencies-2)
    -   [Scripts](#scripts-2)
-   [@evergreendocs/web](#evergreendocsweb)
    -   [Description](#description-3)
    -   [Dependencies](#dependencies-3)
    -   [Scripts](#scripts-3)
-   [eslint-config-evergreendocs](#eslint-config-evergreendocs)
    -   [License](#license)
    -   [Dependencies](#dependencies-4)
-   [@evergreendocs/stacks](#evergreendocsstacks)
    -   [Description](#description-4)
    -   [Dependencies](#dependencies-5)
    -   [Scripts](#scripts-4)
-   [@evergreendocs/tsconfig](#evergreendocstsconfig)

## @evergreendocs/api

### Description

Evergreen Docs API used for the Evergreen Docs web app and the Evergreen Docs CLI

### Dependencies

-   @aws-sdk
-   @prisma/client
-   @trpc/server
-   zod
-   @evergreendocs/tsconfig
-   @faker-js/faker
-   @tsconfig/node16-strictest-esm
-   @types/node
-   aws-sdk-client-mock
-   eslint-config-evergreendocs
-   prisma
-   ts-node
-   tsc-watch
-   typescript

### Scripts

-   build: "tsc"
-   start: "node dist/main.mjs"
-   test: "AWS_ACCESS_KEY_ID=fake AWS_SECRET_ACCESS_KEY=fake node --loader ts-node/esm --test ./**/users.test.ts"
-   test:watch: "node --test --watch"
-   lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
-   prisma:generate: "prisma generate"
-   prisma:push: "prisma db push"
-   prisma:migrate: "prisma migrate dev"
-   prisma:seed: "prisma db seed"

## @evergreendocs/documentum

### Description

Documentum is a README.md file generator for GitHub repositories. It uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file

### Dependencies

-   @octokit
-   minimatch
-   openai
-   zod
-   @aws-sdk/client-secrets-manager
-   @evergreendocs/tsconfig
-   @types
-   aws-lambda
-   eslint-config-evergreendocs
-   tsc-watch
-   typescript
-   vitest

### Scripts

-   build: "tsc"
-   start: "node dist/main.mjs"
-   test: "vitest run"
-   test:watch: "vitest watch"
-   lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

## @evergreendocs/sunrise

### Description

Sunrise ia lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus

### Dependencies

-   zod
-   @aws-sdk
-   @evergreendocs/tsconfig
-   @types
-   aws-lambda
-   eslint-config-evergreendocs
-   tsc-watch
-   typescript
-   vitest

### Scripts

-   build: "tsc"
-   start: "node dist/main.mjs"
-   test: "vitest run"
-   test:watch: "vitest watch"
-   lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

## @evergreendocs/web

### Description

Evergreen Docs web app. Allows users to manage and customise the Evergreen GitHub app

### Dependencies

-   @tabler/icons
-   next
-   react
-   react-dom
-   react-wrap-balancer
-   @babel/core
-   @evergreendocs
-   @tailwindcss/typography
-   @types
-   @typescript-eslint/eslint-plugin
-   @vitest/ui
-   autoprefixer
-   classnames
-   eslint-config-evergreendocs
-   postcss
-   prettier-plugin-tailwindcss
-   sst
-   tailwindcss
-   typescript

### Scripts

-   dev:next: "sst env next dev --stage=$SST_STAGE"
-   build: "next build"
-   start: "next start"
-   test: "vitest run"
-   test:watch: "vitest watch"
-   lint: "next lint"

## eslint-config-evergreendocs

### License

MIT

### Dependencies

-   eslint
-   eslint-config-next
-   eslint-config-prettier
-   eslint-config-turbo
-   eslint-plugin-import
-   eslint-plugin-prettier
-   eslint-plugin-react
-   eslint-plugin-unicorn

## @evergreendocs/stacks

### Description

Used to deploy the Evergreen Docs stacks

### Dependencies

-   zod
-   @evergreendocs/tsconfig
-   @types/node
-   eslint-config-evergreendocs
-   typescript

### Scripts

-   build: "tsc"
-   lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"
-   console: "sst console"

## @evergreendocs/tsconfig