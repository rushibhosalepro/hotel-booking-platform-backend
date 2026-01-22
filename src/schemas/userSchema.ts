import z from "zod";

export const userSingnupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["customer", "owner"]).optional(),
  phone: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
