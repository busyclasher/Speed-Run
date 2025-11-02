# Julius Baer AML Platform - System Architecture Diagram

## Complete System Architecture

```mermaid
graph TB
    subgraph "Client Layer - Browser"
        USER[👤 End Users]
        COMPLIANCE[🛡️ Compliance Officer]
        RM[💼 Relationship Manager]
    end

    subgraph "Frontend Layer - Next.js 14 - Port 3000"
        subgraph "Pages & Routes"
            LANDING["Root - Role Selector"]
            COMP_DASH["compliance - Dashboard"]
            COMP_REVIEW["compliance review reviewId"]
            RM_DASH["rm - RM Dashboard"]
            RM_CLIENT["rm clientId - Portfolio"]
            ALERT_INV["investigation alertId"]
        end

        subgraph "Component Architecture"
            direction LR
            UI_LIB["shadcn ui Components<br/>Button Card Table Dialog etc"]
            COMP_COMPS["Compliance Components<br/>KanbanBoardDnD<br/>DocumentUploadAnalysis<br/>RiskScoreCard<br/>ClientProfile"]
            RM_COMPS["RM Components<br/>ClientPortfolioDetail<br/>SmartRecommendations<br/>TransactionHistory<br/>AdverseMediaFeed"]
            INV_COMPS["Investigation Components<br/>TransactionDetails<br/>DocumentViewer<br/>AgentFindings<br/>HistoricalContext"]
            CHARTS["Chart Components<br/>LineChart PieChart<br/>Recharts"]
        end

        subgraph "State & Data Management"
            REACT_QUERY["React Query<br/>tanstack react-query<br/>Data Fetching & Caching"]
            API_CLIENT["API Client<br/>lib api.ts<br/>Supabase Integration"]
            MOCK_DATA["Mock Data<br/>Development Fallback"]
            REC_ENGINE["Recommendation Engine<br/>AI-driven suggestions"]
        end
    end

    subgraph "Backend Layer - FastAPI - Port 8000"
        subgraph "Main AML Platform API"
            MAIN_APP["main.py<br/>FastAPI Application"]

            subgraph "API Routes"
                ALERT_API["api alerts<br/>Summary Active Details Remediate"]
                TRANS_API["api transactions<br/>Volume History"]
                AUDIT_API["api audit-trail<br/>Audit Logs"]
                WS_API["ws alerts<br/>WebSocket Real-time"]
            end

            subgraph "AI Agent System"
                ORCHESTRATOR["Agent Orchestrator<br/>Multi-agent coordinator"]
                REG_AGENT["Regulatory Watcher<br/>FINMA Compliance"]
                TRANS_AGENT["Transaction Analyst<br/>Pattern Analysis"]
                DOC_AGENT["Document Forensics<br/>Tampering Detection"]
            end

            DB_SERVICE["Database Service<br/>Mock Supabase Integration"]
        end

        subgraph "Document Corroboration System API"
            CORR_APP["src backend main.py<br/>Document Analysis FastAPI"]

            subgraph "Corroboration Routes"
                OCR_API["api v1 ocr<br/>Text Extraction"]
                DOC_PARSE_API["api v1 documents<br/>Parse Extract Tables"]
                CORR_API["api v1 corroboration<br/>Analyze Validate Report"]
            end

            subgraph "Document Processing Pipeline"
                direction TB
                OCR_SVC["OCR Service<br/>Docling Engine<br/>Text Extraction"]
                DOC_SVC["Document Service<br/>PDF DOCX Image Parser<br/>Table Extraction"]
                DOC_VAL["Document Validator<br/>Format Structure Content<br/>spaCy NLP"]
                IMG_ANALYZER["Image Analyzer<br/>EXIF AI Detection<br/>ELA Tampering<br/>Forensics"]
                RISK_SCORER["Risk Scorer<br/>Multi-factor Scoring<br/>Weighted Algorithm"]
                REPORT_GEN["Report Generator<br/>Audit Logs JSON Reports<br/>Markdown Export"]
                CORR_SVC["Corroboration Service<br/>Pipeline Orchestrator"]
            end
        end
    end

    subgraph "Data Layer"
        subgraph "Database - Supabase PostgreSQL"
            direction TB
            ALERTS_TBL[("alerts<br/>AML Alerts<br/>Agent Findings<br/>Document Issues")]
            TRANS_TBL[("transactions<br/>Financial Transactions<br/>Client History")]
            DOCS_TBL[("documents<br/>Document Metadata<br/>Analysis Results")]
            AUDIT_TBL[("audit_logs<br/>Complete Audit Trail<br/>User Actions")]
            CLIENTS_TBL[("clients<br/>Client Information<br/>KYC Data")]
        end

        subgraph "File Storage"
            TMP_STORAGE["tmp uploads<br/>Temporary Files"]
            AUDIT_FILES["tmp corroboration audit<br/>JSONL Audit Logs"]
            REPORT_STORAGE["JSON Report Storage<br/>Full Analysis Reports"]
        end
    end

    subgraph "External Services & APIs"
        subgraph "AI & ML Services"
            GROQ["Groq API<br/>llama-3.1-70b-versatile<br/>llama-3.2-90b-vision<br/>AI Agent Intelligence"]
            SIGHTENGINE["SightEngine API<br/>AI-Generated Image Detection<br/>Content Moderation"]
            GOOGLE_VISION["Google Vision API<br/>Advanced OCR<br/>Image Analysis"]
            HIVE_AI["Hive AI<br/>Content Detection"]
        end

        subgraph "Image Verification Services"
            SERPAPI["SerpAPI<br/>Google Reverse Image Search<br/>Source Verification"]
            TINEYE["TinEye API<br/>Reverse Image Search<br/>Duplicate Detection"]
            BING_VISION["Bing Visual Search<br/>Image Similarity"]
        end

        subgraph "Document Processing"
            DOCLING["Docling Library<br/>Local OCR & Parsing<br/>Table Extraction"]
            SPACY["spaCy NLP<br/>en_core_web_sm<br/>Text Analysis"]
        end
    end

    subgraph "Supporting Libraries & Tools"
        PIL["Pillow<br/>Image Processing"]
        NUMPY["NumPy SciPy<br/>Forensic Algorithms"]
        DND_KIT["dnd-kit<br/>Drag & Drop UI"]
        RECHARTS["Recharts<br/>Data Visualization"]
    end

    %% User to Frontend Connections
    USER --> LANDING
    COMPLIANCE --> COMP_DASH
    COMPLIANCE --> COMP_REVIEW
    COMPLIANCE --> ALERT_INV
    RM --> RM_DASH
    RM --> RM_CLIENT

    %% Frontend Internal Connections
    LANDING --> UI_LIB
    COMP_DASH --> COMP_COMPS
    COMP_DASH --> CHARTS
    COMP_REVIEW --> INV_COMPS
    RM_DASH --> RM_COMPS
    RM_CLIENT --> RM_COMPS
    ALERT_INV --> INV_COMPS

    COMP_COMPS --> DND_KIT
    CHARTS --> RECHARTS

    %% Frontend to API Client
    COMP_DASH --> REACT_QUERY
    COMP_REVIEW --> REACT_QUERY
    RM_DASH --> REACT_QUERY
    RM_CLIENT --> REACT_QUERY
    ALERT_INV --> REACT_QUERY

    REACT_QUERY --> API_CLIENT
    API_CLIENT --> MOCK_DATA
    RM_COMPS --> REC_ENGINE

    %% API Client to Backend
    API_CLIENT -->|REST API<br/>HTTP HTTPS| MAIN_APP
    API_CLIENT -->|WebSocket<br/>Real-time| WS_API
    API_CLIENT -->|Document Upload| CORR_APP

    %% Main AML Platform Flow
    MAIN_APP --> ALERT_API
    MAIN_APP --> TRANS_API
    MAIN_APP --> AUDIT_API
    MAIN_APP --> WS_API

    ALERT_API --> DB_SERVICE
    TRANS_API --> DB_SERVICE
    AUDIT_API --> DB_SERVICE

    ALERT_API --> ORCHESTRATOR
    ORCHESTRATOR --> REG_AGENT
    ORCHESTRATOR --> TRANS_AGENT
    ORCHESTRATOR --> DOC_AGENT

    %% Document Corroboration Flow
    CORR_APP --> OCR_API
    CORR_APP --> DOC_PARSE_API
    CORR_APP --> CORR_API

    OCR_API --> OCR_SVC
    DOC_PARSE_API --> DOC_SVC
    CORR_API --> CORR_SVC

    CORR_SVC --> OCR_SVC
    CORR_SVC --> DOC_SVC
    CORR_SVC --> DOC_VAL
    CORR_SVC --> IMG_ANALYZER
    CORR_SVC --> RISK_SCORER
    CORR_SVC --> REPORT_GEN

    OCR_SVC --> DOCLING
    DOC_SVC --> DOCLING
    DOC_VAL --> SPACY
    IMG_ANALYZER --> PIL
    IMG_ANALYZER --> NUMPY

    %% Backend to Database
    DB_SERVICE --> ALERTS_TBL
    DB_SERVICE --> TRANS_TBL
    DB_SERVICE --> CLIENTS_TBL
    DB_SERVICE --> AUDIT_TBL

    DOC_SVC --> DOCS_TBL
    REPORT_GEN --> DOCS_TBL
    REPORT_GEN --> AUDIT_TBL

    %% File Storage
    CORR_SVC --> TMP_STORAGE
    REPORT_GEN --> AUDIT_FILES
    REPORT_GEN --> REPORT_STORAGE

    %% External API Connections
    REG_AGENT -.->|Future| GROQ
    TRANS_AGENT -.->|Future| GROQ
    DOC_AGENT -.->|Future| GROQ

    IMG_ANALYZER -.->|Ready| SIGHTENGINE
    IMG_ANALYZER -.->|Ready| GOOGLE_VISION
    IMG_ANALYZER -.->|Ready| HIVE_AI
    IMG_ANALYZER -.->|Ready| SERPAPI
    IMG_ANALYZER -.->|Ready| TINEYE
    IMG_ANALYZER -.->|Ready| BING_VISION

    %% Styling
    classDef frontend fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef backend fill:#10b981,stroke:#059669,color:#fff
    classDef database fill:#f59e0b,stroke:#d97706,color:#fff
    classDef external fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef agent fill:#ec4899,stroke:#db2777,color:#fff
    classDef user fill:#6366f1,stroke:#4f46e5,color:#fff

    class LANDING,COMP_DASH,COMP_REVIEW,RM_DASH,RM_CLIENT,ALERT_INV,UI_LIB,COMP_COMPS,RM_COMPS,INV_COMPS,CHARTS,REACT_QUERY,API_CLIENT,MOCK_DATA,REC_ENGINE frontend
    class MAIN_APP,CORR_APP,ALERT_API,TRANS_API,AUDIT_API,WS_API,OCR_API,DOC_PARSE_API,CORR_API,OCR_SVC,DOC_SVC,DOC_VAL,IMG_ANALYZER,RISK_SCORER,REPORT_GEN,CORR_SVC,DB_SERVICE backend
    class ALERTS_TBL,TRANS_TBL,DOCS_TBL,AUDIT_TBL,CLIENTS_TBL,TMP_STORAGE,AUDIT_FILES,REPORT_STORAGE database
    class GROQ,SIGHTENGINE,GOOGLE_VISION,HIVE_AI,SERPAPI,TINEYE,BING_VISION,DOCLING,SPACY,PIL,NUMPY,DND_KIT,RECHARTS external
    class ORCHESTRATOR,REG_AGENT,TRANS_AGENT,DOC_AGENT agent
    class USER,COMPLIANCE,RM user
```

