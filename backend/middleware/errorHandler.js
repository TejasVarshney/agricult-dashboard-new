import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  // Log error for debugging
  console.error(`[Error] ${status} - ${message}`);
  console.error(err.stack);

  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; 