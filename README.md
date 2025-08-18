# Better Auth Cosmos DB Adapter

This project provides a custom adapter for `better-auth` that integrates with Azure Cosmos DB. It allows for seamless interaction with the required tables: User, Session, Account, and VerificationToken.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the adapter, run the following command:

```bash
npm install better-auth-cosmos
```

## Usage

To use the adapter, import it into your application and configure it with your Azure Cosmos DB connection string and database name.

```typescript
import { buildCosmosAdapter } from 'better-auth-cosmos';

export const adapter = buildCosmosAdapter({
    adapterId: 'cosmos-adapter',
    adapterName: 'Cosmos Adapter',
    dbCredentials: {
        connectionString: process.env.COSMOS_DB!
    },
    dbName: process.env.COSMOS_DB_NAME || 'better-auth',
    debugLogs: true,
    usePlural: false,
});
```

## API

I am not supporting custom CosmosClient objects and instead initializing through config.  Since this adapter is specific to the `better-auth` implementation, we really don't care about exposing functionality and can leave the abstraction as-is.
```typescript
import { betterAuth } from "better-auth";
import { cosmosAdapter } from "../my/code";
 
export const auth = betterAuth({
  database: cosmosAdapter({ ...options })),
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.  Run the tests with an instance of cosmos to verify changes.
```bash
bun run test
```

## License

This project is licensed under use it, idc.