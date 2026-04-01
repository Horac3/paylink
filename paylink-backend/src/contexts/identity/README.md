# Identity Context

Handles merchant registration, authentication, and JWT lifecycle.

## Bounded Context Boundary

This context owns: `Merchant` aggregate, `Credentials` VO, JWT token signing.

## API Endpoints

All at `/api/v1/auth`:

| Method | Path       | Auth | Description                        |
|--------|------------|------|------------------------------------|
| POST   | /register  | No   | Register a new merchant            |
| POST   | /login     | No   | Login, receive access+refresh pair |
| POST   | /refresh   | No   | Refresh access token               |
| POST   | /logout    | Yes  | Logout (stateless — discard token) |
| GET    | /me        | Yes  | Get current merchant profile       |

## Domain Rules

- Email must be unique across all merchants
- Password minimum 8 characters, bcrypt-hashed (12 rounds)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Fee tier defaults to STARTER (2%) on registration

## Adding OAuth / SSO

Implement a new strategy in `infrastructure/` (e.g. `google.strategy.ts`), register in `IdentityModule`. No domain changes required.
