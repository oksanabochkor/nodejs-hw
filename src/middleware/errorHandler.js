import createHttpError from 'http-errors';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};