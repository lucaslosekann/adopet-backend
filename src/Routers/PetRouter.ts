import { Router } from "express";
import RequestHandler, { MiddlewareHandler } from "../Helpers/RequestHandler";

import * as PetsController from "../Controllers/PetsController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import { upload } from "../server";

const PetsRouter = Router();

PetsRouter.get("/", RequestHandler(PetsController.index));
PetsRouter.get("/species", RequestHandler(PetsController.getAllSpecies));
PetsRouter.get("/:id", RequestHandler(PetsController.get));
PetsRouter.post("/", AuthMiddleware, RequestHandler(PetsController.create));
PetsRouter.put("/:id", AuthMiddleware, RequestHandler(PetsController.update));
PetsRouter.delete("/:id", AuthMiddleware, RequestHandler(PetsController.remove));
PetsRouter.put(
    "/:id/image",
    AuthMiddleware,
    MiddlewareHandler(upload.single("img")),
    RequestHandler(PetsController.addImage),
);
PetsRouter.delete("/:id/image/:imgId", AuthMiddleware, RequestHandler(PetsController.removeImage));
PetsRouter.get("/:id/image/:imgId", RequestHandler(PetsController.getImage));

export default PetsRouter;
