# Julius Baer: Agentic AI AML Platform

A comprehensive AI-powered platform for real-time Anti-Money Laundering (AML) monitoring and document corroboration, built for Julius Baer.

## 🎯 Project Overview

This platform integrates two critical AML capabilities:

1. **Real-Time AML Monitoring** - Monitor transactions in real-time, generate risk-based alerts, and provide actionable insights
2. **Document & Image Corroboration** - AI-powered document forensics to detect tampering, inconsistencies, and suspicious patterns

## ✨ Features

### Dashboard
- Real-time KPI metrics (Active Alerts, Critical Cases, Resolution Times)
- Risk level distribution visualization
- Transaction volume trends
- Comprehensive alert triage queue

### Investigation Cockpit
- Detailed transaction analysis with risk scoring
- AI-powered document forensics with issue detection
- Multi-agent AI analysis system:
  - **Regulatory Watcher**: Monitors compliance with FINMA regulations
  - **Transaction Analyst**: Analyzes patterns and anomalies
  - **Document Forensics**: Detects digital tampering and inconsistencies
- Historical transaction context
- Complete audit trail

## 🏗️ Architecture

```
julius-baer-aml/
├── frontend/          # Next.js 14 + TypeScript + TailwindCSS
│   ├── app/          # Pages and layouts
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities and API client
│   └── types/        # TypeScript definitions
│
├── backend/          # FastAPI + Python
│   ├── api/         # REST API endpoints
│   ├── models/      # Pydantic schemas
│   ├── services/    # Business logic
│   └── agents/      # AI agents (future)
│
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **npm or yarn** (for frontend packages)
- **pip** (for Python packages)

### Option 1: Run Frontend Only (Recommended to Start)

The frontend works standalone with mock data - perfect for UI testing!

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Option 2: Run Backend Only

The backend provides REST APIs with mock data - no database required!

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py

# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Option 3: Run Full Stack

Run both frontend and backend together:

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in your browser!

## 📱 Screenshots & Pages

### Main Dashboard (`/`)
- Overview of all active AML alerts
- KPI cards showing critical metrics
- Interactive charts for risk visualization
- Alert triage queue with investigation actions

### Investigation Cockpit (`/investigation/[alertId]`)
- Detailed transaction information
- Document viewer with forensics analysis
- AI agent findings from multiple specialized agents
- Historical transaction context
- Remediation and audit trail actions

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching

### Backend
- **FastAPI** - High-performance Python API framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Mock Data** - In-memory data (MongoDB ready)
- **Simulated AI** - Mock agents (Groq API ready)

## 📚 Documentation

- [Frontend README](frontend/README.md) - Detailed frontend documentation
- [Backend README](backend/README.md) - Detailed backend documentation
- API Docs: http://localhost:8000/docs (when backend is running)

## 🔧 Current Status

### ✅ Completed
- [x] Frontend UI with all pages and components
- [x] Backend API with all endpoints
- [x] Mock data for development and testing
- [x] Complete documentation
- [x] CORS configuration for integration

### 🚧 Ready to Add (When Needed)
- [ ] MongoDB integration (currently using mock data)
- [ ] Groq API integration (currently using simulated AI)
- [ ] WebSocket for real-time updates
- [ ] User authentication and authorization
- [ ] Production deployment configuration

## 🎨 Design Highlights

- Professional banking aesthetic matching Julius Baer's brand
- Responsive design for desktop and tablet
- Intuitive navigation between dashboard and investigation views
- Color-coded risk levels and priorities
- Interactive charts and data visualizations

## 🔐 Security Notes

This is a development version with:
- Mock data (no real customer information)
- No authentication (add before production)
- CORS enabled for localhost (restrict in production)

## 📈 Next Steps

### Phase 1: Database Integration
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update backend/.env with connection string
# Uncomment MongoDB code in backend/services/database.py
```

### Phase 2: AI Integration
```bash
# Get Groq API key from https://groq.com
# Add to backend/.env: GROQ_API_KEY=your_key
# Implement real agents in backend/agents/
```

### Phase 3: Real-Time Features
```bash
# Add WebSocket support
# Implement live alert notifications
# Add real-time dashboard updates
```

### Phase 4: Production Deployment
```bash
# Add authentication (JWT, OAuth)
# Configure production environment variables
# Set up monitoring and logging
# Deploy to cloud (AWS, Azure, GCP)
```

## 🧪 Testing

### Test Frontend
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
# Click through dashboard and investigation pages
```

### Test Backend API
```bash
cd backend
python main.py
# Visit http://localhost:8000/docs
# Try the interactive API documentation
```

### Test Integration
```bash
# Start both frontend and backend
# Frontend will automatically connect to backend
# Test full flow: Dashboard → Click "Investigate" → View details
```

## 📝 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (`.env`)
```env
CORS_ORIGINS=http://localhost:3000
# Future additions:
# MONGODB_URL=mongodb://localhost:27017
# GROQ_API_KEY=your_key_here
```

## 🤝 Contributing

This is a proprietary project for Julius Baer. For questions or support, contact the development team.

## 📄 License

Proprietary - Julius Baer

---

**Built with ❤️ for Julius Baer's AML Compliance Team**

