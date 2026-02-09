import { getModel } from './model-factory';
import type { EmailInput, EmailClassification } from '../types';

const model = getModel({ temperature: 0.3 });

export async function classifyEmail(email: EmailInput): Promise<EmailClassification> {
    const prompt = `You are an email classification expert for a logistics company. Analyze the following email and classify it into ONE of these categories:

Categories:
- booking: Emails requesting to create new shipments or bookings
- tracking: Emails asking about shipment status, ETAs, or tracking information
- customer: General customer service inquiries, complaints, or questions
- documents: Emails about Shipping Instructions (SI) or Bill of Lading (BL) validation
- management: Critical issues, escalations, or problems requiring management attention

Email Details:
Subject: ${email.subject}
From: ${email.sender}
To: ${email.recipient}
Body: ${email.body}

Respond with ONLY the category name (booking, tracking, customer, documents, or management). No explanation needed.`;

    try {
        const response = await model.invoke(prompt);
        const classification = response.content.toString().trim().toLowerCase();

        // Validate classification
        const validClassifications: EmailClassification[] = [
            'booking',
            'tracking',
            'customer',
            'documents',
            'management',
        ];

        if (validClassifications.includes(classification as EmailClassification)) {
            return classification as EmailClassification;
        }

        // Default to customer if classification is invalid
        console.warn(`Invalid classification: ${classification}, defaulting to 'customer'`);
        return 'customer';
    } catch (error) {
        console.error('Error classifying email:', error);
        // Default to customer on error
        return 'customer';
    }
}
