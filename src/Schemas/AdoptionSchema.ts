import { z } from "zod";

export const SubmissionSchema = z.object({
    hadPetsBefore: z
        .string()
        .regex(/^(true|false)$/, "Field must be a boolean")
        .transform((val) => val === "true"),
    hasOtherPets: z
        .string()
        .regex(/^(true|false)$/, "Field must be a boolean")
        .transform((val) => val === "true"),
    houseType: z.string(),
    hasFinancialConditions: z
        .string()
        .regex(/^(true|false)$/, "Field must be a boolean")
        .transform((val) => val === "true"),
    isPreparedForLongTerm: z
        .string()
        .regex(/^(true|false)$/, "Field must be a boolean")
        .transform((val) => val === "true"),
    whatWillDoIfProblemsArise: z.string(),
    petId: z.string(),
});

export const UpdateStatusSchema = z.object({
    adoptionId: z.string(),
    approved: z.boolean()
})

export const GetDocSchema = z.object({
    params: z.object({
        adoptionId: z.string()
    }),
});

export const GetSubmissionSchema = z.object({
    params: z.object({
        adoptionId: z.string()
    }),
});