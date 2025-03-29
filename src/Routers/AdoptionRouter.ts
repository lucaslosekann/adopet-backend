import { Router } from "express";
import RequestHandler, { MiddlewareHandler } from "../Helpers/RequestHandler";

import * as AdoptionController from "../Controllers/AdoptionController";
import { upload } from "../server";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const AdoptionRouter = Router();

AdoptionRouter.post(
    "/",
    AuthMiddleware,
    MiddlewareHandler(
        upload.fields([
            { name: "idCard", maxCount: 1 },
            { name: "profOfResidence", maxCount: 1 },
        ])
    ),
    RequestHandler(AdoptionController.create)
);
AdoptionRouter.get("/status", AuthMiddleware, RequestHandler(AdoptionController.get));
// AdoptionRouter.get("/", RequestHandler(AdoptionController.index));
// AdoptionRouter.put("/:id", RequestHandler(AdoptionController.update));
// AdoptionRouter.delete("/:id", RequestHandler(AdoptionController.remove));

export default AdoptionRouter;
