'use server';

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analyze contract text using Anthropic Claude
 */
export async function analyzeContract(contractText, documentTitle) {
  try {
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

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.3,
      system: 'You are a legal contract analysis expert. You analyze contracts and identify risks, obligations, and negotiation points. Always respond with valid JSON only.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const analysisText = response.content[0].text;
    const analysis = JSON.parse(analysisText);

    return { analysis, error: null };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return { analysis: null, error: error.message };
  }
}

/**
 * Extract text from PDF (placeholder - requires pdf-parse)
 * You'll need to install: npm install pdf-parse
 */
export async function extractTextFromPDF(fileBuffer) {
  try {
    // This is a placeholder - you'll need to implement PDF parsing
    // const pdf = require('pdf-parse');
    // const data = await pdf(fileBuffer);
    // return { text: data.text, pages: data.numpages, error: null };

    return {
      text: null,
      pages: 0,
      error: 'PDF parsing not implemented yet. Install pdf-parse package.',
    };
  } catch (error) {
    return { text: null, pages: 0, error: error.message };
  }
}
