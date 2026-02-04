'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get all documents for the current user
 */
export async function getDocuments() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { documents: [], error: 'Not authenticated' };
    }

    const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return { documents: [], error: error.message };
    }

    return { documents, error: null };
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { document: null, error: 'Not authenticated' };
    }

    const { data: document, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        return { document: null, error: error.message };
    }

    return { document, error: null };
}

/**
 * Create a new document record
 */
export async function createDocument(documentData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { document: null, error: 'Not authenticated' };
    }

    const { data: document, error } = await supabase
        .from('documents')
        .insert([
            {
                user_id: user.id,
                title: documentData.title,
                file_name: documentData.file_name,
                file_url: documentData.file_url,
                file_size: documentData.file_size,
                pages: documentData.pages || 0,
                status: 'pending',
            },
        ])
        .select()
        .single();

    if (error) {
        return { document: null, error: error.message };
    }

    revalidatePath('/dashboard');
    return { document, error: null };
}

/**
 * Update document status
 */
export async function updateDocumentStatus(documentId, status) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('documents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', documentId)
        .eq('user_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    return { error: null };
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // First, delete the file from storage
    const { data: document } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

    if (document?.file_url) {
        const fileName = document.file_url.split('/').pop();
        await supabase.storage
            .from('documents')
            .remove([`${user.id}/${fileName}`]);
    }

    // Then delete the document record
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    return { error: null };
}
