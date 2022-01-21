<h1 align="center"> GameCritic </h1>
<p align="center">A simple, RESTful API created to learn Express and Postgres</p>
<p align="center"><a href="https://gamecritic.herokuapp.com/api">Explore</a>
<p align="center"><img src="https://img.shields.io/website?down_color=red&down_message=DOWN&style=for-the-badge&up_color=green&up_message=UP&url=https%3A%2F%2Fgamecritic.herokuapp.com%2Fapi%2F" alt="Website" /> <img alt="Code Size" src="https://img.shields.io/github/languages/code-size/sanctumlysis/gamecritic?style=for-the-badge" /> <img alt="Build Status" src="https://img.shields.io/github/workflow/status/sanctumlysis/gamecritic/test-and-deploy?style=for-the-badge" /></p>

## Table Of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

The purpose of this API is to enable me to learn about utilising Express.js and PostgreSQL and how to utilise them in conjunction to create a stable API with a plethora of endpoints, with versatile queries and parameters on each endpoint. The API is considered a RESTful API with stateless requests and a uniform interface.

**Concepts I have learned from this project:**

- How to set up different environments and databases for production, development and testing.

- How to structure complex SQL queries utilising sanitised, dynamic user-inputs.

- The MVC pattern.

- Testing asynchronous code with [Jest](https://jestjs.io/).

- Hosting with [Heroku](https://heroku.com).
- How to utilise JWTs for authentication.

## Built With

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript"/> <img src="https://img.shields.io/badge/Express.js-0F9A41?style=for-the-badge&logo=express" alt="Express" /> <img src="https://img.shields.io/badge/Postgres-32668E?style=for-the-badge&logo=postgresql&logoColor=FFF" alt="Postgres" /> <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest" alt="Jest" /> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">

## Getting Started

If you would like to view this API, you can [click here](https://gamecritic.herokuapp.com/api) to view and interact with it through your browser (Firefox/Chrome recommended for the built-in JSON prettier). Alternatively, you can follow the steps below to have it operating locally on your machine.

### Prerequisites:

- Fork and clone the repository on your machine.

- Make sure you have [Node >v14](https://nodejs.org/en/) and the latest LTS version of [PostgreSQL](https://www.postgresql.org/) installed.

### Installation:

- `cd` into the cloned repo and run `npm install` to install the dependencies.

- Once all dependencies are installed, create a `.env.test` and `.env.development` file within the root directory of the cloned repo Follow the structure set out in [.env-example](/.env-example).

- Once the `.env` files have been created, run the `npm run setup-dbs` command followed by `npm run seed` to create and populate the necessary tables.

- Finally, run `npm test` to make sure that all of the tests are passing.

> _Note: you can use the `npm run dev` command to start the server and explore the API with an API client such as [Insomnia](https://insomnia.rest/download) or [Postman](https://www.postman.com/)._

## Usage

Make a GET request to `/api` to view all of the available endpoints and their queries/parameters, as well as example responses.

## Roadmap

- [x] ~~Integrate JWT authorization to protect endpoints.~~ [Done](https://github.com/sanctumlysis/gamecritic/issues/1).

- [ ] Implement image storage and random generation of images for categories.

- [ ] Add more endpoints.

## License

This API is released under the terms of MIT License. For more details [click here](https://mit-license.org/).

## Acknowledgements

Thanks to the whole team at [Northcoders](https://northcoders.com/) for providing such an incredible learning environment, and a notable mention to Chipie for such a comprehensive code review.