---

## Data Flow Diagrams

### 1. Alert Investigation Flow

```mermaid
sequenceDiagram
    participant CO as Compliance Officer
    participant FE as Frontend Next.js
    participant API as FastAPI Backend
    participant Orch as Agent Orchestrator
    participant RW as Regulatory Watcher
    participant TA as Transaction Analyst
    participant DF as Document Forensics
    participant DB as Supabase Database

    CO->>FE: Navigate to compliance
    FE->>API: GET api alerts active
    API->>DB: Query alerts table
    DB-->>API: Return active alerts
    API-->>FE: Alert list with metadata
    FE-->>CO: Display Kanban board

    CO->>FE: Click on alert card
    FE->>API: GET api alerts alertId
    API->>Orch: analyze_alert alert_data

    par Parallel Agent Analysis
        Orch->>RW: analyze alert
        RW-->>Orch: FINMA compliance findings
    and
        Orch->>TA: analyze alert
        TA-->>Orch: Pattern anomalies
    and
        Orch->>DF: analyze alert
        DF-->>Orch: Document tampering issues
    end

    Orch->>Orch: Calculate aggregate risk score
    Orch-->>API: Comprehensive analysis
    API->>DB: Store agent findings
    API-->>FE: AlertDetails with findings
    FE-->>CO: Display investigation cockpit

    CO->>FE: Approve or Reject with reason
    FE->>API: POST api alerts alertId remediate
    API->>DB: Update alert status
    API->>DB: Log audit trail
    DB-->>API: Success
    API-->>FE: Confirmation
    FE-->>CO: Show success message
```

