import express from "express";
import {
  getAll,
  createRole,
  deleteRole,
  updateRole,
  getDetailRole,
} from "../controllers/role.controller.js";
import { AuthGuard, Authorize } from "../middlewares/auth.js";
import { permissionFieldName, permissionFunction } from "../common/constant.js";

const func = permissionFunction.ROLE;

const router = express.Router();

router.get(
  "/",
  //  AuthGuard, Authorize(func, permissionFieldName.GET),
  getAll,
);

router.post(
  "/",
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  createRole,
);

router.get(
  "/:id",
  // AuthGuard,
  // Authorize(func, permissionFieldName.GET),
  getDetailRole,
);

router.put(
  "/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  updateRole,
);

router.delete(
  "/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.DELETE),
  deleteRole,
);

export default router;
