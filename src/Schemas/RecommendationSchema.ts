import { z } from "zod";

export const RecommendationSchema = z.object({
    userId: z.string().length(24)
});