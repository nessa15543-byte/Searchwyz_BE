import { APIError } from "../utils/APIError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      ...req.body,
      ...req.params,
      ...req.query,
    });
    req.validated = parsed;
    return next();
  } catch (err) {
    if (err.issues) {
      return next(
        APIError.badRequest(
          err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
        )
      );
    }
    return next(APIError.badRequest("Bad request"));
  }
};