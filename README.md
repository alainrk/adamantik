# [WIP] Adamantik

<p align="center">
  <img src='assets/logo.png' width='400'>
</p>

Workout tracking app

## Dev

### Prerequisites

- Setup Google OAuth 2.0 SSO for local development
  - Create a [GCP Project](https://console.cloud.google.com/projectcreate)
  - Create a new OAuth 2.0 Client ID
  - APIs and Services -> "OAuth consent screen".
  - User Type -> External
  - Fill in the information requires
  - Add/Remove scopes -> "/auth/userinfo.email" and "/auth/userinfo.profile"
  - Add test users
  - Generate Application Credentials: Credentials under the "APIS And Services" -> "CREATE CREDENTIALS" -> "OAuth Client ID"
  - Save info and store securely the JSON file

### Commands

```sh
# Install dependencies
npm i

# Seed the database
npm run seed

# Start the app hot reload
npm run dev

# Start Prisma Studio to analyze the database
npm run studio

# Build the app
npm run build
```

## TODO:

Non-exhaustive list of immediate next steps:

- [x] Move authn stuff in their own plugin
- [x] Add authn middleware using implemented google sso
- [x] Protect routes with authn middleware
- [ ] Setup auth middleware and IDP to allow injection and testing
- [ ] Protect routes based on user id - implement scoped access
- [ ] Setup CI/CD
