
   - Description: Used to configure the TypeScript compiler
   - Dependencies: zod, @types/node, eslint-config-evergreendocs, typescript
   - Scripts:       - build: "tsc"
      - lint: "../../node_modules/.bin/eslint . --ext .ts,.mts"

# Evergreendocs 
 :evergreen_tree::books::computer: 

Evergreendocs is a suite of open source tools for building and managing GitHub repositories. It includes an API, Documentum (a README file generator), Sunrise (a lambda function that is triggered by webhook events) and the Evergreen Docs web app. 

## Overview 
Evergreendocs is a suite of open source tools for building and managing GitHub repositories. It includes an API, Documentum (a README file generator), Sunrise (a lambda function that is triggered by webhook events) and the Evergreen Docs web app. The project uses Node version >=18.0.0 and yarn@3.4.1 as the package manager. 
The @evergreendocs/api package contains the Evergreen Docs API used for the Evergreen Docs web app and the Evergreen Docs CLI. Its dependencies include @aws-sdk, @prisma/client, @trpc/server, zod, @evergreendocs/tsconfig, @faker-js/faker, @tsconfig/node16-strictest-esm, @types/node, aws-sdk-client-mock, eslint-config-evergreendocs, prisma, ts-node, tsc-watch and typescript. 
The @evergreendocs/documentum package contains Documentum which is a README.md file generator for GitHub repositories; it uses the GitHub API to fetch information about the repository and uses OpenAI's GPT-3 API to generate a README.md file with its dependencies including @octokit