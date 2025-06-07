import bcrypt from "bcryptjs";
import roleModel from "../models/role.model.js";
import userModel from "../models/user.model.js";
import Logger from "./logger.js";
import permissionModel from "../models/permission.model.js";
import { permissionFunction } from "./constant.js";

import axios from "axios";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT);

export const initData = async () => {
  try {
    // const pass = await bcrypt.hash("123123", PASSWORD_SALT);
    // await userModel.updateOne(
    //   {
    //     username: "admin",
    //   },
    //   {
    //     password: pass,
    //   }
    // );
    // console.log("pass", pass);
    const [role] = await Promise.all([roleModel.countDocuments()]);

    if (role == 0) {
      const [admin, employee] = await Promise.all([
        roleModel.create({
          name: "admin",
        }),
        roleModel.create({
          name: "employee",
        }),
        roleModel.create({
          name: "accountant",
        }),
        roleModel.create({
          name: "bookservice",
        }),
        roleModel.create({
          name: "producer",
        }),
      ]);

      for (let value of Object.values(permissionFunction)) {
        await permissionModel.create({
          name: value,
          role: admin._id,
          add: true,
          view: true,
          edit: true,
          delete: true,
        });
      }
      Logger.log("Create roles successfuly!");
    }

    const roleAdmin = await roleModel.findOne({ name: "admin" });

    const admin = await userModel.findOne({ role: roleAdmin._id });
    if (!admin) {
      const passwordAdminHash = await bcrypt.hash("dev123123", PASSWORD_SALT);
      await userModel.create({
        fullName: "admin",
        username: "admin",
        password: passwordAdminHash,
        status: 2,
        email: "admin@gmail.com",
        role: roleAdmin._id,
      });
      Logger.log("Create admin successfuly!");
    }
  } catch (error) {
    Logger.error(error);
  }
};
