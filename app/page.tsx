import EmailDashboard from '@/components/EmailDashboard';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                        AI Email Agents
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Multi-Agent Email Processing System powered by GPT-4
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span>Email → Classify → Act → Agent Handles It</span>
                    </div>
                </header>

                <EmailDashboard />
            </div>
        </main>
    );
}
