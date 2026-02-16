-- =====================================================
-- AI Contract Terms Simplifier - Complete Database Schema
-- =====================================================
-- This migration creates all necessary tables, policies, and storage
-- for the AI Contract Analysis application
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Documents Table
-- Stores uploaded contract documents with metadata
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    pages INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

-- Analyses Table
-- Stores AI-generated contract analysis with JSONB fields for complex data
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    overall_risk TEXT NOT NULL DEFAULT 'medium' CHECK (overall_risk IN ('low', 'medium', 'high')),
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    complexity_score INTEGER NOT NULL DEFAULT 0 CHECK (complexity_score >= 0 AND complexity_score <= 100),
    summary TEXT,
    contract_type TEXT CHECK (contract_type IN ('employment', 'rental', 'service', 'nda', 'partnership', 'freelance', 'sales', 'other')),
    
    -- JSONB columns for complex nested data
    financial_exposure JSONB DEFAULT '{}'::jsonb,
    role_analysis JSONB DEFAULT '{}'::jsonb,
    risk_alerts JSONB DEFAULT '[]'::jsonb,
    risk_metrics JSONB DEFAULT '[]'::jsonb,
    clauses JSONB DEFAULT '[]'::jsonb,
    obligations JSONB DEFAULT '[]'::jsonb,
    negotiation_points JSONB DEFAULT '[]'::jsonb,
    
    ai_model_version TEXT DEFAULT 'gemini-2.5-flash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on document_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON public.analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_analyses_overall_risk ON public.analyses(overall_risk);
CREATE INDEX IF NOT EXISTS idx_analyses_contract_type ON public.analyses(contract_type);

-- Create GIN indexes for JSONB columns to enable efficient querying
CREATE INDEX IF NOT EXISTS idx_analyses_risk_metrics ON public.analyses USING GIN (risk_metrics);
CREATE INDEX IF NOT EXISTS idx_analyses_clauses ON public.analyses USING GIN (clauses);
CREATE INDEX IF NOT EXISTS idx_analyses_obligations ON public.analyses USING GIN (obligations);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own documents
CREATE POLICY "Users can view their own documents"
    ON public.documents
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert their own documents"
    ON public.documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own documents"
    ON public.documents
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
    ON public.documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on analyses table
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view analyses for their own documents
CREATE POLICY "Users can view analyses for their own documents"
    ON public.analyses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = analyses.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- Policy: Users can insert analyses for their own documents
CREATE POLICY "Users can insert analyses for their own documents"
    ON public.analyses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = analyses.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- Policy: Users can update analyses for their own documents
CREATE POLICY "Users can update analyses for their own documents"
    ON public.analyses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = analyses.document_id
            AND documents.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = analyses.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- Policy: Users can delete analyses for their own documents
CREATE POLICY "Users can delete analyses for their own documents"
    ON public.analyses
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE documents.id = analyses.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- =====================================================
-- STORAGE BUCKET
-- =====================================================

-- Create storage bucket for documents (PDFs)
-- Note: This needs to be run in Supabase Dashboard or via Supabase CLI
-- as storage buckets are not created via SQL migrations directly

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('documents', 'documents', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
-- Policy: Users can upload files to their own folder
-- CREATE POLICY "Users can upload their own documents"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--         bucket_id = 'documents' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- Policy: Users can view their own files
-- CREATE POLICY "Users can view their own documents"
--     ON storage.objects
--     FOR SELECT
--     USING (
--         bucket_id = 'documents' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- Policy: Users can delete their own files
-- CREATE POLICY "Users can delete their own documents"
--     ON storage.objects
--     FOR DELETE
--     USING (
--         bucket_id = 'documents' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for documents table
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for analyses table
DROP TRIGGER IF EXISTS update_analyses_updated_at ON public.analyses;
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.documents IS 'Stores uploaded contract documents with metadata and processing status';
COMMENT ON TABLE public.analyses IS 'Stores AI-generated contract analysis with JSONB fields for complex nested data structures';

COMMENT ON COLUMN public.documents.status IS 'Processing status: pending, processing, completed, or failed';
COMMENT ON COLUMN public.documents.file_url IS 'Public URL to the uploaded PDF file in Supabase Storage';
COMMENT ON COLUMN public.documents.pages IS 'Number of pages in the PDF document';

COMMENT ON COLUMN public.analyses.risk_score IS 'Overall risk score from 0-100';
COMMENT ON COLUMN public.analyses.complexity_score IS 'Document complexity score from 0-100 based on length, jargon, and clause count';
COMMENT ON COLUMN public.analyses.financial_exposure IS 'JSONB: Contains estimatedCosts, penalties, liabilityCaps, bestCase, worstCase';
COMMENT ON COLUMN public.analyses.role_analysis IS 'JSONB: Contains primaryRole, secondaryRole, and perspective analysis for each role';
COMMENT ON COLUMN public.analyses.risk_alerts IS 'JSONB array: Critical alerts with severity, title, message, and icon';
COMMENT ON COLUMN public.analyses.risk_metrics IS 'JSONB array: Risk scores by category (liability, payment, IP, termination, etc.)';
COMMENT ON COLUMN public.analyses.clauses IS 'JSONB array: Detailed clause analysis with risk levels, explanations, and suggestions';
COMMENT ON COLUMN public.analyses.obligations IS 'JSONB array: Key obligations with deadlines, importance, and consequences';
COMMENT ON COLUMN public.analyses.negotiation_points IS 'JSONB array: Suggested negotiation points with current/proposed terms and talking points';

-- =====================================================
-- SAMPLE QUERIES FOR REFERENCE
-- =====================================================

-- Get all documents for a user with their analysis status
-- SELECT 
--     d.id,
--     d.title,
--     d.status,
--     d.created_at,
--     CASE WHEN a.id IS NOT NULL THEN true ELSE false END as has_analysis,
--     a.overall_risk,
--     a.risk_score
-- FROM documents d
-- LEFT JOIN analyses a ON d.id = a.document_id
-- WHERE d.user_id = auth.uid()
-- ORDER BY d.created_at DESC;

-- Get high-risk clauses from all analyses
-- SELECT 
--     d.title,
--     clause->>'title' as clause_title,
--     clause->>'riskLevel' as risk_level,
--     clause->>'explanation' as explanation
-- FROM analyses a
-- JOIN documents d ON a.document_id = d.id
-- CROSS JOIN LATERAL jsonb_array_elements(a.clauses) as clause
-- WHERE clause->>'riskLevel' = 'high'
-- AND d.user_id = auth.uid();

-- =====================================================
-- END OF MIGRATION
-- =====================================================
