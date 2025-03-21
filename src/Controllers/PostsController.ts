import { NextFunction, Request, Response } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";

import PostsSchema from "../Schemas/PostsSchema";

export async function get(req: Request, res: Response, next: NextFunction) {
    const { params } = await PostsSchema.parseAsync(req);

    if (params.name === "reservedName") {
        throw HttpError.BadRequest("Name is reserved");
    }

    if (params.name === "Lucas") {
        return HttpResponse.Ok({
            message: "Success",
        });
    } else {
        //Wrong
        throw new Error("Force fail");

        //Correct
        // throw HttpError.NotFound('Post not found');
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    throw HttpError.NotImplemented("Not implemented");
}
export async function create(req: Request, res: Response, next: NextFunction) {
    throw HttpError.NotImplemented("Not implemented");
}
export async function index(req: Request, res: Response, next: NextFunction) {
    throw HttpError.NotImplemented("Not implemented");
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    throw HttpError.NotImplemented("Not implemented");
}
