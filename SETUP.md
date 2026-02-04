# ContractAI - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- OpenAI API key (or Anthropic API key)

## Step 1: Install Dependencies

```bash
npm install openai
# OR for Anthropic
npm install @anthropic-ai/sdk
```

## Step 2: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database-schema.sql`
4. Paste and run the SQL in the editor
5. This will create all tables, indexes, and security policies

## Step 3: Configure Environment Variables

Update your `.env.local` file:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add these new variables:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

**To get your service role key:**
1. Go to Supabase Dashboard > Settings > API
2. Copy the `service_role` key (keep this secret!)

**To get OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key

## Step 4: Test the Application

```bash
npm run dev
```

Visit http://localhost:3000

## Features Implemented

### ✅ Authentication
- `/login` - User login
- `/signup` - User registration
- Protected routes with middleware

### ✅ Dashboard
- `/dashboard` - Main dashboard
- Document upload with drag & drop
- Document list with status indicators
- Delete documents

### ✅ Analysis
- `/analysis/[id]` - View analysis results
- Risk assessment with scores
- Risky clauses identification
- Obligations tracking
- Negotiation points

### ✅ Backend Actions
- `actions/auth.js` - Authentication
- `actions/documents.js` - Document management
- `actions/upload.js` - File upload to Supabase Storage
- `actions/analysis.js` - Analysis CRUD
- `actions/ai.js` - AI contract analysis

## How It Works

1. **User signs up/logs in** → Supabase Auth
2. **User uploads PDF** → Supabase Storage
3. **Document record created** → Database
4. **AI analyzes contract** → OpenAI GPT-4
5. **Results saved** → Database (analyses, clauses, obligations, etc.)
6. **User views analysis** → Analysis page

## Next Steps (Optional Enhancements)

1. **Implement PDF parsing**
   ```bash
   npm install pdf-parse
   ```
   Update `actions/ai.js` to extract text from PDFs

2. **Add background job processing**
   - Use Supabase Edge Functions or Vercel Cron
   - Process analysis asynchronously

3. **Add export functionality**
   - Export analysis as PDF report
   - Use libraries like `jspdf` or `react-pdf`

4. **Add pricing/subscriptions**
   - Integrate Stripe
   - Limit free tier usage

5. **Email notifications**
   - Use Supabase Auth email templates
   - Send analysis completion emails

## Troubleshooting

### "Module not found" errors
Run: `npm install`

### Authentication not working
- Check `.env.local` has correct Supabase credentials
- Verify database schema is created
- Check RLS policies are enabled

### File upload fails
- Verify storage bucket `documents` exists in Supabase
- Check storage policies are created
- Ensure file is PDF and under 10MB

### AI analysis fails
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Review console for error messages

## Project Structure

```
src/
├── actions/           # Server actions
├── app/
│   ├── (auth)/       # Auth pages
│   ├── (dashboard)/  # Dashboard pages
│   ├── demo/         # Demo page
│   └── page.js       # Landing page
├── components/       # React components
└── lib/             # Utilities
```

## Support

For issues or questions, check:
- Supabase docs: https://supabase.com/docs
- OpenAI docs: https://platform.openai.com/docs
- Next.js docs: https://nextjs.org/docs
