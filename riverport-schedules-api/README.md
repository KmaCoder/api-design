# Riverport Schedules API

API для управління маршрутами та розкладами річкового транспорту.

https://api-design-yagl.onrender.com/api

## Description

This is a NestJS application that provides an API for managing river transport routes and schedules. The API includes features such as:

- Route management (CRUD operations)
- Schedule management (CRUD operations)
- Schedule status updates
- JWT Authentication
- Role-based access control (ADMIN role required for modifications)

## Installation

```bash
# Install dependencies
$ npm install

# Copy environment file and update the values
$ cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:{PORT}/api
```

## Authentication

The API uses JWT authentication. All endpoints require a valid JWT token to be included in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control

- All users can view routes and schedules
- Only users with the ADMIN role can create, update, or delete routes and schedules

### Example roles and tokens:

Generated with secret `your-secret-key`

Admin token:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjEyMyIsInVzZXJuYW1lIjoidGVzdGFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyMTk3MjYwLCJleHAiOjE3NzM3NTQ4NjB9.5sfO42QlBzFK504Y1T_5Q_C1mBanQKPcbVNITCmfxQo`

User token:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQyMTk3MjMzLCJleHAiOjE3NzM3NTQ4MzN9.tNfTG7kyVs9yH3IfV14l7ivwKiJPxoHrdJACvZdS5D4`

To generate new token

```
node -e "console.log(require('jsonwebtoken').sign({ sub: 'admin123', username: 'testadmin', role: 'ADMIN' }, 'your-secret-key', { expiresIn: '1y' }))"
```
