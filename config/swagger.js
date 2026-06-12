import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Blogging Platform API",
      version: "1.0.0",
      description:
        "A RESTful API for a Personal Blogging Platform. Supports user registration/login with JWT, full CRUD for blog posts with ownership enforcement, comments, likes, and user profiles.\n\n**How to authenticate:**\n1. Call `POST /auth/register` or `POST /auth/login`\n2. Copy the `token` value from the response\n3. Click the **Authorize** button above and enter: `Bearer <your_token>`",
      contact: {
        name: "Blog API Support",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter the JWT token returned from /auth/login or /auth/register",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "Authorization",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            role: { type: "string", enum: ["admin", "author", "user"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Post: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            title: { type: "string", example: "My First Post" },
            slug: { type: "string", example: "my-first-post" },
            content: { type: "string", example: "Post body content here..." },
            author: { $ref: "#/components/schemas/User" },
            views: { type: "integer", example: 42 },
            likes: { type: "array", items: { type: "string" } },
            unLikes: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            content: { type: "string", example: "Great post!" },
            post: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            user: { $ref: "#/components/schemas/User" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
