'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function RiskMeter({ score, size = 'md', showLabel = true, label = 'Risk Score' }) {
    // Determine risk level and color
    const getRiskLevel = (score) => {
        if (score >= 70) return { level: 'high', color: 'from-red-500 to-orange-500', textColor: 'text-red-600 dark:text-red-400' };
        if (score >= 40) return { level: 'medium', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-600 dark:text-yellow-400' };
        return { level: 'low', color: 'from-green-500 to-emerald-500', textColor: 'text-green-600 dark:text-green-400' };
    };

    const risk = getRiskLevel(score);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const sizes = {
        sm: { container: 'w-24 h-24', text: 'text-xl', label: 'text-xs' },
        md: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-sm' },
        lg: { container: 'w-40 h-40', text: 'text-3xl', label: 'text-base' },
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn('relative', sizes[size].container)}>
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                    />
                    {/* Progress Circle (with glow layer) */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out opacity-40 blur-[2px]"
                        style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" className={risk.color.split(' ')[0].replace('from-', 'stop-')} />
                            <stop offset="100%" className={risk.color.split(' ')[1].replace('to-', 'stop-')} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn('font-bold', risk.textColor, sizes[size].text)}>
                        {score}
                    </span>
                </div>
            </div>

            {showLabel && (
                <span className={cn('text-muted-foreground font-medium', sizes[size].label)}>
                    {label}
                </span>
            )}
        </div>
    );
}

export function LinearRiskMeter({ score, category, showPercentage = true }) {
    const getRiskColor = (score) => {
        if (score >= 70) return 'bg-gradient-to-r from-red-500 to-orange-500';
        if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                    {category.replace('_', ' ')}
                </span>
                {showPercentage && (
                    <span className="text-sm text-muted-foreground">{score}%</span>
                )}
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden relative">
                <div
                    className={cn('h-full transition-all duration-1000 ease-out relative z-10', getRiskColor(score))}
                    style={{ width: `${score}%` }}
                />
                {/* Glow layer */}
                <div
                    className={cn('absolute inset-0 blur-[4px] opacity-50 transition-all duration-1000 ease-out', getRiskColor(score))}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

export function ComplexityGauge({ score, label = 'Complexity' }) {
    const getComplexityLevel = (score) => {
        if (score >= 70) return { level: 'Very Complex', color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-500 to-pink-500' };
        if (score >= 50) return { level: 'Complex', color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-500 to-indigo-500' };
        if (score >= 30) return { level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'from-yellow-500 to-orange-500' };
        return { level: 'Simple', color: 'text-green-600 dark:text-green-400', bg: 'from-green-500 to-emerald-500' };
    };

    const complexity = getComplexityLevel(score);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-full max-w-xs">
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden relative">
                    <div
                        className={cn('h-full bg-gradient-to-r transition-all duration-1000 ease-out relative z-10', complexity.bg)}
                        style={{ width: `${score}%` }}
                    />
                    {/* Glow layer */}
                    <div
                        className={cn('absolute inset-0 blur-[6px] opacity-40 bg-gradient-to-r transition-all duration-1000 ease-out', complexity.bg)}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <div
                    className="absolute top-0 h-3 w-1 bg-white dark:bg-slate-900 shadow-lg transition-all duration-1000"
                    style={{ left: `${score}%`, transform: 'translateX(-50%)' }}
                />
            </div>
            <div className="text-center">
                <div className={cn('text-lg font-bold', complexity.color)}>
                    {complexity.level}
                </div>
                <div className="text-sm text-muted-foreground">{label}: {score}/100</div>
            </div>
        </div>
    );
}
