'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard,
    FileText,
    History,
    Settings,
    HelpCircle,
    Plus,
    TrendingUp,
    Shield,
    AlertTriangle,
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const mainNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Documents',
            href: '/documents',
            icon: FileText,
            badge: '12',
        },
        {
            title: 'History',
            href: '/history',
            icon: History,
        },
    ];

    const quickStats = [
        {
            title: 'High Risk',
            value: '3',
            icon: AlertTriangle,
            color: 'text-red-600 bg-red-50',
        },
        {
            title: 'In Review',
            value: '5',
            icon: Shield,
            color: 'text-yellow-600 bg-yellow-50',
        },
        {
            title: 'Safe',
            value: '4',
            icon: TrendingUp,
            color: 'text-green-600 bg-green-50',
        },
    ];

    const bottomNavItems = [
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
        {
            title: 'Help & Support',
            href: '/help',
            icon: HelpCircle,
        },
    ];

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-200 bg-white/50 backdrop-blur">
            <div className="flex-1 flex flex-col min-h-0">
                {/* New Document Button */}
                <div className="p-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Analysis
                    </Button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <div className="space-y-1">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        className={cn(
                                            'w-full justify-start',
                                            isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                                        )}
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        <span className="flex-1 text-left">{item.title}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-6">
                        <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Quick Stats
                        </h3>
                        <div className="space-y-2">
                            {quickStats.map((stat) => (
                                <div
                                    key={stat.title}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn('p-2 rounded-lg', stat.color)}>
                                            <stat.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm text-slate-700">{stat.title}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Bottom Navigation */}
                <div className="p-3 border-t border-slate-200 space-y-1">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start',
                                        isActive && 'bg-blue-50 text-blue-700'
                                    )}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {/* Upgrade Card */}
                <div className="p-4 m-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg text-white">
                    <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                    <p className="text-xs text-blue-100 mb-3">
                        Get unlimited document analysis and advanced features
                    </p>
                    <Button variant="secondary" size="sm" className="w-full">
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </aside>
    );
}