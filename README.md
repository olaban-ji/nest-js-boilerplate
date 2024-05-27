# NestJS Boilerplate

This is a boilerplate project for a NestJS application that supports user creation with email and password, password hashing with bcrypt, JWT authentication for logging in and visiting protected routes, and connections to both MongoDB (using Mongoose) and Postgres (using Prisma).

## Features

- **User Registration**: Users can sign up with an email and password. Passwords are hashed with bcrypt before being stored in the database.
- **JWT Authentication**: Users can log in with their email and password to receive a JWT token, which is required to access protected routes.
- **Database Support**: Connects to MongoDB using Mongoose and Postgres using Prisma. Mongoose is what is fully integrated in the user service. To replace with Prisma, visit the [NestJs Docs](https://docs.nestjs.com/recipes/prisma)
- **Response Interceptor**: Standardizes API responses.
- **Custom HTTP Exception**: Provides detailed error messages for HTTP exceptions.
- **Initial Migration**: An initial migration has been performed to set up the database schema.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Prisma](https://www.prisma.io/)

## Getting Started

### Prerequisites

- Node.js (>= 12.x)
- [NestJS](https://docs.nestjs.com/first-steps)
- Yarn
- MongoDB
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/nestjs-boilerplate.git
   cd nestjs-boilerplate
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following content:

   ```env
   # MongoDB
   DATABASE_URI=mongodb://localhost:27017/nestjs-boilerplate

   # PostgreSQL
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database

   #bcrypt
   SALT_ROUNDS=10

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h

   #PostgreSql
   DATABASE_URL="postgresql://<randomusernam>:<randompassword>@localhost:5432/<databasename>?schema=public
   ```

4. Initialize Prisma and run the initial migration:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### API Endpoints

#### User Registration

- **Endpoint**: `POST /users/sign-up`
- **Description**: Register a new user with email and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

#### User Login

- **Endpoint**: `POST /auth/login`
- **Description**: Log in a user and receive a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "your_jwt_token"
  }
  ```

#### Get User Profile

- **Endpoint**: `GET /users/profile`
- **Description**: Get the authenticated user's profile. Requires JWT token.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
