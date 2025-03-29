import dotenv from "dotenv";
dotenv.config();
import EnvSchema from "./Schemas/EnvSchema";
export const ENV = EnvSchema.parse(process.env);

import multer from "multer";
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10, // 5 MB
    },
});

import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

import logger from "./Helpers/logger";
import { ErrorMiddleware } from "./Helpers/RequestHandler";

import AuthRouter from "./Routers/AuthRouter";
import OngRouter from "./Routers/OngRouter";
import PetsRouter from "./Routers/PetRouter";
import AdoptionRouter from "./Routers/AdoptionRouter";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiV1Router = express.Router();
app.use("/v1", apiV1Router);

//Routers
apiV1Router.use("/auth", AuthRouter);
apiV1Router.use("/ongs", OngRouter);
apiV1Router.use("/pets", PetsRouter);
apiV1Router.use("/adoption", AdoptionRouter);

app.use(ErrorMiddleware);
const server = app.listen(ENV.PORT, () => logger.info("Api it's running " + ENV.PORT));

export default server;
