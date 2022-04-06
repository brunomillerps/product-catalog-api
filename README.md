# product-catalog-api

Middleware service to provide a set of rest API which communicate with a supply chain service partner.

## Application Architecture

This application uses Clean Architecture, and the project structure looks like this:

```
.
├── README.md
├── babel.config.js
├── jest.config.js
├── package.json
├── src
│   ├── app.ts
│   ├── application
│   │   ├── domain
│   │   │   └── exceptions
│   │   └── usecase
│   │       ├── DeleteProduct
│   │       ├── GetProducts
│   │       ├── NewProduct
│   │       ├── ProductDto.ts
│   │       └── UpdateProducts
│   ├── framework
│   │   ├── controllers
│   │   │   ├── createProduct
│   │   │   ├── deleteProduct
│   │   │   └── getAllProdutcts
│   │   ├── middleware
│   │   │   └── exceptions
│   │   └── routes
│   │       ├── Products.routes.it.spec.ts
│   │       └── Products.routes.ts
│   ├── gateway
│   │   └── supplyChain
│   │       └── rest
│   └── server.ts
└── tsconfig
```

### Application package

Contains the project business rules and it should not depend on other layers around. Its inner package are:

- **domain**: holds classes that have shared rules, are usually known as rich entity
- **usecase**: responsible to organize the system rules and play with abstractions to delegate outside responsibilities

### Framework

It has all the needed configuration to the framework in place to operate healthily

### Gateway

Contains the implementation of the abstractions determined by the use cases classes. It is also going to access external systems like databases, rest APIs, messages queue, etc.

## How to run

Run following steps:

- yarn install
- yarn dev (for development)
- yarn build (to generate javascript bin)
- yarn start (node start prod environment)

## Code coverage

Current code coverage

```
All files                              |    99.2 |      100 |     100 |   99.18 |
 application/domain/exceptions         |     100 |      100 |     100 |     100 |
  ErrorException.ts                    |     100 |      100 |     100 |     100 |
  InvalidProductIdException.ts         |     100 |      100 |     100 |     100 |
  ProductNotFound.ts                   |     100 |      100 |     100 |     100 |
 application/usecase/DeleteProduct     |     100 |      100 |     100 |     100 |
  DeleteProductUseCase.ts              |     100 |      100 |     100 |     100 |
 application/usecase/GetProducts       |     100 |      100 |     100 |     100 |
  GetAllProductsUseCase.ts             |     100 |      100 |     100 |     100 |
 application/usecase/NewProduct        |     100 |      100 |     100 |     100 |
  CreateProductUseCase.ts              |     100 |      100 |     100 |     100 |
 framework/controllers/createProduct   |     100 |      100 |     100 |     100 |
  CreateProductController.ts           |     100 |      100 |     100 |     100 |
 framework/controllers/deleteProduct   |     100 |      100 |     100 |     100 |
  DeleteProductController.ts           |     100 |      100 |     100 |     100 |
 framework/controllers/getAllProdutcts |     100 |      100 |     100 |     100 |
  GetAllProructsController.ts          |     100 |      100 |     100 |     100 |
 framework/middleware/exceptions       |     100 |      100 |     100 |     100 |
  error.middleware.ts                  |     100 |      100 |     100 |     100 |
 framework/routes                      |     100 |      100 |     100 |     100 |
  Products.routes.ts                   |     100 |      100 |     100 |     100 |
 gateway/supplyChain/rest              |   98.18 |      100 |     100 |   98.07 |
  CreateProductSupplyChainRest.ts      |     100 |      100 |     100 |     100 |
  DeleteProductSupplyChainRest.ts      |     100 |      100 |     100 |     100 |
  GetProductsSupplyChainRest.ts        |   88.88 |      100 |     100 |   88.88 | 22
  SupplyChainBaseGateway.ts            |     100 |      100 |     100 |     100 |
  SupplyChainClientRest.ts             |     100 |      100 |     100 |     100 |
---------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 13 passed, 13 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        13.486 s
Ran all test suites.
Done in 14.29s.

```

Important to note that the file `src/gateway/SupplyChainClientRest.ts` needs test and, with that, the major feature of handling failures will be covered.

- The estimated time to complete unit test is one work day.

## APIs

### Create product

**Request**

```
curl --location --request POST 'localhost:3000/api/v1/products' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Shampoo Tipo 2",
    "quantity": 10,
    "price": 30
}'
```

**Response**

```
{
    "id": "1f556e25-8b74-4d0d-8904-b5d02d1e1973",
    "name": "Shampoo Tipo 2",
    "quantity": 10,
    "price": 30
}
```

### Get all products

**Request**:

```
curl --location --request GET 'localhost:3000/api/v1/products'
```

**Response**

```
[
    {
        "quantity": 6,
        "id": "bfc022a5-c239-45f5-bb35-f88023b669ce",
        "price": "23.65",
        "name": "Prod 00033"
    },
    {
        "quantity": 5,
        "id": "88c5db61-4501-4e38-bf8c-29a6626766e1",
        "price": 12.34,
        "name": "testing 123"
    },
]
```

### Update a product

Not implemented yet

As the mock server has no PUT API
I would have to recreate the resource to simulate an update, because it doesn't accept the ID in the body of POST (create resource) nor create a new one, because that will cause new ID.

To accomplish this API, will need:

- Keep a unique ID in database, and return it to user
- Everey product creation, call the service API and then save to database the server id. Here we have a relation IDs
- Gel all should return either product persisted or not in database. Also, exchange the IDs
- Delete api deletes both server mock and database
- Update will only update the product name?! Possible risk of cold data.

A branch `feature/mongodb` contains database implementations to keep a new and unchaged ID, missing rules in usecases

### Delete a product

**Request**

```
curl --location --request DELETE 'localhost:3000/api/v1/products/3550ed97-4922-4275-bd2e-13c04cc4d80b'
```

**Response**
204 - No Content

## Cross-cutting concern

### API Rate Limit

Basic in memory rate-limiting. Use to limit repeated requests to the application endpoints.

Any income API request to the `/api/` path will have 100 allowed requests within a window of 10 minutes, after that, the requests will fail directly with a 429 status code.

```
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
```

### HTTP header security

The application use `helmet` to secure the application. They are:

- contentSecurityPolicy
- crossOriginEmbedderPolicy
- crossOriginOpenerPolicy
- crossOriginResourcePolicy
- dnsPrefetchControl
- expectCt
- frameguard
- hidePoweredBy
- hsts
- ieNoOpen
- noSniff
- originAgentCluster
- permittedCrossDomainPolicies
- referrerPolicy
- xssFilter

### Circuit Braker

Uses opossum as circuit braker to prevent failures propagation and fail fast

## TODO

- add Idempotency to POST, PUT, DELETE
- ~integration test with supertest~
- ~100% unit test~
- load test
- secure API with authentication (jwt, api-key, etc)
