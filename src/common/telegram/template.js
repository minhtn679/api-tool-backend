// import {
//   ESCROW_STATUS_NAME,
//   ESCROW_TYPE_NAME,
//   ORDER_SATUS_NAME,
//   ORDER_SATUS_NAME_EXTERNAL_CUSTOMER,
//   ROLES,
//   ROLES_NAME,
//   SERVICE_NAME,
//   TYPE_PACK,
//   USER_STATUS_NAME,
//   WALLET_TYPE,
// } from "../constant.js";
// import moment from "moment";
// import dotenv from "dotenv";
// import { formatMoney } from "../index.js";
// dotenv.config();

// const formatPrice = (price) => {
//   return new Intl.NumberFormat("vi", {
//     style: "currency",
//     currency: "VND",
//   }).format(price);
// };
// const checkQuantityItem = (orders) => {
//   let count = 0;
//   orders?.forEach((element) => (count += element?.quantity));
//   return count;
// };

// const convertOrderItemToText = (item) => {
//   let result = "";
//   Object.entries(item?._doc || item).forEach(([key, value]) => {
//     if (key === "domain") {
//       result += `\t <b>Domain: </b> <code>${value}</code>  \n`;
//     } else if (key === "discountAmount") {
//       result += `\t <b>Đơn giá: </b> <code>${formatPrice(value)}</code>  \n`;
//     } else if (key === "quantity") {
//       result += `\t <b>Số lượng: </b> <code>${value}</code>  \n`;
//     } else if (key === "service") {
//       result += `\t <b>Dịch vụ: </b> <code>${value}</code>  \n`;
//     } else if (key === "anchorText1") {
//       result += `\t <b>Anchor text 1: </b> <code>${value}</code>  \n`;
//     } else if (key === "url1") {
//       result += `\t <b>Url 1: </b> <code>${value}</code>  \n`;
//     } else if (key === "anchorText2") {
//       result += `\t <b>Anchor text 2: </b> <code>${value}</code>  \n`;
//     } else if (key === "url2") {
//       result += `\t <b>Url 2: </b> <code>${value}</code>  \n`;
//     } else if (key === "timeStart") {
//       result += `\t <b>Ngày bắt đầu: </b> <code>${value}</code>  \n`;
//     } else if (key === "timeExpired") {
//       result += `\t <b>Ngày hết hạn: </b> <code>${value}</code>  \n`;
//     } else if (key === "linkPost") {
//       result += `\t <b>Link hoàn thành: </b> <code>${value}</code>  \n`;
//     } else if (key === "linkDrive") {
//       result += `\t <b>Link Drive: </b> <code>${value}</code>  \n`;
//     } else if (key === "newOrExtend") {
//       result += `\t <b>Đặt mới/Gia hạn: </b> <code>${value}</code>  \n`;
//     }
//   });

//   return result;
// };

// export const TEMPLATE_MESSAGE = {
//   ORDER_TTTP_TL: ({
//     orderCode,
//     customer,
//     producer,
//     items = [],
//     totalPrice = 0,
//   }) => {
//     let bodyOrder = ``;
//     items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });

//     const template =
//       `<b>THÔNG BÁO ĐẶT HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>SEO/CONTENT: </b> <code>${customer}</code> \n` +
//       `<b>NCC: </b> <code>${producer}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice(totalPrice)}</i></code></b> \n\n`;

//     return template;
//   },

//   ORDER_PRODUCER: (order) => {
//     let bodyOrder = ``;
//     order?.items?.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPrice);
//     const status = ORDER_SATUS_NAME[0];
//     const template =
//       `<b>PM_SEO: THÔNG BÁO ĐẶT HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${order.customer?.username}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n\n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/producer/don-hang/${orderCode}">PM_SEO</a>`;

//     return template;
//   },
//   COMMENT_ORDER: ({ order, user, content }) => {
//     const template =
//       `<b>PM_SEO: BÌNH LUẬN ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>Nội dung: </b> ${
//         content?.textContent ? content?.textContent : `Hình ảnh`
//       } \n` +
//       `<b>Người bình luận: </b> <code>${user?.username}</code> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;
//     return template;
//   },
//   COMMENT_ORDER_TO_PRODUCER: ({ order, user, content }) => {
//     const template =
//       `<b>ĐƠN HÀNG CỦA BẠN CÓ BÌNH LUẬN MỚI</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>Nội dung: </b> ${
//         content?.textContent ? content?.textContent : `Hình ảnh`
//       } \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;
//     return template;
//   },
//   COMMENT_ORDER_TO_TROLY: ({ order, user, content }) => {
//     const template =
//       `<b>${
//         user?.role?.name === ROLES.PRODUCER
//           ? "ĐỐI TÁC"
//           : user?.role?.name === ROLES.EXTERNAL_CUSTOMER
//           ? "KHÁCH HÀNG NGOÀI"
//           : "SEO/CONTENT"
//       } TRẢ LỜI BÌNH LUẬN</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>Nội dung: </b> ${
//         content?.textContent ? content?.textContent : `Hình ảnh`
//       } \n` +
//       `<b>Người bình luận: </b> <code>${user?.username}</code> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;
//     return template;
//   },

//   DELETE_COMMENT_ORDER: ({ order, user, content }) => {
//     const template =
//       `<b>PM_SEO: XÓA BÌNH LUẬN ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>Nội dung: </b> ${
//         content?.textContent ? content?.textContent : `Hình ảnh`
//       } \n` +
//       `<b>Người xóa: </b> <code>${user?.username}</code> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;
//     return template;
//   },
//   ORDER_CUSTOMER: ({
//     orderCode,
//     status = ORDER_SATUS_NAME["-2"],
//     producer,
//     items = [],
//     totalPrice = 0,
//     totalPriceDiscount = 0,
//   }) => {
//     let bodyOrder = ``;
//     items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPriceDiscount);
//     const template =
//       `<b>PM_SEO: ĐẶT HÀNG THÀNH CÔNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n\n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n\n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/customer/don-hang/${orderCode}">PM_SEO</a>`;

//     return template;
//   },

//   ORDER_EXTERNAL_CUSTOMER: ({
//     orderCode,
//     status = ORDER_SATUS_NAME_EXTERNAL_CUSTOMER["0"],
//     producer,
//     items = [],
//     totalPrice = 0,
//     totalPriceDiscount = 0,
//   }) => {
//     let bodyOrder = ``;
//     items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPriceDiscount);
//     const template =
//       `<b>KHÁCH HÀNG NGOÀI: ĐẶT HÀNG THÀNH CÔNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n\n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n\n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/customer/don-hang/${orderCode}">Khách hàng ngoài</a>`;

