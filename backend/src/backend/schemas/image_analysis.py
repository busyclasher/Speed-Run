"""Image analysis result schemas for focused services."""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from backend.schemas.validation import ValidationIssue


class MetadataAnalysisResult(BaseModel):
    """Results from metadata analysis."""

    has_exif: bool = Field(description="Whether image has EXIF metadata")
    has_editing_software_signs: bool = Field(description="Whether editing software was detected in metadata")
    has_timestamp_inconsistencies: bool = Field(description="Whether timestamps are inconsistent")
    has_camera_info: bool = Field(description="Whether camera information is present")
    exif_data: Optional[Dict[str, Any]] = Field(None, description="Extracted EXIF data")
    issues: List[ValidationIssue] = Field(default=[], description="Metadata-related issues")


class AIDetectionResult(BaseModel):
    """Results from AI-generated image detection."""

    is_ai_generated: bool = Field(description="Whether image appears to be AI-generated")
    confidence: float = Field(ge=0.0, le=1.0, description="Detection confidence (0-1)")
    noise_level: float = Field(description="Image noise level")
    color_entropy: float = Field(description="Color distribution entropy")
    edge_consistency_score: float = Field(ge=0.0, le=1.0, description="Edge consistency score")
    has_ai_artifacts: bool = Field(description="Whether AI artifacts were detected")
    detection_factors: List[str] = Field(default=[], description="Factors that contributed to AI detection")


class TamperingDetectionResult(BaseModel):
    """Results from tampering detection."""

    is_tampered: bool = Field(description="Whether image shows signs of tampering")
    confidence: float = Field(ge=0.0, le=1.0, description="Tampering detection confidence (0-1)")
    ela_performed: bool = Field(description="Whether ELA analysis was performed")
    ela_anomaly_ratio: Optional[float] = Field(None, description="Ratio of anomalous pixels in ELA")
    ela_variance: Optional[float] = Field(None, description="ELA variance for compression profiling")
    has_cloned_regions: bool = Field(description="Whether cloned regions were detected")
    compression_consistent: bool = Field(description="Whether compression is consistent")
    issues: List[ValidationIssue] = Field(default=[], description="Tampering-related issues")


class CompressionProfile(BaseModel):
    """Detected compression profile (social media platform or camera)."""

    profile: str = Field(description="Profile name (e.g., 'whatsapp_low', 'instagram', 'facebook')")
    message: str = Field(description="Human-readable description of the profile")
    confidence: str = Field(description="Confidence level: 'HIGH', 'MEDIUM', or 'LOW'")
    size_match: bool = Field(description="Whether image size matches typical profile size")
    ela_range: tuple = Field(description="ELA variance range for this profile")
    typical_size: tuple = Field(description="Typical image dimensions for this profile")


class ForensicAnalysisResult(BaseModel):
    """Comprehensive forensic analysis result (orchestrated)."""

    is_authentic: bool = Field(description="Overall authenticity verdict")
    reverse_image_matches: int = Field(default=0, description="Number of reverse image search matches")
    metadata_analysis: MetadataAnalysisResult = Field(description="Metadata analysis results")
    ai_detection: AIDetectionResult = Field(description="AI detection results")
    tampering_detection: TamperingDetectionResult = Field(description="Tampering detection results")
    compression_profiles: List[CompressionProfile] = Field(
        default=[],
        description="Detected compression profiles (e.g., social media platforms)"
    )
    all_issues: List[ValidationIssue] = Field(default=[], description="All issues from all analyses")
    authenticity_score: float = Field(
        ge=0.0, le=1.0,
        description="Overall authenticity score (0=not authentic, 1=authentic)"
    )


__all__ = [
    "MetadataAnalysisResult",
    "AIDetectionResult",
    "TamperingDetectionResult",
    "CompressionProfile",
    "ForensicAnalysisResult",
]
