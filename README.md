# Personal Blogging Platform API

A robust RESTful API for a Personal Blogging Platform built with **Node.js**, **Express.js**, and **MongoDB**. The API supports user registration, JWT-based authentication, full CRUD operations for blog posts with ownership enforcement, comments, likes, and user profile management.

---

## Table of Contents

- [Database Choice](#database-choice)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-routes)
  - [Posts](#post-routes)
  - [Comments](#comment-routes)
  - [Profile](#profile-routes)
  - [Admin](#admin-routes)
- [Authentication Flow](#authentication-flow)
- [Validation Rules](#validation-rules)
- [Security Measures](#security-measures)
- [API Documentation](#api-documentation)

---

## Database Choice

**MongoDB** (via Mongoose) was chosen for the following reasons:

- **Flexible schema**: Blog posts and comments naturally vary in structure; MongoDB's document model accommodates this without rigid migrations.
- **JSON-native storage**: Blog content is already JSON-shaped, so there is zero impedance mismatch between the API layer and the database.
- **Scalability**: MongoDB scales horizontally with ease, which is important for a content platform that can grow rapidly.
- **Rich querying**: Mongoose provides a powerful query API with full-text search, pagination, filtering, and population (joins) out of the box.
- **Managed hosting**: MongoDB Atlas provides free-tier cloud hosting, making zero-config deployment straightforward.

**Schema relationships:**

| Entity | Fields |
|--------|--------|
| `User` | `_id`, `name`, `email`, `password` (hashed), `role`, `createdAt`, `updatedAt` |
| `Post` | `_id`, `title`, `slug`, `content`, `author` (ref → User), `views`, `likes`, `createdAt`, `updatedAt` |
| `Comment` | `_id`, `content`, `post` (ref → Post), `user` (ref → User), `createdAt`, `updatedAt` |

A **One-to-Many** relationship exists between `User` and `Post`: one user can author many posts.

---

## Features

- **JWT Authentication**: Signup, login, logout, and password reset via email OTP.
- **Ownership-based Authorization**: Users can only update or delete their own posts/comments.
- **Full Post CRUD**: Create, list, view, update, and delete blog posts.
- **Comment System**: Nested comments per post.
- **Like / Unlike**: Toggle likes and dislikes on posts.
- **Profile Management**: Users can view, update, and delete their own profile.
- **Admin Panel**: Admins can manage all users.
- **Pagination, Filtering & Search**: Query posts with `?page`, `?limit`, `?keyword`, `?sort`.
- **Swagger UI**: Interactive API docs at `/api-docs`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | MongoDB (Mongoose ODM) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcrypt` |
| Validation | `express-validator` |
| API Docs | `swagger-jsdoc` + `swagger-ui-express` |
| Security | `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `sanitize-html` |
| Email | `nodemailer` |

---

## Project Structure

```
blog-api/
├── config/
│   ├── connect.js          # MongoDB connection
│   └── swagger.js          # OpenAPI spec configuration
├── controllers/
│   ├── authCtrl.js         # Register, login, logout, password reset
│   ├── postCtrl.js         # Post CRUD + likes
│   ├── commentCtrl.js      # Comment CRUD
│   ├── profileCtrl.js      # My profile operations
│   └── adminCtrl.js        # Admin user management
├── middlewares/
│   ├── authMiddleware.js   # JWT verification
│   ├── roleMiddleware.js   # Role-based access control
│   ├── errorMiddleware.js  # Global error handler
│   ├── filterMiddleware.js # Query filter injection
│   └── validatorMiddleware.js # express-validator error collector
├── models/
│   ├── userModel.js        # User schema (bcrypt pre-save hook)
│   ├── postModel.js        # Post schema (author ref → User)
│   └── commentModel.js     # Comment schema
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── profileRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── apiError.js         # Custom error class
│   ├── apiFeatures.js      # Pagination, filtering, sorting
│   ├── factoryHandler.js   # Generic CRUD factory
│   ├── generateTokens.js   # JWT creation + cookie setter
│   ├── generateResetCode.js
│   ├── sendEmail.js
│   ├── emailTemplates.js
│   └── validators/
│       ├── authValidator.js
│       ├── postValidator.js
│       ├── commentValidator.js
│       ├── profileValidator.js
│       └── adminValidator.js
├── .env                    # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js               # Entry point
```

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- A MongoDB connection string (free [MongoDB Atlas](https://cloud.mongodb.com) cluster works)
- An email account for password reset emails (e.g. Gmail App Password)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Bakry-186/blog-api.git
cd blog-api

# 2. Install dependencies
npm install

# 3. Create .env file (see Environment Variables section below)
cp .env.example .env   # then edit .env with your values

# 4. Start the development server (auto-restarts on file changes)
npm run dev

# 5. OR start in production mode
npm start
```

The server will start on `http://localhost:3000`.  
Swagger UI is available at `http://localhost:3000/api-docs`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

# MongoDB connection string
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/blog

# JWT secret (use a long random string in production)
JWT_SECRET_ACCESS_KEY=your_super_secret_jwt_key_here

# Email credentials for password reset (Gmail example)
NODE_CODE_SENDING_EMAIL_ADDRESS=yourname@gmail.com
NODE_CODE_SENDING_EMAIL_PASSWORD=your_gmail_app_password
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `POST` | `/auth/logout` | Public | Clear auth cookie |
| `POST` | `/auth/forgot-password` | Public | Send 6-digit reset code to email |
| `POST` | `/auth/verify-reset-code` | Public | Verify the reset code |
| `PUT` | `/auth/reset-password` | Public | Reset password with verified code |

### Post Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/posts` | **Public** | List all posts (paginated, filterable) |
| `POST` | `/posts` | **Private** | Create a new post (linked to logged-in user) |
| `GET` | `/posts/:id` | **Public** | Get a single post (increments view count) |
| `PUT` | `/posts/:id` | **Private (owner)** | Update a post (only if user is the author) |
| `DELETE` | `/posts/:id` | **Private (owner)** | Delete a post (only if user is the author) |
| `POST` | `/posts/:id/like` | **Private** | Like a post |
| `DELETE` | `/posts/:id/like` | **Private** | Remove like from a post |
| `POST` | `/posts/:id/unlike` | **Private** | Unlike a post |
| `DELETE` | `/posts/:id/unlike` | **Private** | Remove unlike from a post |

**Query parameters for `GET /posts`:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `page` | integer | `?page=2` | Page number (default: 1) |
| `limit` | integer | `?limit=5` | Items per page (default: 10) |
| `keyword` | string | `?keyword=node` | Full-text search in title and content |
| `sort` | string | `?sort=-createdAt` | Sort field (prefix `-` for descending) |

### Comment Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/posts/:postId/comments` | **Public** | List all comments for a post |
| `POST` | `/posts/:postId/comments` | **Private** | Create a comment on a post |
| `PUT` | `/comments/:id` | **Private (owner)** | Update a comment |
| `DELETE` | `/comments/:id` | **Private (owner)** | Delete a comment |

### Profile Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/profiles/me` | **Private** | Get current user's profile |
| `PUT` | `/profiles/me` | **Private** | Update current user's profile |
| `DELETE` | `/profiles/me` | **Private** | Delete current user's account |
| `PUT` | `/profiles/change-password` | **Private** | Change current user's password |
| `GET` | `/profiles/me/posts` | **Private** | Get posts created by the current user |
| `GET` | `/profiles/me/comments` | **Private** | Get comments made by the current user |

### Admin Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | **Admin** | List all users |
| `POST` | `/users` | **Admin** | Create a user |
| `GET` | `/users/:id` | **Admin** | Get a specific user |
| `PUT` | `/users/:id` | **Admin** | Update a user |
| `DELETE` | `/users/:id` | **Admin** | Delete a user |
| `PUT` | `/users/change-password/:id` | **Admin** | Change a user's password |

---

## Authentication Flow

1. **Register**: `POST /api/v1/auth/register` with `{ name, email, password, passwordConfirm }`
2. **Login**: `POST /api/v1/auth/login` with `{ email, password }` → response includes a `token` field
3. **Use the token**: Add `Authorization: Bearer <token>` header to all protected requests
4. **Token expiry**: Tokens expire after **7 days**

---

## Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required, string, 2–32 characters |
| `email` | Required, valid email format, must be unique |
| `password` | Required, string, **minimum 8 characters** |
| `passwordConfirm` | Must match `password` |
| `post.title` | Required, minimum 3 characters |
| `post.content` | Required, minimum 10 characters |
| `comment.content` | Required, minimum 1 character |

All validation errors return **HTTP 400** with a JSON array of error messages.

---

## Security Measures

| Measure | Implementation |
|---------|---------------|
| Password hashing | `bcrypt` with salt rounds = 10 (pre-save hook on User model) |
| JWT auth | `jsonwebtoken` — token in response body + `HttpOnly` cookie |
| Rate limiting | `express-rate-limit` — 100 requests/hour per IP on `/api/*` |
| Security headers | `helmet` |
| NoSQL injection | `express-mongo-sanitize` sanitizes `req.body` and `req.params` |
| XSS protection | `sanitize-html` strips all HTML tags from string inputs |
| Ownership checks | Update/delete validates that `post.author === req.user._id` |
| `.env` secrets | Sensitive config kept out of source control via `.gitignore` |

---

## API Documentation

Interactive Swagger UI is available once the server is running:

```
http://localhost:3000/api-docs
```

**To test protected endpoints in Swagger UI:**
1. Call `POST /auth/login` and copy the `token` from the response
2. Click the **Authorize** 🔒 button at the top of the Swagger page
3. Enter `Bearer <your_token>` in the `bearerAuth` field
4. All subsequent requests will include the token automatically

The spec is auto-generated from JSDoc `@swagger` annotations in the route files using `swagger-jsdoc`.

---

## Error Handling

All errors are handled through a global Express error middleware and return consistent JSON:

```json
{
  "status": "fail",
  "message": "Descriptive error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request – validation failed |
| `401` | Unauthorized – no/invalid/expired token |
| `403` | Forbidden – authenticated but not the resource owner |
| `404` | Not Found – resource does not exist |
| `429` | Too Many Requests – rate limit exceeded |
| `500` | Internal Server Error |

---

## License

MIT License.
