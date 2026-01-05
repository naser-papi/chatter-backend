# Chatter Backend

A production-grade, scalable chat application backend built with NestJS, GraphQL, and MongoDB. This backend provides real-time messaging capabilities with WebSocket subscriptions, user authentication, and file storage integration.

## 🏗️ Architecture Overview

### Technology Stack

- **Framework**: NestJS 10.x (Node.js)
- **API**: GraphQL (Apollo Server) with REST endpoints
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js (Local & JWT strategies)
- **Real-time**: GraphQL Subscriptions (graphql-ws)
- **Storage**: Azure Blob Storage (optional) or Local filesystem
- **Logging**: Pino with HTTP request logging
- **Validation**: class-validator & class-transformer
- **Package Manager**: pnpm
- **Containerization**: Docker (multi-stage build)

### Project Structure

```
src/
├── auth/              # Authentication module (JWT, Passport strategies)
├── users/             # User management
├── chats/             # Chat entities and management
│   └── messages/      # Message handling with subscriptions
├── common/            # Shared utilities
│   ├── database/      # MongoDB setup, abstract repository pattern
│   ├── storage/       # File storage abstraction (Azure/Local)
│   └── pub-sub/       # GraphQL PubSub for subscriptions
└── migrations/        # Database migrations (migrate-mongo)
```

## ✨ Key Features

- ✅ **GraphQL API** with auto-generated schema
- ✅ **Real-time messaging** via GraphQL subscriptions
- ✅ **JWT Authentication** with HTTP-only cookies
- ✅ **WebSocket authentication** for subscriptions
- ✅ **File uploads** with Azure Blob Storage or local storage
- ✅ **Database migrations** support
- ✅ **Structured logging** with Pino
- ✅ **Input validation** with class-validator
- ✅ **CORS** configuration
- ✅ **Docker** multi-stage build for production

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x
- pnpm 9.x
- MongoDB instance
- (Optional) Azure Storage Account for file storage

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm start:dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/chatter

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=86400

# Storage Configuration (Optional)
STORAGE_DRIVER=local  # Options: 'local' or 'azure'
UPLOAD_DIR=/app/storage/uploads
UPLOADS_URL_PREFIX=/uploads

# Azure Storage (Required if STORAGE_DRIVER=azure)
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
```

## Repository Links

- Frontend repo: https://github.com/naser-papi/chatter-front

### Running with Docker

```bash
# Build the Docker image
docker build -t chatter-backend .

# Run the container
docker run -p 8000:8000 --env-file .env chatter-backend
```

## 📊 Database Schema

### Users
- `email` (unique, indexed)
- `fullName`
- `password` (hashed with bcrypt)
- `avatarUrl` (optional)

### Chats
- `userId` (creator)
- `isPrivate` (boolean)
- `name`
- `userIds` (array of participant IDs)
- `messages` (embedded messages)

### Messages
- `content`
- `createAt` (timestamp)
- `userId` (sender)
- `chatId` (reference to chat)

## 🔐 Authentication

The application uses JWT tokens stored in HTTP-only cookies for security:

- **Login**: POST `/auth/login` (REST) or `login` mutation (GraphQL)
- **Logout**: POST `/auth/logout` (REST) or `logout` mutation (GraphQL)
- **WebSocket Auth**: Cookies are validated on WebSocket connection for subscriptions

### GraphQL Guards

Use `@UseGuards(GqlAuthGuard)` decorator to protect GraphQL resolvers.

## 📡 API Endpoints

### GraphQL Playground

When running in development, access GraphQL Playground at:
```
http://localhost:8000/graphql
```

### REST Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /uploads/*` - Static file serving

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## 📝 Code Quality

```bash
# Linting
pnpm lint

# Formatting
pnpm format
```

## 🔍 Code Review Analysis

### ✅ Strengths

1. **Well-structured Architecture**
   - Clean separation of concerns with modular design
   - Repository pattern for data access abstraction
   - Abstract base classes promote code reuse

2. **Type Safety**
   - TypeScript throughout the codebase
   - GraphQL schema generation from TypeScript classes
   - Strong typing with DTOs

3. **Security Best Practices**
   - HTTP-only cookies for JWT storage
   - Password hashing with bcrypt
   - CORS configuration
   - Input validation with class-validator

4. **Production Readiness**
   - Docker multi-stage build
   - Environment-based configuration
   - Structured logging (Pino)
   - Database migrations support

5. **Real-time Capabilities**
   - GraphQL subscriptions for live updates
   - WebSocket authentication
   - PubSub pattern implementation

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)

### Requirements:

- Include the original copyright notice and license text
- Include a copy of the MIT License in distributions

## 🤝 Contributing

Contributions are welcome 🎉

**Fork the repo**

Create a feature branch: `feat/<name>` or `fix/<name>`

Open a PR with a clear description and screenshots/logs when relevant

**Good first contributions**

- Documentation improvements
- Tests (unit/integration)
- Performance or DX enhancements
- Small features (message UI, chat UX, etc.)


## Full License Text

```
MIT License

Copyright (c) 2026 Naser Papi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

For more information, see the [LICENSE](LICENSE) file in the repository root.

---

**Status**: 🟡 Under Active Development

**Last Updated** Jan 2026