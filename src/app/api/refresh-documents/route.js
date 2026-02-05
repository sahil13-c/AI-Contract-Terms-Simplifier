import { getDocuments } from '@/actions/documents';
import { getUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const { user } = await getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { documents } = await getDocuments();

        revalidatePath('/dashboard');
        return NextResponse.json({ documents });

    } catch (error) {
        console.error('Refresh documents error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
