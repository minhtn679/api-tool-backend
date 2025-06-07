import mongoose from "mongoose";
import { validationResult } from "express-validator";
import cron from "node-cron";

import createError from "../middlewares/error.js";
import DomainModel from "../models/domain.model.js";
import UsdExchangeRateModel from "../models/usd.model.js";
import { sleep, validateDomain } from "../common/index.js";
import { RESULT, ROLES } from "../common/constant.js";
import Logger from "../common/logger.js";
import userModel from "../models/user.model.js";
import { messageByLanguage } from "../common/language/language.js";
import OrderModel from "../models/order.model.js";
import cartItemModel from "../models/cartItem.model.js";
import { customAlphabet, nanoid } from 'nanoid'

export const getUniqueCode = () => {
  //
  const random = customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    7
  )();

  // const timer = new Date().getTime().toString();
  // const preCode = timer.slice(0, timer.length - 9);
  const timeSegment = Date.now().toString().slice(-5); // last 5 digits of timestamp

  return timeSegment + random;
};

const roundPrice = (price = 0, usd) => {
  if (!price) {
    return 0;
  }

  return Math.round(Math.round((Number(price) * usd) / 1000) * 1000) || 0;
};

export async function createPostDomain(req, res, next) {
  try {
    const body = req.body;

    if (body.typePack !== "pack") {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return next(createError(422, error.array()[0].msg));
      }
      const domainValidated = validateDomain(body.domain);
      if (!domainValidated) {
        return next(createError(422, messageByLanguage(req, "missingData")));
      }

      const result = await DomainModel.create({
        ...body,
        code: getUniqueCode(),
        domain: domainValidated,
        creator: req?.user._id,
        isDeleted: false,
      });

      return res.status(201).json({
        status: RESULT.SUCCESS,
        message: "Đã đăng lên sàn vui lòng chờ duyệt",
        data: result,
      });
    } else {
      const result = await DomainModel.create({
        ...body,
        creator: req?.user._id,
        isDeleted: false,
      });

      return res.status(201).json({
        status: RESULT.SUCCESS,
        message: "Đã đăng lên sàn vui lòng chờ duyệt",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function createManyPostDomain(req, res, next) {
  try {
    const { data } = req.body;

    if (req.user?.status !== 2)
      return next(
        createError(400, messageByLanguage(req, "youCannotPostADomain"))
      );

    for (const item of data) {
      const domainValidated = validateDomain(item.domain);
      if (!domainValidated) {
        return next(createError(422, messageByLanguage(req, "missingData")));
      }
    }

    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );
    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const exchange = await UsdExchangeRateModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean();

    const list = await Promise.all(
      data?.map(async (item) => {
        const domainValidated = validateDomain(item.domain);
        const {
          textlinkUSDPrice,
          textlinkHomeUSDPrice,
          textlinkHeaderUSDPrice,
          textlinkFooterUSDPrice,
          guestPostUSDPrice,
          bannerUSDPrice,
          textlinkPrice,
          textlinkHomePrice,
          textlinkHeaderPrice,
          textlinkFooterPrice,
          guestPostPrice,
          bannerPrice,
        } = item;

        const payload = {
          ...item,
          code: getUniqueCode(),
          textlinkPrice: textlinkUSDPrice ? roundPrice(textlinkUSDPrice, exchange?.value) : textlinkPrice, 
          textlinkUSDPrice,
          textlinkHomePrice: textlinkHomeUSDPrice ? roundPrice(textlinkHomeUSDPrice, exchange?.value) : textlinkHomePrice, 
          textlinkHomeUSDPrice,
          textlinkHeaderPrice: textlinkHeaderUSDPrice ? roundPrice(textlinkHeaderUSDPrice, exchange?.value) : textlinkHeaderPrice, 
          textlinkHeaderUSDPrice,
          textlinkFooterPrice: textlinkFooterUSDPrice ? roundPrice(textlinkFooterUSDPrice, exchange?.value) : textlinkFooterPrice, 
          textlinkFooterUSDPrice,
          guestPostPrice: guestPostUSDPrice ? roundPrice(guestPostUSDPrice, exchange?.value) : guestPostPrice, 
          guestPostUSDPrice,
          bannerPrice: bannerUSDPrice ? roundPrice(bannerUSDPrice, exchange?.value) : bannerPrice, 
          bannerUSDPrice,
          exchange: exchange?.value || 0,
          domain: domainValidated,
          creator: req?.user._id,
          isDeleted: false,
        };

        return payload;
      })
    );

    for (const item of list) {
      const result = await DomainModel.create(item);
    }

    return res.status(201).json({
      status: RESULT.SUCCESS,
      message: "Đã đăng lên sàn vui lòng chờ duyệt",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaging(req, res, next) {
  try {
    const {
      search,
      service = "",
      status = "",
      page = 1,
      limit = 10,
      sale = "",
      sortBy,
      min,
      max,
    } = req.query;
    const skip = (page - 1) * limit;
    const CONSTANT_TYPE_PACK = ["tool", "entity", "backlink", "traffic"];
    const condition = {
      isDeleted: false,
      isShow: true,
      status: 1,
    };
    const and = [];

    if (status) condition["status"] = status;
    let sort = { createdAt: -1 };
    if ([ROLES.EMPLOYEE].includes(req.user.role.name)) {
      condition["isShow"] = true;
      condition["status"] = 1;
      condition["typePack"] = { $in: ["domain", null] };
      sort = {
        createdAt: -1,
      };
    }

    if (req.user.role.name === ROLES.BOOK_SERVICE) {
      // condition["creator"] = req.user._id;
      condition["typePack"] = { $in: ["domain", null] };
    }

    if (search) {
      let searchStr = search.trimStart().trimEnd();
      if (!search.includes("https://") && !search.includes("http://")) {
        searchStr = search.replace("www.", "");
      } else {
        const url = new URL(search);
        searchStr = url.hostname.replace("www.", "");
      }

      const or = [
        {
          domain: { $regex: searchStr, $options: "i" },
        },
      ];

      const users = await userModel.findOne({ username: search });
      if (users) {
        or.push({
          creator: users._id,
        });
      }

      and.push({
        $or: or,
      });
    }
    if (service) {
      if (!CONSTANT_TYPE_PACK?.includes(service)) condition[service] = true;
      else condition.type = service?.toString();
    }

    if (sale) {
      condition["creator"] = new mongoose.Types.ObjectId(sale);
    }

    if (status) {
      condition["status"] = parseInt(status);
    }

    if (min) {
      and.push({
        $or: [
          {
            bannerPrice: {
              $gte: Number(min),
            },
          },
          {
            textlinkPrice: {
              $gte: Number(min),
            },
          },
          {
            guestPostPrice: {
              $gte: Number(min),
            },
          },
        ],
      });
    }

    if (max) {
      and.push({
        $or: [
          {
            bannerPrice: {
              $lte: Number(max),
            },
            isSaleBanner: true,
          },
          {
            textlinkPrice: {
              $lte: Number(max),
            },
            isSaleTextLink: true,
          },
          {
            guestPostPrice: {
              $lte: Number(max),
            },
            isSaleGuestPost: true,
          },
        ],
      });
    }

    if (and.length > 0) {
      condition["$and"] = and;
    }

    console.log("condition", condition, condition["$and"]?.[1]);
    const [result, count] = await Promise.all([
      DomainModel.find({
        ...condition,
      })
        .populate({
          path: "creator",
          select: [ROLES.ADMIN, ROLES.ACCOUNTANT].includes(req.user?.role?.name)
            ? ""
            : "fullName username",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      DomainModel.find({
        ...condition,
      }).countDocuments(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      data: {
        count: count || 0,
        items: result || [],
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllDomain(req, res, next) {
  try {
    const {
      search,
      producer = "",
      isShow = true,
      status = "",
      page = 1,
      limit = 10,
      sale = "",
    } = req.query;
    const skip = (page - 1) * limit;

    const condition = {
      isDeleted: false,
      creator: req.user._id,
    };
    let sort = { createdAt: -1 };

    const [result, count] = await Promise.all([
      DomainModel.find({
        ...condition,
      })
        .populate({
          path: "creator",
          select: "fullName username",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      DomainModel.find({
        ...condition,
      }).countDocuments(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      data: {
        count: count || 0,
        items: result || [],
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function getPagingPack(req, res, next) {
  try {
    const {
      search,
      type,
      min,
      max,
      producer = "",
      isShow = true,
      status = "",
      page = 1,
      limit = 10,
      index,
      noIndex,
    } = req.query;
    const skip = (page - 1) * limit;

    const condition = {
      typePack: "pack",
      isDeleted: false,
    };
    if (status) condition["status"] = status;
    if ([ROLES.EMPLOYEE].includes(req.user.role.name)) {
      condition["isShow"] = true;
      condition["status"] = 1;
      condition["$or"] = [
        {
          isBlacklist: false,
        },
        {
          isBlacklist: {
            $exists: false,
          },
        },
      ];
    }

    if (req.user.role.name === ROLES.BOOK_SERVICE) {
      // condition["creator"] = req.user._id;
    }

    if (search) {
      let searchStr = search.trimStart().trimEnd();
      if (!search.includes("https://") && !search.includes("http://")) {
        searchStr = search.replace("www.", "");
      } else {
        const url = new URL(search);
        searchStr = url.hostname.replace("www.", "");
      }

      condition["domain"] = {
        $regex: searchStr,
        $options: "i",
      };
    }

    if (type) {
      condition["type"] = type;
    }

    if (producer) {
      condition["creator"] = new mongoose.Types.ObjectId(producer);
    }

    if (status) {
      condition["status"] = status;
    }

    if (index !== undefined) {
      condition["index"] = index === "true";
    }
    if (noIndex !== undefined) {
      condition["noIndex"] = noIndex === "true";
    }

    if (min || max) {
      condition["pricePack"] = {
        $gte: Number(min) || 0,
        $lte: Number(max) || 10000000000,
      };
    }

    const [result, count] = await Promise.all([
      DomainModel.find({
        ...condition,
      })
        .populate({
          path: "creator",
          select: [ROLES.ADMIN, ROLES.ACCOUNTANT].includes(req.user?.role?.name)
            ? ""
            : "fullName username",
        })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),
      DomainModel.find({
        ...condition,
      }).countDocuments(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      data: {
        count: count,
        items: result || [],
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDomain(req, res, next) {
  try {
    const id = req.params.id;
    const reqUser = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }

    const domainInfo = await DomainModel.findOne({ _id: id }).populate(
      "creator"
    );

    if (!domainInfo)
      return next(createError(404, messageByLanguage(req, "domainNotFound")));

    if (req.body.status === 1 && domainInfo?.creator?.status === 1)
      return next(
        createError(
          400,
          messageByLanguage(
            req,
            "thisPartnerHasNotBeenApprovedContactAdminToApprovePartners"
          )
        )
      );

    if (reqUser?.role.name !== "producer") {
      // if (!req.body?.status && req.body.status !== 0) {
      //   return next(createError(403, "Bạn không có quyền chỉnh sửa"));
      // }

      const domainUpdated = await DomainModel.findOneAndUpdate(
        { _id: id },
        { ...req.body, status: req.body.status, discount: req.body.discount },
        { new: true }
      );

      if (!domainUpdated) {
        return next(createError(403, messageByLanguage(req, "domainNotFound")));
      }

      return res.status(200).json({
        status: RESULT.SUCCESS,
        message: "Cập nhật thành công",
        data: domainUpdated,
      });
    }
    delete req.body.discount;
    const domain = await DomainModel.findOneAndUpdate(
      { _id: id, creator: reqUser?._id },
      req.body,
      {
        new: true,
      }
    );

    if (!domain) {
      return next(
        createError(403, messageByLanguage(req, "youDoNotHaveEditingRights"))
      );
    }
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật thành công",
      data: domain,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateManyDomain(req, res, next) {
  try {
    const { data } = req.body;
    const reqUser = req.user;

    if (!data?.length) {
      return next(createError(422, 'Không có dữ liệu'));
    }

    for (const item of data) {

      if (!item?.code) {
        return next(createError(422, 'Mã dịch vụ không hợp lệ'));
      }

      const domainInfo = await DomainModel.findOne({ code: item?.code }).populate(
        "creator"
      );

      if (!domainInfo)
        return next(createError(404, messageByLanguage(req, "domainNotFound")));

      if (item.status === 1 && domainInfo?.creator?.status === 1)
        return next(
          createError(
            400,
            messageByLanguage(
              req,
              "thisPartnerHasNotBeenApprovedContactAdminToApprovePartners"
            )
          )
        );

      const exchange = await UsdExchangeRateModel
        .findOne()
        .sort({ createdAt: -1 })
        .lean();

      const {
        textlinkUSDPrice,
        textlinkHomeUSDPrice,
        textlinkHeaderUSDPrice,
        textlinkFooterUSDPrice,
        guestPostUSDPrice,
        bannerUSDPrice,
        textlinkPrice,
        textlinkHomePrice,
        textlinkHeaderPrice,
        textlinkFooterPrice,
        guestPostPrice,
        bannerPrice,
      } = item;

      const payload = {
        ...item,
        textlinkPrice: textlinkUSDPrice ? roundPrice(textlinkUSDPrice, exchange?.value) : textlinkPrice, 
        textlinkUSDPrice,
        textlinkHomePrice: textlinkHomeUSDPrice ? roundPrice(textlinkHomeUSDPrice, exchange?.value) : textlinkHomePrice, 
        textlinkHomeUSDPrice,
        textlinkHeaderPrice: textlinkHeaderUSDPrice ? roundPrice(textlinkHeaderUSDPrice, exchange?.value) : textlinkHeaderPrice, 
        textlinkHeaderUSDPrice,
        textlinkFooterPrice: textlinkFooterUSDPrice ? roundPrice(textlinkFooterUSDPrice, exchange?.value) : textlinkFooterPrice, 
        textlinkFooterUSDPrice,
        guestPostPrice: guestPostUSDPrice ? roundPrice(guestPostUSDPrice, exchange?.value) : guestPostPrice, 
        guestPostUSDPrice,
        bannerPrice: bannerUSDPrice ? roundPrice(bannerUSDPrice, exchange?.value) : bannerPrice, 
        bannerUSDPrice,
        exchange: exchange?.value || 0,
      };

      if (reqUser?.role.name !== "producer") {
        // if (!item?.status && item.status !== 0) {
        //   return next(createError(403, "Bạn không có quyền chỉnh sửa"));
        // }

        const domainUpdated = await DomainModel.findOneAndUpdate(
          { _id: domainInfo?._id },
          payload,
          { new: true }
        );

        if (!domainUpdated) {
          return next(createError(403, messageByLanguage(req, "domainNotFound")));
        }

        // return res.status(200).json({
        //   status: RESULT.SUCCESS,
        //   message: "Cập nhật thành công",
        //   data: domainUpdated,
        // });
      }
      delete item.discount;
      const domain = await DomainModel.findOneAndUpdate(
        { _id: id, creator: reqUser?._id },
        payload,
        {
          new: true,
        }
      );

      if (!domain) {
        return next(
          createError(403, messageByLanguage(req, "youDoNotHaveEditingRights"))
        );
      }
    }
    
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    next(error);
  }
}

export const deleteDomain = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }
    let domain;
    if (req?.user?.role?.name !== "producer") {
      domain = await DomainModel.findByIdAndUpdate(id, {
        isDeleted: true,
      });
      if (!domain)
        return next(createError(404, messageByLanguage(req, "domainNotFound")));
    } else {
      domain = await DomainModel.findOneAndUpdate(
        {
          _id: id,
          creator: req?.user?._id,
        },
        {
          isDeleted: true,
        }
      );
      if (!domain)
        return next(createError(404, messageByLanguage(req, "domainNotFound")));
    }
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xóa domain thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDomainWithoutOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req?.user?._id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }
    const domain = await DomainModel.findById(id);
    if (userId.toString() !== domain.creator._id.toString()) {
      return next(
        createError(
          422,
          messageByLanguage(req, "youDoNotHavePermissionToPerformThisAction")
        )
      );
    }
    if (!domain) {
      return next(createError(404, messageByLanguage(req, "domainNotFound")));
    }
    const sku = domain.sku;
    const orders = await OrderModel.find({ "items.productCode": sku });

    if (orders.length > 0) {
      const isNotDeletable = orders.some((order) =>
        [-2, -1, 0, 1, 2, 3, 4, 5, 12].includes(order.status)
      );

      if (isNotDeletable) {
        return next(
          createError(
            422,
            messageByLanguage(req, "cannotDeleteDomainWithOrders")
          )
        );
      }
    }

    await DomainModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Xóa domain thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMultipleDomains = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const userId = req?.user?._id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(createError(422, messageByLanguage(req, "invalidId")));
    }

    const domains = await DomainModel.find({ _id: { $in: ids } });
    const errors = [];

    for (const domain of domains) {
      const nameDomain = domain.domain;

      // Kiểm tra quyền sở hữu
      if (userId.toString() !== domain.creator._id.toString()) {
        errors.push({
          nameDomain,
          error: messageByLanguage(
            req,
            "youDoNotHavePermissionToPerformThisAction"
          ),
        });
        continue;
      }

      const orders = await OrderModel.find({ "items.productCode": domain.sku });
      if (orders.length > 0) {
        const hasRestrictedStatus = orders.some((order) =>
          [-2, -1, 0, 1, 2, 3, 4, 5, 12].includes(order.status)
        );

        if (hasRestrictedStatus) {
          errors.push({
            nameDomain,
            error: messageByLanguage(req, "cannotDeleteDomainWithOrders"),
          });
          continue;
        }
      }

      await DomainModel.updateOne({ _id: domain._id }, { isDeleted: true });
    }

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Quá trình xóa hoàn tất.",
      errors,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { domain, service, quantity } = req.body;

    const checkDomain = await DomainModel.findById(domain);

    if (!checkDomain) {
      return next(createError(404, messageByLanguage(req, "domainNotFound")));
    }

    const cartItems = await cartItemModel.find({
      user: req.user._id,
      domain,
      service,
    });

    if (Number(quantity) > 0 && !isNaN(Number(quantity))) {
      const cartItem = cartItems?.find(
        (e) => e?.domain?.toString() === checkDomain?._id?.toString()
      );

      if (cartItem) {
        await cartItemModel.findByIdAndUpdate(cartItem?._id, {
          quantity: +quantity,
        });
      } else {
        await cartItemModel.create({
          quantity,
          service,
          domain,
          user: req.user._id,
        });
      }
    } else if (quantity == 0) {
      const cartItem = cartItems?.find(
        (e) => e?.domain?.toString() === checkDomain?._id?.toString()
      );

      if (cartItem) {
        await cartItemModel.findByIdAndDelete(cartItem?._id);
      }
    }

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật giỏ hàng",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const cartItems = await cartItemModel
      .find({
        user: req.user._id,
      })
      .populate("user")
      .populate({
        path: "domain",
        populate: {
          path: "creator",
          select: "username",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật giỏ hàng thành công!",
      data: cartItems,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExchangeDomain = async (exchange) => {
  try {
    const domains = await DomainModel.find({ isDeleted: false });

    for (const domain of domains) {
      const payload = {
        exchange,
      }

      if (domain?.textlinkUSDPrice) {
        payload.textlinkPrice = roundPrice(domain?.textlinkUSDPrice, exchange);
      }

      if (domain?.textlinkHomeUSDPrice) {
        payload.textlinkHomePrice = roundPrice(domain?.textlinkHomeUSDPrice, exchange);
      }

      if (domain?.textlinkHeaderUSDPrice) {
        payload.textlinkHeaderPrice = roundPrice(domain?.textlinkHeaderUSDPrice, exchange);
      }

      if (domain?.textlinkFooterUSDPrice) { 
        payload.textlinkFooterPrice = roundPrice(domain?.textlinkFooterUSDPrice, exchange);
      }

      if (domain?.guestPostUSDPrice) {
        payload.guestPostPrice = roundPrice(domain?.guestPostUSDPrice, exchange);
      }

      if (domain?.bannerUSDPrice) {
        payload.bannerPrice = roundPrice(domain?.bannerUSDPrice, exchange);
      }


      await DomainModel.updateOne(
        { _id: domain?._id },
        payload
      )
    }
  } catch (error) {
    console.log('error: ', error);
  }
};