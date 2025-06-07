import express from "express";
const router = express.Router();

import {
  createPermission,
  deletePermission,
  getAllPermission,
  getMyPermission,
  getPermissionByRole,
  updatePermission,
} from "../controllers/permission.controller.js";
import { AuthGuard } from "../middlewares/auth.js";

router.get("/", AuthGuard, getAllPermission);

router.get("/getByRole", getPermissionByRole);
router.get("/getMyPermission", getMyPermission);
router.post("/", AuthGuard, createPermission);
router.put("/:id", AuthGuard, updatePermission);
router.delete("/:id", AuthGuard, deletePermission);

export default router;
