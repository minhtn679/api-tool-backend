// import ActionHistoryModel from "../models/log.model.js";
import rateLimit from "express-rate-limit";
// export const createActionMiddleWare = (actionName) => {
//   return async (req, res, next) => {
//     try {
//       await ActionHistoryModel.create({
//         actionName: `${actionName}`,
//         requestDetail: `query: ${JSON.stringify(
//           req.query
//         )}, params: ${JSON.stringify(req.params)}, body:  ${JSON.stringify(
//           req.body
//         )}`,
//         ip: req.headers["x-forwarded-for"] || "::1",
//         user: req?.user?._id,
//       });
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json(error);
//     }
//   };
// };

export const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 6 seconds
  max: 10, // limit each IP to 2 requests per windowMs
});