### 2. Document Corroboration Flow

```mermaid
sequenceDiagram
    participant User as User CO or RM
    participant FE as Frontend
    participant CorrAPI as Corroboration API
    participant CorrSvc as Corroboration Service
    participant DocSvc as Document Service
    participant Validator as Document Validator
    participant ImgAnalyzer as Image Analyzer
    participant RiskScorer as Risk Scorer
    participant ReportGen as Report Generator
    participant Storage as File Storage
    participant DB as Database

    User->>FE: Upload document PDF or Image
    FE->>CorrAPI: POST api v1 corroboration analyze
    CorrAPI->>Storage: Save to tmp uploads
    CorrAPI->>CorrSvc: analyze_document file_path

    alt Document Type PDF or DOCX
        CorrSvc->>DocSvc: parse_document file_path
        DocSvc->>DocSvc: Docling OCR plus extraction
        DocSvc-->>CorrSvc: Full text plus tables
    else Document Type Image
        CorrSvc->>DocSvc: parse_document_bytes image
        DocSvc-->>CorrSvc: OCR text
    end

    par Multi-dimensional Validation
        CorrSvc->>Validator: validate_format text
        Validator->>Validator: Check spacing fonts spelling
        Validator-->>CorrSvc: FormatValidationResult
    and
        CorrSvc->>Validator: validate_structure text
        Validator->>Validator: Check completeness templates
        Validator-->>CorrSvc: StructureValidationResult
    and
        CorrSvc->>Validator: validate_content text
        Validator->>Validator: PII detection quality score
        Validator-->>CorrSvc: ContentValidationResult
    and
        CorrSvc->>ImgAnalyzer: analyze_image file_path
        ImgAnalyzer->>ImgAnalyzer: EXIF metadata analysis
        ImgAnalyzer->>ImgAnalyzer: AI-generated detection
        ImgAnalyzer->>ImgAnalyzer: ELA tampering detection
        ImgAnalyzer->>ImgAnalyzer: Forensic analysis
        ImgAnalyzer-->>CorrSvc: ImageAnalysisResult
    end

    CorrSvc->>RiskScorer: calculate_risk_score all_results
    RiskScorer->>RiskScorer: Weight components format 15% structure 25% content 20% image 40%
    RiskScorer->>RiskScorer: Calculate severity scores
    RiskScorer->>RiskScorer: Determine risk level & recommendations
    RiskScorer-->>CorrSvc: RiskScore

    CorrSvc->>ReportGen: generate_report all_data
    ReportGen->>ReportGen: Assign document_id
    ReportGen->>Storage: Save JSONL audit log
    ReportGen->>Storage: Save full JSON report
    ReportGen->>DB: Store report metadata
    ReportGen-->>CorrSvc: CorroborationReport

    CorrSvc->>Storage: Delete temp file
    CorrSvc-->>CorrAPI: Complete report
    CorrAPI-->>FE: JSON response
    FE-->>User: Display analysis results with risk score
```

