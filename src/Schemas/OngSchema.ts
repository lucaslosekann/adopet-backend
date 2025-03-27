import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    cnpj: z.string().length(14),
});
