import { z } from "zod";

export const columnSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title cannot exceed 50 characters" })
    .regex(/^[^<>]*$/, { message: "Title cannot contain HTML tags" }),
});

export type Column = z.infer<typeof columnSchema>;
