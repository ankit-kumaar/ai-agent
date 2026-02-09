import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { AgentStatus, AgentType } from '@/lib/types';

export async function GET() {
    try {
        const agentTypes: AgentType[] = ['booking', 'tracking', 'customer', 'documents', 'management'];
        const statuses: AgentStatus[] = [];

        for (const agentType of agentTypes) {
            // Get all executions for this agent type
            const { data: executions, error } = await supabaseAdmin
                .from('agent_executions')
                .select('*')
                .eq('agent_type', agentType);

            if (error) {
                console.error(`Error fetching executions for ${agentType}:`, error);
                continue;
            }

            const totalExecutions = executions?.length || 0;
            const successfulExecutions = executions?.filter(e => e.status === 'completed').length || 0;
            const failedExecutions = executions?.filter(e => e.status === 'failed').length || 0;

            // Calculate average execution time
            let averageExecutionTime = 0;
            if (executions && executions.length > 0) {
                const completedExecutions = executions.filter(
                    e => e.completed_at && e.started_at
                );
                if (completedExecutions.length > 0) {
                    const totalTime = completedExecutions.reduce((sum, e) => {
                        const start = new Date(e.started_at).getTime();
                        const end = new Date(e.completed_at!).getTime();
                        return sum + (end - start);
                    }, 0);
                    averageExecutionTime = totalTime / completedExecutions.length;
                }
            }

            // Get last execution
            const lastExecution = executions && executions.length > 0
                ? executions.sort((a, b) =>
                    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
                )[0]
                : undefined;

            statuses.push({
                agentType,
                totalExecutions,
                successfulExecutions,
                failedExecutions,
                averageExecutionTime,
                lastExecution: lastExecution
                    ? {
                        timestamp: lastExecution.started_at,
                        status: lastExecution.status,
                    }
                    : undefined,
            });
        }

        return NextResponse.json({
            success: true,
            data: statuses,
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
