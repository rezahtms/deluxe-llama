import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Task title is required" })
    .max(50, { message: "Task title cannot exceed 50 characters" })
    .regex(/^[^<>]*$/, { message: "task title cannot contain HTML tags" }),
});

export type Task = z.infer<typeof taskSchema>;
