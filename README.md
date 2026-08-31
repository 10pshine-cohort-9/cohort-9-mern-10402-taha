# NOTES APP

## Full-Stack MERN Application

### Project Report

**Course / Cohort:** Cohort 9 — MERN (NodeJS + ReactJS)
**Student:** Taha Shahid


---

# Table of Contents

1. Introduction
2. Project Objectives
3. System Overview
4. Functional Features
5. Technology Stack
6. System Architecture
7. Project Structure
8. Frontend Documentation
9. Backend Documentation
10. Database Design
11. Authentication and Authorization
12. API Documentation
13. Validation
14. Error Handling
15. Logging
16. Testing
17. Code Coverage
18. SonarQube Analysis
19. Postman API Testing
20. Environment Configuration
21. Complete Installation Guide
22. How to Run the Project
23. Production Build
24. Troubleshooting
25. Security Considerations
26. Development Workflow
27. Quality Assurance
28. Limitations
29. Future Improvements
30. Conclusion
31. Appendices

---

# 1. Introduction

Notes App is a full-stack, responsive note management application developed as part of Cohort 9's MERN assignment. The application provides users with a clean and intuitive workspace for creating, storing, editing, searching, and managing their personal notes.

The application addresses the problem of decentralized note-taking by providing a unified platform that can be accessed through a modern web browser. Users can create an account, authenticate securely, and perform complete CRUD operations on their personal notes.

The application also provides additional functionality, including note searching and filtering, individual note viewing, profile management, session management, and rich-text note editing through Tiptap.

The system follows the MERN stack architecture and consists of a React-based frontend, a Node.js and Express.js backend, and a MongoDB database managed through Mongoose.

Security and software quality were considered throughout the development process. The application implements password hashing, JWT-based authentication, protected routes, user-specific authorization, centralized error handling, structured logging, automated testing, code coverage reporting, and SonarQube analysis.

---

# 2. Project Objectives

The primary objective of this project was to develop a functional, secure, maintainable, and well-tested full-stack web application while following modern software engineering practices.

The main objectives were:

1. Implement secure user authentication using password hashing and JSON Web Tokens (JWT).
2. Enforce protected routes and server-side authorization to maintain user data privacy.
3. Develop a responsive and accessible React frontend.
4. Build a RESTful backend API using Express.js.
5. Persist application data using MongoDB and Mongoose.
6. Implement automated testing for both frontend and backend components.
7. Establish centralized error handling.
8. Implement structured request and application logging.
9. Integrate SonarQube to monitor code quality, security, and maintainability.
10. Maintain a modular project structure that supports future development and expansion.
11. Provide a responsive user experience across desktop and mobile screen sizes.
12. Provide rich-text note creation and editing through the Tiptap editor.
13. Ensure that users can access and modify only the notes associated with their own accounts.

---

# 3. System Overview

Notes App follows a client-server architecture. The user interacts with the React frontend through a browser. The frontend manages the user interface and application state and communicates with the backend through HTTP requests.

The Express.js backend receives and processes these requests. Protected routes require a valid JWT token in the Authorization header. The authentication middleware verifies the token before allowing the request to continue.

Controllers contain the application's business logic and communicate with MongoDB through Mongoose. MongoDB stores user accounts and notes.

The overall request flow is:

```text
User
  |
  v
React Frontend
  |
  +-- React Context / Application State
  |
  +-- API Service
  |
  v
REST API
  |
  v
Express Backend
  |
  +-- Structured Logging
  |
  +-- Authentication Middleware
  |
  +-- Controllers
  |
  +-- Validation
  |
  +-- Mongoose ODM
  |
  v
MongoDB
```

Structured logging records the lifecycle of HTTP requests, while validation ensures that incoming data meets the required rules before it is stored.

Errors generated during request processing are passed to centralized error-handling middleware, which produces consistent responses for the frontend.

---

# 4. Functional Features

## 4.1 Authentication

The authentication system restricts access to authorized users.

Users can create an account by providing their name, email address, and password. Passwords are securely hashed using bcryptjs before being stored in the database.

After successful authentication, the backend generates a JSON Web Token. The frontend uses this token when making protected API requests.

The authentication system provides the following functionality:

* User signup
* User login
* Password hashing
* JWT generation
* JWT verification
* Protected frontend routes
* Protected backend API endpoints
* User-specific note authorization
* Secure logout

Unauthenticated users attempting to access protected application pages are redirected to the login page.

## 4.2 Notes Management

The application provides complete note management functionality through Create, Read, Update, and Delete operations.

