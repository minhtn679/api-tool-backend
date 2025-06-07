import jwt from "jsonwebtoken";
import createError from "./error.js";
import User from "../models/user.model.js";
import roleModel from "../models/role.model.js";
import permissionModel from "../models/permission.model.js";
import { messageByLanguage } from "../common/language/language.js";
import moment from "moment";

export const AuthGuard = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: -1,
      message: "You are not authenticated!",
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: -1,
        message: messageByLanguage(req, "loginSessionExpiredPleaseLogInAgain"),
      });
    }

    User.findOne({ _id: user._id })
      .populate("role")
      .select("-password -__v -updatedAt")
      .then((res) => {
        if (res?.status == 0) {
          return next(
            createError(401, messageByLanguage(req, "accountNotVerified"))
          );
        }

        if (res?.status == 1) {
          return next(
            createError(401, messageByLanguage(req, "accountAwaitingApproval"))
          );
        }
        if (res?.status == 3) {
          return next(
            createError(401, messageByLanguage(req, "accountNotApproved"))
          );
        }
        if (res.status === 4) {
          const currentTime = moment();
          const countdownTime = moment(res.countdown);
          if (!res?.countdown || countdownTime.isBefore(currentTime)) {
            return next(
              createError(401, messageByLanguage(req, "accountHasBeenLocked"))
            );
          }
        }
        req.user = res;
        next();
      })
      .catch((err) => {
        return next(
          createError(
            401,
            messageByLanguage(req, "loginSessionExpiredPleaseLogInAgain")
          )
        );
      });
  });
};

export const RoleGuard = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return [
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user?.role?.name)) {
        return next(createError(403, "Unauthorized"));
      }
      next();
    },
  ];
};

export function Authorize(func = "", permission = "") {
  return async (req, res, next) => {
    try {
      // const roles = await roleModel.findById(req.user?.role?._id);

      if (req.user?.role?.name === "admin") return next();
      if (func && permission) {
        const permissionField = await permissionModel.findOne({
          name: func,
          role: req?.user?.role?._id,
        });

        if (!permissionField) {
          return res
            .status(403)
            .json({ message: messageByLanguage(req, "youDoNotHaveAccess") });
        }

        const checkFlag = permissionField?.[permission] || false;

        if (!checkFlag) {
          return res.status(403).json({
            message: messageByLanguage(
              req,
              "youHaveNotBeenGrantedThisPermission"
            ),
          });
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "No Token" });
    }
  };
}