//     return template;
//   },
//   TTTP_ACCEPTED_TTTP: ({ order, status, userAction }) => {
//     const template =
//       `<b>PM_SEO: TT/TP ĐÃ XÁC NHẬN ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>SEO/CONTENT: </b> <code>${order?.customer?.username}</code>  \n` +
//       `<b>TEAM: </b> <code>${order?.team?.name}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${order?.producer?.username}</code> \n` +
//       `<b>Người duyệt: </b> <code>${userAction}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n\n`;
//     // `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/customer/don-hang/${order?.orderCode}">PM_SEO</a>`;
//     return template;
//   },
//   TL_ACCEPTED_ORDER: ({ order, status, userAction }) => {
//     const template =
//       `<b>PM_SEO: TL ĐÃ DUYỆT ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order?.orderCode}</code>  \n` +
//       `<b>SEO/CONTENT: </b> <code>${order?.customer?.username}</code>  \n` +
//       `<b>TEAM: </b> <code>${order?.team?.name}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${order?.producer?.username}</code> \n` +
//       `<b>Người duyệt: </b> <code>${userAction}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n\n`;
//     // `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/customer/don-hang/${order?.orderCode}">PM_SEO</a>`;
//     return template;
//   },
//   PRODUCER_ACCEPTED: ({ order, status }) => {
//     const template =
//       `<b>PM_SEO: NHÀ CUNG CẤP ĐÃ XÁC NHẬN ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n\n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/customer/don-hang/${orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   PRODUCER_COMPLETED: ({ orderCode, producer, status }) => {
//     const template =
//       `<b>PM_SEO: NHÀ CUNG CẤP ĐÃ HOÀN THÀNH DỊCH VỤ</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `Vui lòng kiểm tra và xác nhận trên hệ thống: <a href="${process.env.CLIENT_URL}/customer/don-hang/${orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   CUSTOMER_CONFIRMED: ({ order, status }) => {
//     let bodyOrder = ``;
//     order.items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPriceDiscount);
//     const template =
//       `<b>PM_SEO: SEO/CONTENT ĐÃ XÁC NHẬN HOÀN THÀNH ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order.orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${order.customer.username}</code> \n` +
//       `<b>Telegram khách hàng: </b> <code>${order.customer.telegramUsername}</code> \n` +
//       `<b>Nhà cung cấp: </b> <code>${order.producer.username}</code> \n` +
//       `<b>Telegram nhà cung cấp: </b> <code>${order.producer.telegramUsername}</code> \n` +
//       `<b>STK nhà cung cấp: </b> <code>${order.producer.bankNumber}</code> \n` +
//       `<b>Ngân hàng: </b> <code>${order.producer.bankName}</code> \n` +
//       `<b>Tên trên thẻ: </b> <code>${order.producer.nameInCard}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/admin/don-hang/${order.orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   TTTP_CONFIRMED: ({ order, status, userAction }) => {
//     let bodyOrder = ``;
//     order.items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPriceDiscount);
//     const template =
//       `<b>PM_SEO: TTTP ĐÃ DUYỆT THANH TOÁN, CHỜ TL DUYỆT THANH TOÁN</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order.orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${order.customer.username}</code> \n` +
//       `<b>Telegram khách hàng: </b> <code>${order.customer.telegramUsername}</code> \n` +
//       `<b>Nhà cung cấp: </b> <code>${order.producer.username}</code> \n` +
//       `<b>Telegram nhà cung cấp: </b> <code>${order.producer.telegramUsername}</code> \n` +
//       `<b>STK nhà cung cấp: </b> <code>${order.producer.bankNumber}</code> \n` +
//       `<b>Ngân hàng: </b> <code>${order.producer.bankName}</code> \n` +
//       `<b>Tên trên thẻ: </b> <code>${order.producer.nameInCard}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n` +
//       `<b>Người duyệt: </b> <code>${userAction}</code> \n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/admin/don-hang/${order.orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   TL_ACCEPT_PAYMENT: ({ order, status, userAction }) => {
//     let bodyOrder = ``;
//     order.items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPriceDiscount);
//     const template =
//       `<b>PM_SEO: TRỢ LÝ ĐÃ DUYỆT THANH TOÁN, CHỜ THANH TOÁN ĐƠN HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order.orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${order.customer.username}</code> \n` +
//       `<b>Telegram khách hàng: </b> <code>${order.customer.telegramUsername}</code> \n` +
//       `<b>Nhà cung cấp: </b> <code>${order.producer.username}</code> \n` +
//       `<b>Telegram nhà cung cấp: </b> <code>${order.producer.telegramUsername}</code> \n` +
//       `<b>STK nhà cung cấp: </b> <code>${order.producer.bankNumber}</code> \n` +
//       `<b>Ngân hàng: </b> <code>${order.producer.bankName}</code> \n` +
//       `<b>Tên trên thẻ: </b> <code>${order.producer.nameInCard}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n` +
//       `<b>Người duyệt: </b> <code>${userAction}</code> \n` +
//       `Truy cập website để xem chi tiết: <a href="${process.env.CLIENT_URL}/admin/don-hang/${order.orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   TL_ACCEPT_PAYMENT_TO_PRODUCER: ({ order }) => {
//     let bodyOrder = ``;
//     order.items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(order.totalPriceDiscount);
//     const template =
//       `<b>TRỢ LÝ ĐÃ DUYỆT THANH TOÁN</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${order.orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${order.customer.username}</code> \n` +
//       `<b>Telegram khách hàng: </b> <code>${order.customer.telegramUsername}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n`;
//     return template;
//   },

//   SUPPORTER_PAYMENT: ({
//     orderCode,
//     producer,
//     customer,
//     status = ORDER_SATUS_NAME[6],
//     items = [],
//     totalPrice = 0,
//     totalPriceDiscount = 0,
//     role,
//   }) => {
//     let bodyOrder = ``;
//     items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPriceDiscount);
//     const template =
//       `<b>PM_SEO: ĐƠN HÀNG ĐÃ ĐƯỢC THANH TOÁN</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Khách hàng: </b> <code>${customer}</code> \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n` +
//       `Vui lòng kiểm tra và xác nhận trên hệ thống: <a href="${process.env.CLIENT_URL}/${role}/don-hang/${orderCode}">PM_SEO</a>`;
//     return template;
//   },

//   LOG_LOGIN: (username, requestIp) => {
//     return (
//       `<b>${username}</b> đăng nhập \n` +
//       `<b>IP:</b> ${requestIp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_SIGNUP: (user, role, requestIp) => {
//     return (
//       `Người dùng đăng ký tài khoản \n` +
//       `Phân quyền: <b>${role}</b> \n` +
//       `Username: <b>${user?.username}</b> \n` +
//       // `Email: <b>${user?.email}</b> \n` +
//       // `SDT: <b>${user?.phone}</b> \n` +
//       `Telegram: <b>${user?.telegramUsername}</b> \n` +
//       `<b>IP:</b> ${requestIp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_CONFIRM_SIGNUP: (user, requestIp) => {
//     return (
//       `<b>${user?.username}</b> kích hoạt tài khoản thành công \n` +
//       `<b>IP:</b> ${requestIp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_CHANGE_PASSWORD: (user, requestIp) => {
//     return (
//       `<b>${user?.username}</b> thay đổi mật khẩu \n` +
//       `<b>IP:</b> ${requestIp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   LOG_REQUEST_PASSWORD_RESET: (user, requestIp) => {
//     return (
//       `<b>${user?.username}</b> yêu cầu đặt lại mật khẩu \n` +
//       `<b>Email:</b> ${user?.email} \n` +
//       `<b>IP:</b> ${requestIp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_ORDER: ({
//     orderCode,
//     customer,
//     producer,
//     items = [],
//     totalPrice = 0,
//     totalPriceDiscount = 0,
//     isExternalCustomer = false,
//     team,
//     brand,
//   }) => {
//     let bodyOrder = ``;
//     items.forEach((item, index) => {
//       bodyOrder += `- Dịch vụ thứ ${index + 1}\n${convertOrderItemToText(
//         item
//       )}`;
//     });
//     const formatPrice = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPrice);
//     const formatPriceDiscount = new Intl.NumberFormat("vi", {
//       style: "currency",
//       currency: "VND",
//     }).format(totalPriceDiscount);
//     const template =
//       `<b>NGƯỜI DÙNG ĐẶT HÀNG</b> \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Khách hàng: </b> <code>${customer}</code> \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatPrice}</i></code></b> \n` +
//       `<b>TỔNG TIỀN SAU CHIẾT KHẤU: <code><i>${formatPriceDiscount}</i></code></b> \n` +
//       `<b>LOẠI KHÁCH HÀNG: <code><i>${
//         isExternalCustomer ? "Khách hàng ngoài" : "PM SEO"
//       }</i></code></b> \n` +
//       `<b>Team: <code><i>${team || "-"}</i></code></b> \n` +
//       `<b>Hậu đài: <code><i>${brand || "-"}</i></code></b> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;

//     return template;
//   },

//   LOG_STATUS_ORDER: (orderCode, status, userAction) => {
//     return (
//       `<b>CẬP NHẬT ĐƠN HÀNG</b>  \n\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Trạng thái: </b> <code>${status}</code> \n` +
//       `<b>Người thực hiện: </b> <code>${userAction}</code> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} `
//     );
//   },

