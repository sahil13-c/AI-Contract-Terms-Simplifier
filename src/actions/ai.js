'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyze contract text using Google Gemini AI
 */
export async function analyzeContract(contractText, documentTitle) {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('❌ GOOGLE_GEMINI_API_KEY is not set');
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }
    
    console.log('🔑 Gemini API Key is available');
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are a legal contract analysis expert. Analyze the following contract and provide a comprehensive analysis in JSON format.

Contract Title: ${documentTitle}

Contract Text:
${contractText}

Provide your analysis in the following JSON structure:
{
  "overallRisk": "low" | "medium" | "high",
  "riskScore": <number 0-100>,
  "summary": "<brief summary of the contract and main concerns>",
  "riskMetrics": [
    { "category": "liability", "score": <0-100> },
    { "category": "payment", "score": <0-100> },
    { "category": "intellectual_property", "score": <0-100> },
    { "category": "termination", "score": <0-100> },
    { "category": "confidentiality", "score": <0-100> },
    { "category": "indemnification", "score": <0-100> }
  ],
  "clauses": [
    {
      "title": "<clause title>",
      "riskLevel": "low" | "medium" | "high",
      "category": "<category>",
      "page": <page number>,
      "clauseText": "<original clause text>",
      "explanation": "<why this is risky in plain English>",
      "impact": "<potential impact>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
    }
  ],
  "obligations": [
    {
      "title": "<obligation title>",
      "category": "reporting" | "payment" | "delivery" | "confidentiality" | "communication",
      "importance": "critical" | "important" | "normal",
      "deadline": "<deadline description>",
      "description": "<what you need to do>",
      "consequences": "<what happens if you don't comply>"
    }
  ],
  "negotiationPoints": [
    {
      "priority": "high" | "medium" | "low",
      "title": "<negotiation point title>",
      "currentTerms": "<current unfavorable terms>",
      "proposedTerms": "<better alternative terms>",
      "rationale": "<why this change matters>",
      "talkingPoints": ["<talking point 1>", "<talking point 2>", ...],
      "priorityScore": <0-100>
    }
  ]
}

Important:
- Focus on identifying risky, unfair, or unusual clauses
- Explain everything in plain, simple English
- Provide actionable suggestions
- Prioritize the most important issues
- Return ONLY valid JSON, no additional text`;

    console.log('📤 Sending request to Gemini...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('📥 Received response from Gemini');
    console.log('📊 Response content length:', analysisText.length);

    if (!analysisText) {
      console.error('❌ Empty response from Gemini');
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }

    // Clean up the response - remove any markdown formatting
    let cleanedText = analysisText.trim();
    
    // Remove ```json and ``` if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace('```json', '').trim();
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.replace(/```$/, '').trim();
    }

    console.log('🔄 Parsing JSON response...');
    const analysis = JSON.parse(cleanedText);

    console.log('✅ Successfully parsed Gemini analysis');
    return { analysis, error: null };
  } catch (error) {
    console.error('❌ Gemini Analysis Error:', error);
    
    // Check for specific API quota issues
    if (error.message?.includes('quota') || error.message?.includes('billing') || error.message?.includes('rate limit')) {
      console.log('💳 API Quota Issue Detected - Using fallback analysis');
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }
    
    // Return fallback analysis instead of failing completely
    return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
  }
}

/**
 * Generate fallback analysis when AI is not available (optimized for speed)
 */
function generateFallbackAnalysis(contractText, documentTitle) {
  console.log('🔄 Using fallback analysis (AI not available)');
  
  // Basic text analysis (quick operations)
  const textLength = contractText.length;
  const wordCount = contractText.split(/\s+/).length;
  
  // Optimized term detection - use simple string matching instead of regex
  const riskyTerms = [
    { term: 'indemnif', category: 'liability', risk: 'high' }, // Partial match for indemnify/indemnification
    { term: 'liabilit', category: 'liability', risk: 'medium' }, // Partial match for liability/liabilities
    { term: 'confident', category: 'confidentiality', risk: 'medium' }, // Partial match for confidential/confidentiality
    { term: 'terminat', category: 'termination', risk: 'medium' }, // Partial match for terminate/termination
    { term: 'payment', category: 'payment', risk: 'low' },
    { term: 'intellectual', category: 'intellectual_property', risk: 'high' }
  ];
  
  const foundClauses = [];
  const lowerText = contractText.toLowerCase();
  
  // Quick term detection (much faster than regex)
  riskyTerms.forEach(({ term, category, risk }) => {
    const index = lowerText.indexOf(term);
    if (index !== -1) {
      // Get context around the term (limited to 100 chars for speed)
      const start = Math.max(0, index - 50);
      const end = Math.min(textLength, index + 50);
      const context = contractText.substring(start, end).trim();
      
      foundClauses.push({
        title: `${term.charAt(0).toUpperCase() + term.slice(1)} Clause Detected`,
        riskLevel: risk,
        category,
        page: 1,
        clauseText: context,
        explanation: `This contract contains language related to ${term}. Please review this clause carefully.`,
        impact: `May affect your ${category} obligations`,
        suggestions: ['Review with legal counsel', 'Consider negotiating terms', 'Understand full implications']
      });
    }
  });
  
  // Limit results for faster processing
  const limitedClauses = foundClauses.slice(0, 3); // Max 3 clauses for speed
  
  return {
    overallRisk: limitedClauses.length > 1 ? 'medium' : 'low',
    riskScore: Math.min(limitedClauses.length * 20, 60),
    summary: `Quick analysis of "${documentTitle}". Document contains ${wordCount} words. ${limitedClauses.length} potentially important clauses detected. For detailed AI analysis, please configure GOOGLE_GEMINI_API_KEY.`,
    riskMetrics: [
      { category: 'liability', score: limitedClauses.filter(c => c.category === 'liability').length * 25 },
      { category: 'payment', score: limitedClauses.filter(c => c.category === 'payment').length * 20 },
      { category: 'intellectual_property', score: limitedClauses.filter(c => c.category === 'intellectual_property').length * 30 },
      { category: 'termination', score: limitedClauses.filter(c => c.category === 'termination').length * 25 },
      { category: 'confidentiality', score: limitedClauses.filter(c => c.category === 'confidentiality').length * 20 },
      { category: 'indemnification', score: 25 }
    ],
    clauses: limitedClauses,
    obligations: [
      {
        title: 'Review Contract Terms',
        category: 'communication',
        importance: 'critical',
        deadline: 'Before signing',
        description: 'Carefully review all terms and conditions in this contract',
        consequences: 'Legal obligations may apply once signed'
      }
    ],
    negotiationPoints: [
      {
        priority: 'high',
        title: 'Configure AI Analysis',
        currentTerms: 'Basic pattern matching only',
        proposedTerms: 'Full AI-powered analysis with Gemini',
        rationale: 'Get detailed insights and recommendations for your contract',
        talkingPoints: ['Set up GOOGLE_GEMINI_API_KEY in .env.local', 'Visit ai.google.dev for API key'],
        priorityScore: 90
      }
    ]
  };
}

/**
 * Extract text from PDF
 */
export async function extractTextFromPDF(fileBuffer) {
  try {
    // Dynamic import to avoid SSR issues
    const pdf = require('pdf-parse');
    const data = await pdf(fileBuffer);
    return { text: data.text, pages: data.numpages, error: null };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return { text: null, pages: 0, error: error.message };
  }
}

/**
 * Process text-based document with AI analysis
 */
export async function processTextDocument(documentId, contractText, documentTitle) {
  try {
    console.log('🚀 Starting text document processing for:', documentId);
    
    // Skip PDF extraction - text is already provided
    console.log('📄 Using provided text, length:', contractText.length);
    
    if (!contractText || contractText.trim().length === 0) {
      console.error('❌ No text provided');
      throw new Error('No contract text provided');
    }
    
    console.log('✅ Text validated successfully');
    
    // Step 2: Analyze with AI
    console.log('🤖 Step 2: Analyzing with Gemini...');
    const { analysis: aiAnalysis, error: analysisError } = await analyzeContract(contractText, documentTitle);
    
    if (analysisError) {
      console.error('❌ Gemini analysis failed:', analysisError);
      throw new Error(`Gemini analysis failed: ${analysisError}`);
    }
    
    if (!aiAnalysis) {
      console.error('❌ Gemini analysis returned null');
      throw new Error('Gemini analysis returned null');
    }
    
    console.log('✅ Gemini analysis completed successfully');
    console.log('📊 Analysis summary:', aiAnalysis.summary?.substring(0, 100) + '...');
    
    // Step 3: Save analysis results to database
    console.log('💾 Step 3: Saving analysis to database...');
    const { createAnalysis } = await import('./analysis');
    const { analysis: savedAnalysis, error: saveError } = await createAnalysis(documentId, aiAnalysis);
    
    if (saveError) {
      console.error('❌ Failed to save analysis:', saveError);
      throw new Error(`Failed to save analysis: ${saveError}`);
    }
    
    if (!savedAnalysis) {
      console.error('❌ Save analysis returned null');
      throw new Error('Save analysis returned null');
    }
    
    console.log('✅ Analysis saved successfully');
    
    // Step 4: Update document status
    console.log('📝 Step 4: Updating document status...');
    const { updateDocumentStatus } = await import('./documents');
    const statusResult = await updateDocumentStatus(documentId, 'completed');
    
    if (statusResult.error) {
      console.error('❌ Failed to update status:', statusResult.error);
      throw new Error(`Failed to update status: ${statusResult.error}`);
    }
    
    console.log('🎉 Text document processing completed successfully!');
    return { analysis: savedAnalysis, error: null };
    
  } catch (error) {
    console.error('💥 Text document processing error:', error);
    
    // Update document status to failed
    try {
      console.log('🔄 Updating document status to failed...');
      const { updateDocumentStatus } = await import('./documents');
      await updateDocumentStatus(documentId, 'failed');
      console.log('✅ Status updated to failed');
    } catch (statusError) {
      console.error('❌ Failed to update document status:', statusError);
    }
    
    return { error: error.message };
  }
}

/**
 * Complete document processing pipeline
 * 1. Extract text from PDF
 * 2. Analyze with AI
 * 3. Save results to database
 */
export async function processDocument(documentId, fileBuffer, documentTitle) {
  try {
    console.log('🚀 Starting document processing for:', documentId);
    
    // Step 1: Extract text from PDF
    console.log('📄 Step 1: Extracting text from PDF...');
    const { text: contractText, pages, error: extractError } = await extractTextFromPDF(fileBuffer);
    
    if (extractError) {
      console.error('❌ PDF extraction failed:', extractError);
      throw new Error(`PDF extraction failed: ${extractError}`);
    }
    
    if (!contractText || contractText.trim().length === 0) {
      console.error('❌ No text extracted from PDF');
      throw new Error('No text could be extracted from the PDF');
    }
    
    console.log(`✅ Text extracted successfully, pages: ${pages}, text length: ${contractText.length}`);
    
    // Step 2: Analyze with AI
    console.log('🤖 Step 2: Analyzing with Gemini...');
    const { analysis: aiAnalysis, error: analysisError } = await analyzeContract(contractText, documentTitle);
    
    if (analysisError) {
      console.error('❌ Gemini analysis failed:', analysisError);
      throw new Error(`Gemini analysis failed: ${analysisError}`);
    }
    
    if (!aiAnalysis) {
      console.error('❌ Gemini analysis returned null');
      throw new Error('Gemini analysis returned null');
    }
    
    console.log('✅ Gemini analysis completed successfully');
    console.log('📊 Analysis summary:', aiAnalysis.summary?.substring(0, 100) + '...');
    
    // Step 3: Save analysis results to database
    console.log('💾 Step 3: Saving analysis to database...');
    const { createAnalysis } = await import('./analysis');
    const { analysis: savedAnalysis, error: saveError } = await createAnalysis(documentId, aiAnalysis);
    
    if (saveError) {
      console.error('❌ Failed to save analysis:', saveError);
      throw new Error(`Failed to save analysis: ${saveError}`);
    }
    
    if (!savedAnalysis) {
      console.error('❌ Save analysis returned null');
      throw new Error('Save analysis returned null');
    }
    
    console.log('✅ Analysis saved successfully');
    
    // Step 4: Update document status
    console.log('📝 Step 4: Updating document status...');
    const { updateDocumentStatus } = await import('./documents');
    const statusResult = await updateDocumentStatus(documentId, 'completed');
    
    if (statusResult.error) {
      console.error('❌ Failed to update status:', statusResult.error);
      throw new Error(`Failed to update status: ${statusResult.error}`);
    }
    
    console.log('🎉 Document processing completed successfully!');
    return { analysis: savedAnalysis, error: null };
    
  } catch (error) {
    console.error('💥 Document processing error:', error);
    
    // Update document status to failed
    try {
      console.log('🔄 Updating document status to failed...');
      const { updateDocumentStatus } = await import('./documents');
      await updateDocumentStatus(documentId, 'failed');
      console.log('✅ Status updated to failed');
    } catch (statusError) {
      console.error('❌ Failed to update document status:', statusError);
    }
    
    return { error: error.message };
  }
}
