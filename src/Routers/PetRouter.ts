import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as PetsController from "../Controllers/PetsController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const PetsRouter = Router();

PetsRouter.get("/", RequestHandler(PetsController.index));
PetsRouter.get("/:id", RequestHandler(PetsController.get));
PetsRouter.post("/", AuthMiddleware, RequestHandler(PetsController.create));
PetsRouter.put("/:id", AuthMiddleware, RequestHandler(PetsController.update));
PetsRouter.delete("/:id", AuthMiddleware, RequestHandler(PetsController.remove));

export default PetsRouter;
