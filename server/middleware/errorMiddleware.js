/**
 * @desc A custom error class for handling API errors.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @desc Middleware to handle all thrown errors.
 * It sends a structured JSON response based on the error.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('ERROR ', err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went very wrong!',
  });
};

/**
 * @desc A wrapper for async functions to catch errors and pass them to the global error handler.
 * @param {Function} fn - The async controller function to wrap.
 * @returns {Function} A new function that handles errors.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export { AppError, errorHandler, catchAsync };