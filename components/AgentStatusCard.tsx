'use client';

import type { AgentStatus } from '@/lib/types';
import { Package, MapPin, MessageSquare, FileText, AlertTriangle } from 'lucide-react';

const agentIcons = {
    booking: Package,
    tracking: MapPin,
    customer: MessageSquare,
    documents: FileText,
    management: AlertTriangle,
};

const agentDescriptions = {
    booking: 'Create shipments',
    tracking: 'Monitor ETAs',
    customer: 'Draft replies',
    documents: 'Validate SI/BL',
    management: 'Flag issues',
};

interface AgentStatusCardProps {
    status: AgentStatus;
}

export default function AgentStatusCard({ status }: AgentStatusCardProps) {
    const Icon = agentIcons[status.agentType];
    const successRate = status.totalExecutions > 0
        ? Math.round((status.successfulExecutions / status.totalExecutions) * 100)
        : 0;

    return (
        <div className="glass glass-hover rounded-xl p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold capitalize">{status.agentType}</h3>
                    <p className="text-xs text-muted-foreground">
                        {agentDescriptions[status.agentType]}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-accent">{successRate}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Runs</span>
                    <span className="font-semibold">{status.totalExecutions}</span>
                </div>

                {status.lastExecution && (
                    <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${status.lastExecution.status === 'completed'
                                    ? 'bg-accent'
                                    : 'bg-red-500'
                                } animate-pulse`} />
                            <span className="text-xs text-muted-foreground">
                                Last run: {new Date(status.lastExecution.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
