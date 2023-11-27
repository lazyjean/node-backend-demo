# Summary

# Architecture Design
This is a simple architecture design based on [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) clean architecture.
Its core idea is to separate the business logic from the data access layer and user interface.

## Domain
Place business model in the `src/domain`. including entities, value objects, and use cases (didn't define usecase interface in this demo for simplicity). 

## Business Logic
The business logic is implemented in the `src/services/user/usecase`.

## Data Access Layer
The data access layer is implemented in the `src/services/user/repository`. We can implement any other data access layer such as mysql, postgres, etc.

## Application Programming Interface
The API is implemented in the `src/services/user/delivery`. We can implement any other API, such as gRPC, graphQL, etc.

# How to run
## pre-requisites
- Node.js 20.0+
- Yarn 1.22+
- Docker 24+
- Docker Compose 2.22

## run with docker-compose
```bash
# You can start all services by running docker-compose
docker-compose up -d

# You can see theses services when you succeed to run docker-compose.
❯ docker ps
CONTAINER ID   IMAGE                                      COMMAND                  CREATED       STATUS                 PORTS                      NAMES
af814561fbc9   leeszi/node-backend-demo:latest            "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:80->3000/tcp       node-backend-demo-backend-1
40bb12a725da   mongo                                      "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:27017->27017/tcp   node-backend-demo-mongo-1
cc01af13f41a   ghcr.io/joeferner/redis-commander:latest   "/usr/bin/dumb-init …"   2 hours ago   Up 2 hours (healthy)   0.0.0.0:8082->8081/tcp     node-backend-demo-redis-commander-1
39da0a1ffb46   mongo-express                              "/sbin/tini -- /dock…"   2 hours ago   Up 2 hours             0.0.0.0:8081->8081/tcp     node-backend-demo-mongo-express-1
b56db1f1e0ed   redis:6.0.20-alpine3.18                    "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:6379->6379/tcp     node-backend-demo-redis-1
```

## run locally
### run
```bash
# install dependencies
$ yarn install

# run dev server. You need run docker-compose services first. Because the server depends on redis and mongodb.
$ yarn start:dev

# run test
$ yarn test
```
