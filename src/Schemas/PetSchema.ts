import { z } from "zod";

export const CreatePetSchema = z.object({
    formerName: z.string(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    species: z.string(),
    breed: z.string(),
    weight: z.number(),
    size: z.string(),
    castrated: z.boolean(),
    available: z.boolean(),
    expenseRange: z.string(),
    isActive: z.boolean(),
    isGoodWithKids: z.boolean(),
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

export const AddPetImageSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

export const RemovePetImageSchema = z.object({
    params: z.object({
        id: z.string(),
        imgId: z.string(),
    }),
});

export const GetPetImageSchema = z.object({
    params: z.object({
        id: z.string(),
        imgId: z.string(),
    }),
});
