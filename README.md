# Socialite

Socialite is a demo Express.js app designed to leverage MongoDB to emulate a Social Media service serving requests. The goal of which is to explore the utility of MongoDB and the Object-Document Mapper (ODM) Mongoose. This app was produced as part of the Coding Bootcamp from the University of Sydney and edX.

The main motivation behind this app was to further understand the process of creating, designing, populating, and manipulating a NoSQL database. This was accomplished by creating a series of routes in Express to simulate requests from a frontend or user app consuming the database as an API.

There are two core API endpoints, `/api/users` and `/api/thoughts`, which between them explore the idea of handling subdocuments as referential bodies (`friends`), or embedded subdocuments (`reactions`).

The biggest challenge in developing this app was error handling. There was a lot of effort put into creating a somewhat standardised set of helper methods in the routes particularly to catch most edge cases where possible, while minimising repeat code blocks. It does help a lot with code readability, so the effort feels worthwhile and worth exploring further in other projects and apps.

Some areas I would aim to improve in future releases:
- Support for query params instead of path parameters
- A refinement pass on the error handling to make it more informative without overexposing details
    - Additional changes to help gracefully coerce to a successful outcome if at all possible would also be nice (such as auto-populating the username if it were included but left empty in some situations)

## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [Credits](#credits)
- [License](#license)

## Usage
When the app has been started, you can make calls to it using your browser, the fetch Web API, or any API endpoint utility such as [cURL](https://curl.se/), [Postman](https://www.postman.com/), or [Insomnia](https://insomnia.rest/) on port `3001`.

As the endpoints were predominantly tested using Insomnia, an export of the Collection has been made available [here](./docs/Insomnia_Collection.json), which includes all routes, and documentation to briefly articulate accepted parameters.

### User Routes
`[GET] /api/users` - Get all Users

![A demo of the GET /api/users route in Insomnia](./docs/users_get_all.gif)

`[GET] /api/users/:id` - Get one User by ID

![A demo of the GET /api/users/:id route in Insomnia](./docs/users_get_one.gif)

`[POST] /api/users` - Create a new User

![A demo of the POST /api/users/:id route in Insomnia](./docs/users_post.gif)

`[PUT] /api/users/:id` - Update a User

![A demo of the PUT /api/users/:id route in Insomnia](./docs/users_update.gif)

`[DELETE] /api/users/:id` - Delete a User

![A demo of the DELETE /api/users/:id route in Insomnia](./docs/users_delete.gif)

#### Friend Routes
`[POST] /api/users/:id/friends/:friendId` - Add a Friend

![A demo of the POST /api/users/:id/friends/:friendId route in Insomnia](./docs/users_post_friend.gif)

`[DELETE] /api/users/:id/friends/:friendId` - Remove a Friend

![A demo of the DELETE /api/users/:id/friends/:friendId route in Insomnia](./docs/users_delete_friend.gif)

### Thought Routes
`[GET] /api/thoughts` - Get all Thoughts

![A demo of the GET /api/thoughts route in Insomnia](./docs/thoughts_get_all.gif)

`[GET] /api/thoughts/:id` - Get one Thought by ID

![A demo of the GET /api/thoughts/:id route in Insomnia](./docs/thoughts_get_one.gif)

`[POST] /api/thoughts` - Create a new Thought

![A demo of the POST /api/thoughts/:id route in Insomnia](./docs/thoughts_post.gif)

`[PUT] /api/thoughts/:id` - Update a Thought

![A demo of the PUT /api/thoughts/:id route in Insomnia](./docs/thoughts_update.gif)

`[DELETE] /api/thoughts/:id` - Delete a Thought

![A demo of the DELETE /api/thoughts/:id route in Insomnia](./docs/thoughts_delete.gif)

#### Reaction Routes
`[POST] /api/thoughts/:id/reactions/:reactionId` - Add a Reaction

![A demo of the POST /api/thoughts/:id/reactions/:reactionId route in Insomnia](./docs/thoughts_post_reaction.gif)

`[DELETE] /api/thoughts/:id/reactions/:reactionId` - Remove a Reaction

![A demo of the DELETE /api/thoughts/:id/reactions/:reactionId route in Insomnia](./docs/thoughts_delete_reaction.gif)

## Installation
### Prerequisites
- [Node.js version 20 LTS or higher](https://nodejs.org/en)
- [MongoDB Community Server version 7.0.7 or higher](https://www.mongodb.com/try/download/community)
- A means of interacting with REST APIs, such as
    - [cURL](https://curl.se/)
    - [Postman](https://www.postman.com/)
    - [Insomnia](https://insomnia.rest/)
        - (Optional) Import the included [Insomnia Collection](./docs/Insomnia_Collection.json) to pre-load routes for testing

### Setup
- Clone a copy of the files to the system you wish to run this from
- From a command prompt or terminal, navigate to the directory and enter `npm install`
- Once packages have been downloaded, seed the database by running `npm run seed`
- Start the server using `npm start`
- Refer to the [Usage](#usage) section for additional guidance on the endpoints available

## Credits
### Code and Extensibility
This app was developed with the following runtimes and packages:

#### Runtimes
- [Node.js](https://nodejs.org/en)
- [MongoDB Community Server](https://www.mongodb.com/try/download/)

#### Packages
- [Express.js](https://expressjs.com/)
- [Moment.js](https://momentjs.com/)
- [MongoDB](https://www.npmjs.com/package/mongodb)
- [Mongoose](https://mongoosejs.com/)

### References
- Dummy data for email addresses generated via [Online Data Generator](https://www.onlinedatagenerator.com/home/demo)
- Random sentences used as placeholder text in both Thoughts and Reactions generated from [Random Word Generator](https://randomwordgenerator.com/sentence.php)

## License
This repository is provided under the [MIT License](./LICENSE)