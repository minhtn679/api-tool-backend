import express from "express";

import {
  AuthGuard,
  RoleGuard,
  Authorize,
} from "../middlewares/auth.js";
import * as UserController from "../controllers/user.controller.js";
import {
  ROLES,
  permissionFieldName,
  permissionFunction,
} from "../common/constant.js";
import { ChangeAvatarDTO } from "../validator/user.validator.js";
import { SignupDTO } from "../validator/auth.validator.js";

const func = permissionFunction.USER;

const router = express.Router();

router.post(
  "/",
  SignupDTO,
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  UserController.createUser
);

router.get(
  "/get-paging",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  UserController.getPagingUser
);

// get paging user for select of actions
router.get(
  "/get-all-user",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  UserController.getPagingUserForActions
);

router.get("/get-all-by-role", AuthGuard, UserController.getAllUserByRoles);

router.get(
  "/get-paging-customer",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  UserController.getAllUserByRoleCustomer
);

router.patch(
  "/update-user/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  UserController.updateUserById
);

router.patch(
  "/admin-update-user/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  UserController.updateUserById
);

router.patch(
  "/change-avatar/:id",
  AuthGuard,
  ChangeAvatarDTO,
  UserController.changeAvatar
);

router.delete(
  "/delete-one/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.DELETE),
  UserController.deleteUserById
);

router.delete(
  "/delete-many",
  AuthGuard,
  Authorize(func, permissionFieldName.DELETE),
  UserController.deleteMultiUser
);

router.get(
  "/detail/:id",
  AuthGuard,
  // Authorize(func, permissionFieldName.GET),
  UserController.getUserById
);

router.delete(
  "/delete-one-when-sigup/:id",
  UserController.deleteHardUserById
);

export default router;