//   LOG_DOMAIN_CREATE: (domain, user, edit = false) => {
//     return (
//       `<b>${edit ? "CHỈNH SỬA TÊN MIỀN" : "THÊM TÊN MIỀN MỚI"}</b>\n` +
//       `<b>Domain:</b> <code>${domain.domain}</code> \n` +
//       `<b>${edit ? "Người sửa" : "Người tạo"}: </b>${user} \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `- Guest Point: <b>${
//         domain.isSaleGuestPost ? formatPrice(domain.guestPostPrice) : "Không"
//       }</b>  \n` +
//       `- Text Link: <b>${
//         domain.isSaleTextLink ? formatPrice(domain.textlinkPrice) : "Không"
//       }</b>\n` +
//       `- Banner: <b>${
//         domain.isSaleBanner ? formatPrice(domain.bannerPrice) : "Không"
//       }</b>\n` +
//       `- Index (GP): <b>${domain.index ? "có" : "Không"}</b>\n` +
//       `- Noindex (GP): <b>${domain.noIndex ? "có" : "Không"}</b>\n` +
//       `- Dofollow (GP): <b>${domain.guestPostDoFollow ? "có" : "Không"}</b>\n` +
//       `- Nofollow (GP): <b>${domain.guestPostNoFollow ? "có" : "Không"}</b>\n` +
//       `- Dofollow (Textlink): <b>${
//         domain.textLinkDoFollow ? "có" : "Không"
//       }</b>\n` +
//       `- Nofollow (Textlink): <b>${
//         domain.textLinkNoFollow ? "có" : "Không"
//       }</b>\n` +
//       `Đăng lên sàn: <b>${domain.isShow ? "Có" : "Không"}</b> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_PACK_CREATE: (domain, user, edit = false) => {
//     return (
//       `<b>${edit ? "CHỈNH SỬA GÓI DỊCH VỤ" : "THÊM GÓI DỊCH VỤ MỚI"}</b>\n` +
//       `<b>Tên gói:</b> <code>${domain.domain}</code> \n` +
//       `<b>${edit ? "Người sửa" : "Người tạo"}: </b>${user} \n` +
//       `<b>Dịch vụ:</b> \n` +
//       `- ${TYPE_PACK[domain?.type]}: <b>${
//         domain.pricePack ? formatPrice(domain.pricePack) : "Không"
//       }</b>  \n` +
//       `Đăng lên sàn: <b>${domain.isShow ? "Có" : "Không"}</b> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_DOMAIN_DELETE: (domain, user) => {
//     return (
//       `<b>XÓA TÊN MIỀN</b>\n` +
//       `<b>Domain:</b> <code>${domain.domain}</code> \n` +
//       `<b>Người xóa: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_CREATE_USER: (user, role, userRequest) => {
//     return (
//       `<b>THÊM NGƯỜI DÙNG MỚI</b>\n` +
//       `<b>Username: </b>${user.username} \n` +
//       `<b>Email: </b>${user.email} \n` +
//       `<b>Phân quyền: </b>${role} \n` +
//       `<b>Telegram ID: </b>${user.telegram} \n` +
//       `<b>Telegram Username: </b>${user.telegramUsername} \n` +
//       `<b>Người thêm: </b>${userRequest} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_UPDATE_USER: (user, role, requestIp, userAction) => {
//     return (
//       `<b>CẬP NHẬT THÔNG TIN NGƯỜI DÙNG</b>\n` +
//       `<b>Username: </b>${user.username} \n` +
//       `<b>Email: </b>${user.email} \n` +
//       `<b>Phân quyền: </b>${role} \n` +
//       `<b>Telegram ID: </b>${user.telegram} \n` +
//       `<b>Telegram Username: </b>${user.telegramUsername} \n` +
//       `${
//         role == "Đối tác" ? `<b>Tên ngân hàng: </b>${user?.bankName} \n` : ""
//       }` +
//       `${
//         role == "Đối tác" ? `<b>Tên tài khoản: </b>${user?.nameInCard} \n` : ""
//       }` +
//       `${
//         role == "Đối tác" ? `<b>Số tài khoản: </b>${user?.bankNumber} \n` : ""
//       }` +
//       `<b>IP: </b>${requestIp} \n` +
//       `<b>Trạng thái: </b>${USER_STATUS_NAME[user?.status]} \n` +
//       `<b>Người cập nhật: </b>${userAction} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   LOG_DELETE_USER: (user, requestIp, userAction) => {
//     return (
//       `<b>ADMIN XÓA USER</b>\n` +
//       `<b>Username: </b>${user.username} \n` +
//       `<b>IP: </b>${requestIp} \n` +
//       `<b>Người thực hiện: </b>${userAction} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_BLOCK_USER: (user1, user2, ip, fp) => {
//     return (
//       `<b>KHÓA TÀI KHOẢN NHÀ CUNG CẤP</b>\n` +
//       `<b>Username: </b>${user1.username}, ${user2.username} \n` +
//       `<b>IP: </b>${ip} \n` +
//       `<b>FP: </b>${fp} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_NEWS_CREATE: (news, edit = false) => {
//     return (
//       `<b>ADMIN ${edit ? "CHỈNH SỬA BÀI VIẾT" : "TẠO BÀI VIẾT MỚI"}</b>\n` +
//       `<b>Tiêu đề: </b>${news.title} \n` +
//       `<b>Đường dẫn tĩnh: </b>${news?.slug} \n` +
//       `<b>Trạng thái: </b>${
//         news?.status == 1
//           ? "Đã duyệt"
//           : news?.status == 2
//           ? "Chờ xét duyệt"
//           : "Nháp"
//       } \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   LOG_NEWS_DELETE: (news) => {
//     return (
//       `<b>ADMIN XÓA BÀI VIẾT</b>\n` +
//       `<b>Tiêu đề: </b>${news.title} \n` +
//       `<b>Đường dẫn tĩnh: </b>${news?.slug} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_DOMAINSEO_CREATE_EDIT: (
//     domain,
//     team,
//     user,
//     isEdit = false,
//     statusText = "",
//     isExternalCustomer = false
//   ) => {
//     return (
//       `<b>NGƯỜI DÙNG ${isEdit ? "SỬA" : "THÊM"} DOMAIN SEO</b>\n` +
//       `<b>Người ${isEdit ? "sửa" : "tạo"}: </b>${user?.username} \n` +
//       `<b>Domain: </b>${domain.name} \n` +
//       `${isExternalCustomer ? "" : `<b>Team: </b>${team?.name} \n`}` +
//       `${isExternalCustomer ? "" : `<b>Hậu đài: </b>${domain.comment} \n`}` +
//       statusText +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   LOG_DOMAINSEO_DELETE: (domain, user) => {
//     return (
//       `<b>NGƯỜI DÙNG XÓA DOMAIN SEO</b>\n` +
//       `<b>Domain: </b>${domain.name} \n` +
//       `<b>Người xóa: </b>${user?.username} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_TEAM_CREATE_EDIT: (team, user, hauDai = [], isEdit = false) => {
//     return (
//       `<b>NGƯỜI DÙNG ${isEdit ? "SỬA" : "THÊM"} TEAM</b>\n` +
//       `<b>Người ${isEdit ? "sửa" : "thêm"}: </b>${user?.username} \n` +
//       `<b>Team: </b>${team.name} \n` +
//       `<b>Hậu đài: </b>${hauDai.toString()} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   LOG_TEAM_DELETE: (team, user) => {
//     return (
//       `<b>NGƯỜI DÙNG XÓA TEAM</b>\n` +
//       `<b>Team: </b>${team.name} \n` +
//       `<b>Người xóa: </b>${user?.username} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_ROLE_CREATE_EDIT: (name, username, isEdit = false) => {
//     return (
//       `<b>${isEdit ? "SỬA" : "THÊM"} PHÂN QUYỀN</b>\n` +
//       `<b>Người ${isEdit ? "sửa" : "thêm"}: </b>${username} \n` +
//       `<b>Tên phân quyền: </b>${name} \n`
//     );
//   },
//   LOG_ROLE_DELETE: (name, username) => {
//     return (
//       `<b>XÓA PHÂN QUYỀN</b>\n` +
//       `<b>Người xóa: </b>${username} \n` +
//       `<b>Tên phân quyền: </b>${name} \n`
//     );
//   },

//   NOTICE_LIMIT_ADMIN: (
//     producer,
//     customer,
//     date = "ngày",
//     typeBudget = "",
//     totalPrice = 0,
//     totalPriceOrderPending = 0,
//     budgetPerOrder = 0,
//     budget = 0
//   ) => {
//     return (
//       `<b>THÔNG BÁO</b> \n` +
//       `NCC  <b>${producer}</b> không thể nhận đơn hàng mới từ <b>${customer}</b>.\n` +
//       `Do NCC <b>${producer}</b> không đủ ngân sách ${date}! \n` +
//       `Loại ngân sách: <b>${typeBudget}</b> \n` +
//       `Số tiền của đơn hàng: <b>${formatMoney(totalPrice)}</b> \n` +
//       `Tổng tiền đơn hàng của đối tác: <b>${formatMoney(
//         totalPriceOrderPending
//       )}</b> \n` +
//       `Ngân sách theo giao dịch: <b>${formatMoney(budgetPerOrder)}</b> \n` +
//       `Ngân sách theo đối tác: <b>${formatMoney(budget)}</b>`
//     );
//   },
//   NOTICE_LIMIT_PRODUCER: (customer, date = "ngày") => {
//     return (
//       `<b>KHÔNG THỂ NHẬN ĐƠN HÀNG MỚI</b> \n` +
//       `Bạn có đơn hàng mới từ <b>${customer}</b> nhưng không thể nhận. Do ngân sách không đủ!`
//     );
//   },

