export class APIError extends Error {
  constructor(message, statusCode = 500, code = "SERVER_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }

  static badRequest(message = "Bad request") {
    return new APIError(message, 400, "BAD_REQUEST");
  }

  static unauthorized(message = "Unauthorized") {
    return new APIError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new APIError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Not found") {
    return new APIError(message, 404, "NOT_FOUND");
  }

  static conflict(message = "Conflict") {
    return new APIError(message, 409, "CONFLICT");
  }

  static tooMany(message = "Too many requests") {
    return new APIError(message, 429, "TOO_MANY_REQUESTS");
  }

  static internal(message = "Server error") {
    return new APIError(message, 500, "INTERNAL");
  }
}