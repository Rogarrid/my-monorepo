export function getErrorMessage(error: any, reply: any) {
  if (error.code) {
    return reply.send({
      errorCode: error.code,
      message: error.meta.cause,
    });
  }
  if (error.message) {
    console.log(error);
    return reply.send({
      code: error.statusCode,
      message: error.message,
    });
  }
}
