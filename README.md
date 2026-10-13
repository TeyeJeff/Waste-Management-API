# Waste Management API

An Express and MongoDB API for users, waste requests, collections, and feedback.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide `MONGODB_URI` and a long random
   `JWT_SECRET`.
3. Start the API with `npm start`. The interactive API documentation is at
   `http://localhost:8080/api-docs`.

## Google OAuth and protected routes

Create a Google OAuth 2.0 web application and register the exact value of
`GOOGLE_CALLBACK_URL` as an authorized redirect URI. Set `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, and `JWT_SECRET` in the local
environment and in the deployment platform's environment settings. For a
deployment, the callback URL must use the deployed HTTPS origin, for example:

```text
https://your-service.example.com/auth/google/callback
```

Open `/auth/google` and sign in with Google. The callback returns a JWT valid
for one hour. Send it as `Authorization: Bearer <token>` to POST, PUT, and
DELETE routes. All four resource collections protect their write routes; their
GET and GET-by-ID routes remain public. If the Google OAuth credentials or JWT
secret are not configured, authentication endpoints return HTTP 503 instead of
allowing unauthenticated writes.

In Swagger UI, use **Authorize** and enter the JWT with the `Bearer ` prefix.

## API checks

- `npm test` runs GET/GetAll tests for all four resources, authentication tests,
  and write-route validation/protection tests.
- `npm run swagger` regenerates `swagger-output.json` without starting the API
  server.
