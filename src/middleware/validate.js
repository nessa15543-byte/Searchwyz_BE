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
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    return res.status(400).json({ success: false, message: "Bad request" });
  }
};