const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "This record already exists";
  }

  // MySQL foreign key constraint
  else if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400;
    message = "Referenced record does not exist";
  }

  // Cannot delete because another record references it
  else if (err.code === "ER_ROW_IS_REFERENCED_2") {
    statusCode = 409;
    message = "This record is being used by another record";
  }

  // Cannot insert NULL into a required column
  else if (err.code === "ER_BAD_NULL_ERROR") {
    statusCode = 400;
    message = "A required field is missing";
  }

  // Database connection error
  else if (err.code === "ECONNREFUSED") {
    statusCode = 503;
    message = "Database service unavailable";
  }

  // Don't expose internal errors to clients
  if (statusCode === 500) {
    message = "Internal Server Error";
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