### 3. Real-time Alert Update Flow

```mermaid
sequenceDiagram
    participant CO as Compliance Officer
    participant Browser as Browser
    participant WS as WebSocket Server
    participant System as Alert System
    participant DB as Database

    CO->>Browser: Open compliance dashboard
    Browser->>WS: Connect to WebSocket ws localhost 8000 ws alerts
    WS-->>Browser: Connection accepted
    WS-->>Browser: status connected
    Browser-->>CO: Dashboard loaded real-time active

    loop Monitor Alerts
        System->>DB: New transaction detected
        DB->>System: Transaction data
        System->>System: Run agent analysis
        System->>DB: Create new alert
        System->>WS: broadcast_new_alert alert_data
        WS->>Browser: type new_alert with alert data
        Browser->>Browser: Update Kanban board
        Browser-->>CO: Show notification
    end

    Note over CO,DB: Alert Status Change
    CO->>Browser: Drag card to Resolved
    Browser->>WS: action update_status alertId 123 status resolved
    WS->>DB: Update alert status
    WS->>WS: broadcast_alert_update 123 resolved
    WS->>Browser: Notify all connected clients
    Browser-->>CO: Visual confirmation
```

### 4. Recommendation Engine Flow

```mermaid
flowchart TD
    Start[Client Portfolio View] --> FetchData[Fetch Client Data from API]
    FetchData --> ClientProfile[Client Profile Data]
    FetchData --> TransHistory[Transaction History]
    FetchData --> CompStatus[Compliance Status]
    FetchData --> RiskScore[Risk Score]

    ClientProfile --> Engine[Recommendation Engine]
    TransHistory --> Engine
    CompStatus --> Engine
    RiskScore --> Engine

    Engine --> CheckRisk{Risk Level?}

    CheckRisk -->|Critical| CriticalRec[URGENT: Escalate to Senior Officer<br/>Time: Immediate<br/>Type: Escalate]
    CheckRisk -->|High| HighRec[HIGH: Schedule Enhanced DD Review<br/>Time: 24 hours<br/>Type: Review]
    CheckRisk -->|Medium| MediumRec[MEDIUM: Contact for Document Update<br/>Time: 1 week<br/>Type: Contact]
    CheckRisk -->|Low| LowRec[LOW: Schedule Periodic Review<br/>Time: 1 month<br/>Type: Schedule]

    CriticalRec --> CheckComp{Pending Compliance?}
    HighRec --> CheckComp
    MediumRec --> CheckComp
    LowRec --> CheckComp

    CheckComp -->|Yes| AddCompRec[Add: Complete Outstanding KYC<br/>Time: 3 days<br/>Type: Review]
    CheckComp -->|No| CheckTrans{High Transaction Volume?}

    AddCompRec --> CheckTrans

    CheckTrans -->|Yes| AddTransRec[Add: Review Large Transactions<br/>Time: 2 days<br/>Type: Review]
    CheckTrans -->|No| CheckMedia{Adverse Media?}

    AddTransRec --> CheckMedia

    CheckMedia -->|Yes| AddMediaRec[Add: Investigate Media Reports<br/>Time: 1 week<br/>Type: Escalate]
    CheckMedia -->|No| AggregateRecs[Aggregate All Recommendations]

    AddMediaRec --> AggregateRecs

    AggregateRecs --> SortByUrgency[Sort by Urgency & Time]
    SortByUrgency --> DisplayRecs[Display Smart Recommendations Panel]
    DisplayRecs --> End[User Takes Action]

    style Start fill:#6366f1
    style Engine fill:#10b981
    style CriticalRec fill:#ef4444
    style HighRec fill:#f97316
    style MediumRec fill:#eab308
    style LowRec fill:#22c55e
    style End fill:#6366f1
```

