import { z } from "zod";

const booleanEnv = (defaultValue: "true" | "false") =>
  z
    .string()
    .default(defaultValue)
    .transform((value) => value.toLowerCase() === "true");

const intEnv = (defaultValue: string) =>
  z
    .string()
    .default(defaultValue)
    .transform((value) => Number.parseInt(value, 10))
    .pipe(z.number().int().positive());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://sonder:sonder_local_password@localhost:5432/sonder?schema=public"),
  JWT_SECRET: z
    .string()
    .min(32)
    .default("local-development-secret-change-before-production"),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_PINPOINT_APPLICATION_ID: z.string().optional().default(""),
  INVITE_ONLY_MODE: booleanEnv("true"),
  POSTING_ENABLED: booleanEnv("true"),
  PUSH_NOTIFICATIONS_ENABLED: booleanEnv("false"),
  MAINTENANCE_MODE: booleanEnv("false"),
  ADMIN_DASHBOARD_ENABLED: booleanEnv("false"),
  ADMIN_SECRET: z.string().optional().default(""),
  REQUEST_TIMEOUT_MS: intEnv("10000")
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}

