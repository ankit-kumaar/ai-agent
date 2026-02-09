'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, User, Clock } from 'lucide-react';

interface EmailCardProps {
    email: any;
}

export default function EmailCard({ email }: EmailCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getClassificationColor = (classification: string) => {
        const colors: Record<string, string> = {
            booking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            tracking: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            customer: 'bg-green-500/20 text-green-400 border-green-500/30',
            documents: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            management: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[classification] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            completed: 'text-accent',
            processing: 'text-yellow-400',
            failed: 'text-red-400',
            pending: 'text-muted-foreground',
        };
        return colors[status] || 'text-muted-foreground';
    };

    return (
        <div className="glass glass-hover rounded-xl p-6 animate-slide-up">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{email.subject}</h3>
                        {email.classification && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getClassificationColor(email.classification)}`}>
                                {email.classification}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{email.sender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(email.created_at).toLocaleString()}</span>
                        </div>
                        <div className={`font-medium ${getStatusColor(email.status)}`}>
                            {email.status}
                        </div>
                    </div>

                    {!isExpanded && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {email.body}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-4 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-4 animate-fade-in">
                    <div>
                        <h4 className="text-sm font-medium mb-2">Email Body</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {email.body}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">To:</span> {email.recipient}
                            </div>
                            <div>
                                <span className="text-muted-foreground">ID:</span>{' '}
                                <span className="font-mono text-xs">{email.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