Users can create notes containing a title and rich-text content, view their existing notes, open individual notes, update them, and delete notes when they are no longer required.

All note operations are performed through the `/api/notes` API endpoints.

The note management functionality includes:

* Creating new notes
* Viewing all personal notes
* Viewing an individual note
* Editing existing notes
* Deleting notes
* Rich-text editing
* Required-field validation
* User-specific authorization
* Delete confirmation

## 4.3 Dashboard

The Dashboard serves as the primary workspace for authenticated users.

It retrieves the user's notes from the backend and displays them through reusable `NoteCard` components.

The Dashboard also provides:

* Loading indicators while data is being retrieved
* An empty state when the user has no notes
* Navigation to the note editor
* Search and filtering functionality
* Access to existing notes for editing
* Dynamic rendering of available notes

## 4.4 Note Editor

The Note Editor provides an interface for creating and editing notes.

The application uses Tiptap as the rich-text editing framework, allowing users to format their note content.

The editor supports both creation and editing modes. Users can save changes and delete existing notes through the editor interface.

A confirmation dialog is used before deleting a note.

The editor synchronizes the rich-text HTML content with the backend note payload.

## 4.5 Individual Note View

Users can open a specific note from the Dashboard and access its complete content.

The individual note functionality retrieves the selected note using its unique identifier and displays its title and rich-text content.

Access to an individual note is protected by authentication and ownership checks, ensuring that users cannot retrieve notes belonging to another account.

## 4.6 Profile

The Profile page provides information about the currently authenticated user.

It displays:

* User name
* Email address
* Total number of notes

The page also provides a logout mechanism that securely terminates the client-side session.

## 4.7 Navigation

Application navigation is implemented using React Router DOM.

Public authentication pages use the `AuthLayout`, while authenticated application pages use the `AppLayout`.

The application provides routes for authentication, dashboard, note creation and editing, individual notes, and profile management.

## 4.8 Responsive Layout

The application is designed to provide a consistent experience across desktop and mobile devices.

The responsive interface includes:

* Mobile-friendly layouts
* Toggleable sidebar navigation
* Sidebar overlay behavior
* Responsive note grids
* Responsive authentication screens
* Adaptive application navigation

The layout structure is handled through reusable React layout components.

## 4.9 Search and Filtering

The Dashboard provides client-side search and filtering functionality.

The search mechanism evaluates the user's search query against note titles and note contents. The displayed notes are updated dynamically as the search query changes.

This allows users to quickly locate notes without requiring a separate database query for every search operation.

## 4.10 Validation

Validation is implemented on both the frontend and backend.

Frontend validation provides immediate feedback to users before requests are submitted. Backend validation ensures that invalid data does not reach the database.

The system validates email formats, required fields, password lengths, and MongoDB ObjectId values.

## 4.11 Error Handling

The backend implements centralized error handling to provide consistent and predictable API responses.

Errors are processed by dedicated middleware, which maps exceptions to appropriate HTTP status codes and response messages.

---

# 5. Technology Stack

| Layer            | Technology                   | Version                   | Purpose                                    |
| ---------------- | ---------------------------- | ------------------------- | ------------------------------------------ |
| Frontend         | React.js                     | ^19.2.7                   | User interface development                 |
| Build Tool       | Vite                         | ^8.1.1                    | Frontend development and bundling          |
| Language         | JavaScript / JSX             | N/A                       | Application programming language           |
| Routing          | React Router DOM             | ^7.18.2                   | Client-side routing                        |
| Backend          | Node.js / Express.js         | ^5.2.1                    | Server environment and REST API            |
| Database         | MongoDB                      | N/A                       | Document-oriented database                 |
| ODM              | Mongoose                     | ^9.8.0                    | MongoDB object modeling                    |
| Authentication   | jsonwebtoken                 | ^9.0.3                    | JWT generation and verification            |
| Password Hashing | bcryptjs                     | ^3.0.3                    | Secure password hashing                    |
| Logging          | Pino / pino-http             | ^10.3.1 / ^11.0.0         | Structured application and request logging |
| Rich Text        | Tiptap                       | ^3.30.2                   | Rich-text editing                          |
| Frontend Testing | Jest + React Testing Library | ^30.4.2 / ^16.3.2         | Frontend testing                           |
| Backend Testing  | Mocha + Chai + Supertest     | ^11.7.1 / ^4.5.0 / ^7.2.2 | Backend and API testing                    |
| Coverage         | c8 / Jest                    | ^12.0.0                   | Code coverage reporting                    |
| Code Quality     | SonarQube                    | N/A                       | Static code quality and security analysis  |

