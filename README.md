<h1>WeRoad Hiring Test</h1>

- [1. Overview](#1-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Installation](#3-installation)
- [4. Environment](#4-environment)
- [5. Running the application](#5-running-the-application)
- [6. Served application](#6-served-application)
- [7. Running unit test](#7-running-unit-test)

## 1. Overview

WeRoad tech assesment.
The project was developed using [NestJS](https://docs.nestjs.com/), [GraphQl](https://graphql.org/) and [Mikro-ORM](https://mikro-orm.io/).

## 2. Prerequisites

To be able to run the project the only requirement is to have docker properely installed.
To manage the dependecies the project uses `pnpm`

## 3. Installation

The following command can be used to install locally the project's dependencies.

```bash
$ pnpm install
```

## 4. Environment

The application is configured using the `.env` file, placed at the root of the project.
This file is not committed in the project for security reasons,
but a `.env.example` file is available and provides the correct template for the real `.env` file.

## 5. Running the application

To easily run the application is available the docker compose multi stage setup, that will provide:

- application instance
- postgres instance

```bash
$ docker compose up dev
```

## 6. Served application

The application expose a GraphQL playground page that allow to keep the graphql endpoint well documented and,
on the other hand, have a UI to test query and mutations without using other tools.

## 7. Running unit test

The unit tests were written using Jest framework.

The following command runs unit tests:

```bash
$ pnpm run test
```
