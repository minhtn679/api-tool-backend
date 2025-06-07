import mongoose from "mongoose";
import { RESULT, ROLES } from "../common/constant.js";
import createError from "../middlewares/error.js";
import RoleModel from "../models/role.model.js";
import permissionModel from "../models/permission.model.js";
import { toSlug } from "../common/index.js";
import userModel from "../models/user.model.js";
import { messageByLanguage } from "../common/language/language.js";

export const getAll = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const roles = await RoleModel.find({
      name: { $regex: search, $options: "i" },
      deletedAt: null,
    })
      .select("-__v")
      .sort({ createdAt: 1 });

    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Lấy danh sách role thành công!",
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

export const getDetailRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "roleInvalid")));
    }
    const role = await RoleModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "permissions",
          localField: "_id",
          foreignField: "role",
          as: "permissions",
        },
      },
    ]);
    if (!role) {
      return next(createError(400, messageByLanguage(req, "roleInvalid")));
    }

    res.status(200).json({
      status: RESULT.SUCCESS,
      message: "success",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    const name = toSlug(fullName);
    const existedRole = await RoleModel.findOne({
      fullName,
      deletedAt: null,
    });
    if (existedRole) {
      return next(createError(400, messageByLanguage(req, "roleExisted")));
    }
    const newRole = await RoleModel.create({
      name,
      fullName,
    });

    const permissions = req.body.permissions;
    for (const permission of permissions) {
      await permissionModel.create({
        role: newRole._id,
        ...permission,
      });
    }

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Thêm role thành công!",
      data: newRole,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, permissions } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "roleInvalid")));
    }

    const role = await RoleModel.findByIdAndUpdate(id, { fullName });
    if (!role)
      return next(createError(404, messageByLanguage(req, "roleDoesNotExist")));

    await permissionModel.deleteMany({ role: id });

    for (const permission of permissions) {
      await permissionModel.create({
        role: id,
        ...permission,
      });
    }

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Sửa role thành công!",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "roleInvalid")));
    }
    const roleExisted = await RoleModel.findById(id);
    if (!roleExisted) {
      return next(createError(400, messageByLanguage(req, "roleDoesNotExist")));
    }
    if (
      [
        ROLES.ADMIN,
        ROLES.ACCOUNTANT,
        ROLES.EMPLOYEE,
        ROLES.BOOK_SERVICE,
      ].includes(roleExisted.name)
    ) {
      return next(
        createError(400, messageByLanguage(req, "thisRoleCannotBeDeleted"))
      );
    }

    const [role, __] = await Promise.all([
      RoleModel.findByIdAndUpdate(id, {
        $set: {
          deletedAt: new Date(),
        },
      }),
      permissionModel.deleteMany({ role: id }),
      userModel.updateMany(
        { role: id },
        {
          $set: {
            deletedAt: new Date(),
          },
        }
      ),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xóa role thành công",
    });
  } catch (error) {
    next(error);
  }
};
