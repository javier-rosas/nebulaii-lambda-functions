import jwt from "jsonwebtoken";

/**
* Verifies the JWT token provided in the HTTP headers of the incoming request.
* @param {Object} options - The options for the middleware.
* @param {string} options.secret - The JWT secret key.
* @returns {Object} The middleware object.
**/
export function verifyTokenMiddleware(options) {
  return {
    before: (handler, next) => {
      const token = handler.event.headers.authorization;
      if (!token) {
        return next(new Error("Authorization token missing"));
      }
      try {
        const decoded = jwt.verify(token, options.secret);
        handler.event.user = decoded;
        next();
      } catch (err) {
        console.log(err);
        next(new Error("Invalid token"));
      }
    },
  };
};