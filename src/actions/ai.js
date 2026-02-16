'use server';
import PDFParser from 'pdf2json';

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extract text from PDF using pdf2json (Node.js compatible)
 */
export async function extractTextFromPDF(fileBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser(null, 1); // 1 = text content only

      pdfParser.on("pdfParser_dataError", errData => {
        console.error('PDF Parser Error:', errData.parserError);
        reject(new Error(errData.parserError));
      });

      pdfParser.on("pdfParser_dataReady", pdfData => {
        try {
          // Extract text from pages
          // pdf2json returns URL-encoded text, so we need to decode it
          const text = pdfData.Pages.map(page => {
            return page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ');
          }).join('\n\n');

          resolve({
            text,
            pages: pdfData.Pages.length,
            error: null
          });
        } catch (error) {
          console.error('Error parsing PDF data:', error);
          reject(error);
        }
      });

      // Parse the buffer
      pdfParser.parseBuffer(fileBuffer);
    } catch (error) {
      console.error('PDF parsing setup error:', error);
      reject(error);
    }
  });
}

/**
 * Robustly sanitize and parse JSON from AI responses
 */
function sanitizeJSON(text) {
  try {
    // 1. Clean up potential markdown formatting
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace('```json', '').trim();
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```/, '').trim();
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.replace(/```$/, '').trim();
    }

    // 2. Remove comments that LLMs sometimes include
    cleanedText = cleanedText.replace(/\/\/.*$/gm, '');

    // 3. Handle trailing commas which are invalid in JSON
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, '$1');

    // 4. Try to find the first '{' and last '}' to isolate the JSON object
    const startIdx = cleanedText.indexOf('{');
    const endIdx = cleanedText.lastIndexOf('}');

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleanedText = cleanedText.substring(startIdx, endIdx + 1);
    }

    return cleanedText;
  } catch (error) {
    console.error('Error sanitizing JSON:', error);
    return text;
  }
}

/**
 * Analyze contract text using Google Gemini AI
 */
