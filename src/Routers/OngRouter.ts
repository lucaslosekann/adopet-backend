import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as OngsController from "../Controllers/OngsController";
import OngMiddleware from "src/Middlewares/OngMiddleware";
import AuthMiddleware from "src/Middlewares/AuthMiddleware";

const OngRouter = Router();

OngRouter.post("/", RequestHandler(OngsController.register));
OngRouter.get("/:id", RequestHandler(OngsController.get));
OngRouter.get("/manage/pets", AuthMiddleware, OngMiddleware, RequestHandler(OngsController.getPets));

export default OngRouter;
