export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    message: status === 500 ? "Something went wrong" : error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};
