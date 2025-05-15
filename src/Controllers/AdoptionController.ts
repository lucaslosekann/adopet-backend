import { NextFunction, Request, Response } from 'express';
import HttpError from '../Helpers/HttpError';
import HttpResponse from '../Helpers/HttpResponse';

import { SubmissionSchema } from '../Schemas/AdoptionSchema';
import { prisma } from '../db';
import { AuthenticatedRequest } from '../Middlewares/AuthMiddleware';

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const idCard = files.idCard?.[0];
    const profOfResidence = files.profOfResidence?.[0];
    if (!idCard || !profOfResidence) {
        throw HttpError.BadRequest('Arquivos necessários não enviados');
    }
    const userId = req.user.id;

    const { petId, ...data } = await SubmissionSchema.parseAsync(req.body);
    const pet = await prisma.pet.findUnique({
        where: {
            id: petId,
        },
        include: {
            ong: true,
            Adoption: true,
        },
    });
    if (!pet) {
        throw HttpError.NotFound('Pet não encontrado');
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            Adoption: true,
        },
    });
    if (!user) {
        throw HttpError.NotFound('Usuário não encontrado');
    }
    if (user.Adoption.some((adoption) => adoption.status === 'PENDING')) {
        throw HttpError.Forbidden('Você já tem uma adoção pendente');
    }
    if (pet.ong.userId === userId) {
        throw HttpError.Forbidden('Você não pode adotar seu próprio pet');
    }
    if (!pet.available) {
        throw HttpError.Forbidden('Pet não disponível para adoção');
    }
    if (!pet.Adoption.every((adoption) => adoption.status === 'REJECTED')) {
        throw HttpError.Forbidden('Pet já foi adotado ou está em processo de adoção');
    }

    const adoption = await prisma.adoption.upsert({
        where: {
            petId_userId: {
                petId,
                userId,
            },
        },
        create: {
            petId,
            userId,
        },
        update: {
            status: 'PENDING',
        },
    });

    const submission = await prisma.adoptionRequestSubmission.create({
        data: {
            ...data,
            idCard: idCard.buffer,
            profOfResidence: profOfResidence.buffer,
            adoption: {
                connect: {
                    id: adoption.id,
                },
            },
        },
        omit: {
            idCard: true,
            profOfResidence: true,
        },
    });

    return HttpResponse.Created({
        message: 'Adoção requerida com sucesso',
        data: submission,
    });
}

export async function get(req: AuthenticatedRequest) {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        include: {
            Adoption: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });
    if (!user) {
        throw HttpError.NotFound('Usuário não encontrado');
    }
    const adoption = user.Adoption[0];
    if (!adoption) {
        throw HttpError.NotFound('Nenhuma adoção encontrada');
    }
    return HttpResponse.Ok({
        message: 'Adoção encontrada com sucesso',
        data: adoption,
    });
}

export async function update() {
    throw HttpError.NotImplemented('Not Implemented');
}

export async function index() {
    throw HttpError.NotImplemented('Not Implemented');
}

export async function remove() {
    throw HttpError.NotImplemented('Not Implemented');
}
