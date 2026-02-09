'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AgentStatus } from '@/lib/types';
import AgentStatusCard from './AgentStatusCard';
import ProcessEmailForm from './ProcessEmailForm';
import EmailCard from './EmailCard';
import { Mail, RefreshCw } from 'lucide-react';

export default function EmailDashboard() {
    const [filter, setFilter] = useState<string>('all');

    // Fetch agent statuses
    const { data: agentStatusData, refetch: refetchAgents } = useQuery({
        queryKey: ['agentStatus'],
        queryFn: async () => {
            const response = await apiClient.get<AgentStatus[]>('/api/agents/status');
            return response.data || [];
        },
    });

    // Fetch emails
    const { data: emailsData, refetch: refetchEmails, isLoading } = useQuery({
        queryKey: ['emails', filter],
        queryFn: async () => {
            const url = filter === 'all'
                ? '/api/emails'
                : `/api/emails?classification=${filter}`;
            const response = await apiClient.get<{ emails: any[]; total: number }>(url);
            return response.data;
        },
    });

    const handleRefresh = () => {
        refetchAgents();
        refetchEmails();
    };

    return (
        <div className="space-y-8">
            {/* Agent Status Cards */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Agents You&apos;ll Build</h2>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 glass glass-hover rounded-lg text-sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {agentStatusData?.map((status) => (
                        <AgentStatusCard key={status.agentType} status={status} />
                    ))}
                </div>
            </section>

            {/* Process Email Form */}
            <section>
                <ProcessEmailForm onSuccess={handleRefresh} />
            </section>

            {/* Email List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Processed Emails
                    </h2>
                    <div className="flex gap-2">
                        {['all', 'booking', 'tracking', 'customer', 'documents', 'management'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === f
                                        ? 'bg-primary text-primary-foreground'
                                        : 'glass glass-hover'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 glass rounded-xl">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                        <p className="mt-4 text-muted-foreground">Loading emails...</p>
                    </div>
                ) : emailsData?.emails && emailsData.emails.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {emailsData.emails.map((email) => (
                            <EmailCard key={email.id} email={email} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 glass rounded-xl">
                        <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No emails processed yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Submit an email above to see it processed by AI agents
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