---

# 6. System Architecture

The application uses a decoupled architecture in which the frontend and backend operate as separate layers.

## 6.1 Frontend Layer

The frontend is responsible for rendering the user interface and responding to user interactions.

React components are organized into reusable components, layouts, pages, contexts, and utility modules.

## 6.2 Context and State Layer

`AuthContext` provides global authentication state throughout the React application.

It manages the active user session and coordinates authentication-related state.

## 6.3 API Service Layer

The `utils/api.js` module centralizes communication with the backend API.

The service handles:

* HTTP requests
* JSON parsing
* Authentication headers
* API error handling
* JWT token attachment

Protected requests automatically include the stored Bearer token.

## 6.4 Backend Routing Layer

Express routers map HTTP methods and URLs to their corresponding controller functions.

Authentication requests are handled through `/api/auth`, while note-related requests are handled through `/api/notes`.

## 6.5 Middleware Layer

The middleware layer provides several important responsibilities:

* Authentication
* Error handling
* 404 route handling
* Request logging
* Request processing

## 6.6 Controller Layer

Controllers contain the application's business logic.

Authentication controllers handle registration and login, while note controllers manage note creation, retrieval, modification, and deletion.

## 6.7 Database Layer

Mongoose schemas define the structure, validation rules, and relationships used by the MongoDB collections.

## 6.8 Logging Layer

Pino and pino-http provide structured request logging.

HTTP requests are logged with information such as the HTTP method, URL, request identifier, and response time.

## 6.9 Error Handling Layer

The centralized error handler provides consistent API responses and prevents unnecessary exposure of internal implementation details.

## 6.10 Testing Layer

The testing layer contains isolated frontend component tests and backend API and middleware tests.

---

# 7. Request Lifecycle Example

The following example demonstrates the lifecycle of an authenticated request when a user opens an existing note.

1. The user selects a note from the Dashboard.
2. React Router navigates to `/notes/:id/edit`.
3. The `NoteEditor` component calls `getNoteApi(id)` from the API service.
4. The API service sends an HTTP GET request containing the stored JWT in the Authorization header.
5. Express receives the request and routes it to `/api/notes/:id`.
6. The authentication middleware verifies the JWT and attaches the authenticated user to `req.user`.
7. The note controller searches for the requested note belonging to that user.
8. Mongoose retrieves the document from MongoDB.
9. The controller returns the note as a JSON response.
10. The frontend updates its state and displays the note content through the Tiptap editor.

---

# 8. Project Structure

```text
Notes-App/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Reusable UI components
│   │   ├── context/
│   │   │   └── AuthContext
│   │   ├── layouts/
│   │   │   ├── AppLayout
│   │   │   └── AuthLayout
│   │   ├── pages/
│   │   │   ├── Dashboard
│   │   │   ├── Login
│   │   │   ├── Signup
│   │   │   ├── NoteEditor
│   │   │   └── Profile
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── validation.js
│   │   │   └── storage.js
│   │   └── __tests__/
│   │       └── Frontend test suites
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── jest.config.cjs
│   └── babel.config.cjs
│
├── backend/
│   ├── config/
│   │   └── Database connection
│   ├── controllers/
│   │   ├── Authentication logic
│   │   └── Notes logic
│   ├── middleware/
│   │   ├── authMiddleware
│   │   ├── errorHandler
│   │   └── notFound
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes
│   │   ├── noteRoutes
│   │   └── healthRoutes
│   ├── utils/
│   │   └── logger.js
│   ├── test/
│   │   ├── Test suites
│   │   └── setup.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docs/
├── postman/
├── sonar-project.properties
├── .gitignore
└── README.md
```

---

# 9. Frontend Documentation

The React frontend is initialized using Vite and provides the complete user interface for the application.

## 9.1 Routing

React Router DOM handles client-side routing.

Public routes include:

* `/login`
* `/signup`

Protected application routes include:

* `/`
* `/notes`
* `/notes/new`
* `/notes/:id/edit`
* `/profile`

Protected routes require a valid authentication session.

## 9.2 Reusable Components

The frontend contains reusable components that provide consistency throughout the application.

### Button

Provides standardized interactive buttons with different variants and sizes.

### Input

Provides controlled input fields with labels, validation states, error messages, and accessibility support.

### Loader

Provides visual feedback during asynchronous operations.

### EditorToolbar

Provides formatting controls for the Tiptap rich-text editor.

### NoteCard

Provides a reusable presentation component for displaying note information within the Dashboard.

## 9.3 Pages

### Login and Signup

