class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorizedUser() {
    return new ApiError(401, "The user is not unauthorized");
  }

  static accessDenied() {
    return new ApiError(403, "Access denied");
  }

  static notFound() {
    return new ApiError(404, "Resource not found");
  }
}

export default ApiError;
