import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import fileUpload from "express-fileupload";
// import Fingerprint from "express-fingerprint";
import http from "http";
import { ConnectDB } from "./src/configs/db.config.js";
import route from "./src/routers/index.js";
import Logger from "./src/common/logger.js";
import { ORDER_STATUS, RESULT } from "./src/common/constant.js";
import { initData } from "./src/common/initData.js";
import path, { dirname, join } from "path";
dotenv.config();
import { domainToASCII, fileURLToPath } from "url";
import userModel from "./src/models/user.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var origin_urls = [
  `${process.env.CLIENT_URL}`,
  `${process.env.ADMIN_URL}`,
  `https://apitool.com`,
  `http://localhost:3000`,
];

const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Language",
  ],
  credentials: true,
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  origin: origin_urls,
  preflightContinue: false,
};

const app = express();
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.use(cookieParser());
app.use(cors(corsOptions));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 500000000,
  })
);

app.use(fileUpload());

app.set("trust proxy", true);

// routers
app.get("/", (req, res) => {
  res.send("Hello world, I'm a develop");
});
app.post("/api/upload", async (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  if (!req.files.file?.[0]) {
    const myFile = req.files.file;
    const name =
      Date.now().toString() + "-" + myFile.name?.replaceAll(" ", "-");
    // Use the mv() method to place the file somewhere on your server
    myFile.mv(`${__dirname}/public/${name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "fuck eroor" });
      }
      return res.json({ status: 1, image: [`/${name}`], name: myFile.name });
    });
  } else {
    const promiseImage = req.files.file?.map(async (myFile) => {
      const name =
        Date.now().toString() + "-" + myFile.name?.replaceAll(" ", "-");
      await myFile.mv(`${__dirname}/public/${name}`);
      return `/${name}`;
    });
    Promise.all(promiseImage).then((data) =>
      res.json({ status: 1, image: data })
    );
  }
});
route(app);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";
  if (status === 500) {
    console.log(error);
  }
  res.status(status).json({ status: RESULT.ERROR, message: message });
});
const server = http.createServer(app);

// db
ConnectDB(() =>
  server.listen(process.env.PORT || 4000, () =>
    Logger.verbose(`App is running on port: ${process.env.PORT || 4000}`)
  )
);
initData();