//   NOTICE_PRODUCER_EXIST_IP: (email, users = [], fp) => {
//     return (
//       `<b>‼️ ĐỐI TÁC VỪA ĐĂNG NHẬP BỊ TRÙNG FP ‼️</b> \n` +
//       `Đối tác có tên đăng nhập <b>${email}</b> vừa đăng nhập có fp là <b>${fp}</b> \n` +
//       `Trùng với các người dùng sau: ${users?.toString()}`
//     );
//   },

//   NOTICE_PRODUCER_EXIST_IP_WITH_BLOCK: (email, user = "", reason = "", fp) => {
//     return (
//       `<b>‼️ ĐỐI TÁC MỚI TRÙNG FP VỚI ĐỐI TÁC ĐÃ KHÓA ‼️</b> \n` +
//       `Đối tác: <b>${email}</b> \n` +
//       `FP: <b>${fp}</b> \n` +
//       `Đối tác đã khóa: <b>${user}</b> \n` +
//       `Lý do: <b>${reason}</b> \n\n` +
//       moment().format("HH:mm DD/MM/YYYY")
//     );
//   },

//   NOTICE_PRODUCER_EXIST_IP_OKVIP: (email, users = [], fp) => {
//     return (
//       `<b>‼️ ĐỐI TÁC VỪA ĐĂNG NHẬP BỊ TRÙNG IP ‼️</b> \n` +
//       `Đối tác có tên đăng nhập <b>${email}</b> vừa đăng nhập có ip là <b>${fp}</b> \n` +
//       `Trùng với các nhân viên online sau: ${users?.toString()}`
//     );
//   },

//   NOTICE_PRODUCER_EXIST_FP_OKVIP: (email, users = [], fp) => {
//     return (
//       `<b>‼️ ĐỐI TÁC VỪA ĐĂNG NHẬP BỊ TRÙNG FP ‼️</b> \n` +
//       `Đối tác có tên đăng nhập <b>${email}</b> vừa đăng nhập có fp là <b>${fp}</b> \n` +
//       `Trùng với các nhân viên online sau: ${users?.toString()}`
//     );
//   },
//   REQUEST_ACCEPT_PRODUCER: ({ username }) => {
//     return (
//       `<b>ĐỐI TÁC YÊU CẦU HỢP TÁC</b> \n` +
//       `<b>Đối tác có tên đăng nhập <code>${username}</code> vừa gửi yêu cầu hợp tác.</b> \n` +
//       `<b>${moment().format("HH:mm DD/MM/YYYY")}</b>`
//     );
//   },
//   PRODUCER_CHANGE_PRICE: ({ listChange, fullName, domain }) => {
//     let stringChange = "";
//     listChange?.forEach((item) => {
//       stringChange +=
//         `Dịch vụ: <b>${item?.service}</b> \n` +
//         `Giá trước khi đổi: <b>${formatPrice(item?.price)}</b> \n` +
//         `Giá sau khi đổi: <b>${formatPrice(item?.priceAfter)}</b> \n`;
//     });
//     return (
//       `<b>ĐỐI TÁC THAY ĐỔI GIÁ DỊCH VỤ</b> \n` +
//       `<b>Tên miền: ${domain}</b> \n` +
//       `${stringChange}` +
//       `Người cập nhật: <b>${fullName}</b> \n` +
//       `<b>${moment().format("HH:mm DD/MM/YYYY")}</b>`
//     );
//   },
//   PRODUCER_CHANGE_PRICE_PACK: ({
//     price = 0,
//     priceAfter = 0,
//     fullName,
//     domain,
//   }) => {
//     return (
//       `<b>ĐỐI TÁC THAY ĐỔI GIÁ DỊCH VỤ</b> \n` +
//       `<b>Tên gói: ${domain}</b> \n` +
//       `Giá trước khi đổi: <b>${formatPrice(price)}</b> \n` +
//       `Giá sau khi đổi: <b>${formatPrice(priceAfter)}</b> \n` +
//       `Người cập nhật: <b>${fullName}</b> \n` +
//       `<b>${moment().format("HH:mm DD/MM/YYYY")}</b>`
//     );
//   },

//   USER_SEND_MESSAGE_TO_USER: ({ message, sender }) => {
//     return (
//       `<b>BẠN CÓ TIN NHẮN MỚI</b>\n` +
//       `<b>Người gửi: ${sender} </b> \n` +
//       `<b>Nội dung: </b>${message} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   USER_SEND_MESSAGE_TO_GROUP: ({ message, sender, receiver }) => {
//     return (
//       `<b>NGƯỜI DÙNG GỬI TIN NHẮN</b>\n` +
//       `<b>Người gửi: </b>${sender} \n` +
//       `<b>Người nhận: </b>${receiver} \n` +
//       `<b>Nội dung: </b>${message} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   UPDATE_NOTE_ORDER: ({ orderCode, user }) => {
//     return (
//       `<b>CẬP NHẬT GHI CHÚ</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   UPDATE_BILL_ORDER: ({ orderCode, user }) => {
//     return (
//       `<b>CẬP NHẬT BILL ORDER</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   UPDATE_IS_EDIT_ORDER: ({ orderCode, user, content, status = 0 }) => {
//     return (
//       `<b>CẦN SỬA ĐƠN HÀNG</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nội dung: </b>${content} \n` +
//       `<b>Trạng thái: </b>${
//         status === 0 ? "Không cần sửa" : status === 1 ? "Cần sửa" : "Đã sửa"
//       } \n` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   UPDATE_IS_EDIT_ORDER_TO_SEO: ({ orderCode, user, content }) => {
//     return (
//       `<b>CẦN SỬA ĐƠN HÀNG</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Nội dung: </b>${content} \n` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   UPDATED_EDIT_ORDER: ({ orderCode, user }) => {
//     return (
//       `<b>ĐƠN HÀNG ĐÃ SỬA</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   REMOVE_PRODUCT_ORDER: ({ orderCode, user, items, itemsAfter }) => {
//     let bodyOrder = ``,
//       bodyAfter = ``;
//     items.forEach((item, index) => {
//       bodyOrder += `- Dịch vụ thứ ${index + 1}\n${convertOrderItemToText(
//         item
//       )}`;
//     });
//     itemsAfter.forEach((item, index) => {
//       bodyAfter += `- Dịch vụ thứ ${index + 1}\n${convertOrderItemToText(
//         item
//       )}`;
//     });

//     let bodyDeletedProduct = ``;
//     items?.forEach((item) => {
//       if (
//         !itemsAfter?.find((e) => e?._id?.toString() === item?._id?.toString())
//       ) {
//         bodyDeletedProduct += `- <code> ${item?.domain}: ${item?.quantity} </code> \n`;
//       }
//     });

//     return (
//       `<b>${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "XÓA SẢN PHẨM TRONG ĐƠN HÀNG"
//           : "CẬP NHẬT LINK ĐƠN HÀNG"
//       }</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Dịch vụ trước khi ${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "xóa"
//           : "sửa"
//       }:</b> \n` +
//       `${bodyOrder}` +
//       `<b>Dịch vụ sau khi ${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "xóa"
//           : "sửa"
//       }:</b> \n` +
//       `${bodyAfter}` +
//       `${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? `<b>Dịch vụ đã xoá:</b> \n ${bodyDeletedProduct}`
//           : ""
//       }` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   REMOVE_PRODUCT_ORDER_TO_SEO: ({ orderCode, user, items, itemsAfter }) => {
//     let bodyOrder = ``,
//       bodyAfter = ``;
//     items.forEach((item) => {
//       bodyOrder += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });
//     itemsAfter.forEach((item) => {
//       bodyAfter += `-  <code> ${SERVICE_NAME[item.service]}: ${
//         item.quantity
//       }</code> \n`;
//     });

//     let bodyDeletedProduct = ``;
//     items?.forEach((item) => {
//       if (
//         !itemsAfter?.find((e) => e?._id?.toString() === item?._id?.toString())
//       ) {
//         bodyDeletedProduct += `- <code> ${item?.domain}: ${item?.quantity} </code> \n`;
//       }
//     });

//     return (
//       `<b>${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "ĐƠN HÀNG CỦA BẠN BỊ XÓA BỚT SẢN PHẨM"
//           : "CẬP NHẬT LINK ĐƠN HÀNG"
//       }</b>\n` +
//       `<b>Mã đơn: </b> <code>${orderCode}</code>  \n` +
//       `<b>Dịch vụ trước khi ${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "xóa"
//           : "sửa"
//       }:</b> \n` +
//       `${bodyOrder}` +
//       `<b>Dịch vụ sau khi ${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? "xóa"
//           : "sửa"
//       }:</b> \n` +
//       `${bodyAfter}` +
//       `${
//         checkQuantityItem(items) !== checkQuantityItem(itemsAfter)
//           ? `<b>Dịch vụ đã xoá:</b> \n ${bodyDeletedProduct}`
//           : ""
//       }` +
//       `<b>Người cập nhật: </b>${user} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   CREATE_DEPOSIT: ({ user, amount, code }) => {
//     return (
//       `<b>TẠO LỆNH NẠP TIỀN</b>\n\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Người tạo: <code>${user}</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   APPROVE_DEPOSIT_TO_USER: ({ amount, status, code }) => {
//     return (
//       `<b>LỆNH NẠP TIỀN: ${
//         status === 1 ? "Đã được duyệt" : "Đã từ chối"
//       }</b>\n\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   APPROVE_DEPOSIT_TO_TL: ({ userAccepted, amount, status, code }) => {
//     return (
//       `<b>LỆNH NẠP TIỀN: ${
//         status === 1 ? "Đã được duyệt" : "Đã từ chối"
//       }</b>\n\n` +
//       `<b>Người duyệt: <code>${userAccepted}</code></b>\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   CREATE_WITHDRAW: ({
//     user,
//     amount,
//     code,
//     role,
//     orders = [],
//     type = WALLET_TYPE.EXTERNAL,
//     paymentMethod = "VND",
//     totalAfterPaymentMethod,
//     currencyValue = 1,
//   }) => {
//     let listOrder = "";

//     orders?.forEach((item, index) => {
//       listOrder += `\n<code>${index + 1}. ${
//         item?.orderDetail?.orderCode
//       } - ${formatMoney(item?.orderDetail?.totalPriceDiscount)}</code>`;
//     });

//     return (
//       `<b>GỬI YÊU CẦU RÚT TIỀN</b>\n\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Người tạo: <code>${user} - ${
//         role === ROLES.EXTERNAL_CUSTOMER ? "KHÁCH HÀNG NGOÀI" : "ĐỐI TÁC"
//       }</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `<b>Loại ví: <code>${
//         type === WALLET_TYPE.OKVIPA
//           ? "OKVIP-A"
//           : type === WALLET_TYPE.OKVIPB
//           ? "OKVIP-B"
//           : type === WALLET_TYPE.F8
//           ? "F8"
//           : type === WALLET_TYPE.MB
//           ? "MB66"
//           : type === WALLET_TYPE.OK9
//           ? "OK9"
//           : type === WALLET_TYPE.SH
//           ? "SHBET"
//           : "KHÁCH HÀNG NGOÀI"
//       }</code></b>\n` +
//       `${orders?.length ? `<b>Đơn hàng: ${listOrder}</b>\n` : ``}` +
//       `${
//         [
//           WALLET_TYPE.OKVIPA,
//           WALLET_TYPE.OKVIPB,
//           WALLET_TYPE.F8,
//           WALLET_TYPE.MB,
//           WALLET_TYPE.OK9,
//           WALLET_TYPE.SH,
//         ].includes(type)
//           ? `<b>Phương thức thanh toán: <code>${paymentMethod}</code></b>\n`
//           : ``
//       }` +
//       `${
//         [
//           WALLET_TYPE.OKVIPA,
//           WALLET_TYPE.OKVIPB,
//           WALLET_TYPE.F8,
//           WALLET_TYPE.MB,
//           WALLET_TYPE.OK9,
//           WALLET_TYPE.SH,
//         ].includes(type)
//           ? `<b>Số tiền ứng với phương thức: <code>${formatMoney(
//               totalAfterPaymentMethod || amount,
//               paymentMethod
//             )}</code></b>\n`
//           : ``
//       }` +
//       `${
//         [
//           WALLET_TYPE.OKVIPA,
//           WALLET_TYPE.OKVIPB,
//           WALLET_TYPE.F8,
//           WALLET_TYPE.MB,
//           WALLET_TYPE.OK9,
//           WALLET_TYPE.SH,
//         ].includes(type) && currencyValue !== 1
//           ? `<b>Tỷ giá: <code>${formatMoney(currencyValue)}</code></b>\n`
//           : ``
//       }` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   APPROVE_WITHDRAW_TO_USER: ({
//     amount,
//     status,
//     code,
//     paymentMethod = "VND",
//     totalAfterPaymentMethod,
//   }) => {
//     return (
//       `<b>LỆNH RÚT TIỀN: ${
//         status === 1
//           ? "Đã được chấp nhận - Đang chuyển tiền"
//           : status === 2
//           ? "Đã chuyển tiền"
//           : "Đã từ chối"
//       }</b>\n\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `<b>Phương thức thanh toán: </b> <code>${
//         paymentMethod || "VND"
//       }</code> \n` +
//       `<b>Tổng tiền ứng với phương thức: </b> <code>${formatMoney(
//         totalAfterPaymentMethod || amount,
//         paymentMethod
//       )}</code> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   APPROVE_WITHDRAW_TO_TL: ({
//     userAccepted,
//     amount,
//     status,
//     code,
//     user,
//     paymentMethod = "VND",
//     totalAfterPaymentMethod,
//   }) => {
//     return (
//       `<b>LỆNH RÚT TIỀN: ${
//         status === 1
//           ? "Đã được chấp nhận - Đang chuyển tiền"
//           : status === 2
//           ? "Đã chuyển tiền"
//           : "Đã từ chối"
//       }</b>\n\n` +
//       `<b>Người dùng: <code>${user?.username} - ${
//         user?.role?.name === ROLES.EXTERNAL_CUSTOMER
//           ? "KHÁCH HÀNG NGOÀI"
//           : "ĐỐI TÁC"
//       }</code></b>\n` +
//       `<b>Mã: <code>${code}</code></b>\n` +
//       `<b>Số tiền: <code>${amount}</code></b>\n` +
//       `<b>Phương thức thanh toán: </b> <code>${
//         paymentMethod || "VND"
//       }</code> \n` +
//       `<b>Tổng tiền ứng với phương thức: </b> <code>${formatMoney(
//         totalAfterPaymentMethod || amount,
//         paymentMethod
//       )}</code> \n` +
//       `<b>Người duyệt: <code>${userAccepted}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   TRANSFERRING_MONEY_TO_TL: ({
//     amount,
//     message,
//     bankNumber,
//     nameInCard,
//     nameInCardFrom,
//     bankNumberFrom,
//     trace,
//   }) => {
//     return (
//       `<b>❇️❇️ HOÀN TẤT CHUYỂN KHOẢN ❇️❇️</b>\n\n` +
//       `<b>Thời gian: <code>${moment().format(
//         "HH:mm DD/MM/YYYY"
//       )}</code></b>\n` +
//       `<b>Mã lệnh rút tiền: <code>${message}</code></b>\n` +
//       `<b>Chuyển khoản từ:</b> ${nameInCardFrom?.toUpperCase()} | <b>STK: </b> ${bankNumberFrom} \n` +
//       `<b>Đến:</b> ${nameInCard?.toUpperCase()} | <b>STK: </b> ${bankNumber} \n` +
//       `<b>Số tiền: </b><code>${amount}</code>\n` +
//       `<b>Mã trace:</b> ${trace}\n` +
//       `${moment().format("HH:mm:ss DD/MM/YYYY")} \n`
//     );
//   },

//   WALLET_LOG_TO_TL: ({
//     user,
//     amount,
//     fromBalance,
//     toBalance,
//     note,
//     type = "",
//   }) => {
//     return (
//       `<b>BIẾN ĐỘNG SỐ DƯ - ${
//         user?.role?.name === ROLES.EXTERNAL_CUSTOMER
//           ? "KHÁCH HÀNG NGOÀI"
//           : "ĐỐI TÁC"
//       }</b>\n\n` +
//       `<b>Người dùng: <code>${user?.username}</code></b>\n` +
//       `<b>Số tiền: <code>${amount < 0 ? "" : "+"}${formatMoney(
//         amount
//       )}</code></b>\n` +
//       `<b>Số tiền trước: <code>${formatMoney(fromBalance)}</code></b>\n` +
//       `<b>Số tiền sau: <code>${formatMoney(toBalance)}</code></b>\n` +
//       `<b>Loại ví: <code>${
//         type === WALLET_TYPE.OKVIPA
//           ? "OKVIP-A"
//           : type === WALLET_TYPE.OKVIPB
//           ? "OKVIP-B"
//           : type === WALLET_TYPE.F8
//           ? "F8"
//           : type === WALLET_TYPE.MB
//           ? "MB66"
//           : type === WALLET_TYPE.OK9
//           ? "OK9"
//           : type === WALLET_TYPE.SH
//           ? "SHBET"
//           : "KHÁCH HÀNG NGOÀI"
//       }</code></b>\n` +
//       `<b>Ghi chú: <code>${note}</code></b>\n` +
//       `${moment().format("HH:mm:ss DD/MM/YYYY")} \n`
//     );
//   },

