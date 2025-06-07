// process.env["NTBA_FIX_350"] = 1;

// import TelegramBot from "node-telegram-bot-api";
// import dotenv from "dotenv";
// dotenv.config();

// import Logger from "../logger.js";
// import { ORDER_SATUS_NAME, ORDER_STATUS, WALLET_TYPE } from "../constant.js";
// import userModel from "../../models/user.model.js";
// import OrderModel from "../../models/order.model.js";
// import { TEMPLATE_MESSAGE } from "./template.js";
// import { insertOrder } from "../../controllers/google-analytics.controller.js";
// import moment from "moment";
// import withdrawModel from "../../models/withdraw.model.js";
// import { formatMoney, sleep } from "../index.js";
// import sendEmail from "../sendMail.js";

// // Group khóa tài khoản
// const TELEGRAM_GROUP_BLOCK_USER = "-1002441755820";
// // Group thông báo đối tác thay đổi giá DV
// const PRODUCER_CHANGE_PRICE_GROUP = "-4097813397";
// // Group tổng admin2
// export const TOTAL_GROUP = "6318861868";
// // Group thanh toán admin
// export const PAYMENT_GROUP = "-1002112295124";

// // Group log ví -> biến động số dư ví của đối tác
// export const WALLET_GROUP = "-1001994681236";

// // Group comment
// export const COMMENT_GROUP = "-1002048154888";

// // Group tổng khách hàng ngoài
// export const EXTERNAL_GROUP = "-4273363430";

// // Group thông báo trùng đơn hàng trong ví tiền
// export const SAME_ORDER_GROUP = "-1002210117687";

// // Group cộng đồng
// export const COMMUNITY_GROUP = "-1002197374199";

// // Group KHN và đối tác đăng ký
// export const PRODUCER_REGISTER_GROUP = "-1002231349341";

// // Group Phần trăm hoàn thành đơn hàng
// export const PERCENT_COMPLETE_ORDER_GROUP = "-1002189262356";

// // Group Cấp độ đối tác
// export const LEVEL_PRODUCER_GROUP = "-4566379723";

// // Group F8bet
// export const TOTAL_GROUP_F8 = "-1002060474656";
// export const PAYMENT_GROUP_F8 = "-1002097407115";
// export const COMMENT_GROUP_F8 = "-1002008103441";
// export const WALLET_GROUP_F8 = "-1002163082519";

// // Group MB66
// export const TOTAL_GROUP_MB = "-1002169716514";
// export const PAYMENT_GROUP_MB = "-1002213180781";
// export const COMMENT_GROUP_MB = "-1002148279463";
// export const WALLET_GROUP_MB = "-1002161991092";

// // Group OK9
// export const TOTAL_GROUP_OK9 = "-1002420003009";
// export const PAYMENT_GROUP_OK9 = "-1002499777095";
// export const COMMENT_GROUP_OK9 = "-1002495177155";
// export const WALLET_GROUP_OK9 = "-1002395946172";

// // Group SH
// export const TOTAL_GROUP_SH = "-1002343217898";
// export const PAYMENT_GROUP_SH = "-1002165971785";
// export const COMMENT_GROUP_SH = "-1002318159833";
// export const WALLET_GROUP_SH = "-1002272430452";

// // Group Khu B
// export const TOTAL_GROUP_OKVIP_B = "-1002352838732";
// export const PAYMENT_GROUP_OKVIP_B = "-1002466806622";
// export const COMMENT_GROUP_OKVIP_B = "-1002400008746";
// export const WALLET_GROUP_OKVIP_B = "-1002497803232";

// // Group log thanh toán tự động
// export const AUTO_BANK_GROUP = "-1002231717686";

// // Group log check link
// export const CHECK_LINK_GROUP = "-1002496532638";

// // Group log blacklist
// export const BLACKLIST_GROUP = "-4619934660";

// // Group log Escrow
// export const ESCROW_GROUP = "-1002488556076";

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const bot = null;
// // new TelegramBot(BOT_TOKEN, { polling: true });
// const botKhuB = null;
// export const handleSyncOrder = async (orderCode, id, imageBill) => {
//   try {
//     const data = await OrderModel.findOne({
//       orderCode: orderCode,
//     })
//       .populate("customer", "username bankNumber fullName telegramUsername")
//       .populate(
//         "producer",
//         "username bankNumber bankName fullName telegramUsername"
//       )
//       .populate("assistantAccept", "username fullName telegramUsername")
//       .populate({
//         path: "domainSEOId",
//         populate: {
//           path: "team",
//         },
//       })
//       .lean();

//     let res = await insertOrder({
//       ...data,
//       imageBill,
//       createdAt: moment().toISOString(),
//     });
//     console.log("res.data", res.data?.success);
//     if (!res.data?.success) {
//       bot.sendMessage(
//         id,
//         `<b>ĐỒNG BỘ ĐƠN HÀNG BỊ LỖI</b>\n` +
//           `<b>MÃ ĐƠN HÀNG: </b><code>${data?.orderCode}</code>\n` +
//           `<b>LÝ DO: </b>${res.data?.message}`,
//         { parse_mode: "html" }
//       );
//     }
//   } catch (error) {
//     console.log(error);
//     bot.sendMessage(
//       id,
//       `<b>ĐỒNG BỘ ĐƠN HÀNG BỊ LỖI</b>\n` +
//         `<b>MÃ ĐƠN HÀNG: </b><code>${orderCode}</code>\n` +
//         `<b>LÝ DO: </b>LỖI HỆ THỐNG`,
//       { parse_mode: "html" }
//     );
//   }
// };

// async function startBot(bot) {
//   try {
//     bot.startPolling();
//     bot.onText(/start/, (msg) => {
//       const chatId = msg.chat.id;
//       const username = msg.from.username || "Chưa đặt username";
//       const message =
//         `<b>CHÀO MỪNG ĐẾN VỚI PM-SEO</b>\n` +
//         `<b>ID CÚA BẠN: </b><code>${chatId}</code>\n` +
//         `<b>USERNAME CÚA BẠN: </b><code>${username}</code>`;

//       bot.sendMessage(chatId, message, { parse_mode: "html" });
//     });

//     bot.onText(/done (.+)/, async (msg, match) => {
//       const chatId = msg.chat.id;
//       // check correct room
//       if (
//         ![
//           PAYMENT_GROUP?.toString(),
//           PAYMENT_GROUP_OKVIP_B?.toString(),
//           PAYMENT_GROUP_F8?.toString(),
//           PAYMENT_GROUP_MB?.toString(),
//           PAYMENT_GROUP_OK9?.toString(),
//           PAYMENT_GROUP_SH?.toString(),
//         ].includes(chatId.toString())
//       ) {
//         return;
//       }

//       const matchRegex = /done (.+)/;
//       if (!matchRegex.test(msg.text)) {
//         bot.sendMessage(chatId, "Không tìm thấy lệnh rút tiền");
//         return;
//       }

//       if (msg.text?.split(" ")?.length !== 2) {
//         return;
//       }

//       const code = msg.text.split(" ")[1];

//       const withdraw = await withdrawModel
//         .findOne({
//           code,
//           type: {
//             $in: [
//               WALLET_TYPE.OKVIPA,
//               WALLET_TYPE.OKVIPB,
//               WALLET_TYPE.F8,
//               WALLET_TYPE.MB,
//               WALLET_TYPE.OK9,
//               WALLET_TYPE.SH,
//             ],
//           },
//         })
//         .populate("user")
//         .lean();

//       if (!withdraw) {
//         bot.sendMessage(chatId, "Không tìm thấy lệnh rút tiền");
//         return;
//       }

//       if ([-1].includes(withdraw.status)) {
//         bot.sendMessage(chatId, "Lệnh rút tiền đã hủy");
//         return;
//       }

//       if ([0].includes(withdraw?.status)) {
//         bot.sendMessage(chatId, "Lệnh rút tiền chưa được duyệt");
//         return;
//       }

//       if ([2].includes(withdraw?.status)) {
//         bot.sendMessage(chatId, "Lệnh rút tiền đã thanh toán thành công");
//         return;
//       }

//       if ([3].includes(withdraw?.status)) {
//         bot.sendMessage(chatId, "Lệnh rút tiền đã thanh toán thất bại");
//         return;
//       }

//       const timeNow = new Date();

//       // tất cả đơn hàng đã thanh toán  thành công -> cập nhật trạng thái lệnh rút tiền
//       const newOrdersInWithdraw = withdraw?.orders?.map((item) => {
//         return {
//           ...item,
//           status: 2,
//           timeBank: timeNow,
//         };
//       });

//       await Promise.all(
//         withdraw?.orders.map(async (item) => {
//           await OrderModel.updateOne(
//             {
//               orderCode: item?.orderDetail?.orderCode,
//             },
//             {
//               paymentStatus: 2,
//               status: ORDER_STATUS.SUPPORTER_PAYMENT,
//               timeBank: new Date(),
//             }
//           );
//         })
//       );

//       await Promise.all([
//         withdrawModel.findByIdAndUpdate(withdraw?._id, {
//           status: 2,
//           orders: newOrdersInWithdraw,
//         }),
//       ]);

//       bot.sendMessage(chatId, "Đã gửi thông báo đến nhà cung cấp");

//       for (const item of newOrdersInWithdraw) {
//         await handleSyncOrder(item?.orderDetail?.orderCode, chatId, "");
//         // sleep(1000);
//       }

//       if (withdraw?.user?.telegram) {
//         bot.sendMessage(
//           withdraw?.user?.telegram,
//           TEMPLATE_MESSAGE.SUPPORTER_PAYMENT_WITHDRAW({
//             code: withdraw?.code,
//             amount: withdraw?.amount,
//             paymentMethod: withdraw?.paymentMethod,
//             orders: withdraw?.orders,
//             producer: withdraw?.user?.username,
//             totalAfterPaymentMethod: withdraw?.totalAfterPaymentMethod,
//           }),
//           {
//             parse_mode: "html",
//           }
//         );
//       }

//       const ordersTemplate = withdraw?.orders?.map((item) => ({
//         orderCode: item?.orderDetail?.orderCode,
//         totalPriceDiscount: formatMoney(item?.orderDetail?.totalPriceDiscount),
//         quantity: item?.orderDetail?.items?.length,
//         service: item?.orderDetail?.items?.[0]?.service || "-",
//       }));

//       sendEmail(
//         withdraw?.user?.email,
//         "Thanh toán yêu cầu rút tiền",
//         "withdrawSeo",
//         {
//           name: withdraw?.user?.username,
//           email: withdraw?.user?.email,
//           amount: formatMoney(withdraw?.amount),
//           code: withdraw?.code,
//           day: moment().format("HH:mm DD/MM/YYYY"),
//           orders: ordersTemplate,
//         }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function InitTeleBot() {
//   try {
//     for (const item of [bot, botKhuB]) {
//       await startBot(item);
//     }
//   } catch (error) {
//     // console.log("Đã gửi thông báo đến nhà cung cấp", error);
//     // Logger.error(error);
//   }
// }

// async function sendMessageWithBotAndBrand(brandChatId, message, hauDai = "") {
//   return;
//   if (hauDai === "OKVIP-B") {
//     botKhuB.sendMessage(brandChatId, message, {
//       parse_mode: "html",
//     });
//   } else {
//     bot.sendMessage(brandChatId, message, { parse_mode: "html" });
//   }
// }

// export async function noticeLimit(id, msgProducer, msgAdmin, hauDai = "") {
//   try {
//     sendMessageWithBotAndBrand(
//       hauDai === "F8"
//         ? PAYMENT_GROUP_F8
//         : hauDai === "MB66-1"
//         ? PAYMENT_GROUP_MB
//         : hauDai === "OK9-1"
//         ? PAYMENT_GROUP_OK9
//         : hauDai === "SHBET"
//         ? PAYMENT_GROUP_SH
//         : hauDai === "OKVIP-B"
//         ? PAYMENT_GROUP_OKVIP_B
//         : PAYMENT_GROUP,
//       msgAdmin,
//       hauDai
//     );

//     if (id) {
//       bot.sendMessage(id, msgProducer, { parse_mode: "html" });
//     }
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegram(message, hauDai = "") {
//   try {
//     if (hauDai === "all") {
//       await Promise.all([
//         bot.sendMessage(TOTAL_GROUP, message, {
//           parse_mode: "html",
//         }),
//         botKhuB.sendMessage(TOTAL_GROUP_OKVIP_B, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_F8, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_MB, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_OK9, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_SH, message, {
//           parse_mode: "html",
//         }),
//       ]);
//     } else {
//       sendMessageWithBotAndBrand(
//         hauDai === "F8"
//           ? TOTAL_GROUP_F8
//           : hauDai === "MB66-1"
//           ? TOTAL_GROUP_MB
//           : hauDai === "OK9-1"
//           ? TOTAL_GROUP_OK9
//           : hauDai === "SHBET"
//           ? TOTAL_GROUP_SH
//           : hauDai === "OKVIP-B"
//           ? TOTAL_GROUP_OKVIP_B
//           : TOTAL_GROUP,
//         message,
//         hauDai
//       );
//     }
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramPaymentGroup(message, hauDai) {
//   try {
//     sendMessageWithBotAndBrand(
//       hauDai === "F8"
//         ? PAYMENT_GROUP_F8
//         : hauDai === "MB66-1"
//         ? PAYMENT_GROUP_MB
//         : hauDai === "OK9-1"
//         ? PAYMENT_GROUP_OK9
//         : hauDai === "SHBET"
//         ? PAYMENT_GROUP_SH
//         : hauDai === "OKVIP-B"
//         ? PAYMENT_GROUP_OKVIP_B
//         : PAYMENT_GROUP,
//       message,
//       hauDai
//     );
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramCommentGroup(message, hauDai = "") {
//   try {
//     sendMessageWithBotAndBrand(
//       hauDai === "F8"
//         ? COMMENT_GROUP_F8
//         : hauDai === "MB66-1"
//         ? COMMENT_GROUP_MB
//         : hauDai === "OK9-1"
//         ? COMMENT_GROUP_OK9
//         : hauDai === "SHBET"
//         ? COMMENT_GROUP_SH
//         : hauDai === "OKVIP-B"
//         ? COMMENT_GROUP_OKVIP_B
//         : COMMENT_GROUP,
//       message,
//       hauDai
//     );
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramWalletGroup(message, hauDai = "") {
//   try {
//     sendMessageWithBotAndBrand(
//       hauDai === "F8"
//         ? WALLET_GROUP_F8
//         : hauDai === "MB66-1"
//         ? WALLET_GROUP_MB
//         : hauDai === "OK9-1"
//         ? WALLET_GROUP_OK9
//         : hauDai === "SHBET"
//         ? WALLET_GROUP_SH
//         : hauDai === "OKVIP-B"
//         ? WALLET_GROUP_OKVIP_B
//         : WALLET_GROUP,
//       message,
//       hauDai
//     );
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramAutoBankGroup(message) {
//   try {
//     await bot.sendMessage(AUTO_BANK_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function handleLogTelegramChangePrice(message, hauDai = "") {
//   try {
//     if (hauDai === "OK") {
//       bot.sendMessage(PRODUCER_CHANGE_PRICE_GROUP, message, {
//         parse_mode: "html",
//       });
//     } else {
//       await Promise.all([
//         bot.sendMessage(PRODUCER_CHANGE_PRICE_GROUP, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_F8, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_MB, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_OK9, message, {
//           parse_mode: "html",
//         }),
//         bot.sendMessage(TOTAL_GROUP_SH, message, {
//           parse_mode: "html",
//         }),
//         botKhuB.sendMessage(TOTAL_GROUP_OKVIP_B, message, {
//           parse_mode: "html",
//         }),
//       ]);
//     }
//   } catch (error) {
//     // Logger.error(error);
//   }
// }
// //
// export async function handleLogTelegramGroupTL(message) {
//   try {
//     await bot.sendMessage(TELEGRAM_GROUP_BLOCK_USER, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // send message to log external group
// export async function handleLogTelegramExternalGroup(message) {
//   try {
//     await bot.sendMessage(EXTERNAL_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramSameOrderGroup(message) {
//   try {
//     await bot.sendMessage(SAME_ORDER_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramCommunityGroup(message) {
//   try {
//     await bot.sendMessage(COMMUNITY_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramProducerRegisterGroup(message) {
//   try {
//     await bot.sendMessage(PRODUCER_REGISTER_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramPercentCompleteOrderGroup(message) {
//   try {
//     await bot.sendMessage(PERCENT_COMPLETE_ORDER_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramLevelProducerGroup(message) {
//   try {
//     bot.sendMessage(LEVEL_PRODUCER_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramCheckLinkGroup(message) {
//   try {
//     bot.sendMessage(CHECK_LINK_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramBlacklistGroup(message) {
//   try {
//     bot.sendMessage(BLACKLIST_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function handleLogTelegramEscrowGroup(message) {
//   try {
//     bot.sendMessage(ESCROW_GROUP, message, {
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function sendMessage(
//   chatId,
//   message,
//   opt = {
//     parse_mode: "html",
//   }
// ) {
//   try {
//     if (!chatId) return;
//     bot.sendMessage(chatId, message, opt);
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function sendImageMessage(chatId, photo, message, opt) {
//   try {
//     if (!chatId) return;
//     bot.sendPhoto(
//       chatId,
//       photo,
//       {
//         caption: message,
//         parse_mode: "HTML",
//       },
//       opt
//     );
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // create order notification to producer
// export async function orderNotifyProducer(chatId, order) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.ORDER_PRODUCER(order);

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // create order notification to customer
// export async function orderNotifyCustomer(
//   chatId,
//   { orderCode, producer, items = [], totalPrice = 0, totalPriceDiscount = 0 }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.ORDER_CUSTOMER({
//       orderCode,
//       producer,
//       items,
//       totalPrice,
//       totalPriceDiscount,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // create order notification to external customer
// export async function orderNotifyExternalCustomer(
//   chatId,
//   { orderCode, producer, items = [], totalPrice = 0, totalPriceDiscount = 0 }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.ORDER_EXTERNAL_CUSTOMER({
//       orderCode,
//       producer,
//       items,
//       totalPrice,
//       totalPriceDiscount,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // TT/TP accepted notification
// export async function TTTPAccepted(
//   chatId,
//   { order, status = ORDER_SATUS_NAME["-1"], userAction = "" }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.TTTP_ACCEPTED_TTTP({
//       order,
//       status,
//       userAction,
//     });
//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // TL accepted notification
// export async function TLAccepted(
//   chatId,
//   { order, status = ORDER_SATUS_NAME[0], userAction = "" }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.TL_ACCEPTED_ORDER({
//       order,
//       status,
//       userAction,
//     });
//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }
// // producer accepted notification
// export async function producerAccepted(
//   chatId,
//   { orderCode, producer, status = ORDER_SATUS_NAME[1] }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.PRODUCER_ACCEPTED({
//       orderCode,
//       producer,
//       status,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // producer completed service notification
// export async function producerCompletedService(
//   chatId,
//   {
//     orderCode,
//     producer,
//     status = ORDER_SATUS_NAME[2],
//     paymentMethod,
//     totalAfterPaymentMethod = 0,
//   }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.PRODUCER_COMPLETED({
//       orderCode,
//       producer,
//       status,
//       paymentMethod,
//       totalAfterPaymentMethod,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // customer confirmed service notification
// export async function customerConfirmService(
//   chatId,
//   { order, status = ORDER_SATUS_NAME[3] }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.CUSTOMER_CONFIRMED({
//       order,
//       status,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// // tttp accept payment
// export async function tttpConfirmService(
//   chatId,
//   { order, status = ORDER_SATUS_NAME[4] }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.TTTP_CONFIRMED({
//       order,
//       status,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function supporterAcceptPayment(
//   chatId,
//   { order, status = ORDER_SATUS_NAME[5], userAction }
// ) {
//   try {
//     if (!chatId) return;
//     const message = TEMPLATE_MESSAGE.TL_ACCEPT_PAYMENT({
//       order,
//       status,
//       userAction,
//     });

//     bot.sendMessage(chatId, message, { parse_mode: "html" });
//   } catch (error) {
//     // console.log(error);
//   }
// }

// export async function requestAcceptProducerTele(user) {
//   try {
//     const message = TEMPLATE_MESSAGE.REQUEST_ACCEPT_PRODUCER(user);
//     await bot.sendMessage("-1002016375976", message, { parse_mode: "html" });
//   } catch (error) {
//     // Logger.error(error);
//   }
// }

// export async function sendPhotoMessageDepositRequestToTL(
//   photo,
//   user,
//   amount,
//   code
// ) {
//   try {
//     await bot.sendPhoto(WALLET_GROUP, photo, {
//       caption: TEMPLATE_MESSAGE.CREATE_DEPOSIT({
//         user,
//         amount,
//         code,
//       }),
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // console.log(error);
//   }
// }

// export async function sendPhotoMessageCreateNotification(photo, user, title) {
//   try {
//     await bot.sendPhoto(TOTAL_GROUP, photo, {
//       caption: TEMPLATE_MESSAGE.CREATE_NOTIFICATION({
//         user,
//         title,
//       }),
//       parse_mode: "html",
//     });
//   } catch (error) {
//     // console.log(error);
//   }
// }
