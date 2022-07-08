import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import loadModels from "./loaders/loadModels.js";
import loadAuth from "./loaders/loadAuth.js";
import regRoutes from "./routes/index.js";
const start = async () => {
  //TO-DO move mongo URI to .env
  await mongoose.connect(process.env.BENCHMARK_MONGO_URI);
  await loadModels();
  var app = express();
  app.options("/*", function(req, res, next){
    res.send(200);
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/file", express.static("./public/uploads"));
  await loadAuth(app);
  await regRoutes(app);
  console.log(global);
  console.log("NODE_ENV: ", process.env.BENCHMARK_NODE_ENV);
  const host = process.env.BENCHMARK_HOST;
  const port = process.env.BENCHMARK_PORT;
  app.listen(port);
  console.log(`auth server started at http://${host}:${port}`);
};

start();
