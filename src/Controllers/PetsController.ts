import { Request, Response } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";
import { AuthenticatedRequest } from "../Middlewares/AuthMiddleware";

import {
    AddPetImageSchema,
    CreatePetSchema,
    DeletePetSchema,
    GetPetImageSchema,
    RemovePetImageSchema,
    UpdatePetSchema,
} from "../Schemas/PetSchema";
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
        include: {
            PetImage: {
                select: {
                    id: true,
                    mimeType: true,
                    createdAt: true,
                },
            },
            ong: {
                include: {
                    user: {
                        include: {
                            address: true,
                        },
                    },
                },
            },
        },
    });
    if (!pet) {
        throw HttpError.NotFound("Pet não encontrado");
    }
    return HttpResponse.Ok({
        ...pet,
        address: {
            city: pet.ong.user.address.city,
            uf: pet.ong.user.address.uf,
        },
    });
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
        throw HttpError.Forbidden("Somente ONGs podem atualizar pets");
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
        throw HttpError.Forbidden("Somente ONGs podem remover pets");
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

export async function addImage(req: AuthenticatedRequest) {
    if (!req.user.Ong) {
        throw HttpError.Forbidden("Somente ONGs podem modificar pets");
    }
    const img = req.file;
    if (!img) {
        throw HttpError.BadRequest("Imagem não encontrada");
    }
    const { params } = await AddPetImageSchema.parseAsync({ params: req.params });

    const { ongId } = await prisma.pet
        .findUniqueOrThrow({
            where: {
                id: params.id,
            },
            select: {
                ongId: true,
            },
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Pet não encontrado");
            }
            throw err;
        });
    if (ongId !== req.user.Ong.id) {
        throw HttpError.Forbidden("ONG não tem permissão para modificar este pet");
    }

    const pet = await prisma.pet
        .update({
            where: {
                id: params.id,
            },
            data: {
                PetImage: {
                    create: {
                        data: img.buffer,
                        mimeType: img.mimetype,
                    },
                },
            },
            select: {
                PetImage: {
                    select: {
                        id: true,
                        mimeType: true,
                        createdAt: true,
                    },
                },
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

export async function removeImage(req: AuthenticatedRequest) {
    if (!req.user.Ong) {
        throw HttpError.Forbidden("Somente ONGs podem modificar pets");
    }
    const { params } = await RemovePetImageSchema.parseAsync({ params: req.params });

    const { ongId } = await prisma.pet
        .findUniqueOrThrow({
            where: {
                id: params.id,
            },
            select: {
                ongId: true,
            },
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Pet não encontrado");
            }
            throw err;
        });
    if (ongId !== req.user.Ong.id) {
        throw HttpError.Forbidden("ONG não tem permissão para modificar este pet");
    }

    await prisma.pet
        .update({
            where: {
                id: params.id,
            },
            data: {
                PetImage: {
                    delete: {
                        id: params.imgId,
                    },
                },
            },
            select: {},
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Pet não encontrado");
            }
            throw err;
        });

    return HttpResponse.NoContent();
}

export async function getImage(req: AuthenticatedRequest, res: Response) {
    const { params } = await GetPetImageSchema.parseAsync({ params: req.params });

    const { id, imgId } = params;

    const img = await prisma.petImage
        .findUniqueOrThrow({
            where: {
                petId: id,
                id: imgId,
            },
            select: {
                mimeType: true,
                data: true,
            },
        })
        .catch((err) => {
            if (err.code === "P2025") {
                throw HttpError.NotFound("Imagem não encontrada");
            }
            throw err;
        });

    if (!img) {
        throw HttpError.NotFound("Imagem não encontrada");
    }
    res.setHeader("Content-Type", img.mimeType);
    res.setHeader("Content-Length", img.data.length);

    res.writeHead(200);
    res.write(img.data);
    res.end();

    return HttpResponse.NoResponse();
}
