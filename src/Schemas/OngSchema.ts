import { z } from "zod";

export const RegisterOngSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    cnpj: z.string().length(14),
});

export const GetOngSchema = z.object({
    id: z.string(),
});
