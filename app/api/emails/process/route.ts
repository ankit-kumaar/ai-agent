import { NextRequest, NextResponse } from 'next/server';
import { processEmailWorkflow } from '@/lib/agents/workflow';
import { z } from 'zod';

const emailSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    sender: z.string().email('Invalid sender email'),
    recipient: z.string().email('Invalid recipient email'),
    body: z.string().min(1, 'Body is required'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = emailSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: validation.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const email = validation.data;

        // Process email through workflow
        const result = await processEmailWorkflow(email);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                emailId: result.emailId,
                classification: result.classification,
                result: result.result,
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
