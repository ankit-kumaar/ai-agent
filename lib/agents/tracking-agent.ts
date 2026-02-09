import { getModel } from './model-factory';
import type { EmailInput, TrackingResult, AgentExecutionResult } from '../types';
import { supabaseAdmin } from '../supabase';

const model = getModel({ temperature: 0.3 });

export async function processTrackingRequest(
    email: EmailInput,
    emailId: string
): Promise<AgentExecutionResult> {
    const prompt = `You are a logistics tracking agent. Extract the tracking number from this email.

Email Details:
Subject: ${email.subject}
From: ${email.sender}
Body: ${email.body}

Find the tracking number. It usually starts with "TRK" or is a series of numbers/letters.
Respond with ONLY the tracking number, nothing else.`;

    try {
        const response = await model.invoke(prompt);
        const trackingNumber = response.content.toString().trim();

        // Look up shipment in database
        const { data: shipment, error } = await supabaseAdmin
            .from('shipments')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .single();

        if (error || !shipment) {
            // Generate mock tracking data if not found
            const result: TrackingResult = {
                trackingNumber,
                currentStatus: 'Not Found',
                location: 'Unknown',
                eta: 'N/A',
                events: [
                    {
                        timestamp: new Date().toISOString(),
                        status: 'Tracking number not found in system',
                        location: 'N/A',
                    },
                ],
            };

            return {
                success: true,
                data: result,
            };
        }

        // Generate tracking information
        const result: TrackingResult = {
            trackingNumber: shipment.tracking_number || trackingNumber,
            currentStatus: shipment.status || 'In Transit',
            location: shipment.destination || 'Unknown',
            eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            events: [
                {
                    timestamp: shipment.created_at,
                    status: 'Booked',
                    location: shipment.origin || 'Origin',
                },
                {
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'In Transit',
                    location: 'Transit Hub',
                },
                {
                    timestamp: new Date().toISOString(),
                    status: 'Out for Delivery',
                    location: shipment.destination || 'Destination',
                },
            ],
        };

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Tracking agent error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
