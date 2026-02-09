import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const classification = searchParams.get('classification');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabaseAdmin
            .from('emails')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        if (classification) {
            query = query.eq('classification', classification);
        }

        const { data: emails, error, count } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: {
                emails: emails || [],
                total: count || 0,
                limit,
                offset,
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
