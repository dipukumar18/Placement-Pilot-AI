export const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

export const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
      errors: [],
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
      errors: [],
    });
  }

  if (error.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.isOperational ? error.message : "Internal server error",
    errors: [],
  });
};
