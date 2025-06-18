import { Request } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";

import { LoginSchema, RegisterSchema } from "../Schemas/AuthSchema";
import { prisma } from "../db";
import { compare, hash } from "bcrypt";
import { generateToken } from "../Helpers/Jwt";
import { AuthenticatedRequest } from "../Middlewares/AuthMiddleware";

export async function register(req: Request) {
    const {
        email,
        password,
        name,
        address,
        taxId,
        expenseRange,
        isActive,
        isGoodWithKids,
        petPreference,
        phoneNumber,
        size,
    } = RegisterSchema.parse(req.body);

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user
        .create({
            data: {
                email,
                password: hashedPassword,
                name,
                taxId,
                phoneNumber,
                address: {
                    create: address,
                },
                petPreference,
                expenseRange,
                isActive,
                isGoodWithKids,
                size,
            },
            include: {
                Ong: true,
            },
        })
        .catch((err) => {
            if (err.code === "P2002") {
                throw HttpError.Duplicated("Email already exists");
            }
            throw err;
        });

    const token = generateToken(user);
    return HttpResponse.Created({
        user,
        token,
    });
}

export async function login(req: Request) {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            Ong: true,
        },
    });
    if (!user) {
        throw HttpError.Unauthorized("Invalid email or password");
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
        throw HttpError.Unauthorized("Invalid email or password");
    }

    const token = generateToken(user);

    return HttpResponse.Created({
        token,
        user: {
            ...user,
            password: undefined,
        },
    });
}

export async function me(req: AuthenticatedRequest) {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
            createdAt: true,
            updatedAt: true,
            taxId: true,
            Ong: {
                select: {
                    id: true,
                },
            },
        },
    });
    return HttpResponse.Ok({ ...user });
}
