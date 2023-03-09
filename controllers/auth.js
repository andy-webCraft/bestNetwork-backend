import bcrypt from "bcrypt";
import User from "../models/User.js";
import ApiError from "../services/error.js";
import { fileService } from "../services/file.js";
import { refreshTokenConfig, tokenService } from "../services/token.js";

/* REGISTER NEW USER */
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, friends, location, occupation } = req.body;
    const picturePath = req.file ? fileService.getFullPath(req.file) : null;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    await newUser.save();

    res.status(201).json({ message: "New user has been registered" });
  } catch (error) {
    next(error);
  }
};

/* LOGGIN USER */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }, ["+password"]);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(ApiError.badRequest("Invalid credentials"));

    const { accessToken, refreshToken } = tokenService.createTokens({ id: user._id });
    await tokenService.saveRefreshToken(user._id, refreshToken);

    user.password = undefined;

    res.cookie("refreshToken", refreshToken, refreshTokenConfig);
    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

/* LOGOUT USER */
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await tokenService.deleteRefreshToken(refreshToken);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    next(error);
  }
};

/* REFRESH TOKENS */
export const refreshTokens = async (req, res, next) => {
  try {
    const { refreshToken: oldToken } = req.cookies;

    const { id: userId } = tokenService.validateRefreshToken(oldToken);
    const tokenFromDb = await tokenService.getRefreshToken(oldToken);
    if (!userId || !tokenFromDb) {
      return next(ApiError.badRequest("Refresh token not found"));
    }

    await tokenService.deleteRefreshToken(oldToken);

    const user = await User.findById(userId);
    const { accessToken, refreshToken } = tokenService.createTokens({ id: userId });
    await tokenService.saveRefreshToken(userId, refreshToken);

    res.cookie("refreshToken", refreshToken, refreshTokenConfig);
    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};
