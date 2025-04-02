import { Request } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";

import { GetOngSchema, RegisterOngSchema } from "../Schemas/OngSchema";
import { prisma } from "../db";
import { hash } from "bcrypt";
import { generateToken } from "../Helpers/Jwt";
import validateCNPJ from "../Services/ValidateCNPJ";
import { getCNPJData } from "../Services/ReceitaWS";

export async function register(req: Request) {
    const { email, password, cnpj, pixKey } = RegisterOngSchema.parse(req.body);

    const isCNPJValid = validateCNPJ(cnpj);
    if (!isCNPJValid) {
        throw HttpError.BadRequest("CNPJ Inválido");
    }
    const cnpjData = await getCNPJData(cnpj);
    if (cnpjData.situacao !== "ATIVA") {
        throw HttpError.BadRequest("O CNPJ não está ativo");
    }
    if (cnpjData.email !== email) {
        throw HttpError.BadRequest("O email não corresponde ao CNPJ");
    }

    const hashedPassword = await hash(password, 10);
    const ong = await prisma.ong
        .create({
            data: {
                cnpj,
                pixKey,
                phone: cnpjData.telefone,
                user: {
                    create: {
                        email,
                        password: hashedPassword,
                        name: cnpjData.nome,
                        address: {
                            create: {
                                street: cnpjData.logradouro,
                                number: cnpjData.numero,
                                neighborhood: cnpjData.bairro,
                                city: cnpjData.municipio,
                                uf: cnpjData.uf,
                                postalCode: cnpjData.cep,
                            },
                        },
                    },
                },
            },
            include: {
                user: {
                    include: {
                        Ong: true,
                    },
                    omit: {
                        password: true,
                    },
                },
            },
        })
        .catch((err) => {
            if (err.code === "P2002") {
                throw HttpError.Duplicated("Email/CNPJ already exists");
            }
            throw err;
        });

    const token = generateToken(ong.user);
    return HttpResponse.Created({
        ong,
        token,
    });
}

export async function get(req: Request) {
    const { id } = GetOngSchema.parse(req.params);

    const data = await prisma.ong.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                include: {
                    address: true,
                },
                omit: {
                    password: true,
                    addressId: true,
                },
            },
        },
        omit: {
            userId: true,
        },
    });
    if (!data) {
        throw HttpError.NotFound("ONG não encontrada");
    }
    const { user, ...ong } = data;

    return HttpResponse.Created({
        ...ong,
        address: user.address,
        email: user.email,
        name: user.name,
    });
}