These pages collect user authentication information and perform client-side validation before making API requests.

The email validation logic uses the deterministic `isValidEmail` function.

### Dashboard

The Dashboard retrieves the authenticated user's notes and displays them through reusable note cards.

It also provides dynamic search and filtering.

### Note Editor

The Note Editor handles both creating and editing notes.

It synchronizes Tiptap's HTML output with the backend request payload.

### Profile

The Profile page displays user information and provides a logout action.

Logging out removes the authentication token from local storage and resets authentication state.

## 9.4 Utilities

### api.js

The API service wraps the native `fetch` API and provides centralized request handling, JSON parsing, authentication headers, and error processing.

### validation.js

The validation utility contains deterministic validation functions used by authentication and other forms.

### storage.js

The storage utility manages client-side persistence related to the authentication session.

---

# 10. Backend Documentation

The backend is implemented using Node.js and Express.js and provides the REST API used by the React frontend.

## 10.1 Application Initialization

The backend separates Express application configuration from server startup.

### app.js

`app.js` configures the Express application and registers:

* CORS
* JSON body parsing
* Pino HTTP logging
* API routes
* Error handling
* 404 handling

This separation makes the application easier to test because the Express application can be imported without binding to a network port.

### server.js

`server.js` is responsible for:

1. Loading the application.
2. Establishing the MongoDB connection.
3. Starting the HTTP server.
4. Listening on the configured port.

## 10.2 Routing and Controllers

Authentication routes are registered under:

```text
/api/auth
```

Notes routes are registered under:

```text
/api/notes
```

Controllers contain the business logic associated with these routes.

## 10.3 Middleware

### authMiddleware

The authentication middleware extracts the Bearer token from the Authorization header, verifies it using `JWT_SECRET`, retrieves the associated user, and attaches the user information to the request.

### errorHandler

The centralized error handler catches application errors and produces standardized JSON responses.

### notFound

The `notFound` middleware handles requests that do not correspond to any registered API route and returns an appropriate 404 response.

---

# 11. Database Design

The application uses MongoDB with Mongoose as its Object Data Modeling layer.

Two primary collections are used.

## 11.1 User Collection

| Field      | Type   | Required | Default | Validation           | Purpose                   |
| ---------- | ------ | -------- | ------- | -------------------- | ------------------------- |
| `name`     | String | Yes      | None    | None                 | User display name         |
| `email`    | String | Yes      | None    | Unique, email format | Authentication identifier |
| `password` | String | Yes      | None    | Minimum 6 characters | Hashed password           |

## 11.2 Note Collection

| Field     | Type     | Required | Default | Validation        | Purpose                |
| --------- | -------- | -------- | ------- | ----------------- | ---------------------- |
| `user`    | ObjectId | Yes      | None    | Reference to User | Note ownership         |
| `title`   | String   | Yes      | None    | None              | Note title             |
| `content` | String   | Yes      | None    | None              | Rich-text HTML content |

Both collections use Mongoose timestamps, which automatically maintain:

* `createdAt`
* `updatedAt`

Note ownership is enforced by including the authenticated user's ID in note queries.

This prevents users from accessing or modifying notes belonging to other accounts.

---

# 12. Authentication and Authorization

The authentication system uses JSON Web Tokens to provide stateless authentication.

The authentication process operates as follows:

1. The user submits registration or login credentials.
2. Passwords are hashed using bcryptjs during account creation.
3. During login, the supplied password is compared against the stored hash.
4. After successful authentication, the backend generates a JWT containing the user's ID.
5. The frontend stores the JWT in local storage.
6. The API service attaches the token to protected requests through the Authorization header.
7. The backend authentication middleware verifies the token.
8. The associated user is retrieved from MongoDB.
9. Note controllers verify ownership using the authenticated user's ID.
10. During logout, the frontend removes the token and resets authentication state.

This authorization mechanism ensures that users can only access and modify their own notes.

---

# 13. API Documentation

## 13.1 Authentication API

### POST /api/auth/signup

**Authentication Required:** No

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Successful Response:** HTTP 201

```json
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "token": "..."
}
```

**Possible Errors:**

* 400 Bad Request
* Missing required fields
* Duplicate email address

### POST /api/auth/login

**Authentication Required:** No

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Successful Response:** HTTP 200

```json
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "token": "..."
}
```

**Possible Errors:**

* 400 Bad Request
* 401 Unauthorized
* Invalid credentials

---

# 14. Notes API

## GET /api/notes

**Authentication Required:** Yes

Requires a valid Bearer token.

**Successful Response:** HTTP 200

