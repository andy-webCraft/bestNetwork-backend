import ApiError from "../services/error.js";
import { tokenService } from "../services/token.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) return next(ApiError.unauthorizedUser());

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = tokenService.validateAccessToken(token);
    if (!verified) return next(ApiError.unauthorizedUser());

    req.userId = verified.id;

    next();
  } catch (error) {
    next(error);
  }
};
