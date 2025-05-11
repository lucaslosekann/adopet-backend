import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    taxId: z.string().length(11),
    phoneNumber: z.string().length(11),
    address: z.object({
        street: z.string(),
        number: z.string(),
        neighborhood: z.string(),
        city: z.string(),
        uf: z.string(),
        postalCode: z.string().length(8),
    }),
    petPreference: z.array(z.string()),
    size: z.string(),
    expenseRange: z.string(),
    isActive: z.boolean(),
    isGoodWithKids: z.boolean(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
