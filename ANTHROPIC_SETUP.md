# Anthropic Claude Integration Guide

## ✅ Updated to Use Anthropic Claude

Your project now uses **Anthropic's Claude 3.5 Sonnet** instead of OpenAI. Claude is excellent for legal contract analysis!

## Step 1: Install Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

## Step 2: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy your API key

## Step 3: Add API Key to .env.local

Open `.env.local` and add:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

Replace `sk-ant-api03-xxxxx` with your actual API key.

## Step 4: Test the Integration

1. Start dev server: `npm run dev`
2. Sign up/login
3. Upload a contract PDF
4. The AI will analyze it using Claude!

## What Changed

### Updated File: `src/actions/ai.js`
- ✅ Switched from OpenAI to Anthropic
- ✅ Using Claude 3.5 Sonnet model
- ✅ Same JSON output format
- ✅ Better for legal analysis

### Model Details
- **Model**: `claude-3-5-sonnet-20241022`
- **Max Tokens**: 8000
- **Temperature**: 0.3 (precise, consistent)

## Why Claude for Legal Analysis?

✅ Better at understanding legal language  
✅ More accurate risk assessment  
✅ Clearer explanations  
✅ Longer context window (200k tokens)  
✅ Better at following JSON format

## Pricing

Claude 3.5 Sonnet pricing:
- Input: $3 per million tokens
- Output: $15 per million tokens

A typical contract analysis costs ~$0.10-0.30

## Troubleshooting

**Error: "API key not found"**
- Make sure `ANTHROPIC_API_KEY` is in `.env.local`
- Restart dev server after adding the key

**Error: "Invalid API key"**
- Check your API key is correct
- Make sure it starts with `sk-ant-`

**Error: "Rate limit exceeded"**
- You've hit your usage limit
- Check your Anthropic console for limits