export async function analyzeContract(contractText, documentTitle, retryCount = 0) {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('❌ GOOGLE_GEMINI_API_KEY is not set');
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }

    console.log(`🔑 Gemini API Key is available (Attempt ${retryCount + 1})`);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // Updated to 2.5-flash as requested
    });

    const prompt = `You are a legal contract analysis expert. Analyze the following contract and provide a comprehensive, deep analysis in JSON format.
Focus on identifying risky, unfair, or unusual clauses, and provide actionable suggestions in plain English.

Contract Title: ${documentTitle}

Contract Text (Snippet):
${contractText.substring(0, 50000)}

Provide your analysis in this EXACT JSON structure:
{
  "contractType": "employment" | "rental" | "service" | "nda" | "partnership" | "freelance" | "sales" | "other",
  "overallRisk": "low" | "medium" | "high",
  "riskScore": 0-100,
  "complexityScore": 0-100,
  "summary": "brief summary",
  "financialExposure": {
    "estimatedCosts": "estimated costs or fees mentioned",
    "penalties": "potential penalties or fines",
    "liabilityCaps": "liability limitations or caps",
    "bestCase": "best case financial scenario",
    "worstCase": "worst case financial scenario"
  },
  "roleAnalysis": {
    "primaryRole": "role name",
    "secondaryRole": "role name",
    "primaryPerspective": {
      "risks": ["risk 1", "risk 2"],
      "benefits": ["benefit 1", "benefit 2"],
      "keyConsiderations": ["consideration 1", "consideration 2"]
    },
    "secondaryPerspective": {
      "risks": ["risk 1", "risk 2"],
      "benefits": ["benefit 1", "benefit 2"],
      "keyConsiderations": ["consideration 1", "consideration 2"]
    }
  },
  "riskMetrics": [
    { "category": "liability", "score": 0-100 },
    { "category": "payment", "score": 0-100 },
    { "category": "intellectual_property", "score": 0-100 },
    { "category": "termination", "score": 0-100 },
    { "category": "confidentiality", "score": 0-100 },
    { "category": "indemnification", "score": 0-100 }
  ],
  "clauses": [
    {
      "title": "clause title",
      "riskLevel": "high" | "medium" | "low",
      "category": "category",
      "page": number,
      "clauseText": "original clause text snippet",
      "explanation": "why this is risky in plain English",
      "impact": "potential impact",
      "suggestions": ["suggestion 1", "suggestion 2"],
      "financialImpact": "specific financial impact if applicable"
    }
  ],
  "obligations": [
    {
      "title": "obligation title",
      "category": "reporting" | "payment" | "delivery" | "confidentiality" | "communication",
      "importance": "critical" | "important" | "normal",
      "deadline": "deadline description",
      "description": "what you need to do",
      "consequences": "what happens if you don't comply"
    }
  ],
  "negotiationPoints": [
    {
      "priority": "high" | "medium" | "low",
      "title": "negotiation point title",
      "currentTerms": "current unfavorable terms",
      "proposedTerms": "better alternative terms",
      "rationale": "why this change matters",
      "talkingPoints": ["point 1", "point 2"],
      "priorityScore": 0-100
    }
  ],
  "riskAlerts": [
    {
      "severity": "critical" | "high" | "medium",
      "title": "alert title",
      "message": "clear warning message",
      "icon": "money" | "liability" | "time" | "legal"
    }
  ]
}

Important:
- Detect the contract type accurately.
- Calculate complexity score based on document length, legal jargon density, and number of complex clauses.
- Provide detailed financial exposure analysis with specific amounts when mentioned.
- Generate role-based analysis from both perspectives (e.g., employee vs employer).
- Create risk alerts for critical issues like "This clause can cost you money" or "Unlimited liability detected".
- Explain everything in plain, simple English.
- Return ONLY valid JSON. No preamble, no postscript.`;

    console.log('📤 Sending request to Gemini...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('📥 Received response from Gemini. Length:', analysisText.length);

    if (!analysisText) {
      console.error('❌ Empty response from Gemini');
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }

    console.log('🔄 Sanitizing and parsing JSON response...');
    const cleanedText = sanitizeJSON(analysisText);

    try {
      const analysis = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed Gemini analysis');
      return { analysis, error: null };
    } catch (parseError) {
      console.error('❌ JSON Parse Error after sanitization:', parseError.message);
      return { analysis: generateFallbackAnalysis(contractText, documentTitle), error: null };
    }
  } catch (error) {
    console.error('❌ Gemini Analysis Error:', error);

    // Handle Rate Limit (429) with Retry
    if (error.status === 429 && retryCount < 2) {
      const delayTime = Math.pow(2, retryCount) * 1000 + (Math.random() * 1000); // Exponential backoff
      console.log(`⚠️ Rate limit hit. Retrying in ${Math.round(delayTime)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayTime));
      return analyzeContract(contractText, documentTitle, retryCount + 1);
    }

    return {
      analysis: generateFallbackAnalysis(contractText, documentTitle, error.status === 429),
      error: null
    };
  }
}


/**
 * Generate fallback analysis when AI is not available (enriched for better UI compatibility)
 */
function generateFallbackAnalysis(contractText, documentTitle, isQuotaError = false) {
  console.log(`🔄 Using fallback analysis (AI not available). Quota issue: ${isQuotaError}`);

  // Basic text analysis (quick operations)
  const textLength = contractText.length;
  const wordCount = contractText.split(/\s+/).length;

  // Optimized term detection - use simple string matching instead of regex
  const riskyTerms = [
    { term: 'indemnif', category: 'liability', risk: 'high' },
    { term: 'liabilit', category: 'liability', risk: 'medium' },
    { term: 'confident', category: 'confidentiality', risk: 'medium' },
    { term: 'terminat', category: 'termination', risk: 'medium' },
    { term: 'payment', category: 'payment', risk: 'low' },
    { term: 'intellectual', category: 'intellectual_property', risk: 'high' }
  ];

  const foundClauses = [];
  const lowerText = contractText.toLowerCase();

  riskyTerms.forEach(({ term, category, risk }) => {
    const index = lowerText.indexOf(term);
    if (index !== -1) {
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

  const limitedClauses = foundClauses.slice(0, 3);

  // Determine potential contract type based on keywords
  let contractType = 'other';
  if (lowerText.includes('employment') || lowerText.includes('employee')) contractType = 'employment';
  else if (lowerText.includes('rent') || lowerText.includes('lease')) contractType = 'rental';
  else if (lowerText.includes('nda') || lowerText.includes('confidentiality')) contractType = 'nda';

  const summaryMessage = isQuotaError
    ? `⚠️ AI QUOTA REACHED: This is a "Quick Analysis" because the AI service (Gemini) hit its free tier limit. Please wait a few minutes or update your API key for a full deep analysis.`
    : `Quick analysis of "${documentTitle}". Document contains ${wordCount} words. ${limitedClauses.length} potentially important clauses detected.`;

  return {
    contractType,
    overallRisk: limitedClauses.length > 2 ? 'high' : (limitedClauses.length > 0 ? 'medium' : 'low'),
    riskScore: Math.min(limitedClauses.length * 25, 80),
    complexityScore: Math.min(Math.round(wordCount / 100), 100),
    summary: summaryMessage,
    financialExposure: {
      estimatedCosts: "Check 'Payment' sections in document",
      penalties: "Potential termination or breach penalties",
      liabilityCaps: "Check 'Liability' sections",
      bestCase: "Smooth contract fulfillment",
      worstCase: "Legal dispute or financial penalty"
    },
    roleAnalysis: {
      primaryRole: "Client/User",
      secondaryRole: "Counterparty",
      primaryPerspective: {
        risks: ["Limited visibility in quick analysis", "Terms may vary by jurisdiction"],
        benefits: ["Basic structure identified"],
        keyConsiderations: ["Manual review required due to AI quota"]
      }
    },
    riskMetrics: [
      { category: 'liability', score: limitedClauses.filter(c => c.category === 'liability').length * 40 },
      { category: 'payment', score: limitedClauses.filter(c => c.category === 'payment').length * 30 },
      { category: 'intellectual_property', score: limitedClauses.filter(c => c.category === 'intellectual_property').length * 40 },
      { category: 'termination', score: limitedClauses.filter(c => c.category === 'termination').length * 35 },
      { category: 'confidentiality', score: limitedClauses.filter(c => c.category === 'confidentiality').length * 30 },
      { category: 'indemnification', score: 40 }
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
        title: 'Perform Full AI Analysis',
        currentTerms: 'Currently viewing limited quick analysis',
        proposedTerms: 'Full AI-powered deep analysis',
        rationale: isQuotaError ? 'AI Quota reached' : 'AI key not configured',
        talkingPoints: ['Wait a few minutes for quota reset', 'Update GOOGLE_GEMINI_API_KEY if needed'],
        priorityScore: 90
      }
    ],
    riskAlerts: isQuotaError ? [
      {
        severity: 'high',
        title: 'AI Rate Limit Reached',
        message: 'The AI analysis is currently restricted due to API limits. You are seeing a basic pattern-match analysis.',
        icon: 'legal'
      }
    ] : []
  };
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
