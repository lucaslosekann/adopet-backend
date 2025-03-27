import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ENV } from "../server";

export function generateToken(
    payload:
        | Prisma.UserGetPayload<{
              include: {
                  Ong: true;
              };
              omit: {
                  password: true;
              };
          }>
        | Prisma.UserGetPayload<{
              include: {
                  Ong: true;
              };
          }>
) {
    const payloadNoPassword = {
        ...payload,
        password: undefined,
    };
    return jwt.sign({ user: payloadNoPassword }, ENV.JWT_SECRET, {
        expiresIn: "7d",
    });
}
