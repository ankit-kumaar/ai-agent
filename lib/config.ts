import { z } from 'zod';

const envSchema = z.object({
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20240620'),
    OPENROUTER_MODEL: z.string().default('anthropic/claude-3.5-sonnet'),
    DEFAULT_PROVIDER: z.enum(['openai', 'anthropic', 'openrouter']).default('openrouter'),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
    DATABASE_URL: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
    const env = {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
        OPENAI_MODEL: process.env.OPENAI_MODEL,
        ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
        OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
        DEFAULT_PROVIDER: process.env.DEFAULT_PROVIDER,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
    };

    const parsed = envSchema.safeParse(env);

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}

export const config = getEnv();
