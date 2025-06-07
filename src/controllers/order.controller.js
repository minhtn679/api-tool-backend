import mongoose from "mongoose";
import groupBy from "lodash/groupBy.js";
import UserModel from "../models/user.model.js";
import createError from "../middlewares/error.js";
import { RESULT, ROLES, SALE_SERVICES } from "../common/constant.js";
import OrderModel from "../models/order.model.js";
import DomainModel from "../models/domain.model.js";
import roleModel from "../models/role.model.js";
import moment from "moment";
import axios from "axios";
import { roundMoney } from "../common/index.js";
import { messageByLanguage } from "../common/language/language.js";
import userModel from "../models/user.model.js";
import orderCodeModel from "../models/orderCode.model.js";
import cartItemModel from "../models/cartItem.model.js";

const today = new Date();
const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);
const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);

const startOfMonth = new Date();
startOfMonth.setDate(1);

const getField = (service) => {
  let priceField = "";
  let saleField = "";
  switch (service) {
    case SALE_SERVICES.BANNER:
      priceField = "bannerPrice";
      saleField = "isSaleBanner";
      break;
    case SALE_SERVICES.GUEST_POST:
      priceField = "guestPostPrice";
      saleField = "isSaleGuestPost";
      break;
    case SALE_SERVICES.TEXT_LINK:
      priceField = "textlinkPrice";
      saleField = "isSaleTextLink";
      break;
    default:
      priceField = "pricePack";
      saleField = "type";
      break;
    // code block
  }
  return { priceField, saleField };
};

export async function createOrderCodeExternal(req, res, next) {
  try {
    const list = await orderCodeModel.find({
      createdAt: {
        $gte: moment().startOf("date").toDate(),
      },
    });
    const orderCode = `ĐN-${moment().format("DDMMYYYY")}-${list?.length + 1}`;
    await orderCodeModel.create({
      orderCode,
    });
    return res.status(200).json({
      message: "Tạo mã đơn ngoài",
      data: orderCode,
    });
  } catch (error) {
    next(error);
  }
}

export async function makeOrderVersion2(req, res, next) {
  try {
    const reqUser = req.user;
    const { orderCode, customer, producer, noteOrder, cartItems } = req.body;

    const checkCode = await OrderModel.find({
      orderCode,
    });

    if (checkCode?.length > 0) {
      return next(createError(400, "Mã đơn hàng đã tồn tại !"));
    }

    const domains = await DomainModel.find({
      _id: {
        $in: cartItems,
      },
      isDeleted: false,
      isShow: true,
      status: 1,
    });

    if (domains.length < 1) {
      return next(createError(400, "Không tìm thấy dịch vụ"));
    }

    const checkProducer = await userModel.findById(producer);

    if (!checkProducer) {
      return next(createError(400, "Không tìm thấy đối tác"));
    }

    let orderItems = [];
    let totalPrice = 0,
      totalPriceDiscount = 0,
      quantity = 0;

    // thêm stt cho từng orderitems
    let key = 1;

    await Promise.all(
      domains?.map(async (val) => {
        orderItems.push({
          domainId: val?._id,
          domain: val?.domain,
          productCode: val?.sku,
          group: val?.group,
          producer,
          customer,
          bookService: val?.creator,
          key,
          isExternal: Boolean(orderCode?.includes("ĐN")),
          ...noteOrder[val._id],
        });
        totalPrice += noteOrder[val._id]?.overallAmount;
        totalPriceDiscount += noteOrder[val._id]?.discountAmount;
        quantity += noteOrder[val._id]?.quantity;
        key++;
      })
    );
    console.log(domains?.[0]?.creator);
    const order = {
      orderCode,
      customer,
      producer,
      bookService: domains?.[0]?.creator,
      employee: req.user?._id,
      items: orderItems,
      totalPrice,
      totalPriceDiscount,
      isExternal: Boolean(orderCode?.includes("ĐN")),
    };
    console.log(cartItems);

    let newOrders = await OrderModel.create(order);

    req.orders = newOrders;

    await cartItemModel.deleteMany({ domain: { $in: cartItems } });

    return res.status(201).json({
      status: RESULT.SUCCESS,
      message: "Đặt hàng thành công, vui lòng chờ nhà cung cấp xác nhận",
      data: newOrders,
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    next(error);
  }
}

export async function getPaging(req, res, next) {
  try {
    const reqUser = req.user;
    const {
      page = 1,
      limit = 10,
      keyword,
      status,
      startDate,
      endDate,
      services,
      tab,
      service,
    } = req.query;
    const skip = (page - 1) * limit;
    const startDateOrder = moment().startOf("month").toISOString();
    const endDateOrder = moment().endOf("month").toISOString();
    let start = new Date(1970, 0, 0);
    let end = new Date();
    let condition = {};

    const and = [];
    // same
    if (reqUser.role?.name === ROLES.EMPLOYEE) {
      and.push({
        $or: [
          { employee: new mongoose.Types.ObjectId(reqUser._id) },
          { bookService: new mongoose.Types.ObjectId(reqUser._id) },
        ],
      });
    }

    // same
    if (tab) {
      if (tab === "pending") {
        const or = [
          {
            status: { $in: [1, 2, 3, 12] },
          },
        ];

        and.push({
          $or: or,
        });
      } else if (tab === "success") {
        const or = [
          {
            status: { $in: [4, 5] },
          },
        ];
        and.push({
          $or: or,
        });
      } else if (tab === "cancel") {
        const or = [
          {
            status: { $in: [6, 7, 8] },
          },
        ];
        and.push({
          $or: or,
        });
      }
    }

    // same
    if (keyword) {
      and.push({
        $or: [
          {
            $or: [
              {
                orderCode: keyword,
              },
              {
                domain: { $regex: `.*${keyword}.*`, $options: "i" },
              },
            ],
          },
        ],
      });
    }
    // same
    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0);
      //
      if (!endDate) {
        end = new Date(startDate);
      } else {
        end = new Date(endDate);
      }
      end.setHours(23, 59, 59);

      condition["createdAt"] = {
        $gte: start,
        $lte: end,
      };
    }
    // same
    if (status) {
      condition["status"] = parseInt(status);
    }

    if (services) {
      condition["items.service"] = services;
    }

    //search for service
    if (
      reqUser.role?.name === ROLES.ADMIN ||
      reqUser.role?.name === ROLES.ACCOUNTANT
    ) {
      if (service) {
        and.push({ "items.service": service });
      }
    }

    if (and?.length > 0) {
      condition["$and"] = and;
    }
    // console.log(condition);
    // console.log(
    condition["$and"]?.forEach((e, i) => {
      console.log(e["$or"], i);
    });
    // );
    const [count, items, totalMoney] = await Promise.all([
      OrderModel.countDocuments(condition),
      OrderModel.find(condition)
        .populate({
          path: "employee",
          select: "username fullName telegramUsername",
          populate: {
            path: "role",
            select: "name",
          },
        })
        .populate({
          path: "producer",
          select: "username fullName",
        })
        .populate(
          "bookService",
          [ROLES.ADMIN, ROLES.ACCOUNTANT].includes()
            ? "username fullName bankNumber usdt bankName nameInCard telegramUsername"
            : "username fullName telegramUsername"
        )
        .limit(limit)
        .skip(skip)
        .sort({
          createdAt: -1,
        })
        .exec(),
    ]);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "success",
      data: {
        count,
        items,
        totalMoney:
          reqUser?.role?.name === ROLES.PRODUCER
            ? 0
            : totalMoney?.[0]?.totalAmount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDataExcel(req, res, next) {
  try {
    const reqUser = req.user;
    const { keyword, status, startDate, endDate, tab, service } = req.query;
    let start = new Date(1970, 0, 0);
    let end = new Date();
    let condition = {};

    const and = [];

    // same
    if (
      reqUser.role?.name === ROLES.EMPLOYEE ||
      reqUser.role?.name === ROLES.BOOK_SERVICE
    ) {
      and.push({
        $or: [{ employee: reqUser._id }, { bookService: reqUser._id }],
      });
    }

    // same
    if (tab) {
      if (tab === "pending") {
        const or = [
          {
            status: { $in: [1, 2, 3, 12] },
          },
        ];

        and.push({
          $or: or,
        });
      } else if (tab === "success") {
        const or = [
          {
            status: { $in: [4, 5] },
          },
        ];
        and.push({
          $or: or,
        });
      } else if (tab === "cancel") {
        const or = [
          {
            status: { $in: [6, 7, 8] },
          },
        ];
        and.push({
          $or: or,
        });
      }
    }
    // same
    if (keyword) {
      and.push({
        $or: [
          {
            $or: [
              {
                orderCode: keyword,
              },
              {
                domain: { $regex: `.*${keyword}.*`, $options: "i" },
              },
            ],
          },
        ],
      });
      // condition["$and"] = [
      //   {
      //     $or: [
      //       {
      //         orderCode: keyword,
      //       },
      //       {
      //         domain: { $regex: `.*${keyword}.*`, $options: "i" },
      //       },
      //     ],
      //   },
      // ];
    }
    // same
    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0);
      //
      if (!endDate) {
        end = new Date(startDate);
      } else {
        end = new Date(endDate);
      }
      end.setHours(23, 59, 59);

      condition["createdAt"] = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
    // same
    if (status) {
      condition["status"] = status;
    }

    // same 0 -> 7
    if (reqUser.role?.name === ROLES.PRODUCER) {
      if (status) {
        if (status < 0 && status > 7) {
          return next(createError(422, messageByLanguage(req, "validStatus")));
        }
      } else {
        condition["status"] = {
          $gte: 0,
          $lte: 8,
        };
      }
    }

    //search for service
    if (
      reqUser.role?.name === ROLES.ADMIN ||
      reqUser.role?.name === ROLES.ACCOUNTANT
    ) {
      if (service) {
        and.push({ "items.service": service });
      }
    }

    if (and?.length > 0) {
      condition["$and"] = and;
    }

    const [items, domains] = await Promise.all([
      OrderModel.find(condition)
        .populate({
          path: "employee",
          select: "username fullName telegramUsername",
          populate: {
            path: "role",
            select: "name",
          },
        })
        .populate(
          "bookService",
          "username fullName telegramUsername bankName nameInCard bankNumber"
        )
        .sort("-createdAt")
        .lean()
        .exec(),
      DomainModel.find().populate("creator", "fullName").lean().exec(),
    ]);
    const objDomain = {};
    domains?.map((item) => (objDomain[item?.domain] = item?.creator?.fullName));
    const finalData = items?.map((item) => {
      const temp = { ...item };
      temp.domain = {
        domain: item?.domain,
        creator: objDomain[item?.domain],
      };
      return temp;
    });
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "success",
      data: {
        items: finalData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const reqUserId = req.user._id;
    const userCurrent = req.user;
    const roleName = req.user?.role?.name;
    const LIST_CHECK_LINK_COMPLETE = [
      "guestPost",
      "entity",
      "backlink",
      "tool",
    ];
    const id = req.params.id;
    const status = req.body.status;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, messageByLanguage(req, "invalidOrderID")));
    }

    const order = await OrderModel.findById(id)
      .populate({
        path: "employee",
        populate: "role",
      })
      .populate({
        path: "bookService",
        populate: "role",
      })
      .lean();

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    switch (roleName) {
      case ROLES.EMPLOYEE:
        if (
          order.employee?._id.toString() !== reqUserId.toString() ||
          ![4, 7, 8, 12].includes(+status)
        ) {
          return next(createError(403, messageByLanguage(req, "notAuthorize")));
        }
        break;

      case ROLES.BOOK_SERVICE:
        if (![2, 3, 6].includes(+status)) {
          return next(createError(403, messageByLanguage(req, "notAuthorize")));
        }
        break;

      case ROLES.ACCOUNTANT:
        if (![5].includes(+status)) {
          return next(createError(403, messageByLanguage(req, "notAuthorize")));
        }
        break;
      default:
        break;
    }

    if ([2, 3, 4, 5].includes(+status) && [6, 7, 8].includes(order?.status)) {
      return next(createError(400, "Đơn hàng đã hủy không thể thao tác!"));
    }

    const data = await OrderModel.updateOne({ _id: id }, { status });

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDetail(req, res, next) {
  try {
    const orderCode = req.params.orderCode;
    let order = await OrderModel.findOne({ orderCode })
      .populate("employee", "username fullName")
      .populate("producer", "username fullName")
      .populate(
        "bookService",
        [ROLES.ADMIN, ROLES.ACCOUNTANT].includes()
          ? "username fullName bankNumber bankName nameInCard telegramUsername"
          : "username fullName telegramUsername"
      )
      .lean();

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }
    order.items?.map((item, index) => (item.key = item.key || index + 1));
    order.items?.sort((a, b) => a?.key - b?.key);
    if (
      order?.items[0]?.service === "backlink" ||
      order?.items[0]?.service === "entity"
    ) {
      const listObjectDomain = {};
      const codeProducts = order?.items?.map((item) => {
        return item?.productCode;
      });
      const domains = await DomainModel.find({
        sku: { $in: codeProducts },
      }).lean();
      if (domains?.length !== 0) {
        domains?.map((item) => (listObjectDomain[item.sku] = item));
        const itemOrder = order?.items?.map((item, index) => {
          const temp = { ...item };
          temp.urlDemo = listObjectDomain[item.productCode]?.urlDemo;
          return temp;
        });
        order.items = itemOrder;
      }
    }

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "success",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export const updateNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { note, noteAssistant } = req.body;

    // if (req.user?.role?.name == "producer")
    //   return next(createError(403, messageByLanguage(req, "youHaveNoRights")));

    const order = await OrderModel.findOne({ _id: id })
      .populate("BookService")
      .populate("employee");

    const reqUserId = req.user._id;

    if ([ROLES.EMPLOYEE].includes(req.user?.role?.name)) {
      if (reqUserId.toString() !== order?.employee?._id.toString()) {
        return next(createError(404, messageByLanguage(req, "orderNotFound")));
      }
      order.note = note;
    } else {
      order.noteAssistant = noteAssistant;
    }
    await order.save();

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật ghi chú đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBillOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { imageBill } = req.body;

    if (
      ![ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.ACCOUNTANT].includes(
        req.user?.role?.name
      )
    )
      return next(createError(403, messageByLanguage(req, "youHaveNoRights")));

    const order = await OrderModel.findOne({ _id: id }).populate("bookService");

    const reqUserId = req.user._id;

    if ([ROLES.EMPLOYEE].includes(req.user?.role?.name)) {
      if (reqUserId.toString() !== order?.employee.toString()) {
        return next(createError(404, messageByLanguage(req, "orderNotFound")));
      }
    }

    order.imageBill = imageBill;
    await order.save();

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật bill đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEditOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isEdit, note } = req.body;
    // if (req.user?.role?.name == ROLES.PRODUCER)
    //   return next(createError(400, "Ai cho bạn đổi cái này!"));
    if (req.user?.role?.name == ROLES.EMPLOYEE && isEdit === 1)
      return next(createError(400, "Tự sửa đi bạn ơi!"));
    if (isEdit === 1 && !note)
      return next(
        createError(400, messageByLanguage(req, "pleaseFillContent"))
      );

    const order = await OrderModel.findOne({ _id: id })
      .populate("bookService")
      .populate({
        path: "employee",
        populate: "role",
      });

    const oldIsEdit = order?.isEdit;

    const reqUserId = req.user._id;
    if ([ROLES.EMPLOYEE].includes(req.user?.role?.name)) {
      if (reqUserId.toString() !== order?.employee?._id.toString()) {
        return next(createError(404, messageByLanguage(req, "orderNotFound")));
      }
      order.isEdit = isEdit;
    } else {
      order.isEdit = isEdit;
      order.contentEdit = note;
    }
    await order.save();

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật ghi chú đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderByLinhChi = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { brand, note, noteAssistant, totalPriceDiscount, team } = req.body;

    if (req.user?.role?.name !== "admin")
      return next(createError(403, messageByLanguage(req, "youHaveNoRights")));

    const order = await OrderModel.findOne({ _id: id }).populate("employee");

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    order.brand = brand;
    order.note = note;
    order.team = team;
    order.noteAssistant = noteAssistant;
    order.totalPriceDiscount = totalPriceDiscount;
    await order.save();

    await updateBudgetWhenUpdateOrder(order, "update", 0);

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật ghi chú đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const checkQuantityItem = (orders) => {
  let count = 0;
  orders?.forEach((element) => (count += element?.quantity));
  return count;
};

export const updateProductInOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { items, totalPrice, totalPriceDiscount } = req.body;
    // if (req.user?.role?.name !== "producer")
    //   return next(createError(403, "Bạn không có quyền!"));
    let quantityService = 0;

    items.forEach((item) => {
      quantityService += item.quantity;
    });
    const order = await OrderModel.findOne({ _id: id })
      .populate("bookService")
      .populate({
        path: "employee",
        populate: "role",
      });
    const itemBefore = [...order.items];

    if (order?.status === 0) order.status = 12; // truong hop ma don hang da duoc tt tp xac nhan
    if (checkQuantityItem(items) !== checkQuantityItem(itemBefore)) {
      order.quantity = quantityService;
      order.totalPrice = totalPrice;
      order.totalPriceDiscount = totalPriceDiscount;
    }

    order.items = items?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));

    await order.save();
    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật ghi chú đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImageBill = async (req, res, next) => {
  try {
    const id = req.params.id;

    const order = await OrderModel.findOne({ _id: id });

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    const updateOrder = await OrderModel.updateOne(
      { _id: id },
      { imageBill: req.body.imageBill }
    );

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật bill đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImageDiscountForSEO = async (req, res, next) => {
  try {
    const id = req.params.id;

    const order = await OrderModel.findOne({ _id: id });

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    const updateOrder = await OrderModel.updateOne(
      { _id: id },
      { imageDiscountForSEO: req.body.imageDiscountForSEO }
    );

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật bill đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIsPayment = async (req, res, next) => {
  try {
    const id = req.params.id;

    const order = await OrderModel.findOne({ _id: id });

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    const updateOrder = await OrderModel.updateOne(
      { _id: id },
      { isPayment: true }
    );

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderCode = async (req, res, next) => {
  try {
    const id = req.params.id;

    const order = await OrderModel.findOne({ _id: id });

    if (!order) {
      return next(createError(404, messageByLanguage(req, "orderNotFound")));
    }

    const isExistingOrderCode = await OrderModel.findOne({
      orderCode: req.body.orderCode,
    });

    if (isExistingOrderCode) {
      return next(createError(404, "Mã đơn hàng đã tồn tại"));
    }

    const updateOrder = await OrderModel.updateOne(
      { _id: id },
      { orderCode: req.body.orderCode }
    );

    return res.status(200).json({
      status: RESULT.SUCCESS,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
