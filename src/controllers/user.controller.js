import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import createError from "../middlewares/error.js";
import User from "../models/user.model.js";
import { RESULT, ROLES } from "../common/constant.js";
import roleModel from "../models/role.model.js";
import DomainModel from "../models/domain.model.js";
import userModel from "../models/user.model.js";
import { messageByLanguage } from "../common/language/language.js";
const PASSWORD_SALT = Number(process.env.PASSWORD_SALT);

export async function getUserById(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(422, messageByLanguage(req, "invalidId")));

    const user = await User.findOne({
      _id: id,
      deletedAt: null,
    }).select("fullName _id email");

    if (!user) {
      next(createError(404, messageByLanguage(req, "userNotFound")));
    }
    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Lấy chi tiết user thành công",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { role, password, email, username, phone, telegram } = req.body;
    const existedRole = await roleModel.findById(role);

    if (!existedRole) {
      next(createError(404, messageByLanguage(req, "roleDoesNotExist")));
    }

    if (existedRole?.name === "admin" && req.user?.role?.name !== "admin")
      return next(createError(400, messageByLanguage(req, "youHaveNoRights")));

    const [existedEmail, existedUsername, existedPhone, existedTelegram] =
      await Promise.all([
        User.findOne({ email }),
        User.findOne({ username }),
        User.findOne({ phone }),
        User.findOne({ telegram }),
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
    if (existedPhone) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được sử dụng!" });
    }

    // if (existedTelegram && telegram !== "null") {
    //   return res.status(400).json({ message: "Telegram đã được sử dụng!" });
    // }

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT);
    const user = new User({
      status: 2,
      ...req.body,
      role: existedRole._id,
      password: passwordHash,
    });
    await user.save();

    return res.status(200).json({
      status: RESULT.SUCCESS,
      data: user,
      message: "Tạo user thành công",
    });
  } catch (error) {
    next(error);
  }
}

export async function getPagingUser(req, res, next) {
  try {
    const reqUser = req.user;
    const pageIndex = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;
    let searchQuery = {
      deletedAt: null,
    };

    const { role, search, status, startDate, endDate } = req.query;

    if (role) {
      if (!mongoose.Types.ObjectId.isValid(role))
        return next(createError(422, messageByLanguage(req, "roleInvalid")));
      searchQuery.role = new mongoose.Types.ObjectId(role);
    }

    const and = [];

    if (search) {
      and.push({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (status) searchQuery.status = parseInt(status);

    if (startDate && endDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      searchQuery.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (and?.length > 0) {
      searchQuery["$and"] = and;
    }
    console.log("searchQuery", searchQuery);
    const [users, count] = await Promise.all([
      userModel.find(searchQuery).populate("role").sort({ createdAt: -1 }),
      userModel.find(searchQuery).countDocuments(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Lấy danh sách user thành công",
      data: {
        count: count || 0,
        items: users || [],
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getPagingUserForActions(req, res, next) {
  try {
    const pageIndex = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;
    let condition = {};

    if (req.query.roles) {
      const roles = await roleModel.find({
        name: {
          $in: req.query.roles?.split(",") || [],
        },
      });

      condition = {
        role: {
          $in: roles?.map((item) => item?._id),
        },
        deletedAt: null,
      };
    }

    const [users, count] = await Promise.all([
      User.find(condition)
        .populate({
          path: "role",
          select: "name",
        })
        .sort({
          createdAt: 1,
        })
        .select("_id username fullName"),
      User.find(condition).countDocuments(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Lấy danh sách user thành công",
      data: {
        count: count || 0,
        items: users || [],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUserByRoleCustomer(req, res, next) {
  try {
    let searchQuery = {
      deletedAt: null,
    };
    const [customerRole] = await Promise.all([
      roleModel.findOne({
        name: ROLES.EMPLOYEE,
      }),
    ]);

    if (req.query.status) {
      searchQuery.status = req.query.status;
    }

    // phân luồng
    const or = [];
    or.push({
      role: customerRole?._id,
    });

    searchQuery["$or"] = or;

    const [users] = await Promise.all([
      User.find(searchQuery)
        .select({ fullName: 1, username: 1 })
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Lấy danh sách user thành công",
      data: {
        items: users,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserById(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }
    // if (req.user._id !== id && req.user.role.name !== ROLES.ADMIN) {
    //   return next(createError(403, "Permission denied!"));
    // }

    const { email, username, phone, telegram, password, role, discount } =
      req.body;

    const [existedEmail, existedUsername, existedPhone, existedTelegram] =
      await Promise.all([
        User.findOne({ email, _id: { $ne: id } }),
        User.findOne({ username, _id: { $ne: id } }),
        User.findOne({ phone, _id: { $ne: id } }),
        User.findOne({ telegram, _id: { $ne: id } }),
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
    if (existedPhone) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được sử dụng!" });
    }
    // if (existedTelegram) {
    //   return res.status(400).json({ message: "Telegram đã được sử dụng!" });
    // }

    const keys = Object.keys(req.body);
    keys?.forEach((key) => {
      if (typeof req.body[key] === "string")
        if (key === "fullName" || key === "nameInCard") {
          req.body[key] = req.body[key].replace(/  +/g, " ").trim();
        } else {
          // req.body[key] = req.body[key].replace(/ /g, "");
        }
    });

    const userInfo = await User.findById(id).populate("role");

    if (!userInfo)
      return next(createError(404, messageByLanguage(req, "userNotFound")));

    if (password) {
      const passwordHash = await bcrypt.hash(password, PASSWORD_SALT);
      req.body.password = passwordHash;
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(201).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật user thành công",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeAvatar(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }
    // if (req.user._id !== id && req.user.role.name !== ROLES.ADMIN) {
    //   return next(createError(403, "Permission denied!"));
    // }
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    if (!user)
      return next(createError(404, messageByLanguage(req, "userNotFound")));
    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật ảnh đại diện thành công",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserById(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(422, messageByLanguage(req, "invalidId")));

    const user = await User.findById(id).populate("role");
    if (!user)
      return next(createError(404, messageByLanguage(req, "userNotFound")));

    // soft delete
    await User.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xoá user thành công",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteHardUserById(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(422, messageByLanguage(req, "invalidId")));

    const user = await User.findById(id).populate("role");
    if (!user)
      return next(createError(404, messageByLanguage(req, "userNotFound")));

    if (!user.isPendingDeposit) {
      return next(createError(404, messageByLanguage(req, "userNotFound")));
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xoá user thành công",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMultiUser(req, res, next) {
  try {
    const userIds = req.body;
    // await User.deleteMany({ _id: userIds });
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xoá user thành công",
    });
  } catch (error) {
    next(error);
  }
}

export const getAllUserByRoles = async (req, res, next) => {
  try {
    const rolesString = req.query.roles?.trim()?.split(",") || [];
    const roles = await roleModel.find({
      name: {
        $in: rolesString,
      },
    });

    const result = await userModel
      .find({
        role: {
          $in: roles?.map((e) => e?._id),
        },
      })
      .select("fullName username");

    return res.json({
      status: RESULT.SUCCESS,
      message: "Lấy danh sách người dùng theo quyền",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
