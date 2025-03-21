import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as PostsController from "../Controllers/PostsController";
const posts = Router();

// /v1/posts

// posts.use((req, res, next) => {
//     logger.info('PostsRouter middleware');
//     next();
// })

posts.get("/", RequestHandler(PostsController.index));
posts.get("/:name", RequestHandler(PostsController.get));
posts.post("/", RequestHandler(PostsController.create));
posts.put("/:id", RequestHandler(PostsController.update));
posts.delete("/:id", RequestHandler(PostsController.remove));

export default posts;
