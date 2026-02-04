'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get analysis for a document
 */
export async function getAnalysis(documentId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    // Get the analysis with all related data
    const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .select(`
      *,
      document:documents!inner(id, user_id, title, file_name)
    `)
        .eq('document_id', documentId)
        .eq('document.user_id', user.id)
        .single();

    if (analysisError) {
        return { analysis: null, error: analysisError.message };
    }

    // Get risk metrics
    const { data: riskMetrics } = await supabase
        .from('risk_metrics')
        .select('*')
        .eq('analysis_id', analysis.id);

    // Get clauses
    const { data: clauses } = await supabase
        .from('clauses')
        .select('*')
        .eq('analysis_id', analysis.id)
        .order('risk_level', { ascending: false });

    // Get obligations
    const { data: obligations } = await supabase
        .from('obligations')
        .select('*')
        .eq('analysis_id', analysis.id)
        .order('importance', { ascending: false });

    // Get negotiation points
    const { data: negotiationPoints } = await supabase
        .from('negotiation_points')
        .select('*')
        .eq('analysis_id', analysis.id)
        .order('priority_score', { ascending: false });

    return {
        analysis: {
            ...analysis,
            riskMetrics: riskMetrics || [],
            clauses: clauses || [],
            obligations: obligations || [],
            negotiationPoints: negotiationPoints || [],
        },
        error: null,
    };
}

/**
 * Create a new analysis
 */
export async function createAnalysis(documentId, analysisData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    // Verify document ownership
    const { data: document } = await supabase
        .from('documents')
        .select('id')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

    if (!document) {
        return { analysis: null, error: 'Document not found' };
    }

    // Create analysis
    const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .insert([
            {
                document_id: documentId,
                overall_risk: analysisData.overallRisk,
                risk_score: analysisData.riskScore,
                summary: analysisData.summary,
            },
        ])
        .select()
        .single();

    if (analysisError) {
        return { analysis: null, error: analysisError.message };
    }

    // Insert risk metrics
    if (analysisData.riskMetrics && analysisData.riskMetrics.length > 0) {
        const riskMetricsData = analysisData.riskMetrics.map((metric) => ({
            analysis_id: analysis.id,
            category: metric.category,
            score: metric.score,
        }));

        await supabase.from('risk_metrics').insert(riskMetricsData);
    }

    // Insert clauses
    if (analysisData.clauses && analysisData.clauses.length > 0) {
        const clausesData = analysisData.clauses.map((clause) => ({
            analysis_id: analysis.id,
            title: clause.title,
            risk_level: clause.riskLevel,
            category: clause.category,
            page: clause.page,
            clause_text: clause.clauseText,
            explanation: clause.explanation,
            impact: clause.impact,
            suggestions: clause.suggestions,
        }));

        await supabase.from('clauses').insert(clausesData);
    }

    // Insert obligations
    if (analysisData.obligations && analysisData.obligations.length > 0) {
        const obligationsData = analysisData.obligations.map((obligation) => ({
            analysis_id: analysis.id,
            title: obligation.title,
            category: obligation.category,
            importance: obligation.importance,
            deadline: obligation.deadline,
            description: obligation.description,
            consequences: obligation.consequences,
        }));

        await supabase.from('obligations').insert(obligationsData);
    }

    // Insert negotiation points
    if (analysisData.negotiationPoints && analysisData.negotiationPoints.length > 0) {
        const negotiationPointsData = analysisData.negotiationPoints.map((point) => ({
            analysis_id: analysis.id,
            priority: point.priority,
            title: point.title,
            current_terms: point.currentTerms,
            proposed_terms: point.proposedTerms,
            rationale: point.rationale,
            talking_points: point.talkingPoints,
            priority_score: point.priorityScore,
        }));

        await supabase.from('negotiation_points').insert(negotiationPointsData);
    }

    revalidatePath('/dashboard');
    return { analysis, error: null };
}

/**
 * Delete an analysis
 */
export async function deleteAnalysis(analysisId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Delete analysis (cascading deletes will handle related records)
    const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', analysisId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    return { error: null };
}
