import { getAnalysis } from '@/actions/analysis';
import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import AnalysisView from './AnalysisView';

export default async function AnalysisPage({ params }) {
    const { user } = await getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = await params;
    const { analysis, error } = await getAnalysis(id);

    if (error || !analysis) {
        redirect('/dashboard');
    }

    return <AnalysisView analysis={analysis} />;
}
