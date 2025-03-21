import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as AuthController from "../Controllers/AuthController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const Auth = Router();

Auth.post("/register", RequestHandler(AuthController.register));
Auth.post("/login", RequestHandler(AuthController.login));
Auth.get("/me", AuthMiddleware, RequestHandler(AuthController.me));

export default Auth;
