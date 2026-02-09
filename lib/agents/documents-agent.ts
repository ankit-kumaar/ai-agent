import { getModel } from './model-factory';
import type { EmailInput, DocumentValidationResult, AgentExecutionResult } from '../types';
import { supabaseAdmin } from '../supabase';

const model = getModel({ temperature: 0.2 });

export async function processDocumentValidation(
    email: EmailInput,
    emailId: string
): Promise<AgentExecutionResult> {
    const prompt = `You are a document validation expert for logistics. Analyze this email about Shipping Instructions (SI) or Bill of Lading (BL) documents.

Email Details:
Subject: ${email.subject}
From: ${email.sender}
Body: ${email.body}

Extract and validate:
1. Document type (SI or BL)
2. Document number
3. Check for completeness (are all required fields mentioned?)
4. Check for accuracy (any obvious errors or inconsistencies?)
5. List any issues found

Respond in JSON format:
{
  "documentType": "SI or BL",
  "documentNumber": "document number",
  "isValid": true or false,
  "completeness": true or false,
  "accuracy": true or false,
  "issues": ["issue 1", "issue 2"] or []
}`;

    try {
        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to validate document');
        }

        const validationData = JSON.parse(jsonMatch[0]);

        // Store document validation in database
        const { data: document, error } = await supabaseAdmin
            .from('documents')
            .insert({
                email_id: emailId,
                document_type: validationData.documentType,
                document_number: validationData.documentNumber,
                validation_status: validationData.isValid ? 'valid' : 'invalid',
                validation_notes: {
                    completeness: validationData.completeness,
                    accuracy: validationData.accuracy,
                    issues: validationData.issues,
                },
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
        }

        const result: DocumentValidationResult = {
            documentType: validationData.documentType,
            documentNumber: validationData.documentNumber,
            isValid: validationData.isValid,
            validationNotes: {
                completeness: validationData.completeness,
                accuracy: validationData.accuracy,
                issues: validationData.issues,
            },
        };

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Documents agent error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
