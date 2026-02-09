import { getModel } from './model-factory';
import type { EmailInput, CustomerReplyResult, AgentExecutionResult } from '../types';

const model = getModel({ temperature: 0.7 });

export async function processCustomerInquiry(
    email: EmailInput,
    emailId: string
): Promise<AgentExecutionResult> {
    const prompt = `You are a professional customer service agent for a logistics company. Draft a helpful, professional reply to this customer email.

Email Details:
Subject: ${email.subject}
From: ${email.sender}
Body: ${email.body}

Guidelines:
- Be professional and courteous
- Address the customer's concerns directly
- Provide helpful information
- Suggest next steps if applicable
- Keep the tone friendly but professional

Respond in JSON format:
{
  "replyText": "your drafted reply here",
  "tone": "professional|friendly|apologetic",
  "suggestedActions": ["action 1", "action 2"]
}`;

    try {
        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to generate customer reply');
        }

        const replyData = JSON.parse(jsonMatch[0]);

        const result: CustomerReplyResult = {
            replyText: replyData.replyText,
            tone: replyData.tone || 'professional',
            suggestedActions: replyData.suggestedActions || [],
        };

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Customer agent error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
