import mongoose from "mongoose";
import { toSlug, getUniqueCode } from "../common/index.js";

const DomainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
    },

    slug: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
    },

    sectors: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Sector",
      },
    ],

    phone: {
      type: String,
    },

    group: {
      type: String,
    },

    // text link
    textlinkPrice: {
      type: Number,
      default: 0,
    },
    textlinkHomePrice: {
      type: Number,
      default: 0,
    },
    textlinkHeaderPrice: {
      type: Number,
      default: 0,
    },
    textlinkFooterPrice: {
      type: Number,
      default: 0,
    },
    textlinkDuration: {
      type: Number,
      default: 0,
    },
    noteTextLink: {
      type: String,
    },
    noteGuestPost: {
      type: String,
    },

    // traffic
    trafficPrice: {
      type: Number,
      default: 0,
    },

    // guestPost
    guestPostPrice: {
      type: Number,
      default: 0,
    },

    //banner
    bannerPrice: {
      type: Number,
      default: 0,
    },

    bannerNumber: {
      type: Number,
      default: 0,
    },

    bannerDuration: {
      type: Number,
      default: 0,
    },

    // isSale
    isSaleGuestPost: {
      type: Boolean,
      default: false,
    },

    isSaleTextLink: {
      type: Boolean,
      default: false,
    },

    isSaleTextHome: {
      type: Boolean,
      default: false,
    },

    isSaleTextFooter: {
      type: Boolean,
      default: false,
    },

    isSaleTextHeader: {
      type: Boolean,
      default: false,
    },

    isSaleBanner: {
      type: Boolean,
      default: false,
    },

    // show
    isShow: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    typePack: {
      type: String,
      default: "domain",
    },
    type: {
      type: String,
    },
    urlDemo: {
      type: String,
    },
    note: {
      type: String,
    },
    pricePack: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      enum: [0, 1], // 0: chua duyet   1: đã duyệt
      default: 1,
    },

    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    index: {
      type: Boolean,
      default: false,
    },
    noIndex: {
      type: Boolean,
      default: false,
    },
    guestPostDoFollow: {
      type: Boolean,
      default: false,
    },
    guestPostNoFollow: {
      type: Boolean,
      default: false,
    },
    textLinkDoFollow: {
      type: Boolean,
      default: false,
    },
    textLinkNoFollow: {
      type: Boolean,
      default: false,
    },
    textlinkUSDPrice: {
      type: Number,
      default: 0,
    },
    textlinkHomeUSDPrice: {
      type: Number,
      default: 0,
    },
    textlinkHeaderUSDPrice: {
      type: Number,
      default: 0,
    },
    textlinkFooterUSDPrice: {
      type: Number,
      default: 0,
    },
    guestPostUSDPrice: {
      type: Number,
      default: 0,
    },
    bannerUSDPrice: {
      type: Number,
      default: 0,
    },
    exchange: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);

DomainSchema.pre("validate", async function (next) {
  if (!this?.sku) {
    let sku = null;
    let count = 10;
    do {
      const random = await getUniqueCode();
      sku = `DOM-${random}`;

      const existed = await DomainModel.findOne({ sku });
      if (existed) count--;
      else count = 0;
    } while (count > 0);

    this.sku = sku;
    const random = await getUniqueCode();
    const slug = toSlug(this.domain + "-" + random);
    this.slug = slug;
  }
  next();
});

const DomainModel = new mongoose.model("Domain", DomainSchema);

export default DomainModel;
