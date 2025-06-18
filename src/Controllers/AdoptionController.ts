import { Response } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";

import { GetDocSchema, SubmissionSchema, UpdateStatusSchema } from "../Schemas/AdoptionSchema";
import { prisma } from "../db";
import { AuthenticatedRequest } from "../Middlewares/AuthMiddleware";

export async function create(req: AuthenticatedRequest) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const idCard = files.idCard?.[0];
    const proofOfResidence = files.proofOfResidence?.[0];
    if (!idCard || !proofOfResidence) {
        throw HttpError.BadRequest("Arquivos necessários não enviados");
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
        throw HttpError.NotFound("Pet não encontrado");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            Adoption: true,
            Ong: true,
        },
    });
    if (!user) {
        throw HttpError.NotFound("Usuário não encontrado");
    }
    if (user.Adoption.some((adoption) => adoption.status === "PENDING")) {
        throw HttpError.Forbidden("Você já tem uma adoção pendente");
    }
    if (user.Ong != null) {
        throw HttpError.BadRequest("Usuário não pode adotar um pet se for uma ONG");
    }
    if (!pet.available) {
        throw HttpError.Forbidden("Pet não disponível para adoção");
    }
    if (!pet.Adoption.every((adoption) => adoption.status === "REJECTED")) {
        throw HttpError.Forbidden("Pet já foi adotado ou está em processo de adoção");
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
            status: "PENDING",
        },
    });

    const submission = await prisma.adoptionRequestSubmission.create({
        data: {
            ...data,
            idCard: idCard.buffer,
            profOfResidence: proofOfResidence.buffer,
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
        message: "Adoção requerida com sucesso",
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
                    createdAt: "desc",
                },
            },
        },
    });
    if (!user) {
        throw HttpError.NotFound("Usuário não encontrado");
    }
    const adoption = user.Adoption[0];
    if (!adoption) {
        throw HttpError.NotFound("Nenhuma adoção encontrada");
    }
    return HttpResponse.Ok({
        message: "Adoção encontrada com sucesso",
        data: adoption,
    });
}

export async function update(req: AuthenticatedRequest) {
    const { adoptionId, approved } = await UpdateStatusSchema.parseAsync(req.body);

    const verifyAdoption = await prisma.adoption.findUnique({
        where: {
            id: adoptionId,
        },
    });
    if (!verifyAdoption) {
        return HttpError.NotFound("Adoção não encontrada.");
    }

    const adoption = await prisma.adoption.update({
        where: {
            id: adoptionId,
        },
        data: {
            status: approved ? "APPROVED" : "REJECTED",
        },
    });
    return HttpResponse.Ok({
        message: "Status da adoção atualizada com sucesso!",
        data: adoption,
    });
}

export async function index() {
    const adoptions = await prisma.adoption.findMany({
        select: {
            id: true,
            pet: {
                select: {
                    formerName: true,
                },
            },
            user: {
                select: {
                    name: true,
                },
            },
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return HttpResponse.Ok(adoptions);
}

export async function getAdoptantRG(req: AuthenticatedRequest, res: Response) {
    const { params } = await GetDocSchema.parseAsync({ params: req.params });
    const { adoptionId } = params;

    const doc = await prisma.adoptionRequestSubmission.findFirst({
        where: {
            adoptionId: adoptionId,
        },
        select: {
            idCard: true,
        },
    });

    if (!doc) {
        throw HttpError.NotFound("RG não encontrado");
    }

    res.setHeader("Content-Length", doc.idCard.length);

    res.writeHead(200);
    res.write(doc.idCard);
    res.end();

    return HttpResponse.NoResponse();
}

export async function getAdoptantProofResidence(req: AuthenticatedRequest, res: Response) {
    const { params } = await GetDocSchema.parseAsync({ params: req.params });
    const { adoptionId } = params;

    const doc = await prisma.adoptionRequestSubmission.findFirst({
        where: {
            adoptionId: adoptionId,
        },
        select: {
            profOfResidence: true,
        },
    });

    if (!doc) {
        throw HttpError.NotFound("Comprovante de Residência não encontrado");
    }

    res.setHeader("Content-Length", doc.profOfResidence.length);

    res.writeHead(200);
    res.write(doc.profOfResidence);
    res.end();

    return HttpResponse.NoResponse();
}

export async function getSubmission(req: AuthenticatedRequest) {
    const { params } = await GetDocSchema.parseAsync({ params: req.params });
    const { adoptionId } = params;

    const submission = await prisma.adoptionRequestSubmission.findFirst({
        where: {
            adoptionId: adoptionId,
        },
        select: {
            whatWillDoIfProblemsArise: true,
            hadPetsBefore: true,
            hasOtherPets: true,
            isPreparedForLongTerm: true,
            hasFinancialConditions: true,
            houseType: true,
        },
    });

    if (!submission) {
        throw HttpError.NotFound("Nenhuma submissão encontrada para esta adoção");
    }

    return HttpResponse.Ok(submission);
}

export async function remove() {
    throw HttpError.NotImplemented("Not Implemented");
}
