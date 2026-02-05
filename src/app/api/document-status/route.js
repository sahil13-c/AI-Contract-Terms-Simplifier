import { getDocument } from '@/actions/documents';
import { getUser } from '@/actions/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { user } = await getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { documentId } = await request.json();

        if (!documentId) {
            return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
        }

        const { document: doc, error } = await getDocument(documentId);

        if (error || !doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ status: doc.status });

    } catch (error) {
        console.error('Document status error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
