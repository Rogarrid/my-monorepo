export const signUpSchema = {
  body: {
    type: "object",
    required: ["name", "email", "role", "password"],
    properties: {
      name: { type: "string" },
      role: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
};

export const updateUserSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

export const userIdSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
};

export const refreshTokenSchema = {
  body: {
    type: "object",
    properties: {
      refreshToken: { type: "string" },
    },
    required: ["refreshToken"],
  },
};
