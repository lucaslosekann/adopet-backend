import { Request } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";
import { AuthenticatedRequest } from "../Middlewares/AuthMiddleware";

import { CreatePetSchema, DeletePetSchema, UpdatePetSchema } from "../Schemas/PetSchema";
import { prisma } from "../db";

export async function index() {
    //implementar filtro de pets
    throw HttpError.NotImplemented("Not Implemented");
}

export async function get(req: Request) {
    const { params } = await DeletePetSchema.parseAsync({ params: req.params });
    const pet = await prisma.pet.findUnique({
        where: {
            id: params.id,
        },
    });
    if (!pet) {
        throw HttpError.NotFound("Pet não encontrado");
    }
    return HttpResponse.Ok(pet);
}

export async function create(req: AuthenticatedRequest) {
    if (!req.user.Ong) {
        throw HttpError.Forbidden("Somente ONGs podem inserir pets");
    }
    const body = await CreatePetSchema.parseAsync(req.body);
    const pet = await prisma.pet.create({
        data: {
            ...body,
            dateOfBirth: new Date(body.dateOfBirth),
            breed: {
                connectOrCreate: {
                    where: {
                        name: body.breed,
                    },
                    create: {
                        name: body.breed,
                    },
                },
            },
            species: {
                connectOrCreate: {
                    where: {
                        name: body.species,
                    },
                    create: {
                        name: body.species,
                    },
                },
            },
            ong: {
                connect: {
                    id: req.user.Ong.id,
                },
            },
        },
    });
    return HttpResponse.Created(pet);
}

export async function update(req: AuthenticatedRequest) {
    if (!req.user.Ong) {
        throw HttpError.Forbidden("Somente ONGs podem inserir pets");
    }
    const { body, params } = await UpdatePetSchema.parseAsync({
        body: req.body,
        params: req.params,
    });
    const { breed, species, ...rest } = body;
    body.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth).toISOString() : undefined;
    const pet = await prisma.pet
        .update({
            where: {
                id: params.id,
            },
            data: {
                ...rest,
                ...(breed && {
                    breed: {
                        connectOrCreate: {
                            where: {
                                name: breed,
                            },
                            create: {
                                name: breed,
                            },
                        },
                    },
                }),
                ...(species && {
                    species: {
                        connectOrCreate: {
                            where: {
                                name: species,
                            },
                            create: {
                                name: species,
                            },
                        },
                    },
                }),
            },
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Pet não encontrado");
            }
            throw err;
        });
    return HttpResponse.Created(pet);
}

export async function remove(req: AuthenticatedRequest) {
    if (!req.user.Ong) {
        throw HttpError.Forbidden("Somente ONGs podem inserir pets");
    }
    const { params } = await DeletePetSchema.parseAsync({ params: req.params });
    await prisma.pet
        .update({
            where: {
                id: params.id,
            },
            data: {
                available: false,
            },
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Pet não encontrado");
            }
            throw err;
        });
    return HttpResponse.NoContent();
}
