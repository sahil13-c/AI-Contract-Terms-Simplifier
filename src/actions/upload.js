'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(formData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { fileUrl: null, error: 'Not authenticated' };
    }

    const file = formData.get('file');

    if (!file) {
        return { fileUrl: null, error: 'No file provided' };
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
        return { fileUrl: null, error: 'Only PDF files are allowed' };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { fileUrl: null, error: 'File size must be less than 10MB' };
    }

    // Generate unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        return { fileUrl: null, fileName: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

    return {
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileBuffer: Buffer.from(await file.arrayBuffer()), // Add file buffer for processing
        error: null
    };
}

/**
 * Upload and process a document with AI analysis
 */
export async function uploadAndProcessDocument(formData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { document: null, error: 'Not authenticated' };
    }

    const file = formData.get('file');
    const title = formData.get('title');

    if (!file || !title) {
        return { document: null, error: 'File and title are required' };
    }

    try {
        // Step 1: Upload file
        const uploadResult = await uploadFile(formData);
        
        if (uploadResult.error) {
            return { document: null, error: uploadResult.error };
        }

        // Step 2: Create document record
        const { createDocument } = await import('./documents');
        const docResult = await createDocument({
            title,
            file_name: uploadResult.fileName,
            file_url: uploadResult.fileUrl,
            file_size: uploadResult.fileSize,
        });

        if (docResult.error) {
            return { document: null, error: docResult.error };
        }

        // Step 3: Update status to processing
        const { updateDocumentStatus } = await import('./documents');
        await updateDocumentStatus(docResult.document.id, 'processing');

        // Step 4: Process document with AI (async - don't wait)
        const { processDocument } = await import('./ai');
        
        // Process asynchronously without blocking the response
        processDocument(docResult.document.id, uploadResult.fileBuffer, title)
            .then(result => {
                if (result.error) {
                    console.error('Background processing failed:', result.error);
                }
            })
            .catch(error => {
                console.error('Background processing error:', error);
            });

        return { 
            document: { ...docResult.document, status: 'processing' }, 
            error: null 
        };

    } catch (error) {
        console.error('Upload and process error:', error);
        return { document: null, error: error.message };
    }
}

/**
 * Upload and process a text-based contract
 */
export async function uploadAndProcessTextContract(contractText, title) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { document: null, error: 'Not authenticated' };
    }

    if (!contractText || !title) {
        return { document: null, error: 'Contract text and title are required' };
    }

    try {
        // Step 1: Create document record (no file upload for text contracts)
        const { createDocument } = await import('./documents');
        const docResult = await createDocument({
            title,
            file_name: `${title}.txt`,
            file_url: `text://${title}`, // Placeholder URL for text contracts
            file_size: contractText.length,
        });

        if (docResult.error) {
            return { document: null, error: docResult.error };
        }

        // Step 2: Update status to processing
        const { updateDocumentStatus } = await import('./documents');
        await updateDocumentStatus(docResult.document.id, 'processing');

        // Step 3: Process document with AI (async - don't wait)
        const { processTextDocument } = await import('./ai');
        
        // Process asynchronously without blocking the response
        processTextDocument(docResult.document.id, contractText, title)
            .then(result => {
                if (result.error) {
                    console.error('Background processing failed:', result.error);
                }
            })
            .catch(error => {
                console.error('Background processing error:', error);
            });

        return { 
            document: { ...docResult.document, status: 'processing' }, 
            error: null 
        };

    } catch (error) {
        console.error('Text upload and process error:', error);
        return { document: null, error: error.message };
    }
}
export async function deleteFile(fileUrl) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Extract file path from URL
    const fileName = fileUrl.split('/').pop();
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}
