import { body } from "express-validator";

export const LoginDTO = [
  body("username", "Tên đăng nhập không được trống").notEmpty(),
  body("password", "Mật khẩu ít nhất 6 ký tự và tối đa 32 ký tự!")
    .trim()
    .isLength({ min: 0, max: 32 }),
];

export const SignupDTO = [
  ...LoginDTO,
  body("fullName", "Không được để trống trường họ tên").trim().notEmpty(),
  body("email", "Không được để trống trường email").trim().notEmpty(),
  body("phone", "Không được để trống trường phone").trim().notEmpty(),
  body("role", "Không được để trống trường role").trim().notEmpty(),
  body("telegramUsername", "Không được để trống telegram username")
    .trim()
    .notEmpty(),
];

export const ChangePasswordDTO = [
  body("password", "Mật khẩu cũ không được trống").trim().notEmpty(),
  body("newPassword", "Mật khẩu mới không được trống").trim().notEmpty(),
  body("newPassword", "Mật khẩu mới ít nhất 6 ký tự và tối đa 32 ký tự!")
    .trim()
    .isLength({ min: 6, max: 32 }),
];
