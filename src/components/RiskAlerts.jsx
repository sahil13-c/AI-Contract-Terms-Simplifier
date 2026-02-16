'use client';

import React from 'react';
import { AlertTriangle, DollarSign, Scale, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
    money: DollarSign,
    liability: Scale,
    time: Clock,
    legal: AlertCircle,
};

const severityStyles = {
    critical: {
        container: 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20',
        icon: 'text-red-600 dark:text-red-400',
        title: 'text-red-900 dark:text-red-100',
        message: 'text-red-700 dark:text-red-300',
    },
    high: {
        container: 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20',
        icon: 'text-orange-600 dark:text-orange-400',
        title: 'text-orange-900 dark:text-orange-100',
        message: 'text-orange-700 dark:text-orange-300',
    },
    medium: {
        container: 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        title: 'text-yellow-900 dark:text-yellow-100',
        message: 'text-yellow-700 dark:text-yellow-300',
    },
};

export function RiskAlert({ severity, title, message, icon = 'legal' }) {
    const Icon = iconMap[icon] || AlertTriangle;
    const styles = severityStyles[severity] || severityStyles.medium;

    return (
        <div className={cn(
            'flex gap-4 p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg',
            styles.container
        )}>
            <div className="flex-shrink-0">
                <div className={cn('p-2 rounded-full bg-white/50 dark:bg-slate-900/50', styles.icon)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div className="flex-1 space-y-1">
                <h4 className={cn('font-semibold text-sm', styles.title)}>
                    {title}
                </h4>
                <p className={cn('text-sm', styles.message)}>
                    {message}
                </p>
            </div>
        </div>
    );
}

export function RiskAlertList({ alerts = [] }) {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <RiskAlert
                    key={index}
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                    icon={alert.icon}
                />
            ))}
        </div>
    );
}
