# Gestion des Demandes — Backend

A REST API for managing ticket requests ("demandes"), built with NestJS, Prisma 7, and PostgreSQL. The API handles the full ticket lifecycle including status transitions and audit trail logging.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Project Overview

This backend powers a ticket management system where users can create, update, and track requests through a defined workflow. Every action performed on a ticket is recorded in an immutable audit trail, making it possible to see the full history of any request at any time.

## Core Features

- **Demandes CRUD** — create, read, update, and soft-delete ticket requests
- **Audit trail** — every mutation generates an immutable log entry with actor, date, and diff
- **Soft delete** — deleted records are hidden from active queries but preserved in the database

## Technology Stack

- **Runtime**: Node.js 24
- **Framework**: NestJS
- **ORM**: Prisma 7
- **Database**: PostgreSQL
- **Documentation**: Swagger / OpenAPI (auto-generated from decorators)
- **Testing**: Jest (unit)

## Getting Started

Follow these steps to set up the backend locally.

### Prerequisites

- Node.js 24
- PostgreSQL running locally
- npm

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and fill in your values:
```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Database name | `demandes_db` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | `password` |
| `DEFAULT_USER_ID` | UUID of the audit user | _(copy from seed output)_ |
| `PORT` | HTTP port | `3000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:4200` |

4. Generate the Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database:
```bash
npx prisma db seed
```

After seeding, copy one of the printed user UUIDs into `DEFAULT_USER_ID` in your `.env`.

7. Start the development server:
```bash
npm run start:dev
```

The API is now running at `http://localhost:3000/api/v1`.
Swagger documentation is available at `http://localhost:3000/api/docs`.

### Running Tests
```bash
# Unit tests
npm run test
# Unit tests in watch mode
npm run test:watch
```
## Contributing

1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature/YourFeature
```
3. Commit your changes:
```bash
git commit -m "Add YourFeature"
```
4. Push to the branch:
```bash
git push origin feature/YourFeature
```
5. Open a pull request.