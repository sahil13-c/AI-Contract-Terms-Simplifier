'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Shield,
    Scale,
    DollarSign,
    Clock,
    Lock,
    ArrowLeft,
    BarChart3,
    MessageSquare,
    Download,
    Share2,
} from 'lucide-react';

export default function AnalysisView({ analysis }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Transform risk metrics array to object
    const riskMetrics = {};
    analysis.riskMetrics?.forEach((metric) => {
        riskMetrics[metric.category] = metric.score;
    });

    const getRiskBadgeVariant = (level) => {
        switch (level) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'secondary';
        }
    };

    const getImportanceBadge = (importance) => {
        switch (importance) {
            case 'critical': return 'destructive';
            case 'important': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {analysis.document.title}
                            </h1>
                            <p className="text-slate-600 mt-2">Contract Analysis Results</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Risk Overview */}
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Overall Risk Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Overall Risk Score</span>
                                <Badge variant={getRiskBadgeVariant(analysis.overall_risk)}>
                                    {analysis.overall_risk.toUpperCase()} RISK
                                </Badge>
                            </div>
                            <Progress value={analysis.risk_score} className="h-3 mb-2" />
                            <p className="text-sm text-slate-600">{analysis.summary}</p>
                        </div>

                        <Separator />

                        {/* Risk Breakdown */}
                        <div>
                            <h3 className="font-semibold mb-4">Risk Breakdown by Category</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(riskMetrics).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-slate-700">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">{value}%</span>
                                        </div>
                                        <Progress value={value} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Risky Clauses ({analysis.clauses?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="obligations" className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Obligations ({analysis.obligations?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="negotiation" className="flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            Negotiation ({analysis.negotiationPoints?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    {/* Risky Clauses Tab */}
                    <TabsContent value="overview" className="space-y-4 mt-6">
                        {analysis.clauses?.map((clause) => (
                            <Card
                                key={clause.id}
                                className={`border-l-4 ${clause.risk_level === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-lg">{clause.title}</CardTitle>
                                                <Badge variant={getRiskBadgeVariant(clause.risk_level)}>
                                                    {clause.risk_level.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <CardDescription className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    {clause.category === 'liability' && <Shield className="h-3 w-3" />}
                                                    {clause.category === 'intellectual_property' && <Lock className="h-3 w-3" />}
                                                    {clause.category === 'termination' && <XCircle className="h-3 w-3" />}
                                                    {clause.category === 'payment' && <DollarSign className="h-3 w-3" />}
                                                    {clause.category.replace(/_/g, ' ')}
                                                </span>
                                                <span>•</span>
                                                <span>Page {clause.page}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="text-xs font-semibold text-slate-700 mb-2 uppercase">Original Clause:</h4>
                                        <p className="text-sm text-slate-700 italic leading-relaxed">
                                            "{clause.clause_text}"
                                        </p>
                                    </div>

                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-sm text-red-900 mb-1">Why This Is Risky:</h4>
                                                <p className="text-sm text-red-800 leading-relaxed">{clause.explanation}</p>
                                                <p className="text-sm text-red-900 font-medium mt-2">
                                                    <strong>Impact:</strong> {clause.impact}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="font-semibold text-sm text-green-900 mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Recommended Actions:
                                        </h4>
                                        <ul className="space-y-2">
                                            {clause.suggestions?.map((suggestion, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                                                    <span className="text-green-600 font-bold mt-0.5">•</span>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Obligations Tab */}
                    <TabsContent value="obligations" className="space-y-4 mt-6">
                        {analysis.obligations?.map((obligation) => (
                            <Card key={obligation.id} className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-lg">{obligation.title}</CardTitle>
                                                <Badge variant={getImportanceBadge(obligation.importance)}>
                                                    {obligation.importance.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <CardDescription className="flex items-center gap-4 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    {obligation.category === 'reporting' && <BarChart3 className="h-3 w-3" />}
                                                    {obligation.category === 'payment' && <DollarSign className="h-3 w-3" />}
                                                    {obligation.category === 'delivery' && <FileText className="h-3 w-3" />}
                                                    {obligation.category === 'confidentiality' && <Lock className="h-3 w-3" />}
                                                    {obligation.category === 'communication' && <MessageSquare className="h-3 w-3" />}
                                                    {obligation.category}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {obligation.deadline}
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-900">{obligation.description}</p>
                                    </div>
                                    {obligation.consequences && (
                                        <Alert className="border-amber-200 bg-amber-50">
                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-amber-800 text-sm">
                                                <strong>Consequences:</strong> {obligation.consequences}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Negotiation Points Tab */}
                    <TabsContent value="negotiation" className="space-y-4 mt-6">
                        <Alert className="border-blue-200 bg-blue-50">
                            <Scale className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-900">Negotiation Strategy</AlertTitle>
                            <AlertDescription className="text-blue-800">
                                These points are prioritized by potential impact. Start with high-priority items.
                            </AlertDescription>
                        </Alert>

                        {analysis.negotiationPoints?.map((point) => (
                            <Card
                                key={point.id}
                                className={`border-l-4 ${point.priority === 'high' ? 'border-l-orange-500' : 'border-l-blue-500'}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-lg">{point.title}</CardTitle>
                                                <Badge variant={point.priority === 'high' ? 'destructive' : 'secondary'}>
                                                    {point.priority.toUpperCase()} PRIORITY
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h5 className="text-xs font-semibold text-red-900 mb-2 uppercase">Current Terms:</h5>
                                            <p className="text-sm text-red-800">{point.current_terms}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h5 className="text-xs font-semibold text-green-900 mb-2 uppercase">Proposed Terms:</h5>
                                            <p className="text-sm text-green-800">{point.proposed_terms}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h5 className="text-xs font-semibold text-slate-900 mb-2 uppercase">Why This Matters:</h5>
                                        <p className="text-sm text-slate-700">{point.rationale}</p>
                                    </div>

                                    {point.talking_points && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h5 className="text-xs font-semibold text-blue-900 mb-3 uppercase flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                How to Negotiate This:
                                            </h5>
                                            <ul className="space-y-2">
                                                {point.talking_points.map((talkingPoint, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                                                        <span className="text-blue-600 font-bold mt-0.5">→</span>
                                                        <span>{talkingPoint}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