```json
[
  {
    "_id": "...",
    "title": "...",
    "content": "..."
  }
]
```

**Purpose:** Retrieves all notes belonging to the authenticated user.

## POST /api/notes

**Authentication Required:** Yes

**Request Body:**

```json
{
  "title": "My Note",
  "content": "<p>Hello World</p>"
}
```

**Successful Response:** HTTP 201

```json
{
  "_id": "...",
  "title": "...",
  "content": "..."
}
```

## GET /api/notes/:id

**Authentication Required:** Yes

**Successful Response:** HTTP 200

```json
{
  "_id": "...",
  "title": "...",
  "content": "..."
}
```

**Possible Errors:**

* 400 Bad Request for an invalid ObjectId
* 404 Not Found when the note does not exist

## PUT /api/notes/:id

**Authentication Required:** Yes

**Request Body:**

```json
{
  "title": "Updated",
  "content": "<p>Updated content</p>"
}
```

**Successful Response:** HTTP 200

```json
{
  "_id": "...",
  "title": "Updated",
  "content": "..."
}
```

## DELETE /api/notes/:id

**Authentication Required:** Yes

**Successful Response:** HTTP 200

```json
{
  "id": "..."
}
```

---

# 15. Validation

Validation is performed at both the client and server levels.

## 15.1 Frontend Validation

Frontend validation provides immediate feedback before network requests are made.

The frontend:

* Checks required fields.
* Validates email addresses.
* Enforces minimum password length.
* Validates note titles and content.
* Validates user input before submitting requests.

The custom deterministic `isValidEmail` function avoids potentially expensive regular-expression backtracking.

## 15.2 Backend Validation

Backend validation provides the final layer of data integrity.

Mongoose schemas enforce required fields and validation rules.

Controllers also validate MongoDB ObjectId values using:

```javascript
mongoose.Types.ObjectId.isValid()
```

This prevents malformed identifiers from causing unexpected database casting errors.

---

# 16. Error Handling

The application implements centralized error handling throughout the backend.

## 16.1 Central Error Handler

The `errorHandler` middleware captures errors generated during request processing and converts them into consistent JSON responses.

The frontend can therefore rely on a predictable response structure containing a `message` property.

## 16.2 Production Safety

Stack traces are exposed during development to assist debugging.

In production, stack traces are not returned to clients, reducing the risk of exposing internal application information.

## 16.3 404 Handling

Requests that do not match any registered Express route are handled by the `notFound` middleware.

The middleware returns a standardized HTTP 404 response.

---

# 17. Logging

Logging is implemented using Pino and pino-http.

The logging system provides fast, structured JSON logging for application monitoring and debugging.

## 17.1 Request Logging

Incoming HTTP requests are recorded with information including:

* HTTP method
* Request URL
* Request identifier
* Response time
* Request and response information where appropriate

## 17.2 Security

Sensitive information is excluded from standard logs.

Passwords, authorization headers, and other sensitive request information are configured for redaction.

## 17.3 Structured Logging

Structured JSON logs make application events easier to search, process, analyze, and integrate with future log aggregation systems.

---

# 18. Testing

The application includes automated tests covering both frontend and backend functionality.

## 18.1 Frontend Testing

The frontend test environment uses:

* Jest
* React Testing Library
* jest-dom
* user-event

The frontend test suite contains 51 verified passing tests across 6 test suites.

The tests cover:

* Component rendering
* User interactions
* Button interactions
* Input handling
* Form validation
* Validation error visibility
* API behavior
* Authentication behavior
* Page functionality
* Protected application behavior

API calls are mocked where appropriate to isolate frontend behavior.

## 18.2 Backend Testing

The backend testing environment uses:

* Mocha
* Chai
* Supertest
* c8

The backend contains 45 verified passing tests covering authentication, middleware, CRUD operations, and authorization behavior.

The tests use Supertest to send HTTP requests directly to the Express application.

The backend tests verify:

* HTTP status codes
* Response structures
* Authentication behavior
* Authorization behavior
* Middleware rejection
* CRUD operations
* Database interactions
* User-specific note access

---

# 19. Code Coverage

Code coverage is generated through the project's testing scripts.

## Frontend

```bash
npm test -- --coverage
```

Jest generates coverage information for the frontend test suite.

## Backend

```bash
npm run test:coverage
```

The backend uses c8 to generate coverage information.

Coverage reports include LCOV files within the respective `coverage` directories.

These LCOV files are also used by SonarQube to evaluate test coverage during static analysis.

The coverage process provides visibility into tested and untested branches and lines of application code.

---

