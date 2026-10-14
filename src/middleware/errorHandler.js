const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError
} = require("sequelize");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (
    err instanceof ValidationError &&
    !(err instanceof UniqueConstraintError)
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map(error => error.message)
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: "A record with this unique value already exists"
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      success: false,
      message: "Related record constraint failed"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

module.exports = errorHandler;
