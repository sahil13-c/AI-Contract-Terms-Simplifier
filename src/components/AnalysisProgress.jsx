'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, FileText, Search, BrainCircuit, BarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
    { id: 'preparing', label: 'Preparing Document', icon: FileText, duration: 1500 },
    { id: 'scanning', label: 'Scanning Clauses', icon: Search, duration: 3000 },
    { id: 'analyzing', label: 'AI Risk Analysis', icon: BrainCircuit, duration: 5000 },
    { id: 'scoring', label: 'Calculating Scores', icon: BarChart, duration: 2000 },
];

export function AnalysisProgress({ onComplete }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime = Date.now();
        let stepDuration = steps[currentStepIndex].duration;
        let animationFrame;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const stepProgress = Math.min((elapsed / stepDuration) * 100, 100);

            setProgress(stepProgress);

            if (elapsed < stepDuration) {
                animationFrame = requestAnimationFrame(updateProgress);
            } else {
                if (currentStepIndex < steps.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                    // Reset for next step
                    startTime = Date.now();
                    stepDuration = steps[currentStepIndex + 1].duration;
                    setProgress(0);
                    animationFrame = requestAnimationFrame(updateProgress);
                } else {
                    // All steps done (visual simulation only, real completion depends on backend)
                    // If backend is still processing, we might stay on last step or show "Finalizing..."
                }
            }
        };

        animationFrame = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrame);
    }, [currentStepIndex]);

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4 relative"
                >
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-20"></div>
                    <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">
                    Analyzing Document
                </h2>
                <p className="text-muted-foreground">
                    Our AI is reviewing your contract details...
                </p>
            </div>

            <Card className="overflow-hidden bg-white dark:bg-slate-900 border-border shadow-sm">
                <CardContent className="p-0">
                    <div className="relative">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0.5 }}
                                    animate={{
                                        opacity: isCurrent || isCompleted ? 1 : 0.4,
                                        backgroundColor: isCurrent ? 'var(--bg-muted)' : 'transparent'
                                    }}
                                    className={`flex items-center p-4 border-b border-border last:border-0 relative overflow-hidden ${isCurrent ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                                >
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-[2px] bg-blue-600 z-10"
                                            style={{ width: `${progress}%` }}
                                            transition={{ ease: "linear" }}
                                        />
                                    )}

                                    <div className={`mr-4 p-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' :
                                        isCurrent ? 'bg-blue-100 text-blue-600' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <Icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-semibold text-sm text-foreground">{step.label}</div>
                                        {isCurrent && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {Math.round(progress)}%
                                            </div>
                                        )}
                                    </div>

                                    {isCurrent && (
                                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6 animate-pulse">
                This usually takes about 1-2 minutes. You can leave this page and come back later.
            </p>
        </div>
    );
}
