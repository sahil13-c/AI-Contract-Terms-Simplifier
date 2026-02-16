'use client';

import React from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { FileText, Building2, Users, Shield, Handshake, Briefcase, FileSignature } from 'lucide-react';

const contractTypeConfig = {
    employment: {
        icon: Briefcase,
        label: 'Employment Contract',
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        description: 'Employment agreement between employer and employee',
    },
    rental: {
        icon: Building2,
        label: 'Rental Agreement',
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        description: 'Lease or rental contract for property',
    },
    service: {
        icon: Users,
        label: 'Service Agreement',
        color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
        description: 'Service provider and client contract',
    },
    nda: {
        icon: Shield,
        label: 'Non-Disclosure Agreement',
        color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
        description: 'Confidentiality and non-disclosure terms',
    },
    partnership: {
        icon: Handshake,
        label: 'Partnership Agreement',
        color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
        description: 'Business partnership terms and conditions',
    },
    freelance: {
        icon: FileSignature,
        label: 'Freelance Contract',
        color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        description: 'Independent contractor or freelancer agreement',
    },
    sales: {
        icon: FileText,
        label: 'Sales Agreement',
        color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
        description: 'Purchase or sales contract',
    },
    other: {
        icon: FileText,
        label: 'General Contract',
        color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
        description: 'General legal agreement',
    },
};

export function ContractTypeDisplay({ contractType }) {
    const config = contractTypeConfig[contractType] || contractTypeConfig.other;
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${config.color}`}>
            <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50">
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <div className="font-semibold">{config.label}</div>
                <div className="text-xs opacity-80">{config.description}</div>
            </div>
        </div>
    );
}

export function FinancialExposureCard({ financialExposure }) {
    if (!financialExposure || Object.keys(financialExposure).length === 0) {
        return null;
    }

    return (
        <GlassCard>
            <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Financial Exposure
                </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
                {financialExposure.estimatedCosts && (
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Estimated Costs</div>
                        <div className="text-lg font-semibold">{financialExposure.estimatedCosts}</div>
                    </div>
                )}
                {financialExposure.penalties && (
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Potential Penalties</div>
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">{financialExposure.penalties}</div>
                    </div>
                )}
                {financialExposure.liabilityCaps && (
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Liability Caps</div>
                        <div className="text-lg font-semibold">{financialExposure.liabilityCaps}</div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">Best Case</div>
                        <div className="text-sm font-semibold">{financialExposure.bestCase || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-xs font-medium text-red-600 dark:text-red-400">Worst Case</div>
                        <div className="text-sm font-semibold">{financialExposure.worstCase || 'N/A'}</div>
                    </div>
                </div>
            </GlassCardContent>
        </GlassCard>
    );
}
