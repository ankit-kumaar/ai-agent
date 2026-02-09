import { getModel } from './model-factory';
import type { EmailInput, BookingResult, AgentExecutionResult } from '../types';
import { supabaseAdmin } from '../supabase';

const model = getModel({ temperature: 0.5 });

export async function processBookingRequest(
    email: EmailInput,
    emailId: string
): Promise<AgentExecutionResult> {
    const prompt = `You are a logistics booking agent. Extract shipment booking details from this email and create a structured booking.

Email Details:
Subject: ${email.subject}
From: ${email.sender}
Body: ${email.body}

Extract the following information:
1. Origin location
2. Destination location
3. Cargo type
4. Cargo weight (if mentioned)
5. Cargo dimensions (if mentioned)
6. Quantity (if mentioned)

Respond in JSON format:
{
  "origin": "origin location",
  "destination": "destination location",
  "cargoType": "type of cargo",
  "weight": "weight with unit or null",
  "dimensions": "dimensions or null",
  "quantity": number or null
}`;

    try {
        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract booking details from email');
        }

        const extractedData = JSON.parse(jsonMatch[0]);

        // Generate tracking number
        const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create shipment in database
        const { data: shipment, error } = await supabaseAdmin
            .from('shipments')
            .insert({
                email_id: emailId,
                tracking_number: trackingNumber,
                origin: extractedData.origin,
                destination: extractedData.destination,
                cargo_details: {
                    type: extractedData.cargoType,
                    weight: extractedData.weight,
                    dimensions: extractedData.dimensions,
                    quantity: extractedData.quantity,
                },
                status: 'booked',
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        const result: BookingResult = {
            trackingNumber,
            origin: extractedData.origin,
            destination: extractedData.destination,
            cargoDetails: {
                type: extractedData.cargoType,
                weight: extractedData.weight,
                dimensions: extractedData.dimensions,
                quantity: extractedData.quantity,
            },
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Booking agent error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
