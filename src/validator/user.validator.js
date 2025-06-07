import { body } from "express-validator";

export const ChangeAvatarDTO = [body("avatar", "Thông tin không hợp lệ").notEmpty()];
