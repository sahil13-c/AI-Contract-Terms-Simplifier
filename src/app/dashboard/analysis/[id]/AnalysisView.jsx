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
    TrendingUp,
    Users,
    Eye,
    Zap,
    Target,
    Award,
    AlertCircle,
} from 'lucide-react';

export default function AnalysisView({ analysis, document, error }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Handle error or missing analysis
    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {document?.title || 'Document Analysis'}
                            </h1>
                            <p className="text-slate-600 mt-2">
                                {document?.status === 'processing' ? 'Analysis in Progress' : 
                                 document?.status === 'failed' ? 'Analysis Failed' : 'Analysis Not Available'}
                            </p>
                        </div>
                    </div>

                    {/* Error or Status Message */}
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                        <CardContent className="pt-6">
                            {error ? (
                                <Alert className="border-red-200 bg-red-50">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <AlertTitle className="text-red-900">Analysis Error</AlertTitle>
                                    <AlertDescription className="text-red-800">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            ) : document?.status === 'processing' ? (
                                <Alert className="border-blue-200 bg-blue-50">
                                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                                    <AlertTitle className="text-blue-900">Analysis in Progress</AlertTitle>
                                    <AlertDescription className="text-blue-800">
                                        Your document is currently being analyzed. This usually takes 1-2 minutes. 
                                        Please check back in a few moments.
                                    </AlertDescription>
                                </Alert>
                            ) : document?.status === 'failed' ? (
                                <Alert className="border-red-200 bg-red-50">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <AlertTitle className="text-red-900">Analysis Failed</AlertTitle>
                                    <AlertDescription className="text-red-800">
                                        We couldn't analyze your document. Please try uploading it again, 
                                        or contact support if the problem persists.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="border-amber-200 bg-amber-50">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <AlertTitle className="text-amber-900">No Analysis Available</AlertTitle>
                                    <AlertDescription className="text-amber-800">
                                        No analysis data found for this document. The analysis may not have completed yet.
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="mt-6 flex gap-2">
                                <Link href="/dashboard">
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                                {document?.status === 'processing' && (
                                    <Button onClick={() => window.location.reload()}>
                                        Refresh Status
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

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

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'secondary';
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
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {analysis.document.file_name}
                                </Badge>
                                <Badge variant={analysis.document.status === 'completed' ? 'success' : 'warning'} className="text-xs">
                                    {analysis.document.status === 'completed' ? 'Completed' : 'Processing'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Analysis Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className={`p-3 rounded-full ${
                                    analysis.overall_risk === 'high' ? 'bg-red-100' :
                                    analysis.overall_risk === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                                }`}>
                                    <Shield className={`h-8 w-8 ${
                                        analysis.overall_risk === 'high' ? 'text-red-600' :
                                        analysis.overall_risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                    }`} />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Overall Risk</h3>
                            <Badge variant={getRiskBadgeVariant(analysis.overall_risk)} className="text-sm px-3 py-1">
                                {analysis.overall_risk.toUpperCase()}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-2">
                                {analysis.overall_risk === 'high' ? 'High risk detected - immediate attention required' :
                                 analysis.overall_risk === 'medium' ? 'Moderate risk - review recommended' : 
                                 'Low risk - generally safe terms'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <BarChart3 className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Risk Score</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {analysis.risk_score}/100
                            </div>
                            <Progress value={analysis.risk_score} className="h-2 mb-2" />
                            <p className="text-sm text-slate-600">
                                Based on {Object.keys(riskMetrics).length} risk categories analyzed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Eye className="h-8 w-8 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Clauses Found</h3>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {analysis.clauses?.length || 0}
                            </div>
                            <p className="text-sm text-slate-600">
                                Risky clauses identified
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-orange-100">
                                    <Target className="h-8 w-8 text-orange-600" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Obligations</h3>
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {analysis.obligations?.length || 0}
                            </div>
                            <p className="text-sm text-slate-600">
                                Key obligations identified
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Overview */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Risk Analysis Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Risk Score Gauge */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Risk Score Breakdown</h3>
                                <div className="relative h-32 w-32 mx-auto">
                                    <svg className="transform -rotate-90 w-32 h-32">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-slate-200"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 56}`}
                                            strokeDashoffset={`${2 * Math.PI * 56} * (1 - analysis.risk_score / 100)`}
                                            className={`${
                                                analysis.risk_score >= 70 ? 'text-red-500' :
                                                analysis.risk_score >= 40 ? 'text-yellow-500' : 'text-green-500'
                                            }`}
                                            transform="rotate(-90 64 64)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">
                                            {analysis.risk_score}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <Badge variant={getRiskBadgeVariant(analysis.overall_risk)} className="mb-2">
                                        {analysis.overall_risk.toUpperCase()} RISK
                                    </Badge>
                                    <p className="text-sm text-slate-600">
                                        {analysis.risk_score >= 70 ? 'High Risk - Immediate Action Required' :
                                         analysis.risk_score >= 40 ? 'Medium Risk - Review Recommended' : 
                                         'Low Risk - Generally Favorable'}
                                    </p>
                                </div>
                            </div>

                            {/* Risk Categories Chart */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Risk by Category</h3>
                                <div className="space-y-3">
                                    {Object.entries(riskMetrics).map(([category, score]) => (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium capitalize text-slate-700">
                                                    {category.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs font-medium text-slate-500">{score}%</span>
                                            </div>
                                            <Progress value={score} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Summary */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Executive Summary</h3>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-slate-700 leading-relaxed">
                                    {analysis.summary}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
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
                        {analysis.clauses?.length > 0 ? (
                            analysis.clauses.map((clause) => (
                                <Card
                                    key={clause.id}
                                    className={`border-l-4 ${clause.risk_level === 'high' ? 'border-l-red-500 bg-red-50' : 
                                                   clause.risk_level === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
                                                   'border-l-green-500 bg-green-50'}`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CardTitle className="text-lg">{clause.title}</CardTitle>
                                                    <Badge variant={getRiskBadgeVariant(clause.risk_level)} className="ml-2">
                                                        {clause.risk_level.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        {clause.category === 'liability' && <Shield className="h-4 w-4 text-red-500" />}
                                                        {clause.category === 'intellectual_property' && <Lock className="h-4 w-4 text-orange-500" />}
                                                        {clause.category === 'termination' && <XCircle className="h-4 w-4 text-yellow-500" />}
                                                        {clause.category === 'payment' && <DollarSign className="h-4 w-4 text-green-500" />}
                                                        {clause.category?.replace(/_/g, ' ') || 'General'}
                                                    </span>
                                                    {clause.page && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Page {clause.page}
                                                        </Badge>
                                                    )}
                                                    {clause.section && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Section {clause.section}
                                                        </Badge>
                                                    )}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">Clause Text</h4>
                                            <div className="bg-slate-100 p-3 rounded-md text-sm text-slate-700 mb-4">
                                                "{clause.clause_text}"
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">Why This Matters</h4>
                                            <p className="text-slate-700 mb-4">{clause.explanation}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">Potential Impact</h4>
                                            <p className="text-slate-700 mb-4">{clause.impact}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">Recommendations</h4>
                                            <div className="space-y-2">
                                                {clause.suggestions?.map((suggestion, index) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-slate-700">{suggestion}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-0 shadow-lg">
                                <CardContent className="text-center py-12">
                                    <div className="flex flex-col items-center space-y-4">
                                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                                        <h3 className="text-lg font-semibold text-slate-900">No Risky Clauses Found</h3>
                                        <p className="text-slate-600">
                                            Great! Your contract appears to have standard terms with minimal risks.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Obligations Tab */}
                    <TabsContent value="obligations" className="space-y-4 mt-6">
                        {analysis.obligations?.length > 0 ? (
                            analysis.obligations.map((obligation) => (
                                <Card key={obligation.id} className="border-0 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CardTitle className="text-lg">{obligation.title}</CardTitle>
                                                <Badge variant={getImportanceBadge(obligation.importance)}>
                                                    {obligation.importance.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {obligation.category?.replace(/_/g, ' ') || 'General'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">Deadline</h4>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-500" />
                                                    <span className="text-sm text-slate-700">{obligation.deadline}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">Importance</h4>
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4 text-slate-500" />
                                                    <span className="text-sm text-slate-700">{obligation.importance}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">What You Need to Do</h4>
                                            <p className="text-slate-700 mb-4">{obligation.description}</p>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                            <h4 className="font-medium text-red-900 mb-2">Consequences if Not Met</h4>
                                            <p className="text-red-800">{obligation.consequences}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-0 shadow-lg">
                                <CardContent className="text-center py-12">
                                    <div className="flex flex-col items-center space-y-4">
                                        <CheckCircle2 className="h-12 w-12 text-blue-500" />
                                        <h3 className="text-lg font-semibold text-slate-900">No Specific Obligations Found</h3>
                                        <p className="text-slate-600">
                                            Your contract doesn't appear to have specific obligations that require tracking.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Negotiation Points Tab */}
                    <TabsContent value="negotiation" className="space-y-4 mt-6">
                        {analysis.negotiationPoints?.length > 0 ? (
                            <>
                                <Alert className="border-blue-200 bg-blue-50">
                                    <Scale className="h-4 w-4 text-blue-600" />
                                    <AlertTitle className="text-blue-900">Negotiation Strategy</AlertTitle>
                                    <AlertDescription className="text-blue-800">
                                        These points are prioritized by potential impact. Start with high-priority items.
                                    </AlertDescription>
                                </Alert>

                                {analysis.negotiationPoints.map((point) => (
                                    <Card key={point.id} className="border-0 shadow-lg">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-lg">{point.title}</CardTitle>
                                                    <Badge variant={getPriorityBadge(point.priority)}>
                                                        {point.priority.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {point.category?.replace(/_/g, ' ') || 'General'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <h4 className="font-medium text-slate-900 mb-2">Current Terms</h4>
                                                    <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                                                        <p className="text-sm text-red-800">{point.currentTerms}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900 mb-2">Suggested Improvement</h4>
                                                    <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                                                        <p className="text-sm text-green-800">{point.proposedTerms}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">Why This Matters</h4>
                                                <p className="text-slate-700 mb-4">{point.rationale}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">Talking Points</h4>
                                                <div className="space-y-2">
                                                    {point.talkingPoints?.map((talkingPoint, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-slate-700">{talkingPoint}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-4">
                                                <span className="text-sm text-slate-500">Priority Score:</span>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={point.priorityScore} className="h-2 w-20" />
                                                    <span className="text-sm font-medium text-slate-700">{point.priorityScore}/100</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        ) : (
                            <Card className="border-0 shadow-lg">
                                <CardContent className="text-center py-12">
                                    <div className="flex flex-col items-center space-y-4">
                                        <Award className="h-12 w-12 text-green-500" />
                                        <h3 className="text-lg font-semibold text-slate-900">No Negotiation Points</h3>
                                        <p className="text-slate-600">
                                            Your contract terms appear to be fair and reasonable.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
