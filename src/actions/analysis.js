'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Get analysis for a document (updated for JSONB schema)
 */
export async function getAnalysis(documentId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    // Get the analysis with all related data from JSONB columns
    const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .select(`
      *,
      document:documents!inner(id, user_id, title, file_name, file_url)
    `)
        .eq('document_id', documentId)
        .eq('document.user_id', user.id)
        .single();

    if (analysisError) {
        return { analysis: null, error: analysisError.message };
    }

    // Return the analysis with JSONB data directly
    return {
        analysis: {
            ...analysis,
            riskMetrics: analysis.risk_metrics || [],
            clauses: analysis.clauses || [],
            obligations: analysis.obligations || [],
            negotiationPoints: analysis.negotiation_points || [],
            riskAlerts: analysis.risk_alerts || [],
            roleAnalysis: analysis.role_analysis || {},
            financialExposure: analysis.financial_exposure || {},
        },
        error: null,
    };
}

/**
 * Create a new analysis (updated for JSONB schema)
 */
export async function createAnalysis(documentId, analysisData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    try {
        // Insert analysis with all data in JSONB columns
        const { data: analysis, error: analysisError } = await supabase
            .from('analyses')
            .insert([
                {
                    document_id: documentId,
                    overall_risk: analysisData.overallRisk || 'medium',
                    risk_score: analysisData.riskScore || 0,
                    complexity_score: analysisData.complexityScore || 0,
                    summary: analysisData.summary || '',
                    contract_type: analysisData.contractType || null,
                    financial_exposure: analysisData.financialExposure || {},
                    role_analysis: {
                        ...(analysisData.roleAnalysis || {}),
                        primaryRoleAnalysis: analysisData.primaryRoleAnalysis,
                        secondaryRoleAnalysis: analysisData.secondaryRoleAnalysis
                    },
                    risk_alerts: analysisData.riskAlerts || [],
                    risk_metrics: analysisData.riskMetrics || [],
                    clauses: analysisData.clauses || [],
                    obligations: analysisData.obligations || [],
                    negotiation_points: analysisData.negotiationPoints || [],
                    ai_model_version: 'gemini-2.5-flash',
                },
            ])
            .select()
            .single();

        if (analysisError) throw analysisError;

        console.log('✅ Analysis saved successfully with JSONB data');

        return { analysis, error: null };

    } catch (error) {
        console.error('❌ Create analysis error:', error);
        return { analysis: null, error: error.message };
    }
}

/**
 * Update an existing analysis
 */
export async function updateAnalysis(analysisId, updateData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { analysis: null, error: 'Not authenticated' };
    }

    try {
        // Update analysis with JSONB data
        const { data: analysis, error: analysisError } = await supabase
            .from('analyses')
            .update({
                overall_risk: updateData.overallRisk,
                risk_score: updateData.riskScore,
                complexity_score: updateData.complexityScore,
                summary: updateData.summary,
                contract_type: updateData.contractType,
                financial_exposure: updateData.financialExposure,
                role_analysis: updateData.roleAnalysis,
                risk_alerts: updateData.riskAlerts,
                risk_metrics: updateData.riskMetrics,
                clauses: updateData.clauses,
                obligations: updateData.obligations,
                negotiation_points: updateData.negotiationPoints,
                updated_at: new Date().toISOString(),
            })
            .eq('id', analysisId)
            .select()
            .single();

        if (analysisError) throw analysisError;

        return { analysis, error: null };

    } catch (error) {
        console.error('❌ Update analysis error:', error);
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
        return { analysis: null, error: 'Not authenticated' };
    }

    try {
        const { error: deleteError } = await supabase
            .from('analyses')
            .delete()
            .eq('id', analysisId);

        if (deleteError) throw deleteError;

        return { success: true, error: null };

    } catch (error) {
        console.error('❌ Delete analysis error:', error);
        return { success: false, error: error.message };
    }
}
