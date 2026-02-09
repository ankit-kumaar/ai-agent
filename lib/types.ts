// Database types generated from Supabase schema
export type Database = {
    public: {
        Tables: {
            emails: {
                Row: {
                    id: string;
                    subject: string;
                    sender: string;
                    recipient: string;
                    body: string;
                    classification: string | null;
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    subject: string;
                    sender: string;
                    recipient: string;
                    body: string;
                    classification?: string | null;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    subject?: string;
                    sender?: string;
                    recipient?: string;
                    body?: string;
                    classification?: string | null;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            },
            agent_executions: {
                Row: {
                    id: string;
                    email_id: string | null;
                    agent_type: string;
                    status: string;
                    input: any | null;
                    output: any | null;
                    error: string | null;
                    started_at: string;
                    completed_at: string | null;
                };
                Insert: {
                    id?: string;
                    email_id?: string | null;
                    agent_type: string;
                    status?: string;
                    input?: any | null;
                    output?: any | null;
                    error?: string | null;
                    started_at?: string;
                    completed_at?: string | null;
                };
                Update: {
                    id?: string;
                    email_id?: string | null;
                    agent_type?: string;
                    status?: string;
                    input?: any | null;
                    output?: any | null;
                    error?: string | null;
                    started_at?: string;
                    completed_at?: string | null;
                };
                Relationships: [];
            },
            shipments: {
                Row: {
                    id: string;
                    email_id: string | null;
                    tracking_number: string | null;
                    origin: string | null;
                    destination: string | null;
                    cargo_details: any | null;
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email_id?: string | null;
                    tracking_number?: string | null;
                    origin?: string | null;
                    destination?: string | null;
                    cargo_details?: any | null;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email_id?: string | null;
                    tracking_number?: string | null;
                    origin?: string | null;
                    destination?: string | null;
                    cargo_details?: any | null;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            },
            documents: {
                Row: {
                    id: string;
                    email_id: string | null;
                    document_type: string;
                    document_number: string | null;
                    validation_status: string;
                    validation_notes: any | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email_id?: string | null;
                    document_type: string;
                    document_number?: string | null;
                    validation_status?: string;
                    validation_notes?: any | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email_id?: string | null;
                    document_type?: string;
                    document_number?: string | null;
                    validation_status?: string;
                    validation_notes?: any | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            },
            issues: {
                Row: {
                    id: string;
                    email_id: string | null;
                    severity: string;
                    title: string;
                    description: string | null;
                    status: string;
                    created_at: string;
                    resolved_at: string | null;
                };
                Insert: {
                    id?: string;
                    email_id?: string | null;
                    severity: string;
                    title: string;
                    description?: string | null;
                    status?: string;
                    created_at?: string;
                    resolved_at?: string | null;
                };
                Update: {
                    id?: string;
                    email_id?: string | null;
                    severity?: string;
                    title?: string;
                    description?: string | null;
                    status?: string;
                    created_at?: string;
                    resolved_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}

// Agent types
export type AgentType = 'booking' | 'tracking' | 'customer' | 'documents' | 'management';

export type EmailClassification = AgentType;

// Email processing types
export interface EmailInput {
    subject: string;
    sender: string;
    recipient: string;
    body: string;
}

export interface ProcessEmailRequest {
    email: EmailInput;
}

export interface ProcessEmailResponse {
    emailId: string;
    classification: EmailClassification;
    agentExecutionId: string;
    result: any;
}

// Agent state for LangGraph
export interface AgentState {
    email: EmailInput;
    emailId?: string;
    classification?: EmailClassification;
    agentResult?: any;
    error?: string;
}

// Agent execution result
export interface AgentExecutionResult {
    success: boolean;
    data?: any;
    error?: string;
}

// Booking agent types
export interface BookingResult {
    trackingNumber: string;
    origin: string;
    destination: string;
    cargoDetails: {
        type: string;
        weight?: string;
        dimensions?: string;
        quantity?: number;
    };
    estimatedDelivery?: string;
}

// Tracking agent types
export interface TrackingResult {
    trackingNumber: string;
    currentStatus: string;
    location: string;
    eta: string;
    events: Array<{
        timestamp: string;
        status: string;
        location: string;
    }>;
}

// Customer agent types
export interface CustomerReplyResult {
    replyText: string;
    tone: 'professional' | 'friendly' | 'apologetic';
    suggestedActions?: string[];
}

// Documents agent types
export interface DocumentValidationResult {
    documentType: 'SI' | 'BL';
    documentNumber: string;
    isValid: boolean;
    validationNotes: {
        completeness: boolean;
        accuracy: boolean;
        issues?: string[];
    };
}

// Management agent types
export interface IssueResult {
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendedActions: string[];
    escalate: boolean;
}

// API response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// Agent status for monitoring
export interface AgentStatus {
    agentType: AgentType;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    lastExecution?: {
        timestamp: string;
        status: string;
    };
}
