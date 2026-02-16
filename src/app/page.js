'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Brain,
  Lock,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI breaks down complex legal jargon into simple, understandable language.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: 'Risk Detection',
      description: 'Automatically identifies and highlights potentially risky clauses in your contracts.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Negotiation Points',
      description: 'Get smart suggestions on what to negotiate and how to improve contract terms.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detailed Reports',
      description: 'Comprehensive clause-by-clause breakdown with risk ratings and explanations.',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: 'Save Time',
      description: 'Analyze contracts in minutes, not hours'
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      title: 'Reduce Risk',
      description: 'Identify problematic clauses before signing'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: 'Better Deals',
      description: 'Negotiate from a position of knowledge'
    },
    {
      icon: <Lock className="h-5 w-5 text-purple-500" />,
      title: 'Secure & Private',
      description: 'Your documents are encrypted and protected'
    }
  ];

  const useCases = [
    {
      title: 'Freelancers & Contractors',
      description: 'Review client contracts for liability, payment terms, and IP rights',
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Renters & Tenants',
      description: 'Understand lease agreements and tenant obligations',
      icon: <FileText className="h-8 w-8 text-green-600" />
    },
    {
      title: 'Small Business Owners',
      description: 'Analyze vendor agreements, NDAs, and service contracts',
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />
    },
    {
      title: 'Job Seekers',
      description: 'Review employment contracts and non-compete clauses',
      icon: <Star className="h-8 w-8 text-amber-600" />
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      content: 'This tool saved me from signing a contract with unlimited liability. The AI spotted issues my lawyer would have charged $500 to find!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      content: 'As a non-technical founder, understanding legal docs was always scary. Now I can review contracts confidently before sending to legal.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Consultant',
      content: 'The negotiation suggestions helped me get better payment terms on three contracts this month. Absolutely worth it!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Contract<span className="text-blue-600">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 hover:bg-slate-50">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all px-6">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-2 py-0.5 rounded-full">New</Badge>
                <span className="flex items-center gap-1">
                  AI-Powered Analysis 2.0 <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Contracts made <br />
                <span className="text-blue-600">Simple & Safe</span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Stop struggling with legal jargon. Identify risks, understand obligations, and negotiate better terms in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 text-lg transition-all w-full sm:w-auto">
                    Start Analyzing Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-lg w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-8 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Free forever plan
                </div>
              </div>
            </div>

            {/* Hero Interactive Element - Cleaned up */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/50 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>

              <Card className="relative border border-slate-200 shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-blue-600"></div>
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <Badge variant="destructive" className="rounded-md shadow-none hover:bg-destructive">HIGH RISK DETECTED</Badge>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs border-slate-200 text-slate-500">Page 3 • Clause 4.2</Badge>
                  </div>
                  <CardTitle className="text-lg text-slate-900">Unlimited Liability Clause</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 bg-white">
                  <div className="bg-slate-50 p-5 rounded-xl border border-red-100 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
                    <p className="text-sm text-slate-700 font-mono leading-relaxed">
                      "The Contractor shall indemnify and hold harmless the Company from <span className="bg-red-100 text-red-700 px-1 rounded font-semibold border-b-2 border-red-200">any and all claims</span>, damages, losses and expenses..."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">Risk Analysis</p>
                        <p className="text-sm text-slate-600">
                          This clause places unlimited financial liability on you. Standard market practice limits liability to the contract value.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                      <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">AI Suggestion</p>
                        <p className="text-sm text-slate-600">
                          Propose a liability cap: "Liability shall not exceed the total fees paid under this Agreement..."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Element - Simplified */}
              <div className="hidden md:flex absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-200 items-center gap-4 animate-bounce duration-[3000ms]">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pass Score</p>
                  <p className="text-xl font-bold text-slate-900">94/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-100">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-3">Powerful Features</h2>
            <p className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Everything You Need to Review Contracts
            </p>
            <p className="text-xl text-slate-600">
              Powerful AI analysis tools designed to help you understand and negotiate better contract terms in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Make Informed Decisions <br />
                <span className="text-blue-600">With Confidence</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Don't sign contracts blindly. Our AI-powered platform gives you the confidence to understand what you're agreeing to and negotiate better terms.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1 text-lg">{benefit.title}</h3>
                      <p className="text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-green-100 rounded-[2.5rem] transform rotate-2"></div>
              <Card className="relative border border-slate-200 shadow-lg bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900">Contract Health Score</CardTitle>
                      <CardDescription>Overall risk assessment analysis</CardDescription>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold border border-yellow-200">
                      B+
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">Overall Risk Level</span>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 shadow-none hover:bg-yellow-200">MEDIUM RISK</Badge>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full w-full relative">
                        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-md transform -translate-x-1/2 scale-y-125 border border-slate-300" style={{ left: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Simplified */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge className="mb-6 bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700 px-4 py-1.5 text-sm">
              Target Audience
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-white">
              Perfect for Anyone <br /> Dealing with Contracts
            </h2>
            <p className="text-xl text-slate-400">
              Whether you're a freelancer, renter, or business owner, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 group shadow-none">
                <CardHeader>
                  <div className="bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-slate-600">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50">
                <CardContent className="pt-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic text-lg leading-relaxed mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to Understand <br /> Your Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are making smarter decisions about their contracts with AI-powered analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto text-lg shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 w-full sm:w-auto text-lg bg-transparent">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-8 opacity-90">
            No credit card required • Free plan available • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ContractAI</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Making legal documents accessible, understandable, and safe for everyone through advanced AI analysis.
              </p>
            </div>
            {/* ... rest of footer largely same ... */}
            <div>
              <h3 className="font-bold text-white mb-6">Product</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-6">Company</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-6">Legal</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-16 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 ContractAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}