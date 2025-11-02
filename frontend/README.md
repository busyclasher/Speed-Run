# Speed-Run AML Platform - Frontend

A modern Next.js application for real-time AML monitoring and document corroboration with AI-powered fraud detection.

**Status**: ✅ Backend Integration Complete

## Features

- **Document Upload & Fraud Detection** ⭐
  - Drag-and-drop document upload (PDF, JPG, PNG)
  - Real-time AI-powered fraud detection
  - Risk scoring (0-100) with color-coded indicators
  - Tampering and AI-generated content detection
  - Detailed issue reporting and passed checks

- **Compliance Dashboard**
  - Drag-and-drop Kanban board for KYC reviews
  - KPI cards showing pending reviews, critical cases, and red flags
  - Business metrics and capacity planning
  - Filter by risk level (All, Critical, High, Medium)

- **Relationship Manager Dashboard**
  - Client list with risk ratings and KYC status
  - Document upload interface
  - Pending documents and alerts tracking
  - Client search functionality

- **Investigation Cockpit**
  - Detailed transaction analysis
  - AI-powered document forensics
  - Multi-agent findings (Regulatory Watcher, Transaction Analyst, Document Forensics)
  - Historical transaction context
  - Audit trail management

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# .env.local (already created with defaults)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_USE_BACKEND_API=true
NEXT_PUBLIC_DEBUG=false
```

**Important**: The backend must be running at `http://localhost:8000` for the frontend to work.

4. Start the backend (required):
```bash
# In a separate terminal, navigate to backend directory
cd ../backend

# Start FastAPI backend
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Or using python
python -m backend.main
```

5. Run the frontend development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

**Development Workflow**:
- Backend must be running first at `http://localhost:8000`
- Frontend will automatically connect to backend API
- Check browser console for API call logs

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                                 # Next.js 14 App Router
│   ├── page.tsx                         # Home - Role selector
│   ├── layout.tsx                       # Root layout
│   ├── providers.tsx                    # React Query provider
│   ├── globals.css                      # Global styles
│   ├── compliance/
│   │   └── page.tsx                     # Compliance dashboard (Kanban + Upload)
│   ├── rm/
│   │   └── page.tsx                     # RM dashboard (Clients + Upload)
│   └── investigation/
│       └── [alertId]/
│           └── page.tsx                 # Investigation cockpit
│
├── components/
│   ├── ui/                              # Shadcn UI (10 components)
│   ├── charts/                          # Chart wrappers
│   │   ├── PieChart.tsx
│   │   └── LineChart.tsx
│   ├── compliance/                      # Compliance UI (11 components)
│   │   ├── DocumentUploadAnalysis.tsx  # ⭐ Document upload + fraud detection
│   │   ├── KanbanBoardDnD.tsx          # Drag-drop Kanban
│   │   └── ...                          # Other compliance components
│   ├── investigation/                   # Investigation UI (5 components)
│   │   ├── TransactionDetails.tsx
│   │   ├── DocumentViewer.tsx
│   │   ├── AgentFindings.tsx
│   │   └── ...
│   └── dashboard/                       # Dashboard UI (4 components)
│       ├── KPICard.tsx
│       ├── AlertTriageTable.tsx
│       └── ...
│
├── lib/
│   ├── api.ts                           # ✅ Backend API client (integrated)
│   ├── mock-data.ts                     # Legacy mock data (to be removed)
│   ├── supabase.ts                      # Legacy Supabase (to be removed)
│   └── utils.ts                         # Utility functions
│
└── types/
    └── index.ts                         # TypeScript type definitions
