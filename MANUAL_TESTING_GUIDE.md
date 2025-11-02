# Speed-Run AML Platform - Manual Testing Guide

Complete step-by-step guide to run and manually test the application.

---

## Prerequisites

Before starting, ensure you have:
- ✅ **Python 3.11+** installed
- ✅ **Node.js 18+** installed
- ✅ **uv** package manager (install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- ✅ **Docker Desktop** (optional, for database)
- ✅ Terminal/Command Prompt access

---

## 🚀 Quick Start (Fastest Way)

### Option 1: Using Startup Scripts (Recommended)

#### Step 1: Start the Backend

```bash
# Navigate to project root
cd /Users/issacj/Desktop/hackathons/Singhacks/Speed-Run

# Make the script executable (first time only)
chmod +x start-backend.sh

# Start backend
./start-backend.sh
```

**What this does:**
- Creates `.env` file from template (if not exists)
- Installs Python dependencies via uv
- Runs health check tests
- Starts backend API server on http://localhost:8000

**You should see:**
```
🚀 Starting backend API server...

📍 Endpoints:
   • API:          http://localhost:8000
   • API Docs:     http://localhost:8000/docs
   • ReDoc:        http://localhost:8000/redoc
   • Health Check: http://localhost:8000/health
```

#### Step 2: Start the Frontend (in a new terminal)

```bash
# Open a NEW terminal window/tab
cd /Users/issacj/Desktop/hackathons/Singhacks/Speed-Run

# Make the script executable (first time only)
chmod +x start-frontend.sh

# Start frontend
./start-frontend.sh
```

**What this does:**
- Creates `.env.local` file with backend configuration
- Installs Node.js dependencies via npm
- Runs health check tests
- Starts Next.js development server on http://localhost:3000

**You should see:**
```
🚀 Starting frontend development server...

📍 Endpoints:
   • Frontend:     http://localhost:3000
   • Compliance:   http://localhost:3000/compliance
   • RM Dashboard: http://localhost:3000/rm
```

#### Step 3: Access the Application

Open your web browser and navigate to:
- **Main Dashboard:** http://localhost:3000
- **Compliance View:** http://localhost:3000/compliance
- **Backend API Docs:** http://localhost:8000/docs

---

## 🔧 Manual Setup (Step-by-Step)

If you prefer manual setup or the scripts don't work:

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd /Users/issacj/Desktop/hackathons/Singhacks/Speed-Run/backend
```

#### 2. Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Optional: Edit .env to customize settings
# The defaults work fine for local testing
```

#### 3. Install Python Dependencies
```bash
# Using uv (recommended)
uv sync

# OR using pip
pip install -r requirements.txt
```

#### 4. Start Backend Server
```bash
# Using uv
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# OR using python directly
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

#### 5. Verify Backend is Running
Open a browser and visit:
- http://localhost:8000/health (should return `{"status": "healthy"}`)
- http://localhost:8000/docs (Swagger API documentation)

### Frontend Setup

#### 1. Navigate to Frontend Directory (in a new terminal)
```bash
cd /Users/issacj/Desktop/hackathons/Singhacks/Speed-Run/frontend
```

#### 2. Create Environment File
```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_USE_BACKEND_API=true

# Feature Flags
NEXT_PUBLIC_ENABLE_DOCUMENT_UPLOAD=true
NEXT_PUBLIC_ENABLE_AI_DETECTION=true

# UI Configuration
NEXT_PUBLIC_APP_NAME=Speed-Run AML Platform
NEXT_PUBLIC_ITEMS_PER_PAGE=20
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=30000

# Debug
NEXT_PUBLIC_DEBUG=false
EOF
```

#### 3. Install Node.js Dependencies
```bash
npm install
```

#### 4. Start Frontend Server
```bash
npm run dev
```

#### 5. Verify Frontend is Running
Open a browser and visit:
- http://localhost:3000 (main dashboard)

---

## 🧪 Manual Testing Scenarios

Now that both servers are running, follow these test scenarios:

### Test Scenario 1: Dashboard Overview

**Objective:** Verify the main dashboard loads and displays metrics

**Steps:**
1. Navigate to http://localhost:3000
2. Observe the dashboard displays:
   - KPI cards (Total Alerts, High Risk Cases, Average Review Time, etc.)
   - Alert trend chart
   - Risk distribution chart
   - Recent alerts table

**Expected Results:**
- ✅ All components render without errors
- ✅ Mock data is displayed
- ✅ Charts are interactive
- ✅ No console errors

**What to Check:**
- Do the numbers look reasonable?
- Can you hover over charts to see tooltips?
- Are colors and styling correct?

---

### Test Scenario 2: Compliance Dashboard Navigation

**Objective:** Navigate to compliance officer view

**Steps:**
1. From main dashboard, click navigation to Compliance page
2. Or directly visit: http://localhost:3000/compliance

**Expected Results:**
- ✅ Compliance dashboard loads
- ✅ Statistics cards display (New, In Review, Flagged, Resolved)
- ✅ Kanban board shows cases in different stages

**What to Check:**
- Are the statistics accurate?
- Does the Kanban board show cards in all columns?
- Can you see client names and risk scores?

---

### Test Scenario 3: Document Upload & Analysis

**Objective:** Test document upload and OCR processing

**Steps:**
1. Navigate to http://localhost:3000/compliance
2. Scroll to the "Document Upload & Analysis" section
3. Click "Choose File" or drag and drop a document:
   - **Sample files to test with:**
     - Any PDF file (preferably with text)
     - Any image file (PNG, JPG) with text
     - Sample provided: `sample_data/Swiss_Home_Purchase_Agreement_Scanned_Noise_forparticipants.pdf`

4. Click "Upload and Analyze Document"
5. Watch the progress indicator
6. View the analysis results

**Expected Results:**
- ✅ File uploads successfully
- ✅ Progress indicator shows processing status
- ✅ OCR extracts text from document
- ✅ Analysis results display:
  - Extracted text
  - Document metadata
  - Risk indicators (if applicable)
  - Validation results

**What to Check:**
- Does the upload work with different file types?
- Is the extracted text accurate?
- Does it handle large files gracefully?
- Are error messages clear for unsupported files?

---

### Test Scenario 4: Risk Score Assessment

**Objective:** Verify risk scoring system

**Steps:**
1. Navigate to any case detail page from the Kanban board
2. Click on a high-risk case (risk score > 70)
3. Observe the Risk Score Card

**Expected Results:**
- ✅ Overall risk score displayed prominently
- ✅ Risk level badge shows correct color:
  - Critical (86-100): Red
  - High (71-85): Orange
  - Medium (41-70): Yellow
  - Low (0-40): Green
- ✅ Risk breakdown shows four categories:
  - Document Risk (/40)
  - Geographic Risk (/30)
  - Client Profile Risk (/20)
  - Transaction Risk (/10)
- ✅ Progress bars visualize each category
- ✅ Risk Level Guide displayed at bottom

**What to Check:**
- Do the colors match the risk levels?
- Are the breakdowns adding up correctly?
- Is the explanation text clear?

---

### Test Scenario 5: Kanban Board Drag & Drop

**Objective:** Test case status updates via drag and drop

**Steps:**
1. Navigate to http://localhost:3000/compliance
2. Find a case in the "New" column
3. Try dragging it to "In Review" column
4. Drop the card
5. Observe the status change

**Expected Results:**
- ✅ Card moves smoothly between columns
- ✅ Status updates automatically
- ✅ Card appears in correct column
- ✅ Time in queue updates
- ✅ No duplicate cards appear

**What to Check:**
- Does drag and drop feel smooth?
- Can you move cards between any columns?
- Does the card maintain its information?

---

### Test Scenario 6: API Integration Test

**Objective:** Verify backend API is working

**Steps:**
1. Open http://localhost:8000/docs (Swagger UI)
2. Test the OCR endpoint:
   - Click on `POST /api/v1/ocr/extract`
   - Click "Try it out"
   - Upload an image with text
   - Click "Execute"
3. Review the response

**Expected Results:**
- ✅ API documentation loads
- ✅ File upload works via Swagger
- ✅ Response contains extracted text
- ✅ Response includes confidence scores
- ✅ Status code is 200

**What to Check:**
- Does the API respond quickly?
- Is the JSON response well-formatted?
- Are error codes meaningful?

---

### Test Scenario 7: Frontend UTF-8 Handling

**Objective:** Verify UTF-8 character support (our fix!)

**Steps:**
1. Navigate to http://localhost:3000
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Look for log messages with emojis
5. Check that emojis display correctly: 🔍 ℹ️ ⚠️ ❌

**Expected Results:**
- ✅ Console logs show proper emojis (not �)
- ✅ All UI text displays correctly
- ✅ No UTF-8 encoding errors
- ✅ Special characters in client names display properly

**What to Check:**
- Are emojis rendering correctly in logs?
- Do client names with special characters (ñ, é, ü) display properly?
- Are there any � replacement characters?

---

### Test Scenario 8: Error Handling

**Objective:** Verify error handling and error boundaries

**Steps:**
1. Try uploading an invalid file (e.g., .exe, .txt)
2. Try uploading a very large file (>10MB)
3. Stop the backend server (Ctrl+C in backend terminal)
4. Try to upload a document with backend stopped
5. Observe error messages

**Expected Results:**
- ✅ Clear error messages for invalid files
- ✅ File size limit enforced
- ✅ Graceful degradation when backend is down
- ✅ Error boundary catches React errors
- ✅ User can recover from errors

**What to Check:**
- Are error messages user-friendly?
- Does the app crash or recover gracefully?
- Can you continue using the app after an error?

---

### Test Scenario 9: Performance Test

**Objective:** Test performance with multiple actions

**Steps:**
1. Rapidly navigate between pages
2. Upload multiple documents in succession
3. Drag and drop multiple cards quickly
4. Refresh the page while loading

**Expected Results:**
- ✅ Navigation is smooth
- ✅ No memory leaks
- ✅ Concurrent uploads handled
- ✅ Page refresh doesn't break state

**What to Check:**
- Does the app feel responsive?
- Are there any lag or delays?
- Does browser memory stay reasonable?

---

### Test Scenario 10: Mobile Responsiveness

**Objective:** Test mobile/tablet views

**Steps:**
1. Open Developer Tools (F12)
2. Click the device toolbar icon (or press Ctrl+Shift+M)
3. Select different devices:
   - iPhone 12/13/14
   - iPad
   - Galaxy S20
4. Navigate through different pages

**Expected Results:**
- ✅ Layout adapts to screen size
- ✅ Navigation menu collapses on mobile
- ✅ Tables become scrollable
- ✅ Cards stack vertically
- ✅ Text remains readable

**What to Check:**
- Does everything fit on small screens?
- Are buttons large enough to tap?
- Is text readable without zooming?

---

## 🐛 Troubleshooting Common Issues

### Backend Won't Start

**Problem:** `uv: command not found`
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or use pip directly
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

**Problem:** Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
uv run uvicorn backend.main:app --reload --port 8001
```

**Problem:** Module not found errors
```bash
# Reinstall dependencies
cd backend
rm -rf .venv
uv sync
```

---

### Frontend Won't Start

**Problem:** Node.js version too old
```bash
# Check version
node -v

# Install Node.js 18+ from https://nodejs.org/
```

**Problem:** Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or Next.js will offer to use 3001 automatically
```

**Problem:** Dependencies fail to install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Document Upload Not Working

**Problem:** CORS errors in console
```bash
# Make sure backend is running on port 8000
# Check backend terminal for errors
# Verify .env.local has: NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Problem:** File size too large
```
# Default limit is 10MB
# To increase, edit backend/.env:
MAX_FILE_SIZE=52428800  # 50MB
```

---

### Page Won't Load / White Screen

**Problem:** Check browser console (F12)
```
1. Look for error messages
2. Check Network tab for failed requests
3. Verify both servers are running
4. Clear browser cache (Ctrl+Shift+R)
```

---

## 🎯 Testing Checklist

Use this checklist to track your manual testing:

### Backend Tests
- [ ] Backend server starts without errors
- [ ] Health check endpoint returns success
- [ ] Swagger docs load at /docs
- [ ] OCR endpoint extracts text from images
- [ ] Document parsing endpoint works with PDFs
- [ ] API returns proper error codes for invalid requests

### Frontend Tests
- [ ] Main dashboard loads and displays metrics
- [ ] Compliance page shows Kanban board
- [ ] KPI cards display correct data
- [ ] Charts are interactive and responsive
- [ ] Document upload works with various file types
- [ ] Risk score card displays correct colors
- [ ] Drag and drop works on Kanban board
- [ ] Navigation between pages is smooth
- [ ] UTF-8 characters display correctly
- [ ] Error messages are user-friendly

### Integration Tests
- [ ] Frontend successfully calls backend APIs
- [ ] File uploads process and return results
- [ ] Real-time updates work (if implemented)
- [ ] Backend errors display in frontend
- [ ] System works with backend offline (mock mode)

### UI/UX Tests
- [ ] All pages are responsive on mobile
- [ ] Color scheme is consistent
- [ ] Loading states are clear
- [ ] Buttons and links are clickable
- [ ] Forms validate input correctly
- [ ] Accessibility: keyboard navigation works

---

## 📊 Expected Test Results Summary

If everything is working correctly, you should see:

**Backend (Terminal 1):**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Frontend (Terminal 2):**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Browser (http://localhost:3000):**
- Dashboard with 4 KPI cards
- Two interactive charts
- Alert table with sample data
- Clean console (no red errors)

---

## 🚪 Stopping the Application

To stop the servers:

1. **Stop Backend:** Go to backend terminal, press `Ctrl+C`
2. **Stop Frontend:** Go to frontend terminal, press `Ctrl+C`
3. **Verify:** Ports 3000 and 8000 are freed

---

## 📝 Notes for Testers

1. **First Run Takes Longer:** Installing dependencies and starting servers takes 2-5 minutes on first run
2. **Mock Data:** Some features use mock data when backend is unavailable
3. **Browser Choice:** Chrome/Edge recommended for best developer tools
4. **Console Logging:** Frontend logs are helpful - keep DevTools open
5. **Hot Reload:** Both servers support hot reload - changes appear automatically

---

## 🎉 Success Criteria

Your manual testing is successful if:
- ✅ Both servers start without errors
- ✅ You can navigate all pages
- ✅ Document upload and analysis works
- ✅ Kanban board is interactive
- ✅ Risk assessments display correctly
- ✅ UTF-8 characters render properly (no �)
- ✅ Mobile view is functional
- ✅ No critical console errors

---

## 📞 Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Review logs in both terminal windows
3. Check browser console (F12) for errors
4. Verify all prerequisites are installed
5. Try restarting both servers

Happy Testing! 🚀
