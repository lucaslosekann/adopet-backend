import dotenv from "dotenv";
dotenv.config();
import EnvSchema from "./Schemas/EnvSchema";
export const ENV = EnvSchema.parse(process.env);

import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

import logger from "./Helpers/logger";
import { ErrorMiddleware } from "./Helpers/RequestHandler";

import PostsRouter from "./Routers/PostsRouter";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiV1Router = express.Router();
app.use("/v1", apiV1Router);

//Routers
apiV1Router.use("/posts", PostsRouter);

app.use(ErrorMiddleware);
const server = app.listen(ENV.PORT, () => logger.info("Api it's running " + ENV.PORT));

export default server;
