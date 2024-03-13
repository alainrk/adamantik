# [WIP] Adamantik

<p align="center">
  <img src='assets/logo.png' width='400'>
</p>

Workout tracking app

## Server

This is a generated [Platformatic Runtime](https://docs.platformatic.dev/docs/reference/runtime/introduction) application.

### Requirements

Platformatic supports macOS, Linux and Windows ([WSL](https://docs.microsoft.com/windows/wsl/) recommended).
You'll need to have [Node.js](https://nodejs.org/) >= v18.8.0 or >= v20.6.0

### Setup

1. Install dependencies:

```bash
npm install
```

### Usage

Run the API with:

```bash
npm start
```

### Adding a Service

Adding a new service to this project is as simple as running `create-platformatic` again, like so:

```
npx create-platformatic
```

### Seed the DB

To seed the database, run:

```
npx platformatic db seed seed.ts
```

### GraphQL Example

```graphql
query users {
  user {
    mesocycle {
      id
      name
      focus
      template
      week {
        id
        workout {
          id
          exerciseInstance {
            workout {
              id
            }
            id
            sets
            exercise {
              name
            }
          }
        }
      }
    }
    mesocycleTemplate {
      name
      focus
      numberOfDays
      template
    }
  }
}

query mesostempl {
  mesocycleTemplate {
    name
    focus
    numberOfDays
    template
  }
}

query exerciseInstances {
  exerciseInstance {
    relativeOrder
    weight
    expectedRir
    feedback
    sets
    workout {
      id
    }
  }
}

query weeks {
  week {
    id
    workout {
      id
      exerciseInstance {
        workout {
          id
        }
        id
        sets
        exercise {
          name
        }
      }
    }
  }
}
```
