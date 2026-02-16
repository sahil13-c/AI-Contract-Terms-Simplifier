'use client';

import { useState } from 'react';
import { Users, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

const roleIcons = {
    employee: '👤',
    employer: '🏢',
    tenant: '🏠',
    landlord: '🏘️',
    service_provider: '🔧',
    client: '💼',
    other: '👥',
};

const roleLabels = {
    employee: 'Employee',
    employer: 'Employer',
    tenant: 'Tenant',
    landlord: 'Landlord',
    service_provider: 'Service Provider',
    client: 'Client',
    other: 'Other Party',
};

export function RoleSwitcher({ roleAnalysis, onRoleChange }) {
    const [selectedRole, setSelectedRole] = useState('primary');
    const [showComparison, setShowComparison] = useState(false);

    if (!roleAnalysis || !roleAnalysis.primaryRole) {
        return null;
    }

    const handleRoleSwitch = () => {
        const newRole = selectedRole === 'primary' ? 'secondary' : 'primary';
        setSelectedRole(newRole);
        if (onRoleChange) {
            onRoleChange(newRole);
        }
    };

    const toggleComparison = () => {
        setShowComparison(prev => !prev);
    };

    const primaryRole = roleAnalysis.primaryRole;
    const secondaryRole = roleAnalysis.secondaryRole;

    return (
        <div className="space-y-4">
            {/* Role Switcher Controls */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex items-center justify-between">
                        <GlassCardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Perspective Analysis
                        </GlassCardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={showComparison ? 'default' : 'outline'}
                                size="sm"
                                onClick={toggleComparison}
                                className="hover-lift"
                            >
                                <ArrowLeftRight className="h-4 w-4 mr-2" />
                                Compare
                            </Button>
                        </div>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                setSelectedRole('primary');
                                if (onRoleChange) onRoleChange('primary');
                            }}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedRole === 'primary'
                                ? 'border-primary bg-primary/10 shadow-glow'
                                : 'border-border/50 hover:border-primary/50'
                                }`}
                        >
                            <span className="text-3xl">{roleIcons[primaryRole] || roleIcons.other}</span>
                            <div className="text-left">
                                <div className="font-semibold">{roleLabels[primaryRole] || 'Primary Party'}</div>
                                <div className="text-xs text-muted-foreground">Your perspective</div>
                            </div>
                        </button>

                        <div className="text-2xl text-muted-foreground">⇄</div>

                        <button
                            onClick={() => {
                                setSelectedRole('secondary');
                                if (onRoleChange) onRoleChange('secondary');
                            }}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedRole === 'secondary'
                                ? 'border-primary bg-primary/10 shadow-glow'
                                : 'border-border/50 hover:border-primary/50'
                                }`}
                        >
                            <span className="text-3xl">{roleIcons[secondaryRole] || roleIcons.other}</span>
                            <div className="text-left">
                                <div className="font-semibold">{roleLabels[secondaryRole] || 'Other Party'}</div>
                                <div className="text-xs text-muted-foreground">Their perspective</div>
                            </div>
                        </button>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Role-Specific Analysis */}
            {!showComparison ? (
                <RoleAnalysisView
                    perspective={selectedRole === 'primary' ? roleAnalysis.primaryPerspective : roleAnalysis.secondaryPerspective}
                    roleName={selectedRole === 'primary' ? roleLabels[primaryRole] : roleLabels[secondaryRole]}
                />
            ) : (
                <ComparisonView
                    primaryPerspective={roleAnalysis.primaryPerspective}
                    secondaryPerspective={roleAnalysis.secondaryPerspective}
                    primaryRole={roleLabels[primaryRole]}
                    secondaryRole={roleLabels[secondaryRole]}
                />
            )}
        </div>
    );
}

function RoleAnalysisView({ perspective, roleName }) {
    if (!perspective) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risks */}
            <GlassCard className="hover-lift">
                <GlassCardHeader>
                    <GlassCardTitle className="text-base flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        Risks for {roleName}
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <ul className="space-y-2">
                        {perspective.risks?.map((risk, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{risk}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCardContent>
            </GlassCard>

            {/* Benefits */}
            <GlassCard className="hover-lift">
                <GlassCardHeader>
                    <GlassCardTitle className="text-base flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Benefits for {roleName}
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <ul className="space-y-2">
                        {perspective.benefits?.map((benefit, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCardContent>
            </GlassCard>

            {/* Key Considerations */}
            <GlassCard className="hover-lift">
                <GlassCardHeader>
                    <GlassCardTitle className="text-base flex items-center gap-2">
                        <span className="text-blue-500">💡</span>
                        Key Considerations
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <ul className="space-y-2">
                        {perspective.keyConsiderations?.map((consideration, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{consideration}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

function ComparisonView({ primaryPerspective, secondaryPerspective, primaryRole, secondaryRole }) {
    return (
        <div className="space-y-4">
            {/* Risks Comparison */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        Risks Comparison
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">{primaryRole}</h4>
                            <ul className="space-y-2">
                                {primaryPerspective?.risks?.map((risk, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">{secondaryRole}</h4>
                            <ul className="space-y-2">
                                {secondaryPerspective?.risks?.map((risk, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Benefits Comparison */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Benefits Comparison
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">{primaryRole}</h4>
                            <ul className="space-y-2">
                                {primaryPerspective?.benefits?.map((benefit, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">{secondaryRole}</h4>
                            <ul className="space-y-2">
                                {secondaryPerspective?.benefits?.map((benefit, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}
