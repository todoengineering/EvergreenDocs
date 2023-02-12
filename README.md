
# EvergreenDocs

:evergreen_tree: A suite of tools for creating and managing GitHub repositories.

## Overview

EvergreenDocs is a suite of tools for creating and managing GitHub repositories. It includes an API, a documentum, a sunrise, a web app, an eslint-config, and a stacks.

The API is used for the Evergreen Docs web app and the Evergreen Docs CLI. It is built with @aws-sdk, @prisma/client, @trpc/server, zod, @evergreendocs/tsconfig, @faker-js/faker, @tsconfig/node16-strictest-esm, @types/node, aws-sdk-client-mock, eslint-config-evergreendocs, prisma, ts-node, tsc-watch, and typescript.

Documentum is a README.md file generator for GitHub repositories. It uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file. It is built with @octokit, minimatch, openai, zod, @aws-sdk/client-secrets-manager, @evergreendocs/tsconfig, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, and vitest.

Sunrise is a lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus. It is built with zod, @aws-sdk, @evergreendocs/tsconfig, @types, aws-lambda, eslint-config-evergreendocs, tsc-watch, typescript, and vitest.

The Evergreen Docs web app allows users to manage and customise the Evergreen GitHub app. It is built with @emotion, @mantine, @next/font, @tabler/icons, @tanstack, @trpc, cookie, fastify, next, react, react-dom, @babel/core, @evergreendocs, @testing-library, @types, @typescript-eslint/eslint-plugin, @vitejs/plugin-react, @vitest/ui, cross-fetch, eslint-config-evergreendocs, jsdom, msw, typescript, and vitest.

Eslint-config-evergreendocs is an MIT-licensed eslint config built with eslint, eslint-config-next, eslint-config-prettier, eslint-config-turbo, eslint-plugin-import, eslint-plugin-prettier, eslint-plugin-react, and eslint-plugin-unicorn.

The stacks are used to deploy the Evergreen Docs stacks. It is built with zod, @evergreendocs/tsconfig, @types/node, eslint-config-evergreendocs, and typescript.

## Installation

To install EvergreenDocs, you will need Node version >=18.0.0 and yarn@3.4.1.

## Features

- API used for the Evergreen Docs web app and the Evergreen Docs CLI
- Documentum is a README.md file generator for GitHub repositories
- Sunrise is a lambda function with an endpoint that is called by the Evergreen Docs Github App webhook and a webhook event message on the EventBridge bus
- Evergreen Docs web app allows users to manage and customise the Evergreen GitHub app
- Eslint-config-evergreendocs is an MIT-licensed eslint config
- Stacks are used to deploy the Evergreen Docs stacks

## Contribution

We welcome contributions to EvergreenDocs! Please feel free to submit a pull request or open an issue.

## License

EvergreenDocs is released under the MIT license. See [LICENSE](LICENSE) for more details.