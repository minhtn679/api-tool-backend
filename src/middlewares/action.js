import actionModel from "../models/action.model.js";

export const actionMiddleware = async (req, res, next) => {
  const startTime = Date.now(); // Ghi lại thời gian bắt đầu
  res.on("finish", async () => {
    try {
      const executionTime = Date.now() - startTime; // Tính thời gian xử lý
      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
        ![400, 401, 404, 500, 501, 502].includes(req.originalUrl)
      ) {
        delete req.body.password;
        await actionModel.create({
          method: req.method,
          url: req.originalUrl,
          ip: req.headers["x-forwarded-for"] || req.ip,
          statusCode: res.statusCode,
          executionTime,
          body: req.body || {},
          params: req.params,
          user: req.user?._id,
          orders: req.orders,
        });
      }
    } catch (error) {
      console.log("finish erorr", error);
    }
  });
  next();
};
