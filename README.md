# Shopify Developer Challenge
[![CircleCI](https://circleci.com/gh/chrismaltais/EcommerceAPI.svg?style=svg)](https://circleci.com/gh/chrismaltais/EcommerceAPI)
[![codecov](https://codecov.io/gh/chrismaltais/ShopifyInternChallenge2019/branch/master/graph/badge.svg)](https://codecov.io/gh/chrismaltais/ShopifyInternChallenge2019)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

This repository is a solution to Shopify’s [Developer Challenge](https://docs.google.com/document/d/1J49NAOIoWYOumaoQCKopPfudWI_jsQWVKlXmw1f1r-4/edit): Building the the barebones backend for an e-commerce store.

This solution uses NodeJS and Express to create a RESTful API.

# Requirements

- Docker (version 18.09.1) **or** 
- Node (version 9.10.1) **and** MongoDB (version 4.0.0)

## Optional

- Postman (version 6.7.1)

# Usage
## Docker (Recommended)

**Docker Setup** 

1. `docker-compose up --build -d`


> This will build and link the containers for the NodeJS app and MongoDB

2. `docker exec -it webAPI npm run seed`


> This will seed the database with a subset of initial products and one user

Congratulations! The server is up and the database is seeded. 

You can begin browsing at `localhost:3000/api/v2/products`!

See the [documentation](https://documenter.getpostman.com/view/3302275/RzteTYBK) for resource information.

**Stopping the server**

`docker-compose stop`
> This will stop both the NodeJS app and MongoDB containers
## Running without Docker
1. Start MongoDB locally
2. `npm install` 
> This installs all required node modules
3. `npm run seed:local`
> This will seed the database with a subset of initial products and one user
4. `npm start`
> This will start the Node app locally


## Postman Setup (mitigates need to use curl for requests)
1. Open the **Postman** desktop application
2. File → **Import** → `path/to/app/postman/Local.postman_environment.json`
  > This will setup your environment in Postman so no configuration is needed.
3. File → **Import** → `path/to/app/postman/Shopify2019DeveloperChallenge.postman_collection.json`
  > This will import the core routes used in the application
  ![](https://i.imgur.com/aNjXJSy.png "Postman Collection")
  
# Documentation
Learn more about:
- [Authentication](https://github.com/chrismaltais/EcommerceAPI/blob/master/docs/AUTHENTICATION.md)
- [API Endpoints](https://documenter.getpostman.com/view/3302275/RzteTYBK)
- [Testing](https://github.com/chrismaltais/EcommerceAPI/blob/master/docs/TESTING.md)
- [Versioning](https://github.com/chrismaltais/EcommerceAPI/blob/master/docs/VERSIONING.md)
- [Contributing](https://github.com/chrismaltais/EcommerceAPI/blob/master/docs/CONTRIBUTING.md)

# Troubleshooting
If any problems arise, for the sake of this challenge most will be fixed by simply reseeding the database
> `docker exec -it webAPI npm run seed` (if running on docker) **OR** `npm run seed:local` (if running locally)

Contact: contact@chrismaltais.com
