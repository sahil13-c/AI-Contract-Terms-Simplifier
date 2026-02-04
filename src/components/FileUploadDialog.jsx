'use client';

import { useState } from 'react';
import { uploadFile } from '@/actions/upload';
import { createDocument } from '@/actions/documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FileUploadDialog({ open, onClose, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.replace('.pdf', ''));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file || !title) {
            setError('Please select a file and enter a title');
            return;
        }

        setUploading(true);
        setProgress(20);
        setError('');

        try {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            setProgress(40);
            const uploadResult = await uploadFile(formData);

            if (uploadResult.error) {
                setError(uploadResult.error);
                setUploading(false);
                return;
            }

            setProgress(60);

            // Create document record
            const docResult = await createDocument({
                title,
                file_name: uploadResult.fileName,
                file_url: uploadResult.fileUrl,
                file_size: uploadResult.fileSize,
            });

            if (docResult.error) {
                setError(docResult.error);
                setUploading(false);
                return;
            }

            setProgress(100);

            // Success
            setTimeout(() => {
                onUploadComplete(docResult.document);
                resetForm();
            }, 500);
        } catch (err) {
            setError(err.message || 'Upload failed');
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setTitle('');
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Contract</DialogTitle>
                    <DialogDescription>
                        Upload a PDF contract for AI-powered analysis
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

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Uploading...</span>
                                <span className="text-slate-500">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
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
                            disabled={!file || !title || uploading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {uploading ? (
                                <>Uploading...</>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
