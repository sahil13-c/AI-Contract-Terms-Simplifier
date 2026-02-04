import { getDocuments } from '@/actions/documents';
import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const { user } = await getUser();

    if (!user) {
        redirect('/login');
    }

    const { documents } = await getDocuments();

    return <DashboardClient initialDocuments={documents || []} user={user} />;
}
