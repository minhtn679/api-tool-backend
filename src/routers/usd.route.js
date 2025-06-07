import express from "express";
import * as UsdController from "../controllers/usd.controller.js";
import { AuthGuard, RoleGuard } from "../middlewares/auth.js";
import { ROLES } from "../common/constant.js";

const router = express.Router();

router.get("/init", UsdController.initUsd);
router.put(
  "/update-exchange-rate",
  AuthGuard,
  RoleGuard([ROLES.ADMIN]),
  UsdController.updateExchangeRate
);
// router.patch('/update', console.log('create'))
// router.delete('/delete', console.log('create'))
// router.get('/', console.log('create

export default router;
