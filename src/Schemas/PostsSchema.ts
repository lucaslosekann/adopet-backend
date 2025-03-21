import { z } from 'zod';

const PostsSchema = z.object({
    params: z.object({
        name: z.string().min(3).max(255),
    })
});

export default PostsSchema;