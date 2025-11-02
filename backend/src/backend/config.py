"""
Configuration settings for the application.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""

    APP_NAME: str = "Speed-Run AML Platform"
    VERSION: str = "1.0.0"

    # CORS settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Logging settings
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, AUDIT
    LOG_FILE: str = ""  # Optional: path to log file

    # Database settings (PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://speedrun:speedrun@localhost:5432/speedrun_aml"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_ECHO: bool = False  # Set to True for SQL query logging
    TESTING: bool = False  # Set to True in test environment

    # Redis settings (Cache)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 50
    REDIS_SOCKET_TIMEOUT: int = 5
    REDIS_SOCKET_CONNECT_TIMEOUT: int = 5
    CACHE_ENABLED: bool = True
    CACHE_DEFAULT_TTL: int = 3600  # 1 hour default

    # Cache TTLs (in seconds)
    CACHE_TTL_DOCUMENT_PARSING: int = 86400  # 24 hours
    CACHE_TTL_OCR: int = 172800  # 48 hours
    CACHE_TTL_IMAGE_ANALYSIS: int = 86400  # 24 hours
    CACHE_TTL_VALIDATION: int = 43200  # 12 hours

    # File upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".docx"]

    # OCR settings
    OCR_ENGINE: str = "docling"  # Using Docling for OCR and document parsing
    OCR_LANGUAGE: str = "en"  # All documents assumed to be in English

    # Temporary file storage
    UPLOAD_DIR: str = "/tmp/uploads"

    # Corroboration settings
    AUDIT_LOG_PATH: str = "/tmp/corroboration_audit"
    ENABLE_REVERSE_IMAGE_SEARCH: bool = False  # Set to True when API keys are configured
    ENABLE_ADVANCED_FORENSICS: bool = True

    # External API keys (optional - add to .env file)
    GOOGLE_VISION_API_KEY: str = ""
    TINEYE_API_KEY: str = ""
    TINEYE_API_SECRET: str = ""
    BING_VISUAL_SEARCH_KEY: str = ""
    HIVE_AI_API_TOKEN: str = ""
    SIGHTENGINE_API_USER: str = ""
    SIGHTENGINE_API_SECRET: str = ""

    # Risk scoring thresholds
    RISK_THRESHOLD_LOW: float = 25.0
    RISK_THRESHOLD_MEDIUM: float = 50.0
    RISK_THRESHOLD_HIGH: float = 75.0

    # Tampering Detection - ELA Thresholds
    TAMPERING_ELA_ANOMALY_THRESHOLD: float = 0.15
    TAMPERING_ELA_VERY_LOW: float = 15.0
    TAMPERING_ELA_LOW: float = 40.0
    TAMPERING_ELA_HIGH: float = 600.0
    TAMPERING_ELA_VERY_HIGH: float = 1000.0

    # Tampering Detection - Advanced Forensic Thresholds
    TAMPERING_NOISE_RATIO_MAX: float = 3.0
    TAMPERING_EDGE_CONSISTENCY_DIFF: int = 20
    TAMPERING_RESAMPLING_FFT_PEAK_RATIO: float = 8.0
    TAMPERING_COLOR_CORR_LOW: float = 0.85
    TAMPERING_MEDIAN_FILTER_THRESHOLD: float = 1.0

    # Tampering Detection - Clone Detection Thresholds
    TAMPERING_CLONE_REGION_SIZE: int = 32
    TAMPERING_CLONE_DUPLICATE_RATIO_THRESHOLD: float = 0.05
    TAMPERING_CLONE_DISTANCE_MIN_BLOCKS: int = 2

    # Tampering Detection - Compression Thresholds
    TAMPERING_COMPRESSION_VARIANCE_THRESHOLD: float = 1000.0

    # Risk Score Normalization (for social media compression)
    RISK_NORMALIZATION_REDUCTION_LOW: float = 0.4
    RISK_NORMALIZATION_REDUCTION_MEDIUM: float = 0.5
    RISK_NORMALIZATION_REDUCTION_HIGH: float = 0.65

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env that aren't in the model


settings = Settings()
