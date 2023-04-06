# Nest prototype

## Description

REST API prototype built with [Nest](https://github.com/nestjs/nest) framework

## Installation

```bash
$ npm install
```
## Data base fixtures

```bash
$ npm run migration:generate
$ npm run migration:create
$ npm run migration:create
$ npm run migration:migrate
$ npm run prefixtures:load
$ npm run fixtures:load
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```