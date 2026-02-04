import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 h-full bg-white border-r flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                    Dashboard
                </Link>
                <Link href="/documents/1" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    Documents
                </Link>
                <Link href="/settings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                    Settings
                </Link>
            </nav>
            <div className="p-4 border-t">
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                    Logout
                </button>
            </div>
        </aside>
    );
}