//   CREATE_NOTIFICATION: ({ user, title }) => {
//     return (
//       `<b>TẠO THÔNG BÁO</b>\n\n` +
//       `<b>Tiêu đề: <code>${title}</code></b>\n` +
//       `<b>Người tạo: <code>${user}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   UPDATE_NOTIFICATION: ({ user, title }) => {
//     return (
//       `<b>CẬP NHẬT THÔNG BÁO</b>\n\n` +
//       `<b>Tiêu đề: <code>${title}</code></b>\n` +
//       `<b>Người cập nhật: <code>${user}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   CHANGE_CUSTOMER_IN_ORDER: ({ orderCode, admin, oldUser, newUser }) => {
//     return (
//       `<b>CẬP NHẬT NGƯỜI MUA CHO ĐƠN HÀNG: ${orderCode}</b>\n\n` +
//       `<b>NGƯỜI MUA CŨ: <code>${oldUser}</code></b>\n` +
//       `<b>NGƯỜI MUA MỚI: <code>${newUser}</code></b>\n` +
//       `<b>Người cập nhật: <code>${admin}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   REVERT_CUSTOMER_IN_ORDER: ({ orderCode, admin, oldUser, newUser }) => {
//     return (
//       `<b>KHÔI PHỤC NGƯỜI MUA BAN ĐẦU CHO ĐƠN HÀNG: ${orderCode}</b>\n\n` +
//       `<b>NGƯỜI MUA TRƯỚC: <code>${oldUser}</code></b>\n` +
//       `<b>NGƯỜI MUA SAU: <code>${newUser}</code></b>\n` +
//       `<b>Người cập nhật: <code>${admin}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },
//   RENEWAL_TEXTLINK_NOTIFICATION: (order, timeStart, timeExpired) => {
//     return (
//       `<b>ĐƠN HÀNG TEXTLINK SẮP ĐẾN NGÀY GIA HẠN</b>\n` +
//       `<b>Đơn hàng:</b> <code>${order?.orderCode}</code> \n` +
//       `<b>Domain SEO:</b> <code>${order?.domainSEOId?.name}</code> \n` +
//       `<b>Thời gian đặt: </b>${timeStart} \n` +
//       `<b>Ngày hết hạn: </b>${timeExpired} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   RENEWAL_TEXTLINK_NOTIFICATION2: (order) => {
//     return (
//       `<b>ĐƠN HÀNG TEXTLINK SẮP ĐẾN NGÀY GIA HẠN</b>\n` +
//       `<b>Đơn hàng:</b> <code>${order?.orderCode}</code> \n` +
//       `<b>Domain dịch vụ:</b> <code>${order?.domain}</code> \n` +
//       `<b>Đối tác:</b> <code>${order?.producer}</code> \n` +
//       `<b>SEO/Content: </b>${order?.customer} \n` +
//       `<b>Ngày hết hạn: </b>${order?.timeExpired} \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   UPDATE_EXCHANGE_RATE: ({ usdt, username }) => {
//     return (
//       `<b>CẬP NHẬT TỶ GIÁ</b>\n\n` +
//       `<b>USDT: <code>${usdt}</code></b>\n` +
//       `<b>Người cập nhật: <code>${username}</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   SUPPORTER_PAYMENT_WITHDRAW: ({
//     code,
//     producer,
//     orders,
//     paymentMethod,
//     amount,
//     totalAfterPaymentMethod,
//   }) => {
//     let bodyOrder = ``;
//     orders.forEach((item, index) => {
//       bodyOrder += `-  <code>${index}. ${item?.orderDetail?.orderCode}</code> \n`;
//     });

//     const template =
//       `<b>PM_SEO: LỆNH RÚT TIỀN ĐƯỢC THANH TOÁN</b> \n\n` +
//       `<b>Mã rút tiền: </b> <code>${code}</code>  \n` +
//       `<b>Nhà cung cấp: </b> <code>${producer}</code> \n` +
//       `<b>Đơn hàng:</b> \n` +
//       `${bodyOrder}` +
//       `<b>TỔNG TIỀN: <code><i>${formatMoney(amount)}</i></code></b> \n` +
//       `<b>PHƯƠNG THỨC THANH TOÁN: <code><i>${paymentMethod}</i></code></b> \n` +
//       `<b>TỔNG TIỀN THEO PHƯƠNG THỨC: <code><i>${formatMoney(
//         totalAfterPaymentMethod,
//         paymentMethod
//       )}</i></code></b> \n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`;
//     return template;
//   },

//   TRANSFERRING_MONEY_FAILED_TO_TL: ({
//     amount,
//     message,
//     bankNumber,
//     nameInCard,
//     nameInCardFrom,
//     bankNumberFrom,
//     reason,
//   }) => {
//     return (
//       `<b>⛔⛔CHUYỂN KHOẢN THẤT BẠI⛔⛔</b>\n\n` +
//       `<b>Thời gian: <code>${moment().format(
//         "HH:mm DD/MM/YYYY"
//       )}</code></b>\n` +
//       `<b>Mã lệnh rút tiền: <code>${message}</code></b>\n` +
//       `<b>Chuyển khoản từ:</b> ${nameInCardFrom} | <b>STK: </b> ${bankNumberFrom} \n` +
//       `<b>Đến:</b> ${nameInCard} | <b>STK: </b> ${bankNumber} \n` +
//       `<b>Số tiền: </b><code>${amount}</code>\n` +
//       `<b>Lí do:</b> ${reason}\n`
//     );
//   },

//   SAME_ORDER_IN_WALLET: ({ wallet, orderCodes = [] }) => {
//     let bodyOrder = ``;
//     orderCodes.forEach((item, index) => {
//       bodyOrder += `-  <code>${index + 1}. ${item}</code> \n`;
//     });

//     return (
//       `<b>⛔⛔ĐƠN HÀNG BỊ TRÙNG TRONG VÍ TIỀN</b>\n\n` +
//       `<b>Đối tác: <code>${wallet?.user?.username}</code></b>\n` +
//       `<b>Đơn hàng:</b> \n` +
//       `${bodyOrder}` +
//       `<b>Loại ví: <code>${
//         wallet?.type === WALLET_TYPE.OKVIPA
//           ? "OKVIP-A"
//           : wallet?.type === WALLET_TYPE.OKVIPB
//           ? "OKVIP-B"
//           : wallet?.type === WALLET_TYPE.F8
//           ? "F8"
//           : wallet?.type === WALLET_TYPE.MB
//           ? "MB66"
//           : wallet?.type === WALLET_TYPE.OK9
//           ? "OK9"
//           : wallet?.type === WALLET_TYPE.SH
//           ? "SHBET"
//           : "KHÁCH HÀNG NGOÀI"
//       }</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")} \n`
//     );
//   },

