# [WIP] Adamantik

<p align="center">
  <img src='assets/logo.png' width='400'>
</p>

Workout tracking app

## Dev

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
- [ ] Protect routes based on user id - implement scoped access