# 20. SonarQube Analysis

SonarQube is integrated into the project to monitor code quality, maintainability, reliability, and security.

The root-level `sonar-project.properties` file defines the source directories, test directories, exclusions, and coverage configuration.

The project distinguishes production source files from test files to ensure that test code does not negatively affect production code quality metrics.

## Analysis Execution

From the project root, the SonarQube scanner can be executed using the configured project environment.

Example:

```powershell
$env:SONAR_TOKEN="<your-token>"
npx sonarqube-scanner
```

The SonarQube instance is configured to analyze the project and evaluate its Quality Gate.

The latest verified analysis resulted in:

* 0 new issues
* New Code Coverage of at least 80%
* Quality Gate: PASSED

Previous issues, including the regular-expression backtracking vulnerability, were addressed during the development and quality-improvement process.

---

# 21. Postman API Testing

A Postman collection is included in the `postman` directory for manual API testing and verification.

The collection covers the authentication and Notes APIs.

The recommended workflow is:

```text
Signup
   |
   v
Login
   |
   v
Create Note
   |
   v
Get Notes
   |
   v
Get Single Note
   |
   v
Update Note
   |
   v
Delete Note
```

The Login request provides the JWT required by protected Notes API requests.

The collection can be used to manually verify:

* User registration
* User authentication
* JWT authentication
* Note creation
* Note retrieval
* Individual note retrieval
* Note updates
* Note deletion
* Protected endpoint behavior
* API response status codes

Requests should be executed in an appropriate sequence because protected Notes API endpoints require a valid authentication token.

---

# 22. Environment Configuration

Environment-specific configuration is documented through the `.env.example` file.

| Variable       | Used By | Purpose                   | Required | Example                             |
| -------------- | ------- | ------------------------- | -------- | ----------------------------------- |
| `PORT`         | Backend | Express server port       | No       | `5000`                              |
| `MONGO_URI`    | Backend | MongoDB connection string | Yes      | `mongodb://localhost:27017/notesdb` |
| `NODE_ENV`     | Backend | Environment mode          | No       | `development`                       |
| `JWT_SECRET`   | Backend | JWT signing secret        | Yes      | `your_jwt_secret_here`              |
| `FRONTEND_URL` | Backend | Allowed CORS origin       | No       | `http://localhost:5173`             |

The `.env` file should contain actual environment-specific values and must not be committed to source control.

---

# 23. Complete Installation Guide

The following procedure can be used to install the application on a clean development machine.

## 23.1 Prerequisites

The following software is required:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database
* Git

For SonarQube analysis, a local SonarQube installation and compatible Java environment are also required.

## 23.2 Clone the Repository

```bash
git clone <repository-url>
cd Notes-App
```

## 23.3 Install Backend Dependencies

```bash
cd backend
npm install
```

## 23.4 Configure Backend Environment

Create a `.env` file inside the `backend` directory.

Use `.env.example` as the reference and configure:

```text
MONGO_URI
JWT_SECRET
PORT
NODE_ENV
FRONTEND_URL
```

At minimum, `MONGO_URI` and `JWT_SECRET` must be configured.

## 23.5 Install Frontend Dependencies

From the project root:

```bash
cd Frontend
npm install
```

## 23.6 Start the Application

Start the backend and frontend development servers separately.

Detailed commands are provided in the next section.

## 23.7 Open the Application

Once both servers are running, open:

```text
http://localhost:5173
```

Register an account and begin using the Notes App.

---

# 24. How to Run the Project

## 24.1 Start the Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

The backend runs on the configured port, with port 5000 used as the default.

## 24.2 Start the Frontend

Open another terminal and run:

```bash
cd Frontend
npm run dev
```

The Vite development server normally makes the application available at:

```text
http://localhost:5173
```

## 24.3 Run Frontend Tests

```bash
cd Frontend
npm test
```

## 24.4 Run Backend Tests

```bash
cd backend
npm test
```

## 24.5 Generate Coverage

Frontend:

```bash
cd Frontend
npm test -- --coverage
```

Backend:

```bash
cd backend
npm run test:coverage
```

---

# 25. Production Build

The React frontend can be built for production using Vite.

Run:

```bash
cd Frontend
npm run build
```

Vite generates the optimized production files inside:

```text
Frontend/dist
```

The generated static files can be hosted using a production web server such as Nginx or deployed to a suitable static hosting platform.

The backend must still be deployed separately unless a production server is configured to serve the frontend assets.

---

# 26. Troubleshooting

## 26.1 MongoDB Connection Failure

### Symptom

The backend fails during startup with a `MongooseServerSelectionError`.