```

## Key Pages

### Home (`/`)
- Role selector: Choose between Compliance Officer or Relationship Manager dashboard

### Compliance Dashboard (`/compliance`) ✅
- **Document Upload & Fraud Detection** (integrated with backend)
- Drag-and-drop Kanban board for KYC reviews
- KPI metrics (Pending Reviews, Critical Cases, Red Flags, Avg Lead Time)
- Business metrics and capacity planning

### RM Dashboard (`/rm`)
- Client list with risk ratings and KYC status
- Document upload interface
- Pending documents and alerts tracking
- Client search functionality

### Investigation Page (`/investigation/[alertId]`)
- Detailed alert investigation
- Transaction details and risk scoring
- AI-powered document analysis
- Multi-agent findings
- Historical transaction context
- Remediation actions (Approve, Escalate, Reject)

## Backend Integration Status

| Feature | Status | Backend Endpoint |
|---------|--------|------------------|
| **Document Upload & Analysis** | ✅ Complete | `POST /api/v1/corroboration/analyze` |
| Dashboard Alerts | ⏳ TODO | `GET /api/v1/alerts/summary` |
| Alert Details | ⏳ TODO | `GET /api/v1/alerts/{id}` |
| Update Alert Status | ⏳ TODO | `PUT /api/v1/alerts/{id}/status` |
| Audit Trail | ⏳ TODO | `GET /api/v1/alerts/{id}/audit-trail` |

### Integrated Features ✅

**DocumentUploadAnalysis Component**:
- Real-time document analysis with FastAPI backend
- Supports PDF, JPG, PNG, JPEG (max 10MB)
- AI-powered fraud detection using Docling
- Risk scoring (0-100) with 4 levels (low/medium/high/critical)
- Detailed issue reporting and passed checks
- Error handling with retry functionality
- Loading states with spinner animations

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | FastAPI backend URL | `http://localhost:8000` | ✅ Yes |
| `NEXT_PUBLIC_API_VERSION` | API version | `v1` | ✅ Yes |
| `NEXT_PUBLIC_USE_BACKEND_API` | Enable backend integration | `true` | ✅ Yes |
| `NEXT_PUBLIC_DEBUG` | Debug mode | `false` | No |

## Development Notes

- ✅ Backend integration complete for document upload/analysis
- ⏳ Dashboard and investigation pages still use mock data (TODO)
- All components built with TypeScript for type safety
- Charts are responsive and interactive
- Drag-and-drop powered by `@dnd-kit`
- React Query ready for data fetching (configured but not yet used)

## API Integration Guide

### Example: Calling Backend API

```typescript
import { analyzeDocument } from "@/lib/api"

// Upload and analyze document
const response = await analyzeDocument(file, clientId?)
// Returns: CorroborationResponse with risk_score, findings, alert_id
```

### Available API Functions

See `lib/api.ts` for complete list:
- `analyzeDocument(file, clientId?)` - ✅ Used
- `getDashboardSummary()` - Ready to use
- `getActiveAlerts()` - Ready to use
- `getAlertDetails(id)` - Ready to use
- `updateAlertStatus(id, status)` - Ready to use
- `getAuditTrail(id)` - Ready to use
- `performOCR(file)` - Ready to use
- `parseDocument(file)` - Ready to use

## Testing Document Upload

1. Ensure backend is running at `http://localhost:8000`
2. Navigate to Compliance Dashboard: `http://localhost:3000/compliance`
3. Scroll to "Upload Documents for Fraud Detection" section
4. Drag & drop a PDF or image file (max 10MB)
5. Watch real-time AI analysis with risk scoring
6. Check browser console for API call logs

## Next Steps

### Phase 1 (Completed) ✅
- [x] Backend API client setup
- [x] Document upload component integration
- [x] Real-time fraud detection
- [x] Error handling and retry logic

### Phase 2 (TODO)
- [ ] Integrate Dashboard with `getDashboardSummary()`
- [ ] Integrate Investigation page with `getAlertDetails()`
- [ ] Add React Query hooks for data fetching
- [ ] Implement loading states throughout
- [ ] Add error boundaries per route

### Phase 3 (TODO)
- [ ] Remove mock data files
- [ ] Remove Supabase dependency
- [ ] Add WebSocket for real-time updates
- [ ] Add user authentication
- [ ] Add comprehensive tests

## Troubleshooting

### Backend Connection Issues

If you see "Analysis failed" errors:
1. Check backend is running: `curl http://localhost:8000/health`
2. Check browser console for CORS errors
3. Verify `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`
4. Check backend logs for errors

### Common Issues

**Issue**: "Failed to fetch" error
**Solution**: Ensure backend is running at `http://localhost:8000`

**Issue**: CORS errors in console
**Solution**: Backend should have `ALLOWED_ORIGINS` configured in `config.py`

**Issue**: File upload shows "error" status immediately
**Solution**: Check file is valid format (PDF/JPG/PNG) and under 10MB

## License

Proprietary - Speed-Run Team
