import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import type { EmailClassification, EmailInput } from '../types';
import { classifyEmail } from './email-classifier';
import { processBookingRequest } from './booking-agent';
import { processTrackingRequest } from './tracking-agent';
import { processCustomerInquiry } from './customer-agent';
import { processDocumentValidation } from './documents-agent';
import { processManagementIssue } from './management-agent';
import { supabaseAdmin } from '../supabase';

// Define the workflow state using Annotation for proper type inference in LangGraph v0.2+
const WorkflowAnnotation = Annotation.Root({
    email: Annotation<EmailInput>(),
    emailId: Annotation<string | undefined>(),
    classification: Annotation<EmailClassification | undefined>(),
    agentResult: Annotation<any>(),
    error: Annotation<string | undefined>(),
});

// Type alias for use in node functions
type WorkflowState = typeof WorkflowAnnotation.State;

// Classifier node
async function classifierNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
        const classification = await classifyEmail(state.email);
        return { classification };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Classification failed',
        };
    }
}

// Router function - determines which agent to use
function routeToAgent(state: WorkflowState): string {
    if (state.error) {
        return END;
    }

    switch (state.classification) {
        case 'booking':
            return 'booking_agent';
        case 'tracking':
            return 'tracking_agent';
        case 'customer':
            return 'customer_agent';
        case 'documents':
            return 'documents_agent';
        case 'management':
            return 'management_agent';
        default:
            return 'customer_agent'; // Default fallback
    }
}

// Booking agent node
async function bookingAgentNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    if (!state.emailId) {
        return { error: 'Email ID is required' };
    }
    const result = await processBookingRequest(state.email, state.emailId);
    return { agentResult: result };
}

// Tracking agent node
async function trackingAgentNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    if (!state.emailId) {
        return { error: 'Email ID is required' };
    }
    const result = await processTrackingRequest(state.email, state.emailId);
    return { agentResult: result };
}

// Customer agent node
async function customerAgentNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    if (!state.emailId) {
        return { error: 'Email ID is required' };
    }
    const result = await processCustomerInquiry(state.email, state.emailId);
    return { agentResult: result };
}

// Documents agent node
async function documentsAgentNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    if (!state.emailId) {
        return { error: 'Email ID is required' };
    }
    const result = await processDocumentValidation(state.email, state.emailId);
    return { agentResult: result };
}

// Management agent node
async function managementAgentNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    if (!state.emailId) {
        return { error: 'Email ID is required' };
    }
    const result = await processManagementIssue(state.email, state.emailId);
    return { agentResult: result };
}

// Create the workflow graph using chaining for proper type inference
const app = new StateGraph(WorkflowAnnotation)
    .addNode('classifier', classifierNode)
    .addNode('booking_agent', bookingAgentNode)
    .addNode('tracking_agent', trackingAgentNode)
    .addNode('customer_agent', customerAgentNode)
    .addNode('documents_agent', documentsAgentNode)
    .addNode('management_agent', managementAgentNode)
    .addEdge(START, 'classifier')
    .addConditionalEdges('classifier', routeToAgent, {
        booking_agent: 'booking_agent',
        tracking_agent: 'tracking_agent',
        customer_agent: 'customer_agent',
        documents_agent: 'documents_agent',
        management_agent: 'management_agent',
    })
    .addEdge('booking_agent', END)
    .addEdge('tracking_agent', END)
    .addEdge('customer_agent', END)
    .addEdge('documents_agent', END)
    .addEdge('management_agent', END)
    .compile();

// Main function to process an email through the workflow
export async function processEmailWorkflow(
    email: {
        subject: string;
        sender: string;
        recipient: string;
        body: string;
    }
) {
    try {
        // Store email in database first
        const { data: emailRecord, error: emailError } = await supabaseAdmin
            .from('emails')
            .insert({
                subject: email.subject,
                sender: email.sender,
                recipient: email.recipient,
                body: email.body,
                status: 'processing',
            })
            .select()
            .single();

        if (emailError || !emailRecord) {
            throw new Error(`Failed to store email: ${emailError?.message}`);
        }

        const emailId = emailRecord.id;

        // Initialize state
        const initialState: WorkflowState = {
            email,
            emailId,
            classification: undefined,
            agentResult: undefined,
            error: undefined,
        };

        // Run the workflow
        const result = await app.invoke(initialState);

        // Update email status
        await supabaseAdmin
            .from('emails')
            .update({
                classification: result.classification,
                status: result.error ? 'failed' : 'completed',
            })
            .eq('id', emailId);

        // Store agent execution
        if (result.classification) {
            await supabaseAdmin.from('agent_executions').insert({
                email_id: emailId,
                agent_type: result.classification,
                status: result.agentResult?.success ? 'completed' : 'failed',
                input: email,
                output: result.agentResult?.data,
                error: result.agentResult?.error || result.error,
                completed_at: new Date().toISOString(),
            });
        }

        return {
            success: !result.error,
            emailId,
            classification: result.classification,
            result: result.agentResult,
            error: result.error,
        };
    } catch (error) {
        console.error('Workflow error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
