import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ENV } from "../server";

export function generateToken(payload: User) {
    const payloadNoPassword = {
        ...payload,
        password: undefined,
    };
    return jwt.sign({ user: payloadNoPassword }, ENV.JWT_SECRET, {
        expiresIn: "7d",
    });
}
