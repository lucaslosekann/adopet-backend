import { Request, response, Response, urlencoded } from "express";
import HttpError from "../Helpers/HttpError";
import HttpResponse from "../Helpers/HttpResponse";
import axios from "axios";
import { RecommendationSchema } from "../Schemas/RecommendationSchema";
import { ENV } from "../server";
import { prisma } from "../db";
import { AuthenticatedRequest } from "../Middlewares/AuthMiddleware";

export async function index(req: AuthenticatedRequest) {
    const userId = req.user.id;

    const recommendationRes = await axios({
        method: "GET",
        url: ENV.RS_BASEURL + "/recommendations",
        params: {
            user_id: userId,
        },
        headers: {
            Authorization: ENV.RS_APIKEY,
        },
        timeout: 10000,
    });

    const recommendedPetIds: string[] = recommendationRes.data.recommendedPets;
    const recommendedPetsData = await prisma.pet.findMany({
        select: {
            id: true,
            formerName: true,
            dateOfBirth: true,
            breed: {
                select: {
                    name: true,
                    specieName: true,
                },
            },
            weight: true,
            size: true,
            castrated: true,
            available: true,
            PetImage: {
                select: {
                    id: true,
                },
            },
        },
        where: {
            id: {
                in: recommendedPetIds,
            },
        },
    });

    return HttpResponse.Ok({
        recommendedPets: recommendedPetsData,
    });
}
