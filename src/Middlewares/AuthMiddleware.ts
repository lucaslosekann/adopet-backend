import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { MiddlewareHandler } from "../Helpers/RequestHandler";
import HttpError from "../Helpers/HttpError";
import { verify } from "jsonwebtoken";
import { ENV } from "../server";

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
    const authorization = Array.isArray(req.headers["authorization"])
        ? req.headers["authorization"][0]
        : req.headers["authorization"];
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        throw HttpError.Unauthorized("Unauthorized");
    }

    try {
        const payload = verify(token, ENV.JWT_SECRET) as { user: UserWithoutPassword } | null;
        if (!payload) {
            throw HttpError.Unauthorized("Unauthorized");
        }

        req.user = payload.user;
    } catch (e) {
        throw HttpError.Unauthorized("Unauthorized");
    }

    next();
});
