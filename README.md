# Blog API

A full-fledged API for a blog platform built with **Node.js** and **Express.js**, featuring authentication, authorization, CRUD operations for posts and comments, user profiles, and various security measures.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Routes](#routes)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [Profile Routes](#profile-routes)
  - [Post Routes](#post-routes)
  - [Comment Routes](#comment-routes)
- [Security Measures](#security-measures)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- **User Authentication**: JWT authentication, signup, login, logout, password reset.
- **Role-Based Authorization**: Admin and Author roles for controlling access.
- **CRUD Operations for Posts**: Create, read, update, and delete blog posts.
- **CRUD Operations for Comments**: Create, read, update, and delete comments on posts.
- **Profile Management**: Users can view, update, and delete their profiles.
- **Security**: Protection against XSS, NoSQL injection, and rate-limiting.

---

## Technologies

- **Node.js**: Runtime environment for building server-side applications.
- **Express.js**: Web framework for handling routes and middleware.
- **MongoDB**: NoSQL database for storing user and post data.
- **JWT (JSON Web Tokens)**: Used for authenticating users.
- **Mongoose**: ODM for MongoDB.
- **Helmet**: Middleware to secure HTTP headers.
- **Cors**: Middleware to handle cross-origin requests.
- **Rate Limit**: Middleware for limiting the number of requests from a user.
- **Mongo Sanitize**: Prevents NoSQL injection.
- **Sanitize HTML**: Protects against XSS attacks.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Bakry-186/blog-api.git
   cd blog-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and set your environment variables:
   ```bash
   PORT=3000
   MONGO_URI=<mongodb+srv://<username>:<password>@your-cluster.mongodb.net/blog>
   JWT_SECRET=<your_jwt_secret_key>
   NODE_CODE_SENDING_EMAIL_ADDRESS=<your_email@example.com>
   NODE_CODE_SENDING_EMAIL_PASSWORD=<your_app_password>
   ```

4. Start the server:
   ```bash
   npm start
   ```

---

## Routes

### Authentication Routes

- **POST** `/api/v1/auth/signup`: User registration
- **POST** `/api/v1/auth/login`: User login
- **POST** `/api/v1/auth/logout`: Logout the user
- **POST** `/api/v1/auth/forgot-password`: Request password reset
- **POST** `/api/v1/auth/verify-reset-code`: Verify reset password code
- **PUT** `/api/v1/auth/reset-password`: Reset user password

### User Routes

- **GET** `/api/v1/users`: Get all users (Admin only)
- **POST** `/api/v1/users`: Create a new user (Admin only)
- **GET** `/api/v1/users/:id`: Get specific user details (Admin only)
- **PUT** `/api/v1/users/:id`: Update user details (Admin only)
- **DELETE** `/api/v1/users/:id`: Delete a user (Admin only)
- **PUT** `/api/v1/users/change-password/:id`: Change user password (Admin only)

### Profile Routes

- **GET** `/api/v1/profiles/me`: Get current user's profile
- **PUT** `/api/v1/profiles/me`: Update current user's profile
- **DELETE** `/api/v1/profiles/me`: Delete current user's profile
- **PUT** `/api/v1/profiles/me/change-password`: Change current user's password
- **GET** `/api/v1/profiles/me/posts`: Get posts created by the current user (Author role)
- **GET** `/api/v1/profiles/me/comments`: Get comments made by the current user

### Post Routes

- **GET** `/api/v1/posts`: Get all posts
- **POST** `/api/v1/posts`: Create a new post (Author role)
- **GET** `/api/v1/posts/:id`: Get a specific post and increase views
- **PUT** `/api/v1/posts/:id`: Update a specific post (Admin or Author)
- **DELETE** `/api/v1/posts/:id`: Delete a specific post (Admin or Author)
- **POST** `/api/v1/posts/:id/like`: Like a post
- **DELETE** `/api/v1/posts/:id/like`: Remove like from post
- **POST** `/api/v1/posts/:id/unlike`: Unlike a post
- **DELETE** `/api/v1/posts/:id/unlike`: Remove unlike from post

### Comment Routes

- **GET** `/api/v1/posts/:postId/comments`: Get all comments for specific post
- **POST** `/api/v1/posts/:postId/comments`: Create a new comment for specific post
- **PUT** `/api/v1/comments/:id`: Update a specific comment
- **DELETE** `/api/v1/comments/:id`: Delete a specific comment

---

## Security Measures

- **Helmet**: Adds security headers to the application to protect against common vulnerabilities.
- **Rate Limiting**: Protects the API from being overwhelmed by too many requests.
- **Data Sanitization**: Ensures that input from users (e.g., `req.body`, `req.params`, `req.query`) is cleaned to prevent NoSQL injection attacks.
- **XSS Protection**: Ensures that user input is sanitized to avoid cross-site scripting (XSS) attacks.
- **JWT Authentication**: Used for securing routes and authenticating users.
- **Role-Based Access Control**: Only authorized users (Admin/Author) can perform specific actions (e.g., create, update, delete posts).
- **Input Validation**: Uses custom validators (via express-validator) to ensure that incoming data (e.g., email, password, post content) meets the expected format and constraints before processing.

---

## Error Handling

- **Custom API Error**: All errors are handled through a custom `ApiError` class.
- **Global Error Middleware**: Handles errors globally by catching any unhandled exceptions and sending a standardized error response.

---

## License

MIT License.
