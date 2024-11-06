# Authentication REST API

This project is a fully functional authentication REST API built with Node.js, TypeScript, and Typegoose. It offers user registration, email verification, password recovery, and JWT-based authentication (access and refresh tokens).

## Features

- **User Registration** - Create a new account with an email and password.
- **Email Verification** - Verify a user's email after registration.
- **Forgot Password** - Send a password reset email.
- **Password Reset** - Reset a user's password.
- **Get Current User** - Retrieve details about the authenticated user.
- **Login** - Authenticate with email and password.
- **Access Token** - Obtain a short-lived access token.
- **Refresh Token** - Obtain a long-lived refresh token to renew the access token.

## Technologies

- **TypeScript** - Static type checking for enhanced developer experience.
- **Express** - A flexible and lightweight web server framework for building RESTful APIs.
- **Typegoose** - A Mongoose wrapper that simplifies TypeScript integration for MongoDB schemas and models.
- **argon2** - Secure password hashing algorithm.
- **Zod** - Data validation and parsing, ensuring strict API schema adherence.
- **jsonwebtoken** - Generating and verifying JSON Web Tokens (JWT) for authentication.
- **Nodemailer** - Sending email notifications for actions like email verification and password resets.
- **Pino** - High-performance logging for better debugging and monitoring.

## Prerequisites

- **Node.js** (>=14.x.x)
- **MongoDB** - The database used for storing user data and tokens.

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ramthenmala/auth-api.git
   cd authentication-rest-api

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following:

   ```plaintext
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/auth-db
   JWT_SECRET=your_jwt_secret
   JWT_ACCESS_TOKEN_EXPIRES_IN=15m
   JWT_REFRESH_TOKEN_EXPIRES_IN=7d
   EMAIL_HOST=smtp.your-email-provider.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   ```

4. **Start the Server**

   ```bash
   pnpm run dev
   ```

   The API will be available at `http://localhost:4000`.

---

## API Routes - `curl` Commands

### Health Check

**Endpoint:** `GET /healthcheck`

```bash
curl -X GET http://localhost:4000/healthcheck
```

### User Registration

**Endpoint:** `POST /api/users`

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "password": "Password123!"
      }'
```

### Verify User Email

**Endpoint:** `POST /api/users/verify/:id/:verificationCode`

Replace `:id` and `:verificationCode` with the actual user ID and verification code.

```bash
curl -X POST http://localhost:4000/api/users/verify/USER_ID/VERIFICATION_CODE
```

### Forgot Password

**Endpoint:** `POST /api/users/forgotpassword`

```bash
curl -X POST http://localhost:4000/api/users/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com"
      }'
```

### Reset Password

**Endpoint:** `POST /api/users/resetpassword/:id/:passwordResetCode`

Replace `:id` and `:passwordResetCode` with the actual user ID and password reset code.

```bash
curl -X POST http://localhost:4000/api/users/resetpassword/USER_ID/PASSWORD_RESET_CODE \
  -H "Content-Type: application/json" \
  -d '{
        "password": "NewPassword123!"
      }'
```

### Login

**Endpoint:** `POST /api/sessions`

```bash
curl -X POST http://localhost:4000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "password": "Password123!"
      }'
```

### Get Current User

**Endpoint:** `GET /api/users/me`

Requires authentication. Replace `ACCESS_TOKEN` with a valid JWT access token.

```bash
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Refresh Access Token

**Endpoint:** `POST /api/sessions/refresh`

Requires authentication. Replace `REFRESH_TOKEN` with a valid JWT refresh token.

```bash
curl -X POST http://localhost:4000/api/sessions/refresh \
  -H "Authorization: Bearer REFRESH_TOKEN"
```
