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
        error: null
    };
}

/**
 * Delete a file from Supabase Storage
 */
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