### Solution

Check that:

1. The local MongoDB service is running, or MongoDB Atlas is accessible.
2. The `MONGO_URI` value is correct.
3. If using MongoDB Atlas, the development machine's IP address is permitted.
4. The database credentials are correct.

## 26.2 Frontend Cannot Reach API

### Symptom

Login requests fail or notes cannot be loaded.

### Solution

Verify that:

1. The backend is running.
2. The backend is listening on the expected port.
3. CORS is configured correctly.
4. The frontend is using the correct API base URL.

## 26.3 SonarQube Quality Gate Failure

### Symptom

SonarQube reports insufficient test coverage.

### Solution

Generate fresh coverage reports before running the scanner.

Frontend:

```bash
npm test -- --coverage
```

Backend:

```bash
npm run test:coverage
```

After generating the coverage reports, execute the SonarQube analysis again.

---

# 27. Security Considerations

Security was considered throughout the application's development.

## Password Protection

Plain-text passwords are never stored in the database. Passwords are protected using bcrypt hashing.

## Authentication

Protected API endpoints require a valid JWT.

## Authorization

The backend verifies note ownership using the authenticated user's ID before allowing notes to be accessed, updated, or deleted.

## Input Validation

Validation is performed at both frontend and backend levels.

The frontend uses deterministic validation logic for email input to avoid potentially expensive regular-expression backtracking.

## Sensitive Data Protection

Logging configuration redacts sensitive information such as passwords and authorization tokens.

## Error Information

Production responses do not expose internal stack traces, reducing the risk of information leakage.

## Protected Routes

Frontend route protection prevents unauthenticated users from accessing authenticated application screens.

Backend middleware independently protects API resources, ensuring that frontend restrictions cannot be bypassed to access protected data.

---

# 28. Development Workflow

The development process followed an iterative software engineering workflow.

The general workflow consisted of the following stages:

1. Identify feature requirements or quality issues.
2. Develop the required component, API, or infrastructure.
3. Write unit and integration tests.
4. Execute the automated test suites.
5. Generate code coverage reports.
6. Run SonarQube static analysis.
7. Review detected issues.
8. Refactor and improve the implementation.
9. Re-run tests and analysis.
10. Continue until the required quality criteria are satisfied.

This workflow helped maintain functionality while continuously improving code quality and maintainability.

---

# 29. Quality Assurance

The project was evaluated using multiple levels of automated quality assurance.

| Metric                | Result        |
| --------------------- | ------------- |
| Frontend Tests        | 51 passing    |
| Backend Tests         | 45 passing    |
| Total Automated Tests | 96 passing    |
| New Code Coverage     | At least 80%  |
| SonarQube Issues      | 0 open issues |
| Quality Gate          | PASSED        |

Testing was used to verify application functionality, while SonarQube was used to identify code-quality, reliability, maintainability, and security concerns.

The issues identified during development were reviewed and addressed before the final quality assessment.

The combination of frontend testing, backend testing, coverage analysis, manual API testing, and static code analysis provides multiple layers of verification.

---

# 30. Limitations

Although the application provides a complete full-stack note-management experience, several limitations remain.

## Local SonarQube Deployment

The current SonarQube setup relies on a locally running SonarQube instance and manually executed analysis.

Each developer therefore needs to configure and run the local SonarQube environment when performing code-quality analysis.

## End-to-End Testing

The project contains comprehensive frontend and backend automated tests, but full browser-based end-to-end testing using a framework such as Cypress or Playwright has not yet been implemented.

## Client-Side Search

The current search functionality operates on notes already retrieved by the frontend. For very large datasets, server-side search could provide better scalability.

---

# 31. Future Improvements

Several improvements could be implemented in future versions of the application.

## Password Recovery

A secure password recovery system could be introduced using email verification and time-limited reset tokens.

## Pagination

The Notes API could support pagination to improve performance when users have a large number of notes.

## Note Sharing

A controlled note-sharing feature could allow users to generate read-only public URLs for selected notes.

## CI/CD Integration

GitHub Actions could be introduced to automatically execute:

* Frontend tests
* Backend tests
* Coverage generation
* SonarQube analysis

This would allow quality checks to be performed automatically whenever changes are pushed or pull requests are created.

## Advanced Search

Search functionality could be moved to the backend and enhanced with indexing, filtering, sorting, and pagination.

## Rich-Text Enhancements

The editor could be expanded with additional formatting capabilities, image support, links, code blocks, and other advanced rich-text features.

---

# 32. Conclusion

