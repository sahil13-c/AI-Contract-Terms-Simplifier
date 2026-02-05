# 🚀 How to Use Your AI Contract/Term Simplifier App

## **Quick Start Guide**

### **1. Access Your App**
```bash
cd my-app
npm run dev
```
Open: http://localhost:3000

---

## **2. User Registration & Login**

### **Sign Up (New Users)**
1. Go to http://localhost:3000
2. Click **"Get Started Free"** button
3. Fill in:
   - Email address
   - Password
   - Confirm password
4. Click **"Sign Up"**

### **Login (Existing Users)**
1. Go to http://localhost:3000
2. Click **"Sign In"** button (top right)
3. Enter:
   - Email address
   - Password
4. Click **"Sign In"**

---

## **3. Upload & Analyze Contracts**

### **Upload Your First Contract**
1. From dashboard, click **"Upload Contract"** button
2. Enter document title (e.g., "Freelance Agreement")
3. Click **"Choose PDF"** or drag & drop file
4. Select your PDF contract file
5. Click **"Upload"** button

### **What Happens During Upload**
- 📤 **File Upload** (0-40% progress)
- 🤖 **AI Processing** (40-60% progress) 
- ✅ **Analysis Complete** (60-100% progress)

### **Supported Files**
- ✅ PDF files only
- ✅ Max size: 10MB
- ✅ Multiple documents allowed

---

## **4. View Analysis Results**

### **Access Analysis**
1. From dashboard, find your uploaded document
2. When status shows **"COMPLETED"**, click **"View Analysis"**
3. See comprehensive contract breakdown

### **Analysis Sections**

#### **🛡️ Risk Assessment**
- **Overall Risk Score** (0-100)
- **Risk Level**: LOW/MEDIUM/HIGH
- **Category Breakdown**: Liability, Payment, IP, Termination, etc.

#### **📄 Risky Clauses**
- **Problematic clauses** highlighted in red
- **Plain English explanations** of why they're risky
- **Specific suggestions** for each clause
- **Page references** to locate in original document

#### **📋 Your Obligations**
- **Critical tasks** you must complete
- **Deadlines** for each obligation
- **Consequences** of non-compliance
- **Priority levels**: CRITICAL/IMPORTANT/NORMAL

#### **🤝 Negotiation Points**
- **Priority rankings** (HIGH/MEDIUM/LOW)
- **Current vs Proposed** terms comparison
- **Talking points** for negotiations
- **Priority scores** to focus efforts

---

## **5. Document Management**

### **Dashboard Features**
- **Document Cards**: Title, pages, status, upload date
- **Status Indicators**:
  - 🕐 **PENDING** - Upload complete, processing queued
  - 🔄 **PROCESSING** - AI analysis in progress  
  - ✅ **COMPLETED** - Analysis ready to view
  - ❌ **FAILED** - Error occurred, try re-uploading

### **Actions Available**
- **View Analysis** - See full results (completed documents)
- **Delete Document** - Remove from system
- **Upload New** - Add more contracts

### **Refresh Status**
- When documents are **processing**, click **"Refresh"** button
- Updates document status in real-time
- Shows when analysis completes

---

## **6. Advanced Features**

### **Demo Mode**
- Visit: http://localhost:3000/demo
- **Full functionality preview** with mock data
- **No upload required** - see example analysis
- **Test all features** before using real documents

### **Export & Share**
- **Download Analysis** - Save results as PDF
- **Share Results** - Send analysis to others
- **Print Reports** - Physical copies for meetings

---

## **7. Troubleshooting**

### **Common Issues**

#### **Document Stuck on "Processing"**
1. Click **"Refresh"** button in dashboard header
2. Wait 1-2 minutes for AI analysis
3. If still processing, try re-uploading

#### **"View Analysis" Button Not Visible**
1. Document status must be **"COMPLETED"**
2. Processing takes 1-2 minutes
3. Check document card for status indicator

#### **Analysis Shows Error**
1. Verify PDF is readable (not scanned images)
2. Check file size < 10MB
3. Try uploading again
4. Check browser console for errors

#### **Login Issues**
1. Verify email/password correct
2. Check internet connection
3. Clear browser cache
4. Try signing up again

### **Getting Help**

#### **Console Debugging**
- Open **Browser Developer Tools** (F12)
- Check **Console** tab for error messages
- Look for **API errors** or **network issues**

#### **Server Logs**
- Check terminal where `npm run dev` is running
- Look for **error messages** during upload
- Verify **database connection** status

---

## **8. Pro Tips**

### **Best Results**
- **Clear PDFs** - not scanned images
- **Text-based contracts** work best
- **Good lighting** when scanning documents
- **Under 10MB** file size limit

### **AI Analysis Quality**
- **Standard contracts** get better analysis
- **Legal language** improves accuracy
- **Complete documents** provide more context
- **Multiple clauses** give richer insights

### **Workflow Efficiency**
- **Upload multiple** contracts for comparison
- **Review negotiation points** before meetings
- **Export analysis** for legal counsel review
- **Track obligations** deadlines in calendar

---

## **9. Configuration (Optional)**

### **Enable Full AI Analysis**
For advanced AI-powered analysis (instead of basic pattern matching):

1. **Get API Key**:
   - Go to https://console.anthropic.com/
   - Sign up/login
   - Create API key
   - Copy key (starts with `sk-ant-`)

2. **Configure App**:
   - Create `.env.local` file in project root
   - Add: `ANTHROPIC_API_KEY=your-key-here`
   - Restart: `npm run dev`

3. **Benefits**:
   - 🤖 Advanced AI with Claude 3.5 Sonnet
   - 📊 More accurate risk scoring
   - 🎯 Precise clause analysis
   - 💡 Smarter negotiation suggestions

---

## **10. Next Steps**

### **After Analysis**
1. **Review risky clauses** carefully
2. **Prioritize negotiation points** by score
3. **Track obligation deadlines** in calendar
4. **Consult legal counsel** for high-risk items
5. **Negotiate terms** using talking points provided
6. **Document agreements** in writing

### **Business Integration**
1. **Standardize contract review** process
2. **Create clause library** from common issues
3. **Train team on risk assessment**
4. **Build negotiation templates** from insights
5. **Track contract metrics** over time

---

## **🎉 You're Ready!**

Your AI Contract/Term Simplifier is now fully functional:
- ✅ Upload contracts instantly
- ✅ Get AI-powered analysis
- ✅ Identify risks and obligations
- ✅ Receive negotiation suggestions
- ✅ Export and share results

**Start protecting your interests with smart contract analysis!**
