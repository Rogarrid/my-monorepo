/**
 * Handles and formats error messages for API responses.
 * @param error - The error object caught from the application.
 * @param reply - The Fastify reply object used to send responses.
 * @returns The formatted error response sent to the client.
 */
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
    // Establecemos un código de respuesta si está presente
    const statusCode = error.statusCode || 400; // o el código que corresponda
    return reply.code(statusCode).send({
      errorCode: error.code,
      message: error.meta?.cause || "An error occurred",
    });
  }

  if (error.message) {
    const statusCode = error.statusCode || 500;
    return reply.code(statusCode).send({
      code: statusCode,
      message: error.message,
    });
  }

  return reply.code(500).send({
    code: 500,
    message: "An unknown error occurred.",
  });
}