---

## Component Interaction Map

```mermaid
graph LR
    subgraph "Frontend Components"
        KB[KanbanBoardDnD]
        DUA[DocumentUploadAnalysis]
        CPD[ClientPortfolioDetail]
        SR[SmartRecommendations]
        TH[TransactionHistory]
        AF[AgentFindings]
        DV[DocumentViewer]
    end

    subgraph "Shared UI Components"
        CARD[Card]
        BADGE[Badge]
        TABLE[Table]
        DIALOG[Dialog]
        PROGRESS[Progress]
    end

    subgraph "Data Layer"
        RQ[React Query]
        AC[API Client]
        SUP[Supabase]
    end

    subgraph "Utilities"
        CN[cn - Class Merger]
        FMT[Formatters]
        RE[Recommendation Engine]
    end

    KB --> CARD
    KB --> BADGE
    KB --> DIALOG
    KB --> RQ

    DUA --> CARD
    DUA --> PROGRESS
    DUA --> AC

    CPD --> SR
    CPD --> TH
    CPD --> CARD
    CPD --> RQ

    AF --> BADGE
    AF --> CARD

    DV --> CARD
    DV --> TABLE

    SR --> RE
    SR --> BADGE

    RQ --> AC
    AC --> SUP

    CARD --> CN
    BADGE --> CN
    TABLE --> CN

    classDef component fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef ui fill:#10b981,stroke:#059669,color:#fff
    classDef data fill:#f59e0b,stroke:#d97706,color:#fff
    classDef util fill:#8b5cf6,stroke:#7c3aed,color:#fff

    class KB,DUA,CPD,SR,TH,AF,DV component
    class CARD,BADGE,TABLE,DIALOG,PROGRESS ui
    class RQ,AC,SUP data
    class CN,FMT,RE util
```

