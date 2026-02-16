'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from '@/actions/auth';
import { deleteDocument } from '@/actions/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    FileText,
    Upload,
    LogOut,
    Trash2,
    Eye,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import FileUploadDialog from '@/components/FileUploadDialog';

export default function DashboardClient({ initialDocuments, user }) {
    const [documents, setDocuments] = useState(initialDocuments);
    const [showUpload, setShowUpload] = useState(false);

    const handleSignOut = async () => {
        await signOut();
    };

    const refreshDocuments = async () => {
        try {
            const response = await fetch('/api/refresh-documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const { documents: updatedDocs } = await response.json();
                setDocuments(updatedDocs);
            }
        } catch (error) {
            console.error('Failed to refresh documents:', error);
        }
    };

    const handleDelete = async (documentId) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        const result = await deleteDocument(documentId);
        if (!result.error) {
            setDocuments(documents.filter(doc => doc.id !== documentId));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'processing':
                return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
            case 'failed':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-slate-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            completed: 'default',
            processing: 'secondary',
            failed: 'destructive',
            pending: 'outline',
        };
        return variants[status] || 'outline';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                ContractAI
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
                            {documents.some(doc => doc.status === 'processing') && (
                                <Button variant="outline" size="sm" onClick={refreshDocuments}>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Refresh
                                </Button>
                            )}
                            <ThemeToggle />
                            <Button variant="outline" size="sm" onClick={handleSignOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Your Documents
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                Upload and analyze your contracts with AI
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowUpload(true)}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Upload className="h-5 w-5 mr-2" />
                            Upload Contract
                        </Button>
                    </div>

                    {/* Documents Grid */}
                    {documents.length === 0 ? (
                        <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent shadow-none">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                                    <FileText className="h-16 w-16 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No documents yet</h3>
                                <p className="text-slate-500 mb-6 text-center max-w-md">
                                    Upload your first contract to get started with AI-powered analysis
                                </p>
                                <Button
                                    onClick={() => setShowUpload(true)}
                                    size="lg"
                                >
                                    <Upload className="h-5 w-5 mr-2" />
                                    Upload Your First Contract
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-200 group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 mr-3">
                                                <CardTitle className="text-lg font-semibold line-clamp-1 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {doc.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-xs text-slate-500">
                                                    {new Date(doc.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </CardDescription>
                                            </div>
                                            <div className="mt-1">
                                                {getStatusIcon(doc.status)}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm mb-6">
                                            <span className="text-slate-500 dark:text-slate-400">{doc.pages} pages</span>
                                            <Badge variant={getStatusBadge(doc.status)} className="capitalize">
                                                {doc.status}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-3">
                                            {doc.status === 'completed' && (
                                                <Link href={`/dashboard/analysis/${doc.id}`} className="flex-1">
                                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Analysis
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(doc.id)}
                                                className="border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-slate-800 dark:hover:bg-red-950/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Upload Dialog */}
            <FileUploadDialog
                open={showUpload}
                onClose={() => setShowUpload(false)}
                onUploadComplete={(newDoc) => {
                    setDocuments([newDoc, ...documents]);
                    setShowUpload(false);
                }}
            />
        </div>
    );
}
