# Testing
The application is thoroughly tested using [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest).

[CodeCov](https://codecov.io/gh/chrismaltais/ShopifyInternChallenge2019) is used to validate the 92% code coverage, and [CirclCI](https://circleci.com/gh/chrismaltais/EcommerceAPI) is used to run all tests before a branch is merged to master. 

This ensures the build isn't broken by changes in code logic.

## How the tests work
An in-memory MongoDB database is built when Jest starts up, the database is seeded before every test, and the database is destroyed when all tests are completed.

## Running the tests
1. `npm install`
 > Ensure that all packages are installed
2. `npm test` OR `npm run test:watch`
> Run all suites of tests

> `npm run test:watch` runs Jest in watch mode, where individual tests can be viewed. Type in `p` to filter tests by filename regex, then `v2` and press `Enter` to view the tests for version 2 of the API.
