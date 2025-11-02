# Contributing to Speed-Run AML Platform

## Welcome! 👋

Thank you for your interest in contributing to Speed-Run! This guide will help you understand our codebase, development workflow, and how to get started quickly.

---

## Table of Contents

1. [Quick Start for Contributors](#quick-start-for-contributors)
2. [Architecture Overview](#architecture-overview)
3. [Development Workflow](#development-workflow)
4. [Code Structure](#code-structure)
5. [Testing Guidelines](#testing-guidelines)
6. [Adding New Features](#adding-new-features)
7. [API Development](#api-development)
8. [Frontend Development](#frontend-development)
9. [Diagrams](#diagrams)
10. [Code Style](#code-style)
11. [Pull Request Process](#pull-request-process)

---

## Quick Start for Contributors

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker Desktop
- Git
- `uv` package manager (for Python)

### Setup Development Environment

```bash
# 1. Clone the repository
git clone <repository-url>
cd Speed-Run

# 2. Backend setup
cd backend
cp .env.example .env
uv sync
uv run pytest  # Verify 369 tests pass

# 3. Frontend setup
cd ../frontend
cp .env.example .env.local
npm install
npm test  # Verify 17 tests pass

# 4. Start development servers
# Terminal 1 - Backend
cd backend
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Verify Setup

- Backend API: http://localhost:8000/docs
- Frontend App: http://localhost:3000
- Backend Health: http://localhost:8000/health

---

## Architecture Overview

Speed-Run follows a **modular, service-oriented architecture** with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (Next.js 14, React 18, TypeScript, TanStack Query)         │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Compliance  │  │ RM Dashboard │  │ Investigation│       │
│  │ Dashboard   │  │              │  │ Page         │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│          │                 │                  │             │
│          └─────────────────┴──────────────────┘             │
│                            │                                │
│                  Custom React Hooks                         │
│              (useDocuments, useAlerts)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
                           │ (JSON)
┌──────────────────────────┴──────────────────────────────────┐
│                       Backend API                            │
│              (FastAPI, Python 3.11+)                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           API Routers (FastAPI)                     │   │
│  │  /api/v1/documents  /api/v1/ocr  /api/v1/alerts    │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │             Service Layer                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│   │
│  │  │Document      │  │Image         │  │Alert       ││   │
│  │  │Service       │  │Analyzer      │  │Service     ││   │
│  │  └──────────────┘  └──────────────┘  └────────────┘│   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│   │
│  │  │OCR Service   │  │Validator     │  │Report      ││   │
│  │  │(Docling)     │  │Services      │  │Generator   ││   │
│  │  └──────────────┘  └──────────────┘  └────────────┘│   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │              Data Layer                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│   │
│  │  │PostgreSQL    │  │Redis Cache   │  │File System ││   │
│  │  │(metadata)    │  │(sessions)    │  │(audit logs)││   │
│  │  └──────────────┘  └──────────────┘  └────────────┘│   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend**:
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.11+
- **OCR Engine**: Docling (IBM Research)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Testing**: pytest, pytest-asyncio
- **Package Manager**: uv (fast Python package management)

**Frontend**:
- **Framework**: Next.js 14.2.5
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5.5.4
- **State Management**: TanStack Query 5.51.1
- **UI Components**: Radix UI, Tailwind CSS
- **Testing**: Vitest 4.0.6, React Testing Library

---

## Development Workflow

### Git Branch Strategy

We use **Git Flow** with the following branches:

```
main (production-ready)
  │
  ├── develop (integration branch)
  │     │
  │     ├── feature/document-validation
  │     ├── feature/ai-detection-improvements
  │     ├── bugfix/ocr-accuracy
  │     └── hotfix/critical-security-patch
  │
  └── release/v1.0.0 (when preparing release)
```

### Branch Naming Conventions

- **Features**: `feature/short-description`
- **Bug Fixes**: `bugfix/issue-description`
- **Hotfixes**: `hotfix/critical-issue`
- **Experiments**: `experiment/idea-name`

### Commit Message Format

We follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(backend): add reverse image search integration

Integrated Google Cloud Vision API for reverse image search.
Supports detecting stolen/reused images with 90% accuracy.

Closes #42

---

fix(frontend): resolve API timeout in dashboard

Increased timeout from 5s to 15s for large document processing.
Added retry logic with exponential backoff.

Fixes #67

---

docs(contributing): add architecture diagrams

Added data flow, sequence, and component diagrams to help
new contributors understand the codebase.
```

---

## Code Structure

### Backend Structure

```
backend/
├── src/backend/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry
│   ├── config.py                  # Configuration management
│   ├── container.py               # Dependency injection
│   │
│   ├── routers/                   # API endpoints
│   │   ├── __init__.py
│   │   ├── document_parser.py     # Document processing endpoints
│   │   ├── ocr.py                 # OCR extraction endpoints
│   │   └── alerts.py              # Alert management endpoints
│   │
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   ├── document_service.py    # Document processing
│   │   ├── ocr_service.py         # OCR operations
│   │   ├── image_analyzer.py      # Image fraud detection
│   │   ├── alert_service.py       # Alert management
│   │   ├── report_generator.py    # Report generation
│   │   └── validation/            # Validation services
│   │       ├── format_validator.py
│   │       ├── content_validator.py
│   │       └── structure_validator.py
│   │
│   ├── schemas/                   # Pydantic models
│   │   ├── __init__.py
│   │   ├── document.py            # Document schemas
│   │   ├── ocr.py                 # OCR schemas
│   │   └── alert.py               # Alert schemas
│   │
│   ├── database/                  # Database layer
│   │   ├── connection.py          # DB connection
│   │   ├── session.py             # Session management
│   │   └── schema.sql             # Database schema
│   │
│   └── adapters/                  # External integrations
│       ├── document_parser/       # Document parsing adapters
│       ├── image/                 # Image processing adapters
│       └── nlp/                   # NLP adapters
│
├── tests/                         # Test suite (369 tests)
│   ├── conftest.py                # Shared fixtures
│   ├── unit/                      # Unit tests
│   │   ├── services/
│   │   └── routers/
│   └── integration/               # Integration tests
│       └── test_document_pipeline.py
│
├── docs/                          # Backend documentation
│   ├── architecture/
│   ├── progress/
│   ├── testing/
│   └── sessions/
│
├── archive/                       # Archived implementations
│   └── old_implementation/
│
├── pyproject.toml                 # Python dependencies
├── pytest.ini                     # Pytest configuration
├── Dockerfile                     # Backend Docker image
└── README.md
```

### Frontend Structure

```
frontend/
├── app/                           # Next.js app router
│   ├── page.tsx                   # Role selector
│   ├── compliance/                # Compliance dashboard
│   │   ├── page.tsx
│   │   └── review/[reviewId]/
│   ├── rm/                        # RM dashboard
│   │   └── page.tsx
│   └── investigation/[alertId]/   # Investigation page
│       └── page.tsx
│
├── components/                    # React components
│   ├── ui/                        # UI primitives (Radix)
│   ├── compliance/                # Compliance-specific
│   │   ├── KanbanBoardDnD.tsx
│   │   └── AlertCard.tsx
│   ├── shared/                    # Shared components
│   │   ├── DocumentUploadAnalysis.tsx
│   │   └── RiskScoreBadge.tsx
│   └── layout/                    # Layout components
│
├── lib/                           # Core utilities
│   ├── config.ts                  # Frontend configuration
│   ├── api.ts                     # API client
│   ├── logger.ts                  # Logging utility
│   ├── hooks/                     # Custom React hooks
│   │   └── useDocuments.ts        # Document API hooks
│   └── utils.ts                   # Helper functions
│
├── test/                          # Test utilities
│   ├── setup.ts                   # Test setup
│   ├── test-utils.tsx             # Custom render
│   └── mocks/                     # Mock data
│       ├── handlers.ts            # MSW handlers
│       └── server.ts              # MSW server
│
├── __tests__/                     # Test suite (17 tests)
│   ├── unit/
│   │   └── lib/config.test.ts
│   └── integration/
│       └── hooks/useDocuments.test.tsx
│
├── public/                        # Static assets
│   ├── images/
│   └── favicon.ico
│
├── styles/                        # Global styles
│   └── globals.css
│
├── package.json                   # Node dependencies
├── tsconfig.json                  # TypeScript config
├── vitest.config.ts               # Vitest config
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── Dockerfile                     # Frontend Docker image
└── README.md
```

---

## Testing Guidelines

### Backend Testing

We maintain **369 passing tests** with comprehensive coverage.

#### Running Tests

```bash
# All tests
cd backend
uv run pytest

# Specific test file
uv run pytest tests/unit/services/test_document_service.py

# With coverage
uv run pytest --cov=backend --cov-report=html

# Watch mode
uv run pytest-watch
```

#### Writing Tests

**Unit Test Example**:
```python
# tests/unit/services/test_image_analyzer.py

import pytest
from backend.services.image_analyzer import ImageAnalyzer

@pytest.fixture
def image_analyzer():
    return ImageAnalyzer()

def test_ai_detection_returns_confidence_score(image_analyzer, sample_image):
    """Test that AI detection returns a confidence score between 0 and 1."""
    result = image_analyzer.detect_ai_generated(sample_image)

    assert 'ai_generated' in result
    assert 'confidence' in result
    assert 0 <= result['confidence'] <= 1

def test_tampering_detection_with_clean_image(image_analyzer, clean_image):
    """Test that tampering detection returns low risk for clean images."""
    result = image_analyzer.detect_tampering(clean_image)

    assert result['tampering_detected'] is False
    assert result['confidence'] < 0.3
```

**Integration Test Example**:
```python
# tests/integration/test_document_pipeline.py

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_full_document_analysis_pipeline(async_client: AsyncClient):
    """Test complete document analysis from upload to report."""

    # Upload document
    with open("tests/fixtures/sample.pdf", "rb") as f:
        response = await async_client.post(
            "/api/v1/documents/analyze",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )

    assert response.status_code == 200
    result = response.json()

    # Verify all analysis components present
    assert 'ocr_result' in result
    assert 'image_analysis' in result
    assert 'validation_results' in result
    assert 'risk_score' in result

    # Verify risk score structure
    assert 0 <= result['risk_score']['overall'] <= 100
    assert result['risk_score']['risk_level'] in ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
```

### Frontend Testing

We maintain **17 passing tests** with room for expansion.

#### Running Tests

```bash
# All tests
cd frontend
npm test

# Watch mode
npm run test

# Coverage
npm run test:coverage

# UI mode (interactive)
npm run test:ui
```

#### Writing Tests

**Unit Test Example**:
```typescript
// __tests__/unit/lib/config.test.ts

import { describe, it, expect } from 'vitest'
import { config, getApiUrl } from '@/lib/config'

describe('Configuration Module', () => {
  it('should have valid backend URL', () => {
    expect(config.api.BACKEND_URL).toBeDefined()
    expect(typeof config.api.BACKEND_URL).toBe('string')
  })

  it('should construct correct API URLs', () => {
    const url = getApiUrl('/documents')
    expect(url).toContain('/api/v1')
    expect(url).toContain('/documents')
  })
})
```

**Integration Test Example**:
```typescript
// __tests__/integration/hooks/useDocuments.test.tsx

import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@/test/test-utils'
import { useDashboardSummary } from '@/lib/hooks/useDocuments'

describe('useDashboardSummary Hook', () => {
  it('should fetch dashboard summary successfully', async () => {
    const { result } = renderHook(() => useDashboardSummary())

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Verify data structure
    expect(result.current.data).toHaveProperty('summary')
    expect(result.current.data.summary).toHaveProperty('total_clients')
  })
})
```

---

## Adding New Features

### Feature Development Checklist

- [ ] Create feature branch: `feature/your-feature-name`
- [ ] Write failing tests first (TDD)
- [ ] Implement feature with clean code
- [ ] Ensure all tests pass
- [ ] Update documentation
- [ ] Add/update API documentation
- [ ] Test manually in development
- [ ] Create pull request
- [ ] Code review by maintainer
- [ ] Merge to develop

### Example: Adding a New Validation Rule

#### 1. Backend Implementation

**Step 1**: Create test first

```python
# tests/unit/services/test_format_validator.py

def test_detect_date_format_inconsistencies():
    """Test detection of inconsistent date formats."""
    validator = FormatValidator()

    content = "Document dated 2025-01-15 and signed on 15/01/2025"
    result = validator.validate_date_consistency(content)

    assert result['has_issues'] is True
    assert 'inconsistent_date_formats' in result['issues']
```

**Step 2**: Implement feature

```python
# backend/src/backend/services/validation/format_validator.py

import re
from typing import Dict, List

class FormatValidator:
    def validate_date_consistency(self, content: str) -> Dict:
        """Detect inconsistent date formats."""

        date_patterns = {
            'ISO': r'\d{4}-\d{2}-\d{2}',
            'US': r'\d{2}/\d{2}/\d{4}',
            'EU': r'\d{2}\.\d{2}\.\d{4}'
        }

        found_formats = []
        for format_name, pattern in date_patterns.items():
            if re.search(pattern, content):
                found_formats.append(format_name)

        has_issues = len(found_formats) > 1

        return {
            'has_issues': has_issues,
            'found_formats': found_formats,
            'issues': ['inconsistent_date_formats'] if has_issues else [],
            'severity': 'MEDIUM' if has_issues else 'NONE'
        }
```

**Step 3**: Integrate into document service

```python
# backend/src/backend/services/document_service.py

def analyze_document(self, file_path: str) -> AnalysisResult:
    # ... existing code ...

    # Add new validation
    date_validation = self.format_validator.validate_date_consistency(text_content)
    validation_results['date_consistency'] = date_validation

    # Update risk score
    if date_validation['has_issues']:
        risk_factors.append(('date_inconsistency', 5))  # 5 points penalty

    # ... rest of analysis ...
```

**Step 4**: Update API schema

```python
# backend/src/backend/schemas/document.py

class ValidationResults(BaseModel):
    format_issues: List[str]
    structure_issues: List[str]
    content_issues: List[str]
    date_consistency: Dict  # NEW
    spelling_errors: List[str]
```

#### 2. Frontend Implementation

**Step 1**: Update API types

```typescript
// frontend/lib/api.ts

export interface ValidationResults {
  format_issues: string[]
  structure_issues: string[]
  content_issues: string[]
  date_consistency: {  // NEW
    has_issues: boolean
    found_formats: string[]
    issues: string[]
    severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  }
  spelling_errors: string[]
}
```

**Step 2**: Display in UI

```tsx
// components/compliance/DocumentValidationResults.tsx

export function DocumentValidationResults({ results }: Props) {
  return (
    <div className="validation-results">
      {/* ... existing validations ... */}

      {/* NEW: Date consistency validation */}
      {results.date_consistency.has_issues && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Inconsistent Date Formats</AlertTitle>
          <AlertDescription>
            Document contains multiple date formats: {results.date_consistency.found_formats.join(', ')}
            <br />
            Recommendation: Standardize to a single date format.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

**Step 3**: Write tests

```typescript
// __tests__/unit/components/DocumentValidationResults.test.tsx

import { render, screen } from '@/test/test-utils'
import { DocumentValidationResults } from '@/components/compliance/DocumentValidationResults'

describe('DocumentValidationResults', () => {
  it('should display date consistency warning', () => {
    const results = {
      date_consistency: {
        has_issues: true,
        found_formats: ['ISO', 'US'],
        issues: ['inconsistent_date_formats'],
        severity: 'MEDIUM'
      }
    }

    render(<DocumentValidationResults results={results} />)

    expect(screen.getByText(/Inconsistent Date Formats/i)).toBeInTheDocument()
    expect(screen.getByText(/ISO, US/i)).toBeInTheDocument()
  })
})
```

---

## Diagrams

### 1. Data Flow Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ 1. Upload document
       ↓
┌──────────────────┐
│ Frontend         │
│ (React/Next.js)  │
└──────┬───────────┘
       │ 2. POST /api/v1/documents/analyze
       ↓
┌──────────────────┐
│ API Router       │
│ (FastAPI)        │
└──────┬───────────┘
       │ 3. Validate & route
       ↓
┌──────────────────┐
│ Document Service │
└─┬────┬─────┬─────┘
  │    │     │
  │    │     └──────────────┐
  │    │ 4. Process         │
  │    ↓                    ↓
  │ ┌──────────┐     ┌─────────────┐
  │ │OCR       │     │Image        │
  │ │Service   │     │Analyzer     │
  │ └────┬─────┘     └──────┬──────┘
  │      │ 5. Extract       │
  │      │                  │ 6. Analyze
  │      ↓                  ↓
  │ ┌──────────────────────────┐
  │ │  Docling Engine          │
  │ │  (OCR + NLP)             │
  │ └────┬─────────────────────┘
  │      │
  │      │ 7. Text + Metadata
  ↓      ↓
┌────────────────────┐
│ Validation Services│
│ - Format           │
│ - Structure        │
│ - Content          │
└────────┬───────────┘
         │ 8. Validation results
         ↓
┌────────────────────┐
│ Risk Scorer        │
└────────┬───────────┘
         │ 9. Risk score (0-100)
         ↓
┌────────────────────┐
│ Report Generator   │
└────────┬───────────┘
         │ 10. Generate report
         ↓
┌────────────────────┐
│ Database           │
│ (PostgreSQL/Redis) │
└────────┬───────────┘
         │ 11. Store metadata
         ↓
┌────────────────────┐
│ Audit Logger       │
│ (JSONL files)      │
└────────┬───────────┘
         │ 12. Return response
         ↓
┌────────────────────┐
│ Frontend           │
│ Display results    │
└────────────────────┘
```

### 2. Sequence Diagram - Document Upload Flow

```
User       Frontend    API Router  Document     OCR        Image      Risk       Database
 │            │            │        Service     Service    Analyzer   Scorer        │
 │ Upload     │            │          │           │          │          │           │
 ├───────────>│            │          │           │          │          │           │
 │            │ POST /analyze         │           │          │          │           │
 │            ├────────────>          │           │          │          │           │
 │            │            │ Validate │           │          │          │           │
 │            │            ├─────────>│           │          │          │           │
 │            │            │          │ Extract   │          │          │           │
 │            │            │          ├──────────>│          │          │           │
 │            │            │          │           │ OCR Text │          │           │
 │            │            │          │<──────────┤          │          │           │
 │            │            │          │                      │          │           │
 │            │            │          │ Analyze Image        │          │           │
 │            │            │          ├─────────────────────>│          │           │
 │            │            │          │                      │ Results  │           │
 │            │            │          │<─────────────────────┤          │           │
 │            │            │          │                                 │           │
 │            │            │          │ Run Validations                 │           │
 │            │            │          ├─────────────────────────────────>           │
 │            │            │          │                                 │           │
 │            │            │          │ Calculate Risk                  │           │
 │            │            │          ├─────────────────────────────────>           │
 │            │            │          │                                 │ Risk=78   │
 │            │            │          │<─────────────────────────────────           │
 │            │            │          │                                             │
 │            │            │          │ Save Metadata                               │
 │            │            │          ├─────────────────────────────────────────────>
 │            │            │          │                                             │
 │            │            │          │ Log Audit Trail                             │
 │            │            │          ├─────────────────────────────────────────────>
 │            │            │          │                                             │
 │            │            │ Results  │                                             │
 │            │<───────────┼──────────┤                                             │
 │            │            │          │                                             │
 │ Display    │            │          │                                             │
 │<───────────┤            │          │                                             │
```

### 3. Component Diagram - Frontend Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend Application                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  Pages (Next.js App Router)            │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │ Compliance   │  │ RM Dashboard │  │Investigation│ │  │
│  │  │ Dashboard    │  │              │  │ Page        │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │  │
│  └─────────┼──────────────────┼──────────────────┼────────┘  │
│            │                  │                  │           │
│  ┌─────────┴──────────────────┴──────────────────┴────────┐  │
│  │                    Components Layer                     │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │ KanbanBoard  │  │ AlertCard    │  │ Document    │ │  │
│  │  │              │  │              │  │ Upload      │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │  │
│  └─────────┼──────────────────┼──────────────────┼────────┘  │
│            │                  │                  │           │
│  ┌─────────┴──────────────────┴──────────────────┴────────┐  │
│  │               Custom Hooks (useDocuments)              │  │
│  │                                                         │  │
│  │  ┌──────────────────────┐  ┌────────────────────────┐ │  │
│  │  │ useDashboardSummary()│  │ useActiveAlerts()      │ │  │
│  │  └──────────────────────┘  └────────────────────────┘ │  │
│  │  ┌──────────────────────┐  ┌────────────────────────┐ │  │
│  │  │ useAnalyzeDocument() │  │ useUpdateAlertStatus() │ │  │
│  │  └──────────────────────┘  └────────────────────────┘ │  │
│  └─────────┬────────────────────────────────────────────┘  │
│            │                                                │
│  ┌─────────┴─────────────────────────────────────────────┐  │
│  │              TanStack Query Provider                   │  │
│  │         (Caching, Auto-refresh, Mutations)            │  │
│  └─────────┬─────────────────────────────────────────────┘  │
│            │                                                │
│  ┌─────────┴─────────────────────────────────────────────┐  │
│  │                  API Client Layer                      │  │
│  │              (lib/api.ts, lib/config.ts)              │  │
│  └─────────┬─────────────────────────────────────────────┘  │
└────────────┼──────────────────────────────────────────────┘
             │
             │ HTTP/REST (JSON)
             │
   ┌─────────┴──────────┐
   │ Backend API        │
   │ (FastAPI)          │
   └────────────────────┘
```

### 4. Class Diagram - Backend Services

```
┌──────────────────────────────────────┐
│         DocumentService              │
├──────────────────────────────────────┤
│ - ocr_service: OCRService            │
│ - image_analyzer: ImageAnalyzer      │
│ - validators: List[Validator]        │
│ - risk_scorer: RiskScorer            │
│ - report_generator: ReportGenerator  │
├──────────────────────────────────────┤
│ + analyze_document(file) -> Result   │
│ + get_analysis_status(id) -> Status  │
│ - _process_ocr(file) -> Text         │
│ - _run_validations(text) -> Issues   │
│ - _calculate_risk(results) -> Score  │
└────────────┬─────────────────────────┘
             │
             │ uses
             ↓
┌──────────────────────────────────────┐
│           OCRService                 │
├──────────────────────────────────────┤
│ - docling_parser: DoclingParser      │
│ - config: OCRConfig                  │
├──────────────────────────────────────┤
│ + extract_text(image) -> str         │
│ + extract_metadata(file) -> dict     │
│ + parse_tables(pdf) -> DataFrame     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│          ImageAnalyzer               │
├──────────────────────────────────────┤
│ - ai_detector: AIDetector            │
│ - tampering_detector: TamperingD...  │
│ - metadata_analyzer: MetadataAn...   │
├──────────────────────────────────────┤
│ + detect_ai_generated(img) -> dict   │
│ + detect_tampering(img) -> dict      │
│ + analyze_metadata(img) -> dict      │
│ + reverse_image_search(img) -> list  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│     <<interface>> Validator          │
├──────────────────────────────────────┤
│ + validate(content) -> ValidationR...│
└──────────────────────────────────────┘
           ▲         ▲         ▲
           │         │         │
      ┌────┴───┐ ┌───┴────┐ ┌─┴────────┐
      │Format  │ │Content │ │Structure │
      │Validat.│ │Validat.│ │Validator │
      └────────┘ └────────┘ └──────────┘

┌──────────────────────────────────────┐
│           RiskScorer                 │
├──────────────────────────────────────┤
│ - weights: dict                      │
│ - thresholds: dict                   │
├──────────────────────────────────────┤
│ + calculate_risk(results) -> Score   │
│ + categorize_risk(score) -> Level    │
│ - _weight_factors(factors) -> float  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│        ReportGenerator               │
├──────────────────────────────────────┤
│ - template_engine: Jinja2            │
│ - export_formats: List[str]          │
├──────────────────────────────────────┤
│ + generate_report(results) -> Report │
│ + export_json(report) -> str         │
│ + export_markdown(report) -> str     │
│ + export_pdf(report) -> bytes        │
└──────────────────────────────────────┘
```

### 5. Use Case Diagram

```
                         Speed-Run AML Platform

  Compliance Officer                  System                RM Officer
         │                              │                        │
         │                              │                        │
    ┌────┴─────────┐                   │              ┌─────────┴────┐
    │              │                   │              │              │
    ▼              ▼                   ▼              ▼              ▼
┌────────┐   ┌──────────┐      ┌─────────────┐  ┌────────┐  ┌──────────┐
│Upload  │   │View      │      │Analyze      │  │View    │  │Monitor   │
│Document│   │Dashboard │      │Document     │  │Clients │  │Alerts    │
└────────┘   └──────────┘      └──────┬──────┘  └────────┘  └──────────┘
                │                     │
                │                     ├─────> OCR Extraction
                │                     │
                │                     ├─────> Format Validation
                │                     │
                │                     ├─────> AI Detection
                │                     │
                │                     ├─────> Tampering Detection
                │                     │
                │                     ├─────> Risk Scoring
                │                     │
                │                     └─────> Generate Report
                │
                ├─────> View Active Alerts
                │
                ├─────> Update Alert Status
                │
                ├─────> Download Report
                │
                └─────> View Audit Trail


   Legal Team
        │
        │
    ┌───┴────────┐
    │            │
    ▼            ▼
┌────────┐  ┌─────────┐
│Access  │  │Generate │
│Audit   │  │Compli...│
│Trail   │  │Reports  │
└────────┘  └─────────┘
```

---

## Code Style

### Backend (Python)

We follow **PEP 8** with some additions:

```python
# Good
def analyze_document(file_path: str, options: Optional[Dict] = None) -> AnalysisResult:
    """
    Analyze a document for fraud indicators.

    Args:
        file_path: Path to the document file
        options: Optional analysis configuration

    Returns:
        AnalysisResult containing risk score and findings

    Raises:
        ValueError: If file format is not supported
        FileNotFoundError: If file does not exist
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # Process document
    result = self._process_file(file_path, options or {})

    return result


# Bad
def analyze(f, opts=None):  # No type hints, unclear name
    if not os.path.exists(f):
        return None  # Should raise exception
    return self._process_file(f, opts)  # No docstring
```

**Key Rules**:
- Use type hints for all function parameters and returns
- Write docstrings for all public methods (Google style)
- Use descriptive variable names (avoid abbreviations)
- Keep functions under 50 lines
- Maximum line length: 100 characters
- Use Black formatter

### Frontend (TypeScript)

We follow **TypeScript ESLint** rules:

```typescript
// Good
interface DocumentAnalysisProps {
  documentId: string
  onAnalysisComplete: (result: AnalysisResult) => void
  showLoadingState?: boolean
}

export function DocumentAnalysis({
  documentId,
  onAnalysisComplete,
  showLoadingState = true
}: DocumentAnalysisProps): JSX.Element {
  const { data, isLoading, error } = useAnalyzeDocument(documentId)

  if (isLoading && showLoadingState) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorAlert message={error.message} />
  }

  return (
    <div className="document-analysis">
      <RiskScoreBadge score={data.risk_score} />
      <ValidationResults results={data.validation_results} />
    </div>
  )
}


// Bad
export function DocAnalysis(props: any) {  // No interface, any type
  const d = useAnalyzeDocument(props.id)  // Unclear variable name

  if (d.isLoading) return <div>Loading...</div>  // No conditional showLoadingState

  return <div>{d.data.risk_score}</div>  // No proper structure
}
```

**Key Rules**:
- Always define interfaces for props
- Use TypeScript strict mode
- Avoid `any` types
- Use functional components with hooks
- Keep components under 200 lines
- Use Prettier formatter

---

## Pull Request Process

### Creating a Pull Request

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open PR on GitHub**
   - Title: Clear, concise description
   - Description: Include context, changes, testing
   - Link related issues
   - Add screenshots (for UI changes)

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #42

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added reverse image search integration
- Updated risk scoring algorithm
- Fixed OCR timeout issue

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No breaking changes
```

### Code Review Guidelines

**For Reviewers**:
- Review within 24 hours
- Be constructive and respectful
- Check for:
  - Correctness
  - Test coverage
  - Code style
  - Documentation
  - Performance implications
- Approve or request changes

**For Authors**:
- Respond to feedback promptly
- Don't take criticism personally
- Explain your decisions
- Update PR based on feedback
- Request re-review when ready

---

## Getting Help

### Resources
- **Documentation**: `/docs` directory
- **API Docs**: http://localhost:8000/docs
- **GitHub Issues**: For bugs and feature requests
- **Slack Channel**: #speed-run-dev (if available)

### Common Questions

**Q: How do I add a new API endpoint?**
A: See [API Development](#api-development) section. Create router, service, schema, and tests.

**Q: Where should I put shared components?**
A: In `frontend/components/shared/` for components used across multiple pages.

**Q: How do I run only failed tests?**
A: Backend: `uv run pytest --lf`. Frontend: `npm test -- --reporter=verbose`

**Q: How do I debug async issues in FastAPI?**
A: Use `breakpoint()` or `import pdb; pdb.set_trace()` in async functions. Tests must be marked with `@pytest.mark.asyncio`.

---

## License

Speed-Run is proprietary software developed for Julius Baer. Contributions are subject to the organization's contribution agreement.

---

## Acknowledgments

- Docling team for the excellent OCR engine
- FastAPI community for the amazing framework
- Next.js team for the robust frontend framework
- All contributors who help improve Speed-Run

---

**Happy Contributing! 🚀**

For questions or suggestions about this guide, please open an issue or contact the maintainers.

---

**Document Version**: 1.0
**Last Updated**: November 2, 2025