---

## Technology Stack Overview

```mermaid
mindmap
  root((Julius Baer<br/>AML Platform))
    Frontend
      Framework
        Next.js 14
        React 18
        TypeScript
      UI and Styling
        TailwindCSS
        shadcn ui
        Radix UI
        Lucide Icons
      State and Data
        React Query
        Supabase Client
      Interactions
        dnd-kit Drag and Drop
        Recharts Visualization
        date-fns
    Backend
      Framework
        FastAPI
        Python 3.9 plus
        Uvicorn ASGI
        Pydantic
      Document Processing
        Docling OCR
        PyPDF2
        python-docx
        Pillow PIL
      NLP and Analysis
        spaCy
        NumPy
        SciPy
      AI Agents
        Groq API Ready
        Multi-agent System
    Database
      Primary
        Supabase PostgreSQL
      Storage
        File System tmp
        JSONL Audit Logs
    External APIs
      AI Services
        Groq llama 3.1 and 3.2
        SightEngine
        Google Vision
        Hive AI
      Image Verification
        SerpAPI
        TinEye
        Bing Visual Search
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "CDN Layer"
            CF["Cloudflare or Vercel CDN<br/>Static Assets Edge Caching"]
        end

        subgraph "Application Layer"
            LB1["Load Balancer<br/>Frontend"]
            FE1["Next.js Instance 1<br/>Port 3000"]
            FE2["Next.js Instance 2<br/>Port 3000"]
            FEN["Next.js Instance N<br/>Port 3000"]

            LB2["Load Balancer<br/>Backend"]
            BE1["FastAPI Instance 1<br/>Port 8000"]
            BE2["FastAPI Instance 2<br/>Port 8000"]
            BEN["FastAPI Instance N<br/>Port 8000"]
        end

        subgraph "Data Layer"
            SUPABASE["Supabase<br/>PostgreSQL<br/>Multi-region"]
            REDIS["Redis Cluster<br/>Caching and Pub Sub"]
            S3["S3 or GCS<br/>Document Storage"]
        end

        subgraph "External Services"
            GROQ_PROD["Groq API<br/>Production Tier"]
            SIGHT_PROD["SightEngine<br/>Image Analysis"]
            SERP_PROD["SerpAPI<br/>Reverse Search"]
        end

        subgraph "Monitoring & Logging"
            SENTRY["Sentry<br/>Error Tracking"]
            DD["Datadog<br/>APM and Metrics"]
            ELK["ELK Stack<br/>Centralized Logging"]
        end
    end

    USERS["👥 End Users"] -->|HTTPS| CF
    CF --> LB1
    LB1 --> FE1
    LB1 --> FE2
    LB1 --> FEN

    FE1 -->|REST API| LB2
    FE2 -->|REST API| LB2
    FEN -->|REST API| LB2

    LB2 --> BE1
    LB2 --> BE2
    LB2 --> BEN

    BE1 --> SUPABASE
    BE2 --> SUPABASE
    BEN --> SUPABASE

    BE1 --> REDIS
    BE2 --> REDIS
    BEN --> REDIS

    BE1 --> S3
    BE2 --> S3
    BEN --> S3

    BE1 -.-> GROQ_PROD
    BE1 -.-> SIGHT_PROD
    BE1 -.-> SERP_PROD

    FE1 --> SENTRY
    BE1 --> SENTRY
    BE1 --> DD
    BE1 --> ELK

    classDef cdn fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef app fill:#10b981,stroke:#059669,color:#fff
    classDef data fill:#f59e0b,stroke:#d97706,color:#fff
    classDef external fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef monitor fill:#ec4899,stroke:#db2777,color:#fff

    class CF cdn
    class LB1,LB2,FE1,FE2,FEN,BE1,BE2,BEN app
    class SUPABASE,REDIS,S3 data
    class GROQ_PROD,SIGHT_PROD,SERP_PROD external
    class SENTRY,DD,ELK monitor
```

