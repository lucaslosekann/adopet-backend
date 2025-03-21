import { z } from "zod";
//Required in prodution dont put .optional()
const EnvSchema = z
    .object({
        //DEV
        NODE_ENV: z.enum(["development", "test", "production"]).optional(),
        PORT: z
            .string()
            .optional()
            .default("8000")
            .transform((val) => Number(val)),
    })
    .refine((input) => {
        const requiredInDevelopment: string[] = ["PORT"];

        if (input.NODE_ENV === "development") {
            for (const key of requiredInDevelopment) {
                const TypedInput: {
                    [key: string]: unknown;
                } = input;

                if (!TypedInput[key]) {
                    throw new Error(`In development mode you need to provide the ${key} var.`);
                }
            }
        }
        return true;
    });

export default EnvSchema;
