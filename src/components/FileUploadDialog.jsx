'use client';

import { useState } from 'react';
import { uploadAndProcessDocument } from '@/actions/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FileUploadDialog({ open, onClose, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [text, setText] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.replace('.pdf', ''));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (uploadMode === 'file' && !file) {
            setError('Please select a file');
            return;
        }
        if (uploadMode === 'text' && !text.trim()) {
            setError('Please enter contract text');
            return;
        }
        if (!title) {
            setError('Please enter a title');
            return;
        }

        setUploading(true);
        setProgress(10);
        setError('');

        try {
            let result;
            
            if (uploadMode === 'file') {
                // File upload
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                
                setProgress(25);
                const { uploadAndProcessDocument } = await import('@/actions/upload');
                result = await uploadAndProcessDocument(formData);
            } else {
                // Text upload
                setProgress(25);
                const { uploadAndProcessTextContract } = await import('@/actions/upload');
                result = await uploadAndProcessTextContract(text, title);
            }

            if (result.error) {
                setError(result.error);
                setUploading(false);
                return;
            }

            setProgress(50);

            // Start polling for status updates
            const pollInterval = setInterval(async () => {
                try {
                    const response = await fetch('/api/document-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ documentId: result.document.id })
                    });
                    
                    if (response.ok) {
                        const { status } = await response.json();
                        
                        if (status === 'processing') {
                            setProgress(60);
                        } else if (status === 'completed') {
                            setProgress(100);
                            clearInterval(pollInterval);
                            setTimeout(() => {
                                onUploadComplete(result.document);
                                resetForm();
                            }, 500);
                        } else if (status === 'failed') {
                            setError('Analysis failed. Please try uploading again.');
                            setUploading(false);
                            clearInterval(pollInterval);
                        }
                    }
                } catch (error) {
                    console.error('Status polling error:', error);
                }
            }, 2000);

            // Fallback timeout after 30 seconds
            setTimeout(() => {
                if (uploading) {
                    setProgress(90);
                    setTimeout(() => {
                        setProgress(100);
                        onUploadComplete(result.document);
                        resetForm();
                        clearInterval(pollInterval);
                    }, 2000);
                }
            }, 30000);

        } catch (err) {
            setError(err.message || 'Upload failed');
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setTitle('');
        setText('');
        setProgress(0);
        setUploading(false);
        setError('');
    };

    const handleClose = () => {
        if (!uploading) {
            resetForm();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload Contract</DialogTitle>
                    <DialogDescription>
                        Upload a PDF contract or paste contract text for AI-powered analysis
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Freelance Agreement"
                            disabled={uploading}
                        />
                    </div>

                    <Tabs value={uploadMode} onValueChange={setUploadMode} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file" className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                PDF File
                            </TabsTrigger>
                            <TabsTrigger value="text" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Paste Text
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="file" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">PDF File</Label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        {file ? (
                                            <>
                                                <FileText className="h-8 w-8 text-blue-600" />
                                                <span className="text-sm font-medium text-slate-900">{file.name}</span>
                                                <span className="text-xs text-slate-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-slate-400" />
                                                <span className="text-sm text-slate-600">Click to select PDF</span>
                                                <span className="text-xs text-slate-500">Max size: 10MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="text" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="text">Contract Text</Label>
                                <Textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your contract text here..."
                                    className="min-h-[200px] resize-none"
                                    disabled={uploading}
                                />
                                <p className="text-xs text-slate-500">
                                    {text.length} characters • Minimum 50 characters recommended
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">
                                    {progress < 60 ? 'Uploading...' : 'Processing with AI...'}
                                </span>
                                <span className="text-slate-500">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            {progress >= 60 && (
                                <p className="text-xs text-slate-500">
                                    AI is analyzing your contract. This may take a minute...
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={uploading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={((uploadMode === 'file' && !file) || (uploadMode === 'text' && !text.trim())) || !title || uploading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {uploading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploadMode === 'file' ? 'Upload PDF' : 'Analyze Text'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
