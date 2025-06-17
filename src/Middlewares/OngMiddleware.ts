import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { MiddlewareHandler } from "../Helpers/RequestHandler";
import HttpError from "../Helpers/HttpError";


type UserWithoutPassword = Omit<
    Prisma.UserGetPayload<{
        include: {
            Ong: true;
        };
    }>,
    "password"
>;
export type AuthenticatedRequest = Request & { user: UserWithoutPassword };

export default MiddlewareHandler(function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if(!req?.user?.Ong){
        throw HttpError.Unauthorized("Resource only available to ongs!");
    }

    next();
});

