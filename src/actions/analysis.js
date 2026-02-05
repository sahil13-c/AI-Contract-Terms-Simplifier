'use server';

import { createClient } from '@/lib/supabase/server';

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
 * Create a new analysis with optimized batch operations
 */
export async function createAnalysis(documentId, analysisData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    try {
        // Start transaction for all operations
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

        if (analysisError) throw analysisError;

        // Prepare all data for batch insertion
        const batchOperations = [];

        // Risk metrics batch
        if (analysisData.riskMetrics?.length > 0) {
            const riskMetricsData = analysisData.riskMetrics.map((metric) => ({
                analysis_id: analysis.id,
                category: metric.category,
                score: metric.score,
            }));
            batchOperations.push(
                supabase.from('risk_metrics').insert(riskMetricsData)
            );
        }

        // Clauses batch
        if (analysisData.clauses?.length > 0) {
            const clausesData = analysisData.clauses.map((clause) => ({
                analysis_id: analysis.id,
                title: clause.title,
                risk_level: clause.riskLevel,
                category: clause.category,
                page: clause.page || 1,
                clause_text: clause.clauseText,
                explanation: clause.explanation,
                impact: clause.impact,
                suggestions: clause.suggestions,
            }));
            batchOperations.push(
                supabase.from('clauses').insert(clausesData)
            );
        }

        // Obligations batch
        if (analysisData.obligations?.length > 0) {
            const obligationsData = analysisData.obligations.map((obligation) => ({
                analysis_id: analysis.id,
                title: obligation.title,
                category: obligation.category,
                importance: obligation.importance,
                deadline: obligation.deadline,
                description: obligation.description,
                consequences: obligation.consequences,
            }));
            batchOperations.push(
                supabase.from('obligations').insert(obligationsData)
            );
        }

        // Negotiation points batch
        if (analysisData.negotiationPoints?.length > 0) {
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
            batchOperations.push(
                supabase.from('negotiation_points').insert(negotiationPointsData)
            );
        }

        // Execute all batch operations in parallel
        const results = await Promise.allSettled(batchOperations);
        
        // Check for any errors in batch operations
        const errors = results.filter(result => result.status === 'rejected');
        if (errors.length > 0) {
            console.error('Some batch operations failed:', errors);
            // Don't fail the entire analysis if some operations fail
        }

        return { analysis, error: null };

    } catch (error) {
        console.error('Create analysis error:', error);
        return { analysis: null, error: error.message };
    }
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

    return { error: null };
}
