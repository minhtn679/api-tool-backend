import _ from "lodash";
import UsdtModel from "../models/usd.model.js";
import createError from "../middlewares/error.js";
import { RESULT } from "../common/constant.js";
import { updateExchangeDomain } from "./domain.controller.js";

export async function initUsd(req, res, next) {
  try {
    const usdt = await UsdtModel.findOne().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      value: usdt?.value || 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExchangeRate(req, res, next) {
  try {
    const { value } = req.body;
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      return next(createError(400), "Tỷ giá không hợp lệ");
    }

    await UsdtModel.create({
      value: Number(value),
      createdBy: req.user?._id,
    });

    await updateExchangeDomain(Number(value));

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: 'Cập nhật tỷ giá thành công',
      data: null
    })
  } catch (error) {
    next(error);
  }
}
