'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RiskMeter, LinearRiskMeter, ComplexityGauge } from '@/components/RiskMeters';
import { RiskAlertList } from '@/components/RiskAlerts';
import { RiskDistributionChart } from '@/components/RiskDistributionChart';
import { ContractTypeDisplay, FinancialExposureCard } from '@/components/ContractInfo';
import {
    GlassCard,
    GlassCardHeader,
    GlassCardTitle,
    GlassCardDescription,
    GlassCardContent,
} from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer').then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    ),
});
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Shield,
    DollarSign,
    Clock,
    ArrowLeft,
    BarChart3,
    MessageSquare,
    Download,
    Share2,
    LayoutPanelLeft,
    Maximize2,
    Minimize2
} from 'lucide-react';

export default function AnalysisView({ analysis, document, error }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPdf, setShowPdf] = useState(false);
    const [highlightedPage, setHighlightedPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState('primary');

    // Auto-collapse PDF on small screens or based on preference could be added here

    // Handle processing state
    if (document?.status === 'processing') {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <AnalysisProgress />
            </div>
        );
    }

    // Handle error or missing analysis
    if (error || !analysis) {
        return <ErrorView error={error} document={document} />;
    }

    const togglePdfView = () => setShowPdf(!showPdf);

    const handleClauseClick = (page) => {
        if (page) {
            setHighlightedPage(page);
            if (!showPdf) setShowPdf(true);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Top Header - Fixed */}
            <header className="border-b border-border bg-background z-10 flex-none px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-4 max-w-[1920px] mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold truncate max-w-[300px] md:max-w-md text-foreground">
                                {document?.title || 'Contract Analysis'}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hidden md:flex">
                                <Badge variant="outline" className="text-[10px] h-5">
                                    {document?.file_name}
                                </Badge>
                                <span>•</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={showPdf ? "default" : "outline"}
                            size="sm"
                            onClick={togglePdfView}
                            className="hidden md:flex gap-2"
                        >
                            <LayoutPanelLeft className="h-4 w-4" />
                            {showPdf ? 'Hide Document' : 'Show Document'}
                        </Button>

                        <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>

                        <GlowButton variant="ghost" size="sm" className="hidden sm:flex">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </GlowButton>
                        <GlowButton variant="glow" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Report
                        </GlowButton>
                    </div>
                </div>
            </header>

            {/* Main Content - Resizable Split View */}
            <div className="flex-1 overflow-hidden relative">
                {showPdf ? (
                    <PanelGroup direction="horizontal" className="h-full">
                        {/* Left Panel: Document Viewer */}
                        <Panel defaultSize={40} minSize={20} className="bg-muted/30 relative border-r border-border">
                            <div className="h-full overflow-hidden flex flex-col">
                                <div className="p-2 bg-background border-b border-border text-xs font-medium text-center text-muted-foreground uppercase tracking-wider flex justify-between items-center px-4">
                                    <span>Original Document</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={togglePdfView}>
                                        <Minimize2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
                                    <PDFViewer
                                        fileUrl={document?.url}
                                        highlightedPage={highlightedPage}
                                        className="h-full w-full border-none rounded-none shadow-none"
                                    />
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors cursor-col-resize z-20 flex items-center justify-center">
                            <div className="h-8 w-1 rounded-full bg-muted-foreground/30"></div>
                        </PanelResizeHandle>

                        {/* Right Panel: Analysis */}
                        <Panel minSize={30} className="bg-background relative">
                            <AnalysisContent
                                analysis={analysis}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                handleClauseClick={handleClauseClick}
                                selectedRole={selectedRole}
                                setSelectedRole={setSelectedRole}
                            />
                        </Panel>
                    </PanelGroup>
                ) : (
                    <div className="h-full overflow-auto bg-slate-50 dark:bg-slate-950">
                        <div className="max-w-5xl mx-auto p-6 transition-all duration-300">
                            <div className="flex justify-end mb-4">
                                <Button variant="outline" onClick={togglePdfView} className="gap-2 bg-white dark:bg-slate-900">
                                    <LayoutPanelLeft className="h-4 w-4" /> Open Document Viewer
                                </Button>
                            </div>
                            <AnalysisContent
                                analysis={analysis}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                handleClauseClick={handleClauseClick}
                                selectedRole={selectedRole}
                                setSelectedRole={setSelectedRole}
                                isFullWidth={true}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AnalysisContent({ analysis, activeTab, setActiveTab, handleClauseClick, selectedRole, setSelectedRole, isFullWidth = false }) {
    const getRiskBadgeVariant = (level) => {
        switch (level) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6 bg-slate-50 dark:bg-slate-950/50">

            {/* Risk Alerts */}
            {analysis.riskAlerts && analysis.riskAlerts.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <RiskAlertList alerts={analysis.riskAlerts} />
                </div>
            )}

            {/* Role Switcher */}
            {analysis.role_analysis && (
                <RoleSwitcher
                    roleAnalysis={analysis.role_analysis}
                    onRoleChange={setSelectedRole}
                />
            )}

            {/* Top Stats Grid */}
            <div className={`grid grid-cols-1 ${isFullWidth ? 'lg:grid-cols-3' : 'xl:grid-cols-2'} gap-6`}>
                <div className={`${isFullWidth ? 'lg:col-span-2' : ''} space-y-6`}>
                    {/* Contract Type */}
                    {analysis.contract_type && (
                        <ContractTypeDisplay contractType={analysis.contract_type} />
                    )}

                    {/* Complexity */}
                    {analysis.complexity_score && (
                        <GlassCard className="bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-sm hover:shadow-glow transition-all">
                            <GlassCardHeader className="pb-2">
                                <GlassCardTitle className="text-base font-semibold">Complexity Score</GlassCardTitle>
                            </GlassCardHeader>
                            <GlassCardContent>
                                <ComplexityGauge score={analysis.complexity_score} />
                            </GlassCardContent>
                        </GlassCard>
                    )}
                </div>

                {/* Risk Meter */}
                <GlassCard className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-glow transition-all">
                    <h3 className="font-semibold mb-4 text-center">Overall Risk Score</h3>
                    <RiskMeter score={analysis.risk_score || 0} size="lg" />
                    <p className="mt-4 text-sm text-center text-muted-foreground">
                        {(analysis.risk_score || 0) > 70 ? 'Requires careful review' : 'Standard terms detected'}
                    </p>
                </GlassCard>
            </div>

            {/* Summary */}
            <GlassCard className="bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-sm hover:shadow-glow transition-all">
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Executive Summary
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                        {analysis.summary || 'No summary available'}
                    </p>
                </GlassCardContent>
            </GlassCard>

            {/* Financial Exposure */}
            {analysis.financial_exposure && (
                <FinancialExposureCard financialExposure={analysis.financial_exposure} />
            )}

            {/* Charts Section */}
            <div className={`grid grid-cols-1 ${isFullWidth ? 'md:grid-cols-2' : 'xl:grid-cols-2'} gap-6`}>
                <Card className="bg-white dark:bg-slate-900 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <BarChart3 className="h-4 w-4" /> Risk Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RiskDistributionChart riskMetrics={analysis.riskMetrics || []} />
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Shield className="h-4 w-4" /> Category Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analysis.riskMetrics?.map((metric) => (
                            <LinearRiskMeter
                                key={metric.category}
                                score={metric.score}
                                category={metric.category}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto bg-white dark:bg-slate-900 p-1 border border-border rounded-lg shadow-sm">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">Overview</TabsTrigger>
                    <TabsTrigger value="clauses" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                        Clauses <Badge variant="secondary" className="ml-2 text-[10px]">{analysis.clauses?.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="obligations" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                        Obligations <Badge variant="secondary" className="ml-2 text-[10px]">{analysis.obligations?.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="negotiation" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                        Negotiation <Badge variant="secondary" className="ml-2 text-[10px]">{analysis.negotiationPoints?.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickStatCard
                            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                            label="High Risk Clauses"
                            value={analysis.clauses?.filter(c => (c && c.riskLevel === 'high')).length || 0}
                            onClick={() => setActiveTab('clauses')}
                        />
                        <QuickStatCard
                            icon={<Clock className="h-5 w-5 text-blue-500" />}
                            label="Key Obligations"
                            value={analysis.obligations?.length || 0}
                            onClick={() => setActiveTab('obligations')}
                        />
                        <QuickStatCard
                            icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                            label="Negotiation Points"
                            value={analysis.negotiationPoints?.length || 0}
                            onClick={() => setActiveTab('negotiation')}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="clauses" className="space-y-4 mt-4">
                    {analysis.clauses?.map((clause, index) => (
                        <Card
                            key={index}
                            className="bg-white dark:bg-slate-900 border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => handleClauseClick(clause.page)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-base font-semibold group-hover:text-blue-600 transition-colors">
                                            {clause.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span>Page {clause.page}</span>
                                            <span>•</span>
                                            <span>{clause.category}</span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(clause.riskLevel || 'medium')} className="capitalize">
                                        {(clause.riskLevel || 'medium')}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-600 dark:text-slate-400 mb-3 border border-border">
                                    "{(clause.clauseText || '').substring(0, 150)}{(clause.clauseText || '').length > 150 ? '...' : ''}"
                                </div>
                                <p className="text-sm mb-2 text-slate-600 dark:text-slate-300">{clause.explanation}</p>
                                {clause.financialImpact && (
                                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                                        <DollarSign className="h-4 w-4 mt-0.5" />
                                        <span>{clause.financialImpact}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="obligations" className="space-y-4 mt-4">
                    {analysis.obligations?.map((msg, idx) => (
                        <Card key={idx} className="bg-white dark:bg-slate-900 border-border shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="text-base font-semibold">{msg.title}</CardTitle>
                                    <Badge variant="outline">{msg.importance}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{msg.description}</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                                    <Clock className="h-3 w-3" /> Due: {msg.deadline}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="negotiation" className="space-y-4 mt-4">
                    {analysis.negotiationPoints?.map((point, idx) => (
                        <Card key={idx} className="bg-white dark:bg-slate-900 border-border shadow-sm">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="text-base font-semibold">{point.title}</CardTitle>
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                        Score: {point.priorityScore}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-100 dark:border-red-900/30">
                                        <span className="text-xs font-bold text-red-600 uppercase mb-1 block">Current</span>
                                        {point.currentTerms}
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-100 dark:border-green-900/30">
                                        <span className="text-xs font-bold text-green-600 uppercase mb-1 block">Proposed</span>
                                        {point.proposedTerms}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 italic">{point.rationale}</p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function QuickStatCard({ icon, label, value, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center p-4 rounded-xl border border-border bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer hover:shadow-md active:scale-[0.99]"
        >
            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-4">
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
            </div>
        </div>
    );
}

function ErrorView({ error, document }) {
    return (
        <div className="min-h-screen p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Card className="max-w-lg w-full p-8 text-center bg-white dark:bg-slate-900 border-border shadow-lg">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-red-100 text-red-600">
                        <XCircle className="h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Analysis Failed</h1>
                <p className="text-muted-foreground mb-6">
                    {error || 'We could not process this document. Please try again.'}
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </Card>
        </div>
    );
}
