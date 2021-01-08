# Zombie API

## Documentation

For the documentation, see [Zombie REST API documentation](docs/index.md) markdown page.

## Workflow

See [Workflow](docs/workflow.md) in the `docs` directory for the following information:
* Questions that arose during designing or implementing the API,
* Optimization,
* A word about testing (also [here](test/unit/README.md)),
* Plans, improvements.

## Installation

```bash
$ npm install
```

Don't forget to install the Postgres database, run it, create a database and input the credentials into the configuration file (`default.yml`) or only the development-mode-related one (`development.yml`).

You can also possible to input the credentials for the production mode (`production.yml`), but it is strongly recommend to avoid that. The better option is to run the application in production mode with the following environmental variables

  * `DB_USERNAME`
  * `DB_PASSWORD`
  * `DB_NAME`

set to the values matching your database.

In case of hosting the app, the online platform should allow you to fill in the corresponding text fields with the values of the environment variables (it's the platform responsibility to store those envs in a secure manner).


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# production mode - passing credentials to db
$ DB_USERNAME=someusername \
  DB_PASSWORD='somepassword1234!@#$' \
  DB_NAME=somedbname \
  npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
**Note**: You need to delete the coverage directory before running the app!
