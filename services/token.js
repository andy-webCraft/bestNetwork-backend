import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

export const refreshTokenConfig = { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true };

export const tokenService = {
  createTokens: (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
  },

  saveRefreshToken: async (userId, refreshToken) => {
    let token = await Token.findOne({ user: userId });

    if (token) {
      token.refreshToken = refreshToken;
      await token.save();
      return;
    }

    token = await Token.create({ user: userId, refreshToken });
    return token;
  },

  getRefreshToken: async (refreshToken) => {
    const token = await Token.findOne({ refreshToken });
    return token;
  },

  validateAccessToken: (accessToken) => {
    try {
      const validateResult = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return validateResult;
    } catch (error) {
      return null;
    }
  },

  validateRefreshToken: (refreshToken) => {
    try {
      const validateResult = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return validateResult;
    } catch (error) {
      return null;
    }
  },

  deleteRefreshToken: async (refreshToken) => {
    const token = await Token.findOneAndDelete({ refreshToken });
    return token;
  },
};
