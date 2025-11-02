# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Speed-Run is a full-stack application for OCR and document parsing. The backend is built with FastAPI and uses Docling for intelligent document understanding, OCR, and content extraction from various document formats.

## Architecture

### Backend (FastAPI - Speed-Run/backend/)
- **Framework**: FastAPI with async support
- **OCR Engine**: Docling for document understanding and text extraction
- **Structure**:
  - `routers/`: API endpoints for OCR and document parsing
  - `services/`: Business logic for OCR and document processing
  - `schemas/`: Pydantic models for request/response validation
  - `config.py`: Application configuration and settings

## Development Commands

### Setup
```bash
# Backend setup (from Speed-Run/backend/ directory)
cd Speed-Run/backend
uv sync
# or
pip install -r requirements.txt
```

### Running the Application
```bash
# Backend (from Speed-Run/backend/ directory)
uv run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
# or
python -m backend.main

# API will be available at:
# - http://localhost:8000 (API)
# - http://localhost:8000/docs (Swagger UI)
```

### Testing
```bash
# Run all tests
# To be implemented

# Run a single test
# To be implemented
```

### Linting
```bash
# Backend
cd Speed-Run/backend
uv run ruff check .
uv run ruff format .
```

## Key Technical Details

### Backend
- Uses **Docling** as the primary engine for OCR and document parsing
- Supports multiple document formats: PDF, DOCX, PNG, JPG, JPEG, TIFF, BMP
- Async/await patterns throughout for better performance
- File upload size limit: 10MB (configurable)
- CORS enabled for frontend integration
- Markdown export for extracted text

### API Endpoints
- `POST /api/v1/ocr/extract` - OCR from images
- `POST /api/v1/documents/parse` - Full document parsing
- `POST /api/v1/documents/extract-tables` - Table extraction

## Dependencies

### Backend Critical Dependencies
- **FastAPI**: Web framework
- **Docling**: OCR and document understanding engine
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation and settings management
- **Pillow**: Image processing
- **PyPDF2**: PDF handling
- **python-docx**: DOCX handling
