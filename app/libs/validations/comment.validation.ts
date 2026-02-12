import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Comment is required" })
    .max(500, { message: "Comment cannot exceed 500 characters" })
    .regex(/^[^<>]*$/, { message: "Comment cannot contain HTML tags" }),
});

export type CommentFormData = z.infer<typeof commentSchema>;
