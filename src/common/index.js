import moment from "moment";
import { customAlphabet } from "nanoid";

export function validateDomain(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  const flag = pattern.test(str);
  if (!flag) return false;
  if (!str.includes("https://") && !str.includes("http://")) {
    const url = new URL(`https://${str}`);
    return url.hostname.replace("www.", "");
  }

  const url = new URL(str);
  console.log("url", url);
  return url.hostname.replace("www.", "");
}

export const toSlug = (str) => {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
    .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  str = str.replace(/[đĐ]/g, "d");

  // thay . -
  str = str.replace(/[.]/g, "-");

  // thay : -
  str = str.replace(/[:]/g, "-");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, "-");

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, "-");

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, "");

  // return
  return str;
};
export const getUniqueCode = async () => {
  //
  const random = await customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    7
  )();

  const timer = new Date().getTime().toString();
  const preCode = timer.slice(0, timer.length - 9);

  return preCode + random;
};

export const delay = (ms) =>
  new Promise((resove, reject) => {
    setTimeout(() => resove(), ms);
  });

export const getWalletUniqueCode = async () => {
  //
  const random = await customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    8
  )();

  const timer = moment().format("DDMM");

  return timer + random;
};

export const formatMoney = (value = 0, paymentMethod = "VND") => {
  if (paymentMethod === "USDT") {
    return (value || 0)?.toLocaleString("en-US") + " USDT";
  }
  if (paymentMethod === "Paypal") {
    return (value || 0)?.toLocaleString("en-US") + " USD";
  }
  return (value || 0)?.toLocaleString("en-US") + " VNĐ";
};

export const roundMoney = (value = 0) => {
  const temp = Math.round(value / 1000);
  return temp * 1000;
};

export const regexDateString =
  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

export const sleep = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
