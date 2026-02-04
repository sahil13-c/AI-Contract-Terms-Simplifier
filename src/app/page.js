'use client';

import { useState } from 'react';
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
  MessageSquare,
  Plus
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI breaks down complex legal jargon into simple, understandable language.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: 'Risk Detection',
      description: 'Automatically identifies and highlights potentially risky clauses in your contracts.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Negotiation Points',
      description: 'Get smart suggestions on what to negotiate and how to improve contract terms.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detailed Reports',
      description: 'Comprehensive clause-by-clause breakdown with risk ratings and explanations.',
      color: 'from-green-500 to-emerald-600'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ContractAI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Legal Analysis
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Understand Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Contracts </span>
              in Plain English
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Stop struggling with legal jargon. Our AI analyzes your contracts, identifies risks, and suggests better terms — all in simple language you can understand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
                  Start Analyzing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-2xl"></div>
            <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="destructive">HIGH RISK</Badge>
                  <Badge variant="outline">Page 3</Badge>
                </div>
                <CardTitle className="text-lg">Unlimited Liability Clause Detected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-slate-700 italic">
                    "The Contractor agrees to indemnify and hold harmless the Company from any and all claims..."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">
                      This clause places unlimited financial liability on you for any issues arising from your work.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">
                      <strong>Suggestion:</strong> Request a liability cap equal to the total contract value.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200">
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Review Contracts
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful AI analysis tools designed to help you understand and negotiate better contract terms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Make Informed Decisions About Your Contracts
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Don't sign contracts blindly. Our AI-powered platform gives you the confidence to understand what you're agreeing to and negotiate better terms.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white/60 backdrop-blur border border-slate-200">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl opacity-20 blur-2xl"></div>
              <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Freelance Contract Analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Overall Risk</span>
                      <Badge variant="warning">MEDIUM</Badge>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Liability Clauses</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <span className="text-red-600 font-medium">High</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Payment Terms</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-green-600 font-medium">Low</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">IP Rights</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-yellow-600 font-medium">Medium</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Found Issues</span>
                      <span className="text-2xl font-bold text-slate-900">7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Who It's For
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Perfect for Anyone Dealing with Contracts
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Whether you're a freelancer, renter, or business owner, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-white">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Understand Your Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making smarter decisions about their contracts with AI-powered analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-6">
            No credit card required • Free plan available • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ContractAI</span>
              </div>
              <p className="text-sm text-slate-400">
                Making legal documents accessible to everyone through AI-powered analysis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Use Cases</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 ContractAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}