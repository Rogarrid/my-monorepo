export function getErrorMessage(error: any, reply: any) {
  if (error.name === "TokenExpiredError") {
    return reply.code(401).send({
      code: 401,
      message: "Token has expired, please log in again.",
    });
  }

  if (error.name === "JsonWebTokenError") {
    return reply.code(400).send({
      code: 400,
      message: "Invalid token, please provide a valid token.",
    });
  }

  if (error.code) {
    return reply.send({
      errorCode: error.code,
      message: error.meta?.cause || "An error occurred",
    });
  }

  if (error.message) {
    return reply.send({
      code: error.statusCode || 500,
      message: error.message,
    });
  }

  return reply.code(500).send({
    code: 500,
    message: "An unknown error occurred.",
  });
}