//   LOG_MESSAGE_COMMUNITY: (user, message) => {
//     return (
//       `<b>TIN NHẮN CỘNG ĐỒNG</b> \n\n` +
//       `<b>Tên đăng nhập: <code>${user?.username}</code></b>\n` +
//       `<b>Phân quyền: <code>${ROLES_NAME[user?.role?.name]}</code></b>\n` +
//       `<b>Nội dung: <code>${
//         message?.type === "image"
//           ? "Hình ảnh"
//           : message?.type === "file"
//           ? "File đính kèm"
//           : message?.message
//       }</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_PIN_MESSAGE_COMMUNITY: (user, message) => {
//     return (
//       `<b>GHIM TIN NHẮN CỘNG ĐỒNG</b> \n\n` +
//       `<b>Tên đăng nhập: <code>${user?.username}</code></b>\n` +
//       `<b>Phân quyền: <code>${ROLES_NAME[user?.role?.name]}</code></b>\n` +
//       `<b>Nội dung: <code>${
//         message?.type === "image"
//           ? "Hình ảnh"
//           : message?.type === "file"
//           ? "File đính kèm"
//           : message?.message
//       }</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_REMOVE_PIN_MESSAGE_COMMUNITY: (user, message) => {
//     return (
//       `<b>⛔GỠ GHIM TIN NHẮN CỘNG ĐỒNG⛔</b> \n\n` +
//       `<b>Tên đăng nhập: <code>${user?.username}</code></b>\n` +
//       `<b>Phân quyền: <code>${ROLES_NAME[user?.role?.name]}</code></b>\n` +
//       `<b>Nội dung: <code>${
//         message?.type === "image"
//           ? "Hình ảnh"
//           : message?.type === "file"
//           ? "File đính kèm"
//           : message?.message
//       }</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_DELETE_MESSAGE_COMMUNITY: (user, message) => {
//     return (
//       `<b>⛔XÓA TIN NHẮN CỘNG ĐỒNG⛔</b> \n\n` +
//       `<b>Tên đăng nhập: <code>${user?.username}</code></b>\n` +
//       `<b>Phân quyền: <code>${ROLES_NAME[user?.role?.name]}</code></b>\n` +
//       `<b>Nội dung: <code>${
//         message?.type === "image"
//           ? "Hình ảnh"
//           : message?.type === "file"
//           ? "File đính kèm"
//           : message?.message
//       }</code></b>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_SYNC_PRODUCER_FAIL: (producer, message) => {
//     return (
//       `<b>⛔ĐỒNG BỘ ĐỐI TÁC BỊ LỖI⛔</b>\n` +
//       `<b>USERNAME MARKETING: </b><code>${producer?.username}</code>\n` +
//       `<b>USERNAME BUSINESS: </b><code>${producer?.fullName}</code>\n` +
//       `<b>LÝ DO: </b>${message}` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_SYNC_PRODUCER_SUCCESS: (producer, user) => {
//     return (
//       `<b>ĐỒNG BỘ ĐỐI TÁC THÀNH CÔNG</b>\n` +
//       `<b>USERNAME MARKETING: </b><code>${producer?.username}</code>\n` +
//       `<b>USERNAME BUSINESS: </b><code>${producer?.fullName}</code>\n` +
//       `<b>Số tài khoản: </b><code>${producer?.bankNumber}</code>\n` +
//       `<b>Ngân hàng: </b><code>${producer?.bankName}</code>\n` +
//       `<b>Chủ thẻ: </b><code>${producer?.nameInCard}</code>\n` +
//       `<b>USDT: </b><code>${producer?.usdt || "Chưa có"}</code>\n` +
//       `<b>Người đồng bộ: </b>${user?.username}` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   NOTICE_CUSTOMER_PRODUCER_HAVE_10ORDERS: (customer, producer, orders = []) => {
//     let bodyOrder = ``;
//     orders.forEach((item, index) => {
//       bodyOrder += `-  <code>${index + 1}. ${item?.orderCode}</code> \n`;
//     });
//     return (
//       `<b>🆘🆘ĐỐI TÁC VÀ SEO/CONTENT CÓ TRÊN 10 ĐƠN HÀNG TRONG THÁNG🆘🆘</b>\n` +
//       `<b>SEO/CONTENT: </b><code>${customer?.username}</code>\n` +
//       `<b>ĐỐI TÁC: </b><code>${producer?.username}</code>\n` +
//       `<b>Số lượng đơn hàng: </b><code>${orders?.length || 0}</code>\n` +
//       `<b>Đơn hàng:</b>\n` +
//       `${bodyOrder}` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   NOTICE_PERCENT_COMPLETE_ORDER_PRODUCER: (producer, percent = 0) => {
//     return (
//       `<b>🆘🆘TỈ LỆ HOÀN THÀNH ĐƠN HÀNG CỦA ĐỐI TÁC DƯỚI 50%🆘🆘</b>\n` +
//       `<b>Tên đăng nhập: </b><code>${producer?.username}</code>\n` +
//       `<b>Email: </b><code>${producer?.email}</code>\n` +
//       `<b>Tỉ lệ hoàn thành: </b><code>${percent * 100}%</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },
//   LOG_RATING_ORDER: (customer, producer, order, star, comment) => {
//     return (
//       `<b>ĐÁNH GIÁ ĐƠN HÀNG</b>\n` +
//       `<b>SEO/CONTENT: </b><code>${customer?.username}</code>\n` +
//       `<b>Đơn hàng: </b><code>${order?.orderCode}</code>\n` +
//       `<b>Đối tác: </b><code>${producer?.username}</code>\n` +
//       `<b>Đánh giá: </b><code>${star}⭐</code>\n` +
//       `<b>Nhận xét: </b><code>${comment || "Trống"}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },
//   LOG_PERCENT_COMPLETE_ORDER: (
//     producer,
//     completeOrder,
//     totalOrder,
//     percent
//   ) => {
//     return (
//       `<b>🆘🆘 PHẦN TRĂM HOÀN THÀNh CỦA ĐỐI TÁC DƯỚI 50% 🆘🆘</b>\n` +
//       `<b>Đối tác: </b><code>${producer?.username}</code>\n` +
//       `<b>SL đơn hàng hoàn thành đúng thời hạn: </b><code>${completeOrder} đơn hàng</code>\n` +
//       `<b>Tổng SL đơn hàng: </b><code>${totalOrder} đơn hàng</code>\n` +
//       `<b>Tỉ lệ hoàn thành: </b><code>${percent}%</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_UPDATE_LEVEL_PRODUCER: (producer, prevLevel, nextLevel) => {
//     return (
//       `<b>CẬP NHẬT CẤP ĐỘ CỦA ĐỐI TÁC THÁNG ${moment().format("MM")}</b>\n` +
//       `<b>Đối tác: </b><code>${producer?.username}</code>\n` +
//       `<b>Cấp độ tháng trước: </b><code>${prevLevel}</code>\n` +
//       `<b>Cập độ mới: </b><code>${nextLevel}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },
//   LOG_AUTO_CANCEL_ORDER_BY_GREATER_25_DAYS: (order) => {
//     return (
//       `<b>TỰ ĐỘNG HỦY ĐƠN HÀNG QUÁ 25 NGÀY</b>\n` +
//       `<b>Mã đơn hàng: </b><code>${order?.orderCode}</code>\n` +
//       `<b>SEO/CONTENT: </b><code>${order?.customer?.username}</code>\n` +
//       `<b>Đối tác: </b><code>${order?.producer?.username}</code>\n` +
//       `<b>Domain SEO: </b><code>${order?.domainSEOId?.name}</code>\n` +
//       `<b>Trạng thái hiện tại: </b><code>${
//         ORDER_SATUS_NAME[order?.status]
//       }</code>\n` +
//       `<b>Tổng tiền: </b><code>${formatMoney(
//         order?.totalPriceDiscount
//       )}</code>\n` +
//       `<b>Ngày đặt hàng: </b><code>${moment(order?.createdAt).format(
//         "HH:mm DD/MM/YYYY"
//       )}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },
//   REDUCE_TOTAL_PRICE_ORDER: (order, amount) => {
//     return (
//       `<b>ĐỐI TÁC GIẢM GIÁ ĐƠN HÀNG</b>\n` +
//       `<b>Mã đơn hàng: </b><code>${order?.orderCode}</code>\n` +
//       `<b>SEO/CONTENT: </b><code>${order?.customer?.username}</code>\n` +
//       `<b>Đối tác: </b><code>${order?.producer?.username}</code>\n` +
//       `<b>Domain SEO: </b><code>${order?.domainSEOId?.name}</code>\n` +
//       `<b>Số tiền giảm: </b><code>${formatMoney(amount)}</code>\n` +
//       `<b>Tổng tiền sau giảm: </b><code>${formatMoney(
//         order?.totalPriceDiscount
//       )}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },
//   LOG_CHECKLINK: (order, items = [], items301 = [], itemsDie = []) => {
//     let body = ``;

//     items?.forEach((item, index) => {
//       let text = ``;
//       item?.urls?.forEach((url) => {
//         text += `\tAnchorText: <code>${url?.anchorText}</code> - Url: <code>${url?.url}</code> \n`;
//       });
//       body +=
//         `${index + 1} - Domain không tìm thấy: <code>${
//           item?.domain
//         }</code> \n` + text;
//     });

//     items301?.forEach((item, index) => {
//       let text = ``;
//       body +=
//         `${index + 1} - Domain dịch vụ 301: <code>${item?.domain}</code> \n` +
//         text;
//     });

//     itemsDie?.forEach((item, index) => {
//       let text = ``;
//       body +=
//         `${index + 1} - Domain dịch vụ bị die: <code>${
//           item?.domain
//         }</code> \n` + text;
//     });

