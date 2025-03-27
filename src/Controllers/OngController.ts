import { Request } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";

import { RegisterSchema } from "../Schemas/OngSchema";
import { prisma } from "../db";
import { hash } from "bcrypt";
import { generateToken } from "../Helpers/Jwt";
import validateCNPJ from "../Services/ValidateCNPJ";
import { getCNPJData } from "../Services/ReceitaWS";

export async function register(req: Request) {
    const { email, password, cnpj } = RegisterSchema.parse(req.body);

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
                user: true,
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
