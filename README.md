# my-monorepo

This project is a monorepo that contains an API developed with Fastify, TypeScript and Prisma. The API includes authentication, role-based authorisation, user management, image upload and real-time notifications via WebSockets. The project uses PostgreSQL as a database and follows a monorepo structure with several packages.

## Features

- JWT authentication: Users can log in, update their data and delete account. .
- Role-based authorisation: Some paths are protected according to the user's role.
- User management: CRUD of users, including updating profiles and deleting accounts.
- Image upload: Users can upload images to external storage.
- Real-time notifications: Implementation of WebSockets for notifications.
- Unit testing: Critical functions and endpoints are covered by unit testing with Jest.
- API documentation: API documentation generated with @fastify/swagger.

## Technologies used

- Node.js with TypeScript
- Fastify: Node.js Framework
- Prisma: ORM for database management
- JWT: For authentication and authorisation
- PostgreSQL: Relational database
- WebSockets: For handling real-time notifications
- Jest: For unit testing
- Yarn: Dependency manager with Yarn Workspaces
- Cloudinary: Cloud storage for images

## Prerequisites for starting a local project

- Node.js >= 16
- Yarn
- PostgreSQL: You must have PostgreSQL installed and configured.
- Cloudinary: You must have a Cloudinary account to manage image uploads.

## Installation

1. Clone this repository:

```
https://github.com/Rogarrid/my-monorepo.git
```

2. Navigate to the project directory:

```
cd my-monorepo
```

3. Install the dependencies using Yarn:

```
yarn install
```

4. Configure the database and run Prisma migrations:

```
yarn migrate:prisma
```

## Environment Variables

This project requires certain environment variables to function correctly. However, these are not included in the repository for security reasons.

If you need the environment variables necessary to run the project, please contact me to obtain them.

rocio.garrido.fer@gmail.com

## Running the project

To start the server in development mode (at the root of the project):

```
yarn start:dev
```

The server will start at http://localhost:3000.

## Running tests

You can run unit tests using Jest (at the root of the project):

```
yarn test
```

## Project structure

The project follows a monorepo structure organised by packages. The main package is api and contains the Fastify server logic.

```
my-monorepo/
│
├── packages/
│ ├── api/
│ │ ├── controllers/
│ │ ├── dto/
│ │ ├── middleware/
│ │ ├── prisma/
│ │ ├── routes/
│ │ ├── test/
| | ├── types/
| | ├── build.ts
│ │ ├── index.ts
| | ├── jest.config.ts
| | └── package.json
| ├── services/
| | ├── cloudinaryService.ts
| | ├── package.json
| | └── userService.ts
│ └── utils/
| ├── errors.ts
| ├── package.json
| └── webSocketClient.ts
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Main packages

- **api**: Central module that manages routes, controllers and API logic.
- **services**: Services to handle business logic and external interactions.
- **utils**: Shared functions and utilities within the monorepo.
  
## Main API Paths

### Authentication

- **POST /users**: Create a new user (sign up) and receive a JWT token.
- **POST /users/login**: Log in and receive a JWT token.
- **POST /users/refresh-token**: Refresh the JWT token using a refresh token.

### User Management

- **GET /users/:id**: Retrieve user details (requires admin role).
- **PUT /users/:id**: Update user details.
- **DELETE /users/:id**: Delete a user.

### Image Management

- **POST /users/upload-image**: Upload an image and retrieve optimized and transformed URLs (requires authentication).

### WebSocket

- **GET /notifications**: Connect to the real-time notifications service using WebSocket.

## Role and Permission Management

The authenticate middleware is used to protect specific routes. In addition, you can specify which roles can access a route by providing a list of allowed roles in the middleware. For example:

```
fastify.get<{ Params: UserIdDto }>(
    "/users/:id",
    { preHandler: authenticate(["admin"]), schema: userIdSchema },
    userController.get
  );
```

## Prisma and Database (Postgres)

Prisma is used as an ORM to handle database operations. You can find the Prisma schema in `packages/api/prisma/schema.prisma`. To perform CRUD operations, Prisma is used inside the drivers.

## Deployment

## Considerations and pending improvements

- **Additional endpoints**: The following endpoints are planned to be created to manage user publications:

  - Endpoint to create and save a new publication associated with an existing user.
  - Endpoint to delete a publication of an existing user.
  - Endpoint to modify a publication created by an existing user.

- **Password validations**: It is recommended that more robust validations be implemented to strengthen password security policies. New validations would include:

  - Minimum of 8 characters.
  - At least one uppercase letter, one lowercase letter, one number and one special character (e.g. @, #, $, etc.).

- **Storing the refreshToken**: Users' refreshToken should be stored in the database in encrypted form to comply with security best practices.

- **Branching**: A branching workflow was not used in this project because there was only one developer working on the project. However, for a collaborative team, it is recommended to work in branches for better version control and parallel development.

- **Pending testing**: Currently only a representative sample of tests has been performed to demonstrate testing expertise. It is recommended to expand testing to comprehensively cover all endpoints and business logic of the application.

- **Endpoint responses**: Endpoints that handle user creation, update and login currently return basic user information, which is useful for the frontend in updating customisable components. If this information is not needed in these cases, it can be replaced by a simple success message to avoid exposing unnecessary data.

## Contribution

If you want to contribute to this project:

- Make a fork of the project.
- Create a branch for your new feature (git checkout -b feature/new-feature).
- Commit your changes (git commit -m ‘Add new feature’).
- Push to the branch (git push origin feature/new-feature).
- Create a Pull Request.
