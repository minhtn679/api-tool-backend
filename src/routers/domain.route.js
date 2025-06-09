import express from "express";
import { AuthGuard, Authorize, RoleGuard } from "../middlewares/auth.js";
import { CreateDomainDTO, validatePriceDomainPack } from "../validator/domain.validator.js";
import * as DomainController from "../controllers/domain.controller.js";
import {
  ROLES,
  permissionFieldName,
  permissionFunction,
} from "../common/constant.js";
import { limiter } from "../middlewares/index.js";

const func = permissionFunction.DOMAIN;

const router = express.Router();

router.delete(
  "/delete/:id",
  AuthGuard,
  RoleGuard([ROLES.ADMIN]),
  Authorize(func, permissionFieldName.DELETE),
  DomainController.deleteDomain
);

router.delete(
  "/delete-without-order/:id",
  AuthGuard,
  RoleGuard([ROLES.BOOK_SERVICE]),
  Authorize(func, permissionFieldName.DELETE),
  DomainController.deleteDomainWithoutOrder
);

router.delete(
  "/delete-multi",
  AuthGuard,
  RoleGuard([ROLES.BOOK_SERVICE, ROLES.ADMIN]),
  Authorize(func, permissionFieldName.DELETE),
  DomainController.deleteMultipleDomains
);

router.post(
  "/create-domain",
  AuthGuard,
  // RoleGuard([ROLES.PRODUCER, ROLES.ADMIN]),
  Authorize(func, permissionFieldName.ADD),
  // CreateDomainDTO,
  DomainController.createPostDomain
);

router.post(
  "/create-many-pack",
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  DomainController.createManyPack
)

router.post(
  "/create-many-domain",
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  DomainController.createManyPostDomain
);

router.put(
  "/update-many-domain",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  DomainController.updateManyDomain
);

router.put(
  "/update-many-pack",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  DomainController.updateManyPack
)

router.get(
  "/paging-domain",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  DomainController.getPaging
);

router.get(
  "/all-domain",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  DomainController.getAllDomain
);

router.get(
  "/paging-pack",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  DomainController.getPagingPack
);
router.patch(
  "/update-domain/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  DomainController.updateDomain
);

router.patch("/update-cart", AuthGuard, DomainController.addToCart);

router.get("/get-cart-items", AuthGuard, DomainController.getCartItems);

export default router;
