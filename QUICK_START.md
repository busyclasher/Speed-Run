# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Option 1: Frontend Only (Fastest!)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 ✨

---

### Option 2: Backend Only

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

API at http://localhost:8000
Docs at http://localhost:8000/docs ✨

---

### Option 3: Full Stack

**Terminal 1 (Backend):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 ✨

---

## 🎯 What You'll See

### Dashboard (/)
- Real-time KPIs
- Risk distribution chart
- Transaction volume trends
- Alert triage table
- Click "Investigate" on any alert

### Investigation (/investigation/ALT-788)
- Transaction details
- Document forensics
- AI agent findings
- Historical context
- Remediation actions

---

## 📚 Key URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API docs |
| Health Check | http://localhost:8000/health | System status |

---

## 🛠️ Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
deactivate  # if venv is active
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Port already in use
```bash
# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Backend (port 8000)
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000   # Windows
```

---

## 📖 Next Steps

1. ✅ **Explore the UI** - Click around, test features
2. ✅ **Check API Docs** - Visit /docs endpoint
3. ✅ **Read Documentation** - See README.md
4. ⏭️ **Add MongoDB** - See IMPLEMENTATION_GUIDE.md
5. ⏭️ **Add Groq AI** - See IMPLEMENTATION_GUIDE.md

---

## 🎉 You're All Set!

The platform is fully functional with mock data.
No database or AI API needed to start exploring!

**Questions?** Check README.md or IMPLEMENTATION_GUIDE.md