//     return (
//       `<b>❌❌❌ THÔNG BÁO TỪ PM CHECK LINK ❌❌❌</b>\n` +
//       `<b>Mã đơn hàng: </b><code>${order?.orderCode}</code>\n` +
//       `<b>SEO/CONTENT: </b><code>${order?.customer?.username}</code>\n` +
//       `<b>Đối tác: </b><code>${order?.producer?.username}</code>\n` +
//       `<b>Loại dịch vụ: </b><code>${order?.service}</code>\n` +
//       `<b>Team: </b><code>${order?.team?.name}</code>\n` +
//       `<b>Hậu đài: </b><code>${order?.brand}</code>\n` +
//       body +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_CREATE_BLACKLIST: (user, userAction, reason = "", support = false) => {
//     let message =
//       `<b>❌❌❌ THÊM NGƯỜI DÙNG VÀO BLACKLIST ❌❌❌</b>\n` +
//       `<b>Người dùng: </b><code>${user?.username}</code>\n` +
//       `<b>Phân quyền: </b><code>${
//         ROLES_NAME[user?.role?.name || ROLES.PRODUCER]
//       }</code>\n` +
//       `<b>Lí do: </b><code>${reason}</code>\n`;
//     if (support) {
//       message += `<b>Liên hệ TL hỗ trợ: @salatlse/@Yonna2802</b>\n`;
//     }

//     message +=
//       `<b>Người thực hiện: </b><code>${userAction?.username}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`;

//     return message;
//   },

//   LOG_UPDATE_BLACKLIST: (user, userAction, reason = "") => {
//     return (
//       `<b>❌❌❌ CẬP NHẬT NGƯỜI DÙNG TRONG BLACKLIST ❌❌❌</b>\n` +
//       `<b>Người dùng: </b><code>${user?.username}</code>\n` +
//       `<b>Phân quyền: </b><code>${
//         ROLES_NAME[user?.role?.name || ROLES.PRODUCER]
//       }</code>\n` +
//       `<b>Lí do: </b><code>${reason}</code>\n` +
//       `<b>Người thực hiện: </b><code>${userAction?.username}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_DELETE_BLACKLIST: (user, userAction) => {
//     return (
//       `<b>❇️❇️ GỠ NGƯỜI DÙNG RA BLACKLIST ❇️❇️</b>\n` +
//       `<b>Người dùng: </b><code>${user?.username}</code>\n` +
//       `<b>Phân quyền: </b><code>${
//         ROLES_NAME[user?.role?.name || ROLES.PRODUCER]
//       }</code>\n` +
//       `<b>Người thực hiện: </b><code>${userAction?.username}</code>\n` +
//       `${moment().format("HH:mm DD/MM/YYYY")}`
//     );
//   },

//   LOG_CREATE_DOMAIN_SCAMMING: (domain, creator) => {
//     return (
//       `<b>THÊM DOMAIN SCAMMING MỚI</b>\n` +
//       `<b>Domain:</b> <code>${domain.domain}</code>\n` +
//       `<b>Lý do:</b> ${domain.reason || "Không có lý do"}\n` +
//       `<b>Người tạo:</b> ${creator}\n` +
//       `<b>Ẩn cho các thương hiệu:</b> ${
//         domain.hideForBrands.length > 0
//           ? domain.hideForBrands.join(", ")
//           : "Không có thương hiệu nào"
//       }\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },

//   LOG_UPDATE_DOMAIN_SCAMMING: (domain, creator) => {
//     return (
//       `<b>CHỈNH SỬA DOMAIN SCAMMING </b>\n` +
//       `<b>Domain:</b> <code>${domain.domain}</code>\n` +
//       `<b>Lý do:</b> ${domain.reason || "Không có lý do"}\n` +
//       `<b>Người thực hiện:</b> ${creator}\n` +
//       `<b>Ẩn cho các thương hiệu:</b> ${
//         domain.hideForBrands.length > 0
//           ? domain.hideForBrands.join(", ")
//           : "Không có thương hiệu nào"
//       }\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },

//   LOG_DELETE_DOMAIN_SCAMMING: (domain, creator) => {
//     return (
//       `<b>Xóa DOMAIN SCAMMING </b>\n` +
//       `<b>Domain:</b> <code>${domain.domain}</code>\n` +
//       `<b>Người thực hiện:</b> ${creator}\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },

//   LOG_ADD_ESCROW: (escrow, producer, creator) => {
//     return (
//       `<b>TẠO MỚI KÝ QUỸ</b>\n` +
//       `<b>Đối tác:</b> <code>${producer?.username}</code>\n` +
//       `<b>Loại ký quỹ:</b> ${ESCROW_TYPE_NAME[escrow?.type]}\n` +
//       `<b>Cấp độ:</b> ${escrow?.level == 4 ? "Kim cương" : escrow?.level}\n` +
//       `<b>Số tiền:</b> ${formatMoney(escrow?.amount)}\n` +
//       `<b>Trạng thái:</b> ${ESCROW_STATUS_NAME[escrow?.status]}\n` +
//       `<b>Ghi chú:</b> ${escrow?.note}\n` +
//       `<b>Người tạo:</b> ${creator?.username} - ${
//         ROLES_NAME[creator?.role?.name]
//       }\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },

//   LOG_UPDATE_ESCROW: (escrow, producer, creator) => {
//     return (
//       `<b>CẬP NHẬT KÝ QUỸ</b>\n` +
//       `<b>Đối tác:</b> <code>${producer?.username}</code>\n` +
//       `<b>Loại ký quỹ:</b> ${ESCROW_TYPE_NAME[escrow?.type]}\n` +
//       `<b>Cấp độ:</b> ${escrow?.level == 4 ? "Kim cương" : escrow?.level}\n` +
//       `<b>Số tiền:</b> ${formatMoney(escrow?.amount)}\n` +
//       `<b>Trạng thái:</b> ${ESCROW_STATUS_NAME[escrow?.status]}\n` +
//       `<b>Ghi chú:</b> ${escrow?.note}\n` +
//       `<b>Người cập nhật:</b> ${creator?.username}\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },

//   LOG_REFUND_ESCROW: (escrows, producer, creator) => {
//     let body = "";
//     let total = 0;

//     escrows?.forEach((escrow, index) => {
//       body +=
//         `- Ký quỹ thứ ${index + 1}:\n` +
//         `\t<b>Loại ký quỹ:</b> ${ESCROW_TYPE_NAME[escrow?.type]}\n` +
//         `\t<b>Cấp độ:</b> ${
//           escrow?.level == 4 ? "Kim cương" : escrow?.level
//         }\n` +
//         `\t<b>Số tiền:</b> ${formatMoney(escrow?.amount)}\n` +
//         `\t<b>Ghi chú:</b> ${escrow?.note}\n`;

//       total += escrow?.amount || 0;
//     });

//     return (
//       `<b>❌❌❌ HOÀN TRẢ KÝ QUỸ ❌❌❌</b>\n` +
//       `<b>Đối tác:</b> <code>${producer?.username}</code>\n` +
//       body +
//       `<b>Tổng tiền:</b> ${formatMoney(total)}\n` +
//       `<b>Người thực hiện:</b> ${creator?.username}\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },
//   LOG_REQUIRE_PRODUCER_ESCROW: (producer, total, type) => {
//     return (
//       `<b>📢📢📢 THÔNG BÁO ĐỐI TÁC KÝ QUỸ 📢📢📢</b>\n` +
//       `<b>Đối tác:</b> <code>${producer?.username}</code>\n` +
//       `<b>Cấp độ:</b> ${producer?.level}\n` +
//       `<b>Tổng doanh thu đơn hàng:</b> ${formatMoney(total)}\n` +
//       `<b>Ghi chú:</b> đã đạt doanh thu ${
//         type === 1
//           ? `50tr VNĐ. Để tiếp tục bán hàng trên hệ thống vui lòng ký quỹ Mốc 1 Cấp 1.`
//           : `100tr VNĐ. Để tiếp tục bán hàng trên hệ thống vui lòng ký quỹ Mốc 2 Cấp 1.`
//       }\n` +
//       `Lưu ý: Khi kết thúc hợp tác chúng tôi sẽ hoàn trả lại toán bộ số tiền đối tác đã ký quỹ cho chúng tôi.\n` +
//       `Chúng tôi rất mong muốn tiếp tục hợp tác với quý đối tác.\n` +
//       ` ${moment().format("HH:mm DD/MM/YYYY")}\n`
//     );
//   },
// };
