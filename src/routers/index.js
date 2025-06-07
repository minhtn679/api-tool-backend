import userRoutes from "./user.route.js";
import domainRoutes from "./domain.route.js";
import authRoutes from "./auth.route.js";
import orderRoutes from "./order.route.js";
import roleRoutes from "./role.route.js";
import permissionRoutes from "./permission.route.js";
import usdRoutes from "./usd.route.js"

function route(app) {
  //
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/domain", domainRoutes);
  app.use("/api/role", roleRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/permission", permissionRoutes);
  app.use("/api/usd", usdRoutes);
}

export default route;
