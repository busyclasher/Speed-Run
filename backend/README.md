# Julius Baer Agentic AI AML Platform - Backend

FastAPI backend for real-time AML monitoring with AI-powered document analysis.

## Current Status

✅ **Ready to Run** - No external dependencies required!

- Using **in-memory mock data** (no MongoDB needed yet)
- Using **simulated AI responses** (no Groq API needed yet)
- Fully functional REST API
- CORS configured for frontend integration

## Features

- **Dashboard API**: Summary statistics, alerts, transaction volumes
- **Alert Management**: Detailed alert information, remediation
- **Transaction Analysis**: Volume trends, historical data
- **Audit Trail**: Complete activity logging
- **Mock AI Agents**: Simulated multi-agent analysis

## Quick Start

### Prerequisites

- Python 3.9+ installed
- pip package manager

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. Open your browser:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Alerts

- `GET /api/alerts/summary` - Dashboard KPIs and statistics
- `GET /api/alerts/active` - List of active alerts
- `GET /api/alerts/{alert_id}` - Detailed alert information
- `POST /api/alerts/{alert_id}/remediate` - Mark alert as remediated

### Transactions

- `GET /api/transactions/volume` - Transaction volume trend
- `GET /api/transactions/history/{client_id}` - Client transaction history

### Audit

- `GET /api/audit-trail/{alert_id}` - Audit trail for specific alert

### System

- `GET /` - API information
- `GET /health` - Health check

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── config.py                    # Configuration settings
├── requirements.txt             # Python dependencies
├── models/
│   └── schemas.py              # Pydantic models
├── services/
│   ├── database.py             # Database service (mock)
│   └── mock_data.py            # Mock data for development
└── api/
    └── routes/
        ├── alerts.py           # Alert endpoints
        ├── transactions.py     # Transaction endpoints
        └── audit.py            # Audit trail endpoints
```

## Testing the API

### Using curl

```bash
# Get dashboard summary
curl http://localhost:8000/api/alerts/summary

# Get active alerts
curl http://localhost:8000/api/alerts/active

# Get specific alert details
curl http://localhost:8000/api/alerts/ALT-788

# Get transaction volume
curl http://localhost:8000/api/transactions/volume
```

### Using the Interactive Docs

Visit http://localhost:8000/docs to use the built-in Swagger UI for testing all endpoints.

## Connecting to Frontend

The backend is configured to accept requests from `http://localhost:3000` by default.

To test with the frontend:

1. Start the backend: `python main.py` (runs on port 8000)
2. Start the frontend: `cd frontend && npm run dev` (runs on port 3000)
3. Frontend will automatically connect to the backend API

## Next Steps: Adding Real Services

### 1. MongoDB Integration

When ready to add MongoDB:

```bash
# Install MongoDB dependencies
pip install motor pymongo

# Update .env file
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=julius_baer_aml
```

Then uncomment the MongoDB code in `services/database.py`

### 2. Groq API Integration

When ready to add Groq AI:

```bash
# Install Groq
pip install groq

# Update .env file
GROQ_API_KEY=your_actual_groq_api_key
```

Create agent files in `agents/` directory for real AI analysis.

### 3. WebSocket Support

For real-time alerts:

```bash
pip install websockets
```

Add WebSocket endpoint in `main.py` for live updates.

## Environment Variables

Create a `.env` file (optional for now):

```env
CORS_ORIGINS=http://localhost:3000
```

## Development Tips

- The API auto-reloads when you make changes (using `--reload` flag)
- Check logs in the terminal for debugging
- Use `/docs` endpoint to explore and test all APIs
- Mock data is defined in `services/mock_data.py` - customize as needed

## Production Deployment

When ready for production:

1. Add MongoDB connection
2. Add Groq API integration
3. Add authentication/authorization
4. Configure environment variables
5. Use production ASGI server (Gunicorn + Uvicorn)
6. Set up proper logging and monitoring

## License

Proprietary - Julius Baer

