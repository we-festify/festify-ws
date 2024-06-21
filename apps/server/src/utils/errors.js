class BadRequestError extends Error {
  constructor(message, errorCode = "BAD_REQUEST") {
    super(message);
    this.statusCode = 400;
    this.errorCode = errorCode;
  }
}

class NotFoundError extends Error {
  constructor(message, errorCode = "NOT_FOUND") {
    super(message);
    this.statusCode = 404;
    this.errorCode = errorCode;
  }
}

class UnauthorizedError extends Error {
  constructor(message, errorCode = "UNAUTHORIZED") {
    super(message);
    this.statusCode = 401;
    this.errorCode = errorCode;
  }
}

class ForbiddenError extends Error {
  constructor(message, errorCode = "FORBIDDEN") {
    super(message);
    this.statusCode = 403;
    this.errorCode = errorCode;
  }
}

const handleErrors = (err, req, res, next) => {
  const { statusCode, errorCode } = err;
  const { message } = err;
  sendError(res, statusCode, message, errorCode);
};

const sendError = (res, statusCode, message, errorCode = "ERROR") => {
  try {
    return res.status(statusCode || 500).json({
      status: "error",
      statusCode: statusCode || 500,
      message: message || "Internal Server Error",
      errorCode,
    });
  } catch (err) {
    console.log("Error while sending error response", err.message);
  }
};

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  handleErrors,
  sendError,
};
