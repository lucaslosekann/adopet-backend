import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    address: z.object({
        street: z.string(),
        number: z.string(),
        neighborhood: z.string(),
        city: z.string(),
        uf: z.string(),
        postalCode: z.string().length(8),
    }),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
