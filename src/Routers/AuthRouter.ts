import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as AuthController from "../Controllers/AuthController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const AuthRouter = Router();

AuthRouter.post("/register", RequestHandler(AuthController.register));
AuthRouter.post("/login", RequestHandler(AuthController.login));
AuthRouter.get("/me", AuthMiddleware, RequestHandler(AuthController.me));

export default AuthRouter;
