import { getAnalysis } from '@/actions/analysis';
import { getUser } from '@/actions/auth';
import { getDocument } from '@/actions/documents';
import { redirect } from 'next/navigation';
import AnalysisView from './AnalysisView';

export default async function AnalysisPage({ params }) {
    const { user } = await getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = await params;
    
    // First check if document exists
    const { document: doc, error: docError } = await getDocument(id);
    
    if (docError || !doc) {
        console.error('Document not found:', docError);
        redirect('/dashboard');
    }

    console.log('Document found:', doc.title, 'Status:', doc.status);

    // Get analysis
    const { analysis, error } = await getAnalysis(id);

    if (error) {
        console.error('Analysis error:', error);
        // Show analysis page with error instead of redirecting
        return <AnalysisView analysis={null} document={doc} error={error} />;
    }

    if (!analysis) {
        console.log('No analysis found for document:', id);
        // Show analysis page with no analysis data
        return <AnalysisView analysis={null} document={doc} error="No analysis available" />;
    }

    console.log('Analysis found, risk level:', analysis.overall_risk);
    return <AnalysisView analysis={analysis} document={doc} error={null} />;
}