---

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Layer 1: Network Security"
            WAF["Web Application Firewall<br/>DDoS Protection Rate Limiting"]
            VPC["Virtual Private Cloud<br/>Network Isolation"]
        end

        subgraph "Layer 2: Application Security"
            HTTPS["HTTPS TLS 1.3<br/>Encrypted Transport"]
            CORS["CORS Configuration<br/>Origin Validation"]
            JWT["JWT Authentication<br/>Token-based Auth"]
            RBAC["Role-Based Access Control<br/>Compliance Officer RM"]
        end

        subgraph "Layer 3: Data Security"
            ENC_REST["Encryption at Rest<br/>Database Encryption"]
            ENC_TRANSIT["Encryption in Transit<br/>API Communication"]
            PII_MASK["PII Masking<br/>Sensitive Data Protection"]
        end

        subgraph "Layer 4: API Security"
            API_KEY["API Key Management<br/>External Services"]
            RATE_LIMIT["Rate Limiting<br/>Per User IP"]
            INPUT_VAL["Input Validation<br/>Pydantic Schemas"]
        end

        subgraph "Layer 5: Audit & Compliance"
            AUDIT_LOG["Complete Audit Trail<br/>All User Actions"]
            ALERT_MON["Alert Monitoring<br/>Suspicious Activity"]
            COMPLIANCE["Compliance Reports<br/>FINMA Requirements"]
        end
    end

    USER["👤 End User"] --> WAF
    WAF --> VPC
    VPC --> HTTPS
    HTTPS --> CORS
    CORS --> JWT
    JWT --> RBAC
    RBAC --> APP["Application"]

    APP --> ENC_TRANSIT
    APP --> INPUT_VAL
    APP --> RATE_LIMIT
    APP --> AUDIT_LOG

    APP --> DB[("Database")]
    DB --> ENC_REST
    DB --> PII_MASK

    APP --> EXT_API["External APIs"]
    EXT_API --> API_KEY

    AUDIT_LOG --> ALERT_MON
    ALERT_MON --> COMPLIANCE

    classDef network fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef app fill:#10b981,stroke:#059669,color:#fff
    classDef data fill:#f59e0b,stroke:#d97706,color:#fff
    classDef api fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef audit fill:#ec4899,stroke:#db2777,color:#fff

    class WAF,VPC network
    class HTTPS,CORS,JWT,RBAC app
    class ENC_REST,ENC_TRANSIT,PII_MASK data
    class API_KEY,RATE_LIMIT,INPUT_VAL api
    class AUDIT_LOG,ALERT_MON,COMPLIANCE audit
```

---

## Summary

This comprehensive system architecture diagram covers:

1. **Complete System Overview**: All layers from client to external services
2. **Data Flow Diagrams**: Alert investigation, document corroboration, real-time updates, and recommendations
3. **Component Interaction**: How frontend components work together
4. **Technology Stack**: Complete tech map
5. **Deployment Architecture**: Production-ready infrastructure
6. **Security Architecture**: Multi-layered security approach

The Julius Baer AML Platform is a sophisticated, production-ready system with:
- **Dual-purpose backend**: Alert management + Document corroboration
- **Multi-agent AI system**: 3 specialized agents with orchestration
- **Comprehensive document analysis**: OCR, validation, forensics, risk scoring
- **Real-time capabilities**: WebSocket integration
- **Professional UI**: Two distinct dashboards for different user roles
- **Scalable architecture**: Ready for horizontal scaling
- **Security-first design**: Multi-layered security approach
- **External API ready**: 7+ integrations prepared
