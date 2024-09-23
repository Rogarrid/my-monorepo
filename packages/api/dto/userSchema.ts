export const signUpSchema = {
  description: "Schema for signing up a new user",
  tags: ["User"],
  body: {
    type: "object",
    required: ["name", "email", "role", "password"],
    properties: {
      name: { type: "string", description: "The user's name" },
      role: { type: "string", description: "The user's role" },
      email: {
        type: "string",
        format: "email",
        description: "The user's email",
      },
      password: { type: "string", description: "The user's password" },
    },
  },
  response: {
    201: {
      description: "User created successfully",
      type: "object",
      properties: {
        user: { type: "object", description: "The created user object" },
        accessToken: { type: "string", description: "JWT access token" },
      },
    },
  },
};

export const loginSchema = {
  description: "Schema for user login",
  tags: ["User"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "The user's email",
      },
      password: { type: "string", description: "The user's password" },
    },
  },
  response: {
    200: {
      description: "Login successful",
      type: "object",
      properties: {
        accessToken: { type: "string", description: "JWT access token" },
        refreshToken: { type: "string", description: "JWT refresh token" },
      },
    },
    401: {
      description: "Invalid credentials",
    },
  },
};

export const updateUserSchema = {
  description: "Schema for updating a user",
  tags: ["User"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", description: "The user's ID" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string", description: "The user's updated name" },
      email: {
        type: "string",
        format: "email",
        description: "The user's updated email",
      },
      password: {
        type: "string",
        minLength: 6,
        description: "The user's updated password",
      },
    },
  },
  response: {
    200: {
      description: "User updated successfully",
      type: "object",
      properties: {
        user: { type: "object", description: "The updated user object" },
      },
    },
  },
};

export const userIdSchema = {
  description: "Schema for retrieving a user by ID",
  tags: ["User"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", description: "The user's ID" },
    },
    required: ["id"],
  },
  response: {
    200: {
      description: "User retrieved successfully",
      type: "object",
      properties: {
        user: { type: "object", description: "The retrieved user object" },
      },
    },
    404: {
      description: "User not found",
    },
  },
};

export const refreshTokenSchema = {
  description: "Schema for refreshing access tokens",
  tags: ["User"],
  body: {
    type: "object",
    properties: {
      refreshToken: { type: "string", description: "The refresh token" },
    },
    required: ["refreshToken"],
  },
  response: {
    200: {
      description: "Token refreshed successfully",
      type: "object",
      properties: {
        accessToken: { type: "string", description: "New JWT access token" },
        refreshToken: { type: "string", description: "New JWT refresh token" },
      },
    },
    401: {
      description: "Invalid refresh token",
    },
  },
};
