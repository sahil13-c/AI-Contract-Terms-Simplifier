import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
            <div className="flex items-center">
                <span className="text-xl font-bold">MyApp</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Action
                </button>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
        </header>
    );
}
