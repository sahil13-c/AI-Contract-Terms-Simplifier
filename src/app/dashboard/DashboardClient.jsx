'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from '@/actions/auth';
import { deleteDocument } from '@/actions/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
                return <Clock className="h-4 w-4 text-yellow-600" />;
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ContractAI
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">{user.email}</span>
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
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Your Documents</h1>
                            <p className="text-slate-600 mt-1">Upload and analyze your contracts</p>
                        </div>
                        <Button
                            onClick={() => setShowUpload(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Contract
                        </Button>
                    </div>

                    {/* Documents Grid */}
                    {documents.length === 0 ? (
                        <Card className="border-2 border-dashed border-slate-300">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <FileText className="h-16 w-16 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
                                <p className="text-slate-600 mb-4 text-center max-w-md">
                                    Upload your first contract to get started with AI-powered analysis
                                </p>
                                <Button
                                    onClick={() => setShowUpload(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Your First Contract
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                                                <CardDescription className="mt-2">
                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            {getStatusIcon(doc.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span>{doc.pages} pages</span>
                                            <Badge variant={getStatusBadge(doc.status)}>
                                                {doc.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-2">
                                            {doc.status === 'completed' && (
                                                <Link href={`/dashboard/analysis/${doc.id}`} className="flex-1">
                                                    <Button variant="outline" className="w-full">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Analysis
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(doc.id)}
                                                className="text-red-600 hover:text-red-700"
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
