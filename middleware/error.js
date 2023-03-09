import ApiError from "../services/error.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🐞 ERROR:", err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
