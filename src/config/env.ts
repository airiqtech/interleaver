import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .transform((value) => Number(value))
    .pipe(z.number().int().positive())
    .default("3001"),
  USER_SERVICE_BASE_URL: z
    .string()
    .url()
    .default("https://dummyjson.com"),
  ENABLE_DOCS: z
    .string()
    .transform((value) => value === "true")
    .optional()
    .default("true"),
});

export type Env = z.infer<typeof envSchema>;

export const loadEnv = (): Env => envSchema.parse(process.env);
