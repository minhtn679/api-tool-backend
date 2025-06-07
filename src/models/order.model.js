import mongoose from "mongoose";
import { getUniqueCode } from "../common/index.js";
import { SALE_SERVICES } from "../common/constant.js";
import moment from "moment/moment.js";

const OrderItemSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
  },

  productCode: {
    type: String,
    required: true,
  },

  group: {
    type: String,
  },

  domainId: {
    type: mongoose.Types.ObjectId,
    ref: "Domain",
  },

  key: {
    type: Number,
    required: false,
    default: 0,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  service: {
    type: String,
    enum: [...Object.values(SALE_SERVICES)],
    required: true,
  },

  overallAmount: {
    type: Number,
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
  },

  anchorText1: {
    type: String,
  },
  anchorText2: {
    type: String,
  },
  url1: {
    type: String,
  },
  url2: {
    type: String,
  },
  linkDrive: {
    type: String,
  },
  linkPost: {
    type: String,
  },
  timeStart: {
    type: String,
  },

  timeExpired: {
    type: String,
  },
  textLink_Note: {
    type: String,
  },

  traffic_TimeStart: {
    type: String,
  },
  traffic_TimeExpired: {
    type: String,
  },
  traffic_IDCamp: {
    type: String,
  },
  traffic_TimeOnSite: {
    type: String,
  },
  entity_key: {
    type: String,
  },
  entity_volume: {
    type: String,
  },
  newOrExtend: {
    type: String,
  },
  timeCompleted: {
    type: String,
  },
  timeWarranty: {
    type: String,
  },
  traffic_Key: {
    type: String,
  },
  traffic_QuantityPerDay: {
    type: String,
  },
  traffic_QuantityDay: {
    type: String,
  },
  traffic_IdCamp: {
    type: String,
  },
  traffic_LinkIp: {
    type: String,
  },
  traffic_UserName: {
    type: String,
  },
  traffic_Password: {
    type: String,
  },
  isComplimentary: {
    type: Boolean,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },

    customer: {
      type: String,
    },

    producer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    bookService: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    employee: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceDiscount: {
      type: Number,
      required: true,
    },

    isEdit: {
      type: Number,
      default: 0,
      enums: [0, 1, 2], // 0 là không cần sửa, 1 là cần sửa, 2 là đã sửa
    },
    contentEdit: {
      type: String,
    },
    domain: {
      type: String,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    urlDoc: {
      type: String,
    },
    status: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 12],
      default: 1,
    },

    // ====status
    // 1 Sale tạo đơn hàng
    // 2 Book dịch vụ xác nhận
    // 3 Book dịch vụ hoàn thành
    // 4 Sale xác nhận hoàn thành
    // 5 Kế toán xác nhận thanh toán
    // 6 Book dịch vụ hủy
    // 7 Book dịch vụ không hoàn thành
    // 8 Sale hủy đơn hàng
    // 12 Cần sửa

    isAutoCancel: {
      type: Boolean,
      default: false,
    },

    note: {
      type: String,
    },
    timeBank: {
      type: Date,
      default: null,
    },
    noteAssistant: {
      type: String,
    },

    imageBill: {
      type: String,
    },

    service: {
      type: String,
    },

    isPayment: {
      type: Boolean,
    },

    imageDiscountForSEO: {
      type: String,
    },

    isExternal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OrderModel = new mongoose.model("Order", OrderSchema);

export default OrderModel;