The Notes App successfully fulfills its objective of providing a secure, responsive, and functional full-stack MERN application for personal note management.

The application combines a React frontend with a Node.js and Express.js REST API and a MongoDB database managed through Mongoose.

The project incorporates several important software engineering practices, including JWT-based authentication, password hashing, server-side authorization, centralized error handling, structured logging, input validation, automated testing, code coverage analysis, and SonarQube-based quality assessment.

The frontend provides a responsive and user-friendly interface for authentication, note management, searching, editing, individual note viewing, and profile management. Reusable components and layouts help maintain consistency throughout the application.

The backend provides a modular REST API with protected endpoints, structured logging, centralized error handling, and ownership-based authorization.

Automated testing provides coverage across the frontend and backend, while Postman provides an additional mechanism for manual API verification. SonarQube analysis provides an additional layer of quality and security verification.

The final quality assessment achieved 96 verified passing automated tests, zero open SonarQube issues, new-code coverage of at least 80%, and a passed Quality Gate.

Overall, the project establishes a strong foundation for a production-oriented note management platform and provides a scalable architecture for future improvements such as password recovery, pagination, note sharing, advanced search, richer editing capabilities, and automated CI/CD integration.

---

# 33. Appendices

## Appendix A — Application URLs

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

### SonarQube

```text
http://localhost:9000
```

The SonarQube URL applies when the local SonarQube server is running.

---

## Appendix B — Important Commands

### Install Backend

```bash
cd backend
npm install
```

### Install Frontend

```bash
cd Frontend
npm install
```

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd Frontend
npm run dev
```

### Frontend Tests

```bash
cd Frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Coverage

```bash
cd Frontend
npm test -- --coverage
```

### Backend Coverage

```bash
cd backend
npm run test:coverage
```

### Frontend Production Build

```bash
cd Frontend
npm run build
```

### SonarQube Analysis

```powershell
$env:SONAR_TOKEN="<your-token>"
npx sonarqube-scanner
```

---

## Appendix C — API Endpoint Summary

| Method | Endpoint           | Authentication | Purpose                  |
| ------ | ------------------ | -------------- | ------------------------ |
| POST   | `/api/auth/signup` | No             | Register a new user      |
| POST   | `/api/auth/login`  | No             | Authenticate a user      |
| GET    | `/api/notes`       | Yes            | Retrieve user's notes    |
| POST   | `/api/notes`       | Yes            | Create a note            |
| GET    | `/api/notes/:id`   | Yes            | Retrieve a specific note |
| PUT    | `/api/notes/:id`   | Yes            | Update a note            |
| DELETE | `/api/notes/:id`   | Yes            | Delete a note            |

---

## Appendix D — Test Summary

| Test Area                     | Framework                    | Result        |
| ----------------------------- | ---------------------------- | ------------- |
| Frontend Components and Pages | Jest + React Testing Library | 51 passing    |
| Backend APIs and Middleware   | Mocha + Chai + Supertest     | 45 passing    |
| Total Automated Tests         | Frontend + Backend           | 96 passing    |
| Frontend Coverage             | Jest                         | Generated     |
| Backend Coverage              | c8                           | Generated     |
| Static Analysis               | SonarQube                    | 0 open issues |
| Quality Gate                  | SonarQube                    | PASSED        |

---

## Appendix E — Required Environment Variables

```text
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
NODE_ENV=development
JWT_SECRET=<your-secret>
FRONTEND_URL=http://localhost:5173
```

Actual secrets and database credentials must be stored in the local `.env` file and must not be committed to the repository.

---

## Appendix F — Application Feature Summary

| Area              | Functionality                               |
| ----------------- | ------------------------------------------- |
| Authentication    | Signup, login, logout, JWT authentication   |
| Authorization     | User-specific access to notes               |
| Notes             | Create, read, update, delete                |
| Rich Text         | Tiptap editor                               |
| Dashboard         | Notes listing, loading states, empty states |
| Search            | Client-side title and content filtering     |
| Profile           | User information and note count             |
| Navigation        | React Router DOM                            |
| Responsive Design | Mobile and desktop layouts                  |
| Backend           | RESTful Express API                         |
| Database          | MongoDB with Mongoose                       |
| Validation        | Frontend and backend validation             |
| Error Handling    | Centralized error and 404 handling          |
| Logging           | Pino and pino-http                          |
| Frontend Testing  | Jest and React Testing Library              |
| Backend Testing   | Mocha, Chai, Supertest                      |
| Coverage          | Jest and c8                                 |
| API Testing       | Postman                                     |
| Code Quality      | SonarQube                                   |
