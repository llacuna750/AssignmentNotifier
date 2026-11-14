const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const mysqlErrors = {
    ER_DUP_ENTRY: {
      statusCode: 409,
      message: "Record already exists.",
    },

    ER_NO_REFERENCED_ROW_2: {
      statusCode: 400,
      message: "Referenced record does not exist.",
    },

    ER_ROW_IS_REFERENCED_2: {
      statusCode: 409,
      message: "Cannot delete this record because it is being used.",
    },

    ER_BAD_NULL_ERROR: {
      statusCode: 400,
      message: "A required field is missing.",
    },

    ER_DATA_TOO_LONG: {
      statusCode: 400,
      message: "Input value is too long.",
    },
  };
  
  const databaseError = mysqlErrors[err.code];

  const statusCode = databaseError?.statusCode || err.statusCode || 500;

  const message =
    databaseError?.message ||
    (statusCode === 500 ? "Internal Server Error." : err.message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
