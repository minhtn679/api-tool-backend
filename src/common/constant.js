export const RESULT = {
  RUNTIME_ERRROR: "-2",
  ERROR: "-1",
  CLEAR: "0",
  SUCCESS: 1,
  DATA_EXIST: "2",
  PERMISSION: "3",
  DATA_USING: "4",
  LOGIC_ENDATE: "5",
  LOGIC_STARTDATE: "6",
  LOGIC_REPEATTIME_WITH_STARTDATE_ENDDATE: "7",
  CONFLICT_TIME_BOOKROOM: "8",
  ERROR_REPEAT_TYPE: "9",
  IMPORT_ERROR: "10",
  ACCOUNT_INCORECT: "11",
  ACCOUNT_COMPANYNAME_INCORRECT: "12",
  ACCOUNT_EXPIRED: "13",
  ACCOUNT_INACTIVE: "14",
  DATA_NOT_EXIST: "15",
  DATE_NOT_CORRECT: "16",
};
export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  BOOK_SERVICE: "bookservice",
  ACCOUNTANT: "accountant",
  PRODUCER: "producer",
};

export const ROLES_NAME = {
  admin: "Admin",
  employee: "Nhân viên",
  bookservice: "Book dịch vụ",
  accountant: "Kế toán",
  producer: "Đối tác",
};

export const SALE_SERVICES = {
  TEXT_LINK: "textlink",
  BANNER: "banner",
  GUEST_POST: "guestPost",
  TRAFFIC: "traffic",
  ENTITY: "entity",
  BACK_LINK: "backlink",
  TOOL: "tool",
  TEXT_HOME: "textHome",
  TEXT_HEADER: "textHeader",
  TEXT_FOOTER: "textFooter",
};

export const SERVICE_NAME = {
  textlink: "Text Link",
  banner: "Banner",
  guestPost: "Guest Post",
  traffic: "Traffic",
  entity: "Entity",
  backlink: "Back Link",
  tool: "Tool",
  textHome: "TextLink Home",
  textHeader: "TextLink Header",
  textFooter: "TextLink Footer",
};

export const TYPE_PACK = {
  traffic: "Traffic",
  entity: "Entity",
  backlink: "Back Link",
  tool: "Tool",
};
export const ORDER_STATUS = {
  SALE_CREATE: 1, // Sale tạo đơn hàng
  BOOK_SERVICE_CONFIRM_SERVICE: 2, // Book dịch vụ xác nhận
  BOOK_SERVICE_COMPLETED_SERVICE: 3, // Book dịch vụ hoàn thành
  SALE_CONFIRM_SERVICE: 4, // Sale xác nhận hoàn thành
  ACCOUNTANT_CONFIRM_PAYMENT: 5, // Kế toán xác nhận thanh toán
  BOOK_SERVICE_CANCELED: 6, // Book dịch vụ hủy
  BOOK_SERVICE_NOT_COMPLETE: 7, // Book dịch vụ không hoàn thành
  SALE_CANCELED: 8, // Sale hủy đơn
  EDIT: 12,
};

export const ORDER_SATUS_NAME = {
  1: "Sale tạo đơn hàng",
  2: "Book dịch vụ xác nhận",
  3: "Book dịch vụ hoàn thành",
  4: "Sale xác nhận hoàn thành",
  5: "Kế toán xác nhận thanh toán",
  6: "Book dịch vụ hủy",
  7: "Book dịch vụ không hoàn thành",
  8: "Sale hủy đơn",
  12: "Cần sửa",
};

export const permissionFieldName = {
  GET: "view",
  ADD: "add",
  DELETE: "delete",
  EDIT: "edit",
};
export const permissionFunction = {
  USER: "user",
  DOMAIN: "domain",
  ORDER: "order",
  ROLE: "role",
};

export const USER_STATUS_NAME = {
  0: "Đang xử lý",
  1: "Đang đợi duyệt",
  2: "Đang hoạt động",
  3: "Từ chối",
  4: "Đã khóa",
};
