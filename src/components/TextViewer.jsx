'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TextViewer({ fileUrl, className = '' }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!fileUrl) return;

        // Check for legacy placeholder URLs (text://)
        if (fileUrl.startsWith('text://')) {
            setLoading(false);
            setError('This document was created with an older version. Please re-upload the text to view it here.');
            return;
        }

        const fetchText = async () => {
            try {
                setLoading(true);
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('Failed to load document text');
                const content = await response.text();
                setText(content);
                setError(null);
            } catch (err) {
                console.error('Error fetching text:', err);
                setError('Failed to load document content. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchText();
    }, [fileUrl]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <Card className={`flex items-center justify-center p-8 h-full bg-slate-50 dark:bg-slate-950 ${className}`}>
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading document...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`flex items-center justify-center p-8 h-full bg-slate-50 dark:bg-slate-950 ${className}`}>
                <div className="flex flex-col items-center gap-2 text-destructive">
                    <FileText className="h-8 w-8" />
                    <p>{error}</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`flex flex-col h-full bg-white dark:bg-slate-900 border-border shadow-sm ${className}`}>
            {/* Header / Controls */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Text View</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs gap-2"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy Text'}
                </Button>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-h-0 overflow-auto bg-white dark:bg-slate-950">
                <div className="p-8 max-w-4xl mx-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {text}
                    </pre>
                </div>
            </div>
        </Card>
    );
}
