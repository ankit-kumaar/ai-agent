import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Fetch email details
        const { data: email, error: emailError } = await supabaseAdmin
            .from('emails')
            .select('*')
            .eq('id', id)
            .single();

        if (emailError || !email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email not found',
                },
                { status: 404 }
            );
        }

        // Fetch agent executions
        const { data: executions, error: executionsError } = await supabaseAdmin
            .from('agent_executions')
            .select('*')
            .eq('email_id', id)
            .order('started_at', { ascending: false });

        if (executionsError) {
            console.error('Error fetching executions:', executionsError);
        }

        // Fetch related data based on classification
        let relatedData = null;
        if (email.classification === 'booking') {
            const { data: shipment } = await supabaseAdmin
                .from('shipments')
                .select('*')
                .eq('email_id', id)
                .single();
            relatedData = shipment;
        } else if (email.classification === 'documents') {
            const { data: document } = await supabaseAdmin
                .from('documents')
                .select('*')
                .eq('email_id', id)
                .single();
            relatedData = document;
        } else if (email.classification === 'management') {
            const { data: issue } = await supabaseAdmin
                .from('issues')
                .select('*')
                .eq('email_id', id)
                .single();
            relatedData = issue;
        }

        return NextResponse.json({
            success: true,
            data: {
                email,
                executions: executions || [],
                relatedData,
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
