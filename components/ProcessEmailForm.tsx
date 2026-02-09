'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Send, Loader2 } from 'lucide-react';

interface ProcessEmailFormProps {
    onSuccess: () => void;
}

export default function ProcessEmailForm({ onSuccess }: ProcessEmailFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        sender: '',
        recipient: '',
        body: '',
    });
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setResult(null);

        try {
            const response = await apiClient.post('/api/emails/process', formData);

            if (response.success) {
                setResult(response.data);
                setFormData({
                    subject: '',
                    sender: '',
                    recipient: '',
                    body: '',
                });
                onSuccess();
            } else {
                setError(response.error || 'Failed to process email');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Process New Email</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Email subject"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Sender</label>
                        <input
                            type="email"
                            value={formData.sender}
                            onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="sender@example.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Recipient</label>
                    <input
                        type="email"
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="recipient@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email Body</label>
                    <textarea
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                        placeholder="Email content..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Process Email
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg animate-fade-in">
                    <h3 className="font-semibold mb-2 text-accent">✓ Email Processed Successfully</h3>
                    <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Classification:</span> <span className="font-medium capitalize">{result.classification}</span></p>
                        <p><span className="text-muted-foreground">Email ID:</span> <span className="font-mono text-xs">{result.emailId}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
}
