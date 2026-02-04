'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Sign up a new user
 */
export async function signUp(formData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

/**
 * Sign in an existing user
 */
export async function signIn(formData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}

/**
 * Get the current user
 */
export async function getUser() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        return { user: null, error: error.message };
    }

    return { user, error: null };
}
