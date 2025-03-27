import { z } from "zod";

export const CreatePetSchema = z.object({
    formerName: z.string(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    weight: z.number(),
    species: z.string(),
    breed: z.string(),
    castrated: z.boolean(),
    available: z.boolean(),
});

export const UpdatePetSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: CreatePetSchema.partial(),
});

export const DeletePetSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

export const GetPetSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});
