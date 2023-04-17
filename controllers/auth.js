import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user.js";
import LogOutToken from "../models/logOutToken.js";
import * as config from "../config.js";
import * as util from "../util/util.js";

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    util.checkForValidationErrors(errors, "Validation input data error");
  } catch (error) {
    next(error);
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPass,
      name: name,
    });
    const result = await user.save();
    console.log(result);
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    err.statusCode = 500;
    next(err);
    return;
  }
};
export const signin = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    util.checkForValidationErrors(errors, "Validation input data error");
  } catch (error) {
    next(error);
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("wrong input data for signin");
      error.statusCode = 400;
      throw error;
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      const error = new Error("Wrong password");
      error.statusCode = 400;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_TIME,
      }
    );
    res.status(200).json({ token: token, userName: user.name.toString() });
  } catch (err) {
    next(err);
    return;
  }
};
export const logout = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    util.checkForValidationErrors(errors, "Validation input data error");
  } catch (error) {
    next(error);
    return;
  }
  const authHeader = req.get("Authorization");
  const logOutToken = new LogOutToken({
    token: authHeader,
  });
  try {
    const result = await logOutToken.save();
    res.status(200).json({ message: "User Logout" });
  } catch (error) {
    err.statusCode = 500;
    next(err);
    return;
  }
};
export const changePassowrd = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    util.checkForValidationErrors(errors, "Validation input data error");
  } catch (error) {
    next(error);
    return;
  }
  const userId = req.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  try {
    const user = await User.findById(userId);
    const passwordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCheck) {
      const error = new Error("Wrong password");
      error.statusCode = 400;
      throw error;
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newHashedPassword;
    await user.save();
    res
      .status(200)
      .json({ message: "Password changed", userId: user._id.toString() });
  } catch (err) {
    next(err);
    return;
  }
};
export const changeEmail = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    util.checkForValidationErrors(errors, "Validation input data error");
  } catch (error) {
    next(error);
    return;
  }
  const userId = req.userId;
  const password = req.body.password;
  const newEmail = req.body.newEmail;
  try {
    const user = await User.findById(userId);
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      const error = new Error("Wrong password");
      error.statusCode = 400;
      throw error;
    }
    user.email = newEmail;
    await user.save();
    res
      .status(200)
      .json({ message: "Email changed", userId: user._id.toString() });
  } catch (err) {
    next(err);
    return;
  }
};
