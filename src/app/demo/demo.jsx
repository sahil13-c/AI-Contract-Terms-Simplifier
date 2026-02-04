'use client';

import { useState } from 'react';
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
    Sparkles,
    TrendingUp,
    Users,
    BarChart3,
    MessageSquare,
    Download,
    Share2,
    ChevronRight,
    Info
} from 'lucide-react';

export default function TestDemoPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [analysisStep, setAnalysisStep] = useState(0);

    // Mock document data
    const mockDocument = {
        id: '1',
        title: 'Freelance Software Development Agreement',
        type: 'Freelance Contract',
        uploadDate: new Date().toISOString(),
        status: 'completed',
        fileSize: '245 KB',
        pages: 12,
    };

    // Mock analysis data
    const mockAnalysis = {
        overallRisk: 'medium',
        riskScore: 65,
        summary: 'This freelance software development agreement contains several standard clauses but includes some areas of concern, particularly around liability and intellectual property rights. The contract heavily favors the client company in several key areas.',

        riskMetrics: {
            liability: 85,
            payment: 35,
            intellectual_property: 70,
            termination: 55,
            confidentiality: 25,
            indemnification: 80,
        },

        keyFindings: [
            {
                type: 'high_risk',
                count: 3,
                label: 'Critical Issues'
            },
            {
                type: 'medium_risk',
                count: 5,
                label: 'Review Needed'
            },
            {
                type: 'low_risk',
                count: 2,
                label: 'Minor Concerns'
            }
        ],

        riskyClausesCount: 8,
        obligationsCount: 12,
        negotiationPointsCount: 6,
    };

    // Mock risky clauses
    const mockRiskyClauses = [
        {
            id: 1,
            title: 'Unlimited Liability Exposure',
            riskLevel: 'high',
            category: 'liability',
            page: 3,
            clauseText: 'The Contractor agrees to indemnify, defend, and hold harmless the Company, its officers, directors, employees, and agents from and against any and all claims, damages, liabilities, costs, and expenses, including reasonable attorneys\' fees, arising out of or resulting from the Contractor\'s performance of services under this Agreement.',
            explanation: 'This clause places unlimited liability on you for any issues arising from your work, regardless of the actual damage or your total compensation. This means you could be held financially responsible for amounts far exceeding what you\'re being paid.',
            impact: 'High financial risk - potentially unlimited damages',
            suggestions: [
                'Request a liability cap equal to total project value or annual compensation',
                'Add "except in cases of gross negligence or willful misconduct"',
                'Exclude liability for third-party claims not directly caused by your work',
                'Negotiate mutual indemnification so both parties share responsibility'
            ]
        },
        {
            id: 2,
            title: 'Broad IP Rights Transfer',
            riskLevel: 'high',
            category: 'intellectual_property',
            page: 5,
            clauseText: 'All work product, including but not limited to any inventions, discoveries, improvements, software code, documentation, designs, and any other intellectual property created by Contractor during the term of this Agreement, whether or not created during working hours, shall be deemed "work made for hire" and shall be the exclusive property of the Company.',
            explanation: 'This clause gives the company ownership of everything you create during the contract period, even work done on your own time or for other clients. The phrase "during the term" is dangerously broad.',
            impact: 'Loss of ownership over personal projects and pre-existing work',
            suggestions: [
                'Limit IP transfer to "work specifically created for and paid for by this project"',
                'Exclude pre-existing IP and clearly define what you\'re bringing to the project',
                'Remove "during the term" and replace with "as part of the deliverables"',
                'Keep ownership of general knowledge, skills, and methodologies learned'
            ]
        },
        {
            id: 3,
            title: 'Short Termination Notice Period',
            riskLevel: 'medium',
            category: 'termination',
            page: 8,
            clauseText: 'Either party may terminate this Agreement at any time, with or without cause, upon seven (7) days written notice to the other party.',
            explanation: 'While mutual termination rights seem fair, 7 days is extremely short notice, especially for termination without cause. This doesn\'t give you enough time to find new work or complete ongoing tasks.',
            impact: 'Income instability and insufficient time to transition',
            suggestions: [
                'Request 30 days notice for termination without cause',
                'Add payment for work in progress at time of termination',
                'Include a "kill fee" of 25-50% for early termination',
                'Different notice periods: 7 days with cause, 30 days without cause'
            ]
        },
        {
            id: 4,
            title: 'Net 60 Payment Terms',
            riskLevel: 'medium',
            category: 'payment',
            page: 6,
            clauseText: 'Company shall pay Contractor within sixty (60) days of receipt of a valid invoice.',
            explanation: 'Net 60 payment terms mean you won\'t get paid for 2 months after submitting your invoice. This creates significant cash flow problems, especially for independent contractors.',
            impact: 'Poor cash flow, delayed compensation',
            suggestions: [
                'Request Net 15 or Net 30 payment terms',
                'Add late payment penalties (1.5% per month)',
                'Negotiate upfront deposit (25-50%)',
                'Request milestone-based payments for longer projects'
            ]
        },
        {
            id: 5,
            title: 'Non-Compete Clause Geographic Scope',
            riskLevel: 'medium',
            category: 'restrictions',
            page: 9,
            clauseText: 'For a period of twelve (12) months following termination, Contractor shall not directly or indirectly engage in any business that competes with Company within the United States.',
            explanation: 'This non-compete is overly broad in geographic scope (entire US) and could prevent you from working in your field for a year after the contract ends.',
            impact: 'Restricted ability to find future work in your industry',
            suggestions: [
                'Narrow geographic scope to company\'s actual operating regions',
                'Reduce time period to 3-6 months',
                'Limit to direct competitors only, not entire industry',
                'Add compensation clause if non-compete is enforced'
            ]
        }
    ];

    // Mock obligations
    const mockObligations = [
        {
            id: 1,
            title: 'Weekly Progress Reports',
            category: 'reporting',
            importance: 'critical',
            deadline: 'Every Friday by 5 PM',
            description: 'Submit detailed progress report including completed tasks, current tasks, blockers, and next week\'s plan.',
            consequences: 'Failure to submit may result in payment delays'
        },
        {
            id: 2,
            title: 'Invoice Submission',
            category: 'payment',
            importance: 'critical',
            deadline: 'Within 5 business days of month end',
            description: 'Submit itemized invoice with time tracking details, deliverables completed, and total hours worked.',
            consequences: 'Late invoices pushed to next payment cycle'
        },
        {
            id: 3,
            title: 'Code Repository Access',
            category: 'delivery',
            importance: 'important',
            deadline: 'Daily commits required',
            description: 'Commit all code to company\'s private repository with descriptive commit messages. Code must be properly documented.',
            consequences: 'Inability to track progress may impact payment'
        },
        {
            id: 4,
            title: 'Confidentiality Obligations',
            category: 'confidentiality',
            importance: 'critical',
            deadline: 'Duration of contract + 2 years',
            description: 'Maintain strict confidentiality of all proprietary information, trade secrets, and business plans. No disclosure to third parties.',
            consequences: 'Breach may result in legal action and damages'
        },
        {
            id: 5,
            title: 'Availability for Meetings',
            category: 'communication',
            importance: 'important',
            deadline: 'Business hours (9 AM - 5 PM EST)',
            description: 'Be available for video calls, meetings, and urgent communications during standard business hours.',
            consequences: 'May impact performance review and renewal'
        }
    ];

    // Mock negotiation points
    const mockNegotiationPoints = [
        {
            id: 1,
            priority: 'high',
            title: 'Liability Cap',
            currentTerms: 'Unlimited liability for all claims and damages',
            proposedTerms: 'Liability capped at total contract value ($50,000)',
            rationale: 'Protects you from catastrophic financial exposure while maintaining accountability. Industry standard for freelance contracts.',
            talkingPoints: [
                'This is standard practice in consulting agreements',
                'Your insurance coverage is limited to this amount',
                'Unlimited liability is unreasonable given the project scope'
            ],
            priority_score: 95
        },
        {
            id: 2,
            priority: 'high',
            title: 'Intellectual Property Scope',
            currentTerms: 'Company owns all work created during contract term',
            proposedTerms: 'Company owns only deliverables specified in Statement of Work',
            rationale: 'Allows you to maintain ownership of side projects, pre-existing work, and general skills/knowledge gained.',
            talkingPoints: [
                'Current clause could claim ownership of unrelated personal projects',
                'Pre-existing tools and frameworks should remain your property',
                'IP transfer should be limited to paid deliverables only'
            ],
            priority_score: 90
        },
        {
            id: 3,
            priority: 'high',
            title: 'Payment Terms',
            currentTerms: 'Net 60 days from invoice receipt',
            proposedTerms: 'Net 15 or Net 30 days from invoice receipt',
            rationale: 'Improves cash flow significantly. Net 60 is unusually long and creates financial hardship for contractors.',
            talkingPoints: [
                'Industry standard is Net 15-30 for contractor payments',
                'Faster payment improves your availability and commitment',
                'Willing to provide early payment discount (2% for Net 15)'
            ],
            priority_score: 85
        },
        {
            id: 4,
            priority: 'medium',
            title: 'Termination Notice Period',
            currentTerms: '7 days notice for any reason',
            proposedTerms: '30 days notice without cause, 7 days with cause',
            rationale: 'Provides adequate time to secure new work and complete current commitments without rushing.',
            talkingPoints: [
                '30 days is standard for professional services',
                'Allows proper knowledge transfer and documentation',
                'Immediate termination still available for breach/cause'
            ],
            priority_score: 70
        },
        {
            id: 5,
            priority: 'medium',
            title: 'Milestone-Based Payments',
            currentTerms: 'Monthly invoicing only',
            proposedTerms: 'Payment upon completion of defined milestones',
            rationale: 'Aligns payment with value delivery, provides more frequent payment opportunities.',
            talkingPoints: [
                'Reduces financial risk for both parties',
                'Ensures steady cash flow throughout project',
                'Common practice for project-based work'
            ],
            priority_score: 65
        }
    ];

    // Simulate analysis steps
    const analysisSteps = [
        { step: 0, label: 'Uploading document...', progress: 20 },
        { step: 1, label: 'Extracting text and clauses...', progress: 40 },
        { step: 2, label: 'AI analyzing contract terms...', progress: 60 },
        { step: 3, label: 'Identifying risk factors...', progress: 80 },
        { step: 4, label: 'Generating recommendations...', progress: 100 },
    ];

    const simulateAnalysis = () => {
        setAnalysisStep(0);
        const interval = setInterval(() => {
            setAnalysisStep(prev => {
                if (prev >= 4) {
                    clearInterval(interval);
                    return 4;
                }
                return prev + 1;
            });
        }, 1500);
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

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
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Contract Analysis Demo
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Test all features with mock data - No database required
                        </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Demo Mode
                    </Badge>
                </div>

                {/* Info Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">Demo Page - All Features Working</AlertTitle>
                    <AlertDescription className="text-blue-800">
                        This page demonstrates all main functionality with mock data. No Supabase or AI API needed for testing.
                        Try the "Simulate Analysis" button below to see the AI analysis flow!
                    </AlertDescription>
                </Alert>

                {/* Document Info Card */}
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">{mockDocument.title}</CardTitle>
                                <CardDescription className="flex items-center gap-4 mt-2">
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        {mockDocument.type}
                                    </span>
                                    <span>•</span>
                                    <span>{mockDocument.pages} pages</span>
                                    <span>•</span>
                                    <span>{mockDocument.fileSize}</span>
                                    <span>•</span>
                                    <Badge variant="outline">
                                        {mockDocument.status.toUpperCase()}
                                    </Badge>
                                </CardDescription>
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
                    </CardHeader>
                </Card>

                {/* Analysis Simulation */}
                {analysisStep < 4 && analysisStep > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">
                                        {analysisSteps[analysisStep].label}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {analysisSteps[analysisStep].progress}%
                                    </span>
                                </div>
                                <Progress value={analysisSteps[analysisStep].progress} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Simulate Analysis Button */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Try AI Analysis Simulation</h3>
                                <p className="text-blue-100 text-sm">
                                    Click to see how the AI analysis process works (no API needed)
                                </p>
                            </div>
                            <Button
                                onClick={simulateAnalysis}
                                className="bg-white text-blue-600 hover:bg-blue-50"
                                disabled={analysisStep > 0 && analysisStep < 4}
                            >
                                {analysisStep === 4 ? 'Analyze Again' : 'Simulate Analysis'}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Overview */}
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Overall Risk Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Overall Score */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Overall Risk Score</span>
                                <Badge variant={getRiskBadgeVariant(mockAnalysis.overallRisk)}>
                                    {mockAnalysis.overallRisk.toUpperCase()} RISK
                                </Badge>
                            </div>
                            <Progress value={mockAnalysis.riskScore} className="h-3 mb-2" />
                            <p className="text-sm text-slate-600">{mockAnalysis.summary}</p>
                        </div>

                        <Separator />

                        {/* Risk Breakdown */}
                        <div>
                            <h3 className="font-semibold mb-4">Risk Breakdown by Category</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(mockAnalysis.riskMetrics).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-slate-700">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">{value}%</span>
                                        </div>
                                        <Progress
                                            value={value}
                                            className="h-2"
                                            indicatorClassName={value > 70 ? 'bg-red-500' : value > 40 ? 'bg-yellow-500' : 'bg-green-500'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Key Findings */}
                        <div className="grid grid-cols-3 gap-4">
                            {mockAnalysis.keyFindings.map((finding, index) => (
                                <div key={index} className="text-center p-4 rounded-lg bg-slate-50">
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {finding.count}
                                    </div>
                                    <div className="text-xs text-slate-600">{finding.label}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Risky Clauses ({mockRiskyClauses.length})
                        </TabsTrigger>
                        <TabsTrigger value="obligations" className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Obligations ({mockObligations.length})
                        </TabsTrigger>
                        <TabsTrigger value="negotiation" className="flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            Negotiation ({mockNegotiationPoints.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Risky Clauses Tab */}
                    <TabsContent value="overview" className="space-y-4 mt-6">
                        {mockRiskyClauses.map((clause) => (
                            <Card
                                key={clause.id}
                                className={`border-l-4 ${clause.riskLevel === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-lg">{clause.title}</CardTitle>
                                                <Badge variant={getRiskBadgeVariant(clause.riskLevel)}>
                                                    {clause.riskLevel.toUpperCase()}
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
                                    {/* Original Clause */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="text-xs font-semibold text-slate-700 mb-2 uppercase">Original Clause:</h4>
                                        <p className="text-sm text-slate-700 italic leading-relaxed">
                                            "{clause.clauseText}"
                                        </p>
                                    </div>

                                    {/* Why Risky */}
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

                                    {/* Suggestions */}
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="font-semibold text-sm text-green-900 mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Recommended Actions:
                                        </h4>
                                        <ul className="space-y-2">
                                            {clause.suggestions.map((suggestion, idx) => (
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
                        {mockObligations.map((obligation) => (
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
                                These points are prioritized by potential impact. Start with high-priority items and be prepared to compromise on lower priorities.
                            </AlertDescription>
                        </Alert>

                        {mockNegotiationPoints.map((point) => (
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
                                    {/* Current vs Proposed */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h5 className="text-xs font-semibold text-red-900 mb-2 uppercase">Current Terms:</h5>
                                            <p className="text-sm text-red-800">{point.currentTerms}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h5 className="text-xs font-semibold text-green-900 mb-2 uppercase">Proposed Terms:</h5>
                                            <p className="text-sm text-green-800">{point.proposedTerms}</p>
                                        </div>
                                    </div>

                                    {/* Rationale */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h5 className="text-xs font-semibold text-slate-900 mb-2 uppercase">Why This Matters:</h5>
                                        <p className="text-sm text-slate-700">{point.rationale}</p>
                                    </div>

                                    {/* Talking Points */}
                                    {point.talkingPoints && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h5 className="text-xs font-semibold text-blue-900 mb-3 uppercase flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                How to Negotiate This:
                                            </h5>
                                            <ul className="space-y-2">
                                                {point.talkingPoints.map((talkingPoint, idx) => (
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

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-red-900 mb-1">
                                {mockRiskyClauses.filter(c => c.riskLevel === 'high').length}
                            </div>
                            <div className="text-sm text-red-700 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                High Risk Issues
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-yellow-900 mb-1">
                                {mockRiskyClauses.filter(c => c.riskLevel === 'medium').length}
                            </div>
                            <div className="text-sm text-yellow-700 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Medium Risk Items
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-blue-900 mb-1">
                                {mockObligations.length}
                            </div>
                            <div className="text-sm text-blue-700 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Your Obligations
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-purple-900 mb-1">
                                {mockNegotiationPoints.length}
                            </div>
                            <div className="text-sm text-purple-700 flex items-center gap-2">
                                <Scale className="h-4 w-4" />
                                Negotiation Points
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-indigo-900 text-white">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                All Features Working!
                            </h3>
                            <p className="text-slate-300 text-sm">
                                ✅ Risk Assessment • ✅ Clause Analysis • ✅ Obligation Tracking • ✅ Negotiation Guidance
                            </p>
                            <p className="text-slate-400 text-xs mt-4">
                                This demo shows all main functionality with realistic mock data. When you connect Supabase and AI,
                                these same components will display real analyzed data from your contracts.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}