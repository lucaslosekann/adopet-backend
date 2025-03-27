import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as OngsController from "../Controllers/OngsController";

const OngRouter = Router();

OngRouter.post("/", RequestHandler(OngsController.register));
OngRouter.get("/:id", RequestHandler(OngsController.get));

export default OngRouter;
