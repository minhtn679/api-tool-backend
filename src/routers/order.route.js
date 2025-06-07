import express from "express";

import { AuthGuard, Authorize } from "../middlewares/auth.js";
import * as OrderController from "../controllers/order.controller.js";
import { permissionFieldName, permissionFunction } from "../common/constant.js";

const func = permissionFunction.ORDER;

const router = express.Router();

router.post(
  "/create-order-code-external",
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  OrderController.createOrderCodeExternal
);

router.post(
  "/make-order",
  AuthGuard,
  Authorize(func, permissionFieldName.ADD),
  OrderController.makeOrderVersion2
);

router.get(
  "/get-list",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  OrderController.getPaging
);

router.get(
  "/get-list-excel",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  OrderController.getDataExcel
);

router.get(
  "/get-detail/:orderCode",
  AuthGuard,
  Authorize(func, permissionFieldName.GET),
  OrderController.getDetail
);

router.patch(
  "/update-order-status/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateOrderStatus
);

router.patch(
  "/update-order-bill/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateBillOrder
);

router.patch(
  "/update-order-note/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateNote
);
router.patch(
  "/update-edit/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateEditOrder
);
router.patch(
  "/update-order/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateOrderByLinhChi
);

router.patch(
  "/delete-product-order/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateProductInOrder
);

router.put(
  "/update-order-img-bill/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateImageBill
);

router.put(
  "/update-order-img-seo/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateImageDiscountForSEO
);

router.put(
  "/update-order-is-payment/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateIsPayment
);

router.put(
  "/update-order-code/:id",
  AuthGuard,
  Authorize(func, permissionFieldName.EDIT),
  OrderController.updateOrderCode
);

export default router;
