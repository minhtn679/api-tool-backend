import { body } from "express-validator";

export const AddToCartDTO = [
   body("domain", "Sản phẩm thuê không được trống").notEmpty(),
   body("services", "Dịch vụ thuê không được trống").notEmpty(),
];
