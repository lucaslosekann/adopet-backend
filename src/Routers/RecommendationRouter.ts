import { Router } from "express";
import RequestHandler, { MiddlewareHandler } from "../Helpers/RequestHandler";
import * as RecommendationController from "../Controllers/RecommendationController";
import AuthMiddleware from "src/Middlewares/AuthMiddleware";

export const RecommendationRouter = Router();

RecommendationRouter.get("/", AuthMiddleware, RequestHandler(RecommendationController.index));