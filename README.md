# product-catalog-api

Middleware service to provide a set of rest API which communicate with a supply chain service partner.

## Application Architecture

This application uses Clean Architecture, and the project structure looks like this:

```
.
├── bin
├── src
│   ├── app.ts
│   ├── application
│   │   ├── domain
│   │   └── usecase
│   ├── framework
│   │   ├── controllers
│   │   ├── middleware
│   │   └── routes
│   └── gateway
│       ├── GetProductsSupplyChainRest.ts
│       ├── SupplyChainClientRest.ts
│       └── http
.
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
- yarn start (for non stage environment)

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

### Get one specific product

### Update a product

### Delete a product

## Crosscut concerns

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
- integration tests
- load test
- secure API with authentication (jwt, api-key, etc)
- fix circuit braker policy for https with status code 4xx
- figure tsc paths issues `Error: Cannot find module '../../../../src/application/usecase/GetProducts/GetAllProductsUseCase'`