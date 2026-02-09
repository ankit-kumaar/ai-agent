import { getModel } from './model-factory';
import type { EmailInput, IssueResult, AgentExecutionResult } from '../types';
import { supabaseAdmin } from '../supabase';

const model = getModel({ temperature: 0.3 });

export async function processManagementIssue(
    email: EmailInput,
    emailId: string
): Promise<AgentExecutionResult> {
    const prompt = `You are a management escalation agent for a logistics company. Analyze this email for critical issues that need management attention.

Email Details:
Subject: ${email.subject}
From: ${email.sender}
Body: ${email.body}

Assess:
1. Severity level (low, medium, high, critical)
2. Issue title (brief summary)
3. Detailed description
4. Recommended actions
5. Whether this needs immediate escalation

Respond in JSON format:
{
  "severity": "low|medium|high|critical",
  "title": "brief issue title",
  "description": "detailed description",
  "recommendedActions": ["action 1", "action 2"],
  "escalate": true or false
}`;

    try {
        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to analyze management issue');
        }

        const issueData = JSON.parse(jsonMatch[0]);

        // Store issue in database
        const { data: issue, error } = await supabaseAdmin
            .from('issues')
            .insert({
                email_id: emailId,
                severity: issueData.severity,
                title: issueData.title,
                description: issueData.description,
                status: issueData.escalate ? 'escalated' : 'open',
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
        }

        const result: IssueResult = {
            severity: issueData.severity,
            title: issueData.title,
            description: issueData.description,
            recommendedActions: issueData.recommendedActions,
            escalate: issueData.escalate,
        };

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Management agent error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
