-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  pages INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  overall_risk TEXT NOT NULL CHECK (overall_risk IN ('low', 'medium', 'high')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create risk_metrics table
CREATE TABLE IF NOT EXISTS risk_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100)
);

-- Create clauses table
CREATE TABLE IF NOT EXISTS clauses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  category TEXT NOT NULL,
  page INTEGER,
  clause_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  impact TEXT NOT NULL,
  suggestions JSONB DEFAULT '[]'::jsonb
);

-- Create obligations table
CREATE TABLE IF NOT EXISTS obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  importance TEXT NOT NULL CHECK (importance IN ('critical', 'important', 'normal')),
  deadline TEXT NOT NULL,
  description TEXT NOT NULL,
  consequences TEXT
);

-- Create negotiation_points table
CREATE TABLE IF NOT EXISTS negotiation_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  current_terms TEXT NOT NULL,
  proposed_terms TEXT NOT NULL,
  rationale TEXT NOT NULL,
  talking_points JSONB DEFAULT '[]'::jsonb,
  priority_score INTEGER CHECK (priority_score >= 0 AND priority_score <= 100)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_risk_metrics_analysis_id ON risk_metrics(analysis_id);
CREATE INDEX IF NOT EXISTS idx_clauses_analysis_id ON clauses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_obligations_analysis_id ON obligations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_points_analysis_id ON negotiation_points(analysis_id);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_points ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for analyses (through documents)
CREATE POLICY "Users can view analyses of their documents"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = analyses.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analyses for their documents"
  ON analyses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = analyses.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analyses of their documents"
  ON analyses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = analyses.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create RLS policies for risk_metrics
CREATE POLICY "Users can view risk_metrics of their analyses"
  ON risk_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = risk_metrics.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert risk_metrics for their analyses"
  ON risk_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = risk_metrics.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create RLS policies for clauses
CREATE POLICY "Users can view clauses of their analyses"
  ON clauses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = clauses.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert clauses for their analyses"
  ON clauses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = clauses.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create RLS policies for obligations
CREATE POLICY "Users can view obligations of their analyses"
  ON obligations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = obligations.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert obligations for their analyses"
  ON obligations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = obligations.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create RLS policies for negotiation_points
CREATE POLICY "Users can view negotiation_points of their analyses"
  ON negotiation_points FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = negotiation_points.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert negotiation_points for their analyses"
  ON negotiation_points FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analyses
      JOIN documents ON documents.id = analyses.document_id
      WHERE analyses.id = negotiation_points.analysis_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
