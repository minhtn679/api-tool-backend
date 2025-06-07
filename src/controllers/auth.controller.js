import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

import RefreshToken from "../models/refreshToken.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

import createError from "../middlewares/error.js";
import { RESULT, ROLES, ROLES_NAME } from "../common/constant.js";

import { messageByLanguage } from "../common/language/language.js";
dotenv.config();

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT);

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");
}

function generateAccessToken(user) {
  const { _id, role } = user;
  return jwt.sign({ _id, role }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
}

function generateRefreshToken(user, ipAddress) {
  const { _id, role } = user;
  const refreshToken = jwt.sign({ _id, role }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
  return new RefreshToken({
    user: user.id || user._id,
    token: refreshToken,
    createdByIp: ipAddress,
  });
}

//

export async function signup(req, res, next) {
  try {
    const {
      role,
      password,
      email,
      username,
      telegramUsername,
      usdt,
      bankNumber,
      bankName,
      nameInCard,
      team,
      visitorId,
      ip,
      fullName,
    } = req.body;

    const existedRole = await Role.findOne({ name: role });
    if (
      !existedRole ||
      ![ROLES.PRODUCER, ROLES.EXTERNAL_CUSTOMER].includes(existedRole.name)
    ) {
      return next(createError(404, messageByLanguage(req, "roleExisted")));
    }

    const [
      existedEmail,
      existedUsername,
      existedTelegram,
      checkMailNotVerify,
      existedBankNumber,
      existedUsdt,
      existedFullName,
    ] = await Promise.all([
      User.findOne({
        email,
        status: {
          $ne: 0,
        },
      }),
      User.findOne({
        username,
        status: {
          $ne: 0,
        },
      }),
      User.findOne({
        telegramUsername,
        status: {
          $ne: 0,
        },
      }),
      User.findOne({
        email,
        status: 0,
      }),
      User.findOne({
        bankNumber,
        status: {
          $ne: 0,
        },
      }),
      User.findOne({
        usdt,
        status: {
          $ne: 0,
        },
      }),
      User.findOne({
        fullName,
        status: {
          $ne: 0,
        },
      }),
    ]);
    if (existedEmail) {
      return res.status(400).json({
        message: messageByLanguage(req, "thisEmailHasBeenRegistered"),
      });
    }
    if (existedUsername) {
      return res
        .status(400)
        .json({ message: messageByLanguage(req, "usernameIsAlreadyTaken") });
    }

    if (existedTelegram && telegramUsername) {
      return res
        .status(400)
        .json({ message: "Telegram Username đã được sử dụng!" });
    }

    if (existedBankNumber && bankNumber) {
      return res.status(400).json({
        message: messageByLanguage(req, "bankAccountUsed"),
      });
    }
    if (existedUsdt && usdt) {
      return res.status(400).json({
        message: messageByLanguage(req, "usdtUsed"),
      });
    }

    if (existedFullName) {
      return res
        .status(400)
        .json({ message: messageByLanguage(req, "fullNameIsAlreadyTaken") });
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT);

    // nêu là khách hàng ngoài sẽ active thẳng
    if (existedRole.name === ROLES.EXTERNAL_CUSTOMER) {
      req.body.status = 2;
    } else if (existedRole.name === ROLES.PRODUCER) {
      req.body.status = 2;
    }
    const user = new User({
      ...req.body,
      role: existedRole._id,
      password: passwordHash,
      fullName,
    });
    await user.save();

    return res.status(200).json({
      status: RESULT.SUCCESS,
      data: {
        user,
      },
      message: "Đăng ký thành công",
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(createError(422, error.array()[0].msg));
    }

    const { username, password, visitorId, ip } = req.body;
    const user = await User.findOne({ username, deletedAt: null }).populate(
      "role"
    );

    if (!user) {
      return next(
        createError(401, messageByLanguage(req, "accountOrPasswordIsIncorrect"))
      );
    }

    if (user?.status == 0) {
      return next(
        createError(403, messageByLanguage(req, "accountNotVerified"))
      );
    }

    if (user?.status == 3) {
      return next(
        createError(403, messageByLanguage(req, "accountNotApproved"))
      );
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Đăng nhập thành công!",
      data: {
        user,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await RefreshToken.deleteOne({
      user: req.user._id,
      createdByIp: req.ip,
    });

    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    const refreshToken = authHeader && authHeader.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        code: "NO_TOKEN",
        status: RESULT.ERROR,
        message: "Invalid refresh token",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      async (err, decoded) => {
        if (err) return next(createError(403, "Invalid refresh token"));

        const { _id, role, exp } = decoded;
        const existedToken = await RefreshToken.findOne({
          user: _id,
          createdByIp: req?.ip,
        });
        if (!existedToken || refreshToken !== existedToken.token) {
          return next(createError(403, "Invalid refresh token"));
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = exp - currentTime;
        const newRefreshToken = jwt.sign(
          { _id, role },
          process.env.JWT_SECRET_REFRESH,
          {
            expiresIn,
          }
        );
        existedToken.token = newRefreshToken;
        await existedToken.save();

        const accessToken = this.generateAccessToken(req.user);
        res.status(201).json({
          status: RESULT.SUCCESS,
          message: "Tạo mới token thành công!",
          data: { accessToken, refreshToken: newRefreshToken },
        });
      }
    );
  } catch (error) {
    next(error);
  }
}

export const checkAuth = async (req, res, next) => {
  try {
    const accessToken = generateAccessToken(req.user);
    const response = {
      message: "Verified",
      status: RESULT.SUCCESS,
      user: req.user,
      accessToken,
    };
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
