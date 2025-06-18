import { Router } from 'express';
import RequestHandler, { MiddlewareHandler } from '../Helpers/RequestHandler';

import * as AdoptionController from '../Controllers/AdoptionController';
import { upload } from '../server';
import AuthMiddleware from '../Middlewares/AuthMiddleware';
import OngMiddleware from "src/Middlewares/OngMiddleware";

const AdoptionRouter = Router();

AdoptionRouter.post(
    '/',
    AuthMiddleware,
    MiddlewareHandler(
        upload.fields([
            { name: 'idCard', maxCount: 1 },
            { name: 'proofOfResidence', maxCount: 1 },
        ]),
    ),
    RequestHandler(AdoptionController.create),
);
AdoptionRouter.get('/status', AuthMiddleware, RequestHandler(AdoptionController.get));
AdoptionRouter.put('/status', AuthMiddleware, OngMiddleware, RequestHandler(AdoptionController.update));
AdoptionRouter.get("/", AuthMiddleware, OngMiddleware, RequestHandler(AdoptionController.index));
AdoptionRouter.get("/docs/rg/:adoptionId", AuthMiddleware, OngMiddleware, RequestHandler(AdoptionController.getAdoptantRG));
AdoptionRouter.get("/docs/proofResidence/:adoptionId", AuthMiddleware, OngMiddleware, RequestHandler(AdoptionController.getAdoptantProofResidence));
AdoptionRouter.get("/submission/:adoptionId", AuthMiddleware, OngMiddleware, RequestHandler(AdoptionController.getSubmission));
// AdoptionRouter.put("/:id", RequestHandler(AdoptionController.update));
// AdoptionRouter.delete("/:id", RequestHandler(AdoptionController.remove));

export default AdoptionRouter;
