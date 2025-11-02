"""
Unit tests for RiskScorer service.

Tests risk score calculation and recommendation generation.
"""

import pytest
from backend.services.risk_scorer import RiskScorer
from backend.schemas.validation import (
    ValidationSeverity,
    ValidationIssue,
    FormatValidationResult,
    StructureValidationResult,
    ContentValidationResult,
    ImageAnalysisResult,
)


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def risk_scorer():
    """Create Risk Scorer instance."""
    return RiskScorer()


@pytest.fixture
def clean_format_validation():
    """Format validation with no issues."""
    return FormatValidationResult(
        has_double_spacing=False,
        has_font_inconsistencies=False,
        has_formatting_issues=False,
        has_spelling_errors=False,
        spelling_error_count=0,
        has_indentation_issues=False,
        double_spacing_count=0,
        trailing_whitespace_count=0,
        issues=[],
    )


@pytest.fixture
def problematic_format_validation():
    """Format validation with multiple issues."""
    return FormatValidationResult(
        has_double_spacing=True,
        has_font_inconsistencies=True,
        has_formatting_issues=True,
        has_spelling_errors=True,
        spelling_error_count=25,
        has_indentation_issues=True,
        double_spacing_count=5,
        trailing_whitespace_count=10,
        issues=[
            ValidationIssue(
                severity=ValidationSeverity.HIGH,
                category="formatting",
                description="Multiple formatting inconsistencies",
            ),
            ValidationIssue(
                severity=ValidationSeverity.MEDIUM,
                category="spelling",
                description="Numerous spelling errors detected",
            ),
        ],
    )


@pytest.fixture
def clean_structure_validation():
    """Structure validation with good results."""
    return StructureValidationResult(
        is_complete=True,
        template_match_score=0.95,
        has_correct_headers=True,
        missing_sections=[],
        issues=[],
    )


@pytest.fixture
def incomplete_structure_validation():
    """Structure validation showing incomplete document."""
    return StructureValidationResult(
        is_complete=False,
        template_match_score=0.45,
        has_correct_headers=False,
        missing_sections=["footer", "signature"],
        issues=[
            ValidationIssue(
                severity=ValidationSeverity.CRITICAL,
                category="structure",
                description="Document incomplete - missing required sections",
            ),
        ],
    )


@pytest.fixture
def clean_content_validation():
    """Content validation with good quality."""
    return ContentValidationResult(
        quality_score=0.85,
        readability_score=65.0,
        word_count=500,
        has_sensitive_data=False,
        issues=[],
    )


@pytest.fixture
def problematic_content_validation():
    """Content validation with quality issues."""
    return ContentValidationResult(
        quality_score=0.35,
        readability_score=15.0,
        word_count=30,
        has_sensitive_data=True,
        issues=[
            ValidationIssue(
                severity=ValidationSeverity.HIGH,
                category="content",
                description="Low content quality and suspicious PII",
            ),
        ],
    )


@pytest.fixture
def clean_image_analysis():
    """Image analysis showing authentic image."""
    return ImageAnalysisResult(
        is_authentic=True,
        is_tampered=False,
        is_ai_generated=False,
        ai_detection_confidence=0.0,
        tampering_confidence=0.0,
        reverse_image_matches=0,
        metadata_issues=[],
        forensic_findings=[],
    )


@pytest.fixture
def tampered_image_analysis():
    """Image analysis showing tampered image."""
    return ImageAnalysisResult(
        is_authentic=False,
        is_tampered=True,
        is_ai_generated=False,
        ai_detection_confidence=0.0,
        tampering_confidence=0.92,
        reverse_image_matches=3,
        metadata_issues=[
            ValidationIssue(
                severity=ValidationSeverity.HIGH,
                category="metadata",
                description="EXIF data shows multiple edits",
            ),
        ],
        forensic_findings=[
            ValidationIssue(
                severity=ValidationSeverity.CRITICAL,
                category="forensic",
                description="Clone stamp tool usage detected",
            ),
        ],
    )


@pytest.fixture
def ai_generated_image_analysis():
    """Image analysis showing AI-generated image."""
    return ImageAnalysisResult(
        is_authentic=False,
        is_tampered=False,
        is_ai_generated=True,
        ai_detection_confidence=0.95,
        tampering_confidence=0.0,
        reverse_image_matches=0,
        metadata_issues=[],
        forensic_findings=[],
    )


# ============================================================================
# Initialization Tests
# ============================================================================


@pytest.mark.unit
def test_risk_scorer_initializes():
    """Test RiskScorer initializes correctly."""
    scorer = RiskScorer()
    assert scorer is not None
    assert scorer.WEIGHTS["format_validation"] == 0.15
    assert scorer.WEIGHTS["structure_validation"] == 0.25
    assert scorer.WEIGHTS["content_validation"] == 0.20
    assert scorer.WEIGHTS["image_analysis"] == 0.40


@pytest.mark.unit
def test_risk_scorer_has_correct_severity_scores():
    """Test severity score mappings."""
    scorer = RiskScorer()
    assert scorer.SEVERITY_SCORES[ValidationSeverity.LOW] == 10
    assert scorer.SEVERITY_SCORES[ValidationSeverity.MEDIUM] == 30
    assert scorer.SEVERITY_SCORES[ValidationSeverity.HIGH] == 60
    assert scorer.SEVERITY_SCORES[ValidationSeverity.CRITICAL] == 100


@pytest.mark.unit
def test_risk_scorer_has_correct_thresholds():
    """Test risk level thresholds."""
    scorer = RiskScorer()
    assert scorer.RISK_THRESHOLDS["low"] == 25
    assert scorer.RISK_THRESHOLDS["medium"] == 50
    assert scorer.RISK_THRESHOLDS["high"] == 75


# ============================================================================
# Calculate Risk Score Tests - All Clean
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_all_clean(
    risk_scorer,
    clean_format_validation,
    clean_structure_validation,
    clean_content_validation,
    clean_image_analysis,
):
    """Test risk calculation with all clean validations."""
    result = await risk_scorer.calculate_risk_score(
        format_validation=clean_format_validation,
        structure_validation=clean_structure_validation,
        content_validation=clean_content_validation,
        image_analysis=clean_image_analysis,
    )

    assert result.overall_score < 25  # Should be low risk
    assert result.risk_level == ValidationSeverity.LOW
    assert result.confidence > 0.5
    assert len(result.recommendations) > 0
    assert "ACCEPT" in result.recommendations[0]


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_with_no_validations(risk_scorer):
    """Test risk calculation with no validations provided."""
    result = await risk_scorer.calculate_risk_score()

    assert result.overall_score == 0.0
    assert result.risk_level == ValidationSeverity.LOW
    assert result.confidence == 0.5
    assert len(result.contributing_factors) == 0


# ============================================================================
# Calculate Risk Score Tests - Problematic Cases
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_with_tampered_image(
    risk_scorer,
    clean_format_validation,
    clean_structure_validation,
    clean_content_validation,
    tampered_image_analysis,
):
    """Test risk calculation with tampered image."""
    result = await risk_scorer.calculate_risk_score(
        format_validation=clean_format_validation,
        structure_validation=clean_structure_validation,
        content_validation=clean_content_validation,
        image_analysis=tampered_image_analysis,
    )

    # Tampered image should result in medium/high risk with normalization (weight=0.4)
    assert result.overall_score > 35  # Adjusted for normalization
    assert result.risk_level in [ValidationSeverity.MEDIUM, ValidationSeverity.HIGH, ValidationSeverity.CRITICAL]
    assert any("tampering" in factor["factor"].lower() for factor in result.contributing_factors)
    assert any("fraud" in rec.lower() for rec in result.recommendations)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_with_ai_generated_image(
    risk_scorer,
    clean_format_validation,
    clean_structure_validation,
    clean_content_validation,
    ai_generated_image_analysis,
):
    """Test risk calculation with AI-generated image."""
    result = await risk_scorer.calculate_risk_score(
        format_validation=clean_format_validation,
        structure_validation=clean_structure_validation,
        content_validation=clean_content_validation,
        image_analysis=ai_generated_image_analysis,
    )

    # AI-generated image should result in medium/high risk with normalization
    assert result.overall_score > 35  # Adjusted for normalization
    assert result.risk_level in [ValidationSeverity.MEDIUM, ValidationSeverity.HIGH, ValidationSeverity.CRITICAL]
    assert any("ai-generated" in factor["factor"].lower() or "ai generated" in factor["factor"].lower() for factor in result.contributing_factors)
    assert any("original document" in rec.lower() or "original" in rec.lower() for rec in result.recommendations)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_with_incomplete_structure(
    risk_scorer,
    clean_format_validation,
    incomplete_structure_validation,
    clean_content_validation,
    clean_image_analysis,
):
    """Test risk calculation with incomplete document structure."""
    result = await risk_scorer.calculate_risk_score(
        format_validation=clean_format_validation,
        structure_validation=incomplete_structure_validation,
        content_validation=clean_content_validation,
        image_analysis=clean_image_analysis,
    )

    # Incomplete document should raise risk
    assert result.overall_score > 25
    assert any("incomplete" in factor["factor"].lower() for factor in result.contributing_factors)
    # Check for missing sections - the factor message may vary
    assert any("missing" in factor["factor"].lower() or "section" in factor["factor"].lower() for factor in result.contributing_factors)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_calculate_risk_score_with_all_problematic(
    risk_scorer,
    problematic_format_validation,
    incomplete_structure_validation,
    problematic_content_validation,
    tampered_image_analysis,
):
    """Test risk calculation with all problematic validations."""
    result = await risk_scorer.calculate_risk_score(
        format_validation=problematic_format_validation,
        structure_validation=incomplete_structure_validation,
        content_validation=problematic_content_validation,
        image_analysis=tampered_image_analysis,
    )

    # All problematic should result in critical risk
    assert result.overall_score > 75
    assert result.risk_level == ValidationSeverity.CRITICAL
    assert len(result.contributing_factors) > 5
    assert "REJECT" in result.recommendations[0]


# ============================================================================
# Format Validation Scoring Tests
# ============================================================================


@pytest.mark.unit
def test_score_format_validation_clean(risk_scorer, clean_format_validation):
    """Test format validation scoring with clean result."""
    score, confidence, factors = risk_scorer._score_format_validation(clean_format_validation)

    assert score == 0.0
    assert confidence == 0.7  # Lower confidence for no issues
    assert len(factors) == 0


@pytest.mark.unit
def test_score_format_validation_with_spelling_errors(risk_scorer):
    """Test format validation scoring with spelling errors."""
    validation = FormatValidationResult(
        has_double_spacing=False,
        has_font_inconsistencies=False,
        has_formatting_issues=True,
        has_spelling_errors=True,
        spelling_error_count=15,
        has_indentation_issues=False,
        double_spacing_count=0,
        trailing_whitespace_count=0,
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_format_validation(validation)

    assert score == 20  # High spelling error count penalty
    assert confidence == 0.7
    assert any("spelling" in factor["factor"].lower() for factor in factors)


@pytest.mark.unit
def test_score_format_validation_with_indentation_issues(risk_scorer):
    """Test format validation scoring with indentation issues."""
    validation = FormatValidationResult(
        has_double_spacing=False,
        has_font_inconsistencies=False,
        has_formatting_issues=True,
        has_spelling_errors=False,
        spelling_error_count=0,
        has_indentation_issues=True,
        double_spacing_count=0,
        trailing_whitespace_count=0,
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_format_validation(validation)

    assert score == 10  # Indentation penalty
    assert any("indentation" in factor["factor"].lower() for factor in factors)


# ============================================================================
# Structure Validation Scoring Tests
# ============================================================================


@pytest.mark.unit
def test_score_structure_validation_clean(risk_scorer, clean_structure_validation):
    """Test structure validation scoring with clean result."""
    score, confidence, factors = risk_scorer._score_structure_validation(clean_structure_validation)

    # Perfect match (0.95) should have low score
    assert score < 10
    assert confidence == 0.85
    assert len(factors) == 0


@pytest.mark.unit
def test_score_structure_validation_low_template_match(risk_scorer):
    """Test structure validation scoring with low template match."""
    validation = StructureValidationResult(
        is_complete=True,
        template_match_score=0.5,
        has_correct_headers=True,
        missing_sections=[],
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_structure_validation(validation)

    # Low template match (0.5) should penalize (1.0 - 0.5) * 50 = 25
    assert score >= 25
    assert any("template match" in factor["factor"].lower() for factor in factors)


@pytest.mark.unit
def test_score_structure_validation_missing_sections(risk_scorer):
    """Test structure validation scoring with missing sections."""
    validation = StructureValidationResult(
        is_complete=False,
        template_match_score=0.8,
        has_correct_headers=True,
        missing_sections=["footer", "signature"],
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_structure_validation(validation)

    # Missing sections (2) * 15 = 30 + incomplete (40) + template penalty
    assert score >= 70
    assert any("missing" in factor["factor"].lower() for factor in factors)
    assert any("incomplete" in factor["factor"].lower() for factor in factors)


# ============================================================================
# Content Validation Scoring Tests
# ============================================================================


@pytest.mark.unit
def test_score_content_validation_clean(risk_scorer, clean_content_validation):
    """Test content validation scoring with clean result."""
    score, confidence, factors = risk_scorer._score_content_validation(clean_content_validation)

    # Quality 0.85 should result in low score: (1.0 - 0.85) * 30 = 4.5
    assert score < 10
    assert confidence == 0.8
    assert len(factors) == 0


@pytest.mark.unit
def test_score_content_validation_low_quality(risk_scorer):
    """Test content validation scoring with low quality score."""
    validation = ContentValidationResult(
        quality_score=0.3,
        readability_score=50.0,
        word_count=200,
        has_sensitive_data=False,
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_content_validation(validation)

    # Quality penalty: (1.0 - 0.3) * 30 = 21
    assert score >= 20
    assert any("quality" in factor["factor"].lower() for factor in factors)


@pytest.mark.unit
def test_score_content_validation_sensitive_data(risk_scorer):
    """Test content validation scoring with sensitive data."""
    validation = ContentValidationResult(
        quality_score=0.8,
        readability_score=60.0,
        word_count=300,
        has_sensitive_data=True,
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_content_validation(validation)

    # Sensitive data penalty: 25
    assert score >= 25
    assert any("sensitive" in factor["factor"].lower() or "pii" in factor["factor"].lower()
               for factor in factors)


@pytest.mark.unit
def test_score_content_validation_low_word_count(risk_scorer):
    """Test content validation scoring with suspiciously low word count."""
    validation = ContentValidationResult(
        quality_score=0.8,
        readability_score=60.0,
        word_count=30,
        has_sensitive_data=False,
        issues=[],
    )

    score, confidence, factors = risk_scorer._score_content_validation(validation)

    # Low word count penalty: 20
    assert score >= 20
    assert any("short" in factor["factor"].lower() and "30 words" in factor["factor"]
               for factor in factors)


# ============================================================================
# Image Analysis Scoring Tests
# ============================================================================


@pytest.mark.unit
def test_score_image_analysis_clean(risk_scorer, clean_image_analysis):
    """Test image analysis scoring with clean result."""
    score, confidence, factors = risk_scorer._score_image_analysis(clean_image_analysis)

    assert score == 0.0
    assert confidence == 0.7
    assert len(factors) == 0


@pytest.mark.unit
def test_score_image_analysis_tampered(risk_scorer, tampered_image_analysis):
    """Test image analysis scoring with tampered image."""
    score, confidence, factors = risk_scorer._score_image_analysis(tampered_image_analysis)

    # Tampering: 0.92 * 90 = 82.8
    assert score > 80
    assert confidence == 0.9
    assert any("tampering" in factor["factor"].lower() for factor in factors)


@pytest.mark.unit
def test_score_image_analysis_ai_generated(risk_scorer, ai_generated_image_analysis):
    """Test image analysis scoring with AI-generated image."""
    score, confidence, factors = risk_scorer._score_image_analysis(ai_generated_image_analysis)

    # AI-generated: 0.95 * 80 = 76
    assert score > 70
    assert confidence == 0.9
    assert any("ai-generated" in factor["factor"].lower() for factor in factors)


@pytest.mark.unit
def test_score_image_analysis_reverse_matches(risk_scorer):
    """Test image analysis scoring with reverse image matches."""
    analysis = ImageAnalysisResult(
        is_authentic=True,
        is_tampered=False,
        is_ai_generated=False,
        ai_detection_confidence=0.0,
        tampering_confidence=0.0,
        reverse_image_matches=10,
        metadata_issues=[],
        forensic_findings=[],
    )

    score, confidence, factors = risk_scorer._score_image_analysis(analysis)

    # 10 matches * 5 = 50 (capped at 50)
    assert score >= 50
    assert any("reverse image" in factor["factor"].lower() for factor in factors)


# ============================================================================
# Risk Level Categorization Tests
# ============================================================================


@pytest.mark.unit
def test_categorize_risk_level_low(risk_scorer):
    """Test risk level categorization for low scores."""
    assert risk_scorer._categorize_risk_level(0) == ValidationSeverity.LOW
    assert risk_scorer._categorize_risk_level(15) == ValidationSeverity.LOW
    assert risk_scorer._categorize_risk_level(24.9) == ValidationSeverity.LOW


@pytest.mark.unit
def test_categorize_risk_level_medium(risk_scorer):
    """Test risk level categorization for medium scores."""
    assert risk_scorer._categorize_risk_level(25) == ValidationSeverity.MEDIUM
    assert risk_scorer._categorize_risk_level(35) == ValidationSeverity.MEDIUM
    assert risk_scorer._categorize_risk_level(49.9) == ValidationSeverity.MEDIUM


@pytest.mark.unit
def test_categorize_risk_level_high(risk_scorer):
    """Test risk level categorization for high scores."""
    assert risk_scorer._categorize_risk_level(50) == ValidationSeverity.HIGH
    assert risk_scorer._categorize_risk_level(65) == ValidationSeverity.HIGH
    assert risk_scorer._categorize_risk_level(74.9) == ValidationSeverity.HIGH


@pytest.mark.unit
def test_categorize_risk_level_critical(risk_scorer):
    """Test risk level categorization for critical scores."""
    assert risk_scorer._categorize_risk_level(75) == ValidationSeverity.CRITICAL
    assert risk_scorer._categorize_risk_level(85) == ValidationSeverity.CRITICAL
    assert risk_scorer._categorize_risk_level(100) == ValidationSeverity.CRITICAL


# ============================================================================
# Recommendation Generation Tests
# ============================================================================


@pytest.mark.unit
def test_generate_recommendations_low_risk(risk_scorer):
    """Test recommendation generation for low risk score."""
    recommendations = risk_scorer._generate_recommendations(
        score=15,
        format_validation=None,
        structure_validation=None,
        content_validation=None,
        image_analysis=None,
    )

    assert len(recommendations) > 0
    assert "ACCEPT" in recommendations[0]
    assert "legitimate" in recommendations[0].lower()


@pytest.mark.unit
def test_generate_recommendations_high_risk(risk_scorer):
    """Test recommendation generation for high risk score."""
    recommendations = risk_scorer._generate_recommendations(
        score=80,
        format_validation=None,
        structure_validation=None,
        content_validation=None,
        image_analysis=None,
    )

    assert len(recommendations) > 0
    assert "REJECT" in recommendations[0]
    assert "critical" in recommendations[0].lower()


@pytest.mark.unit
def test_generate_recommendations_with_tampered_image(risk_scorer, tampered_image_analysis):
    """Test recommendations include tampering warnings."""
    recommendations = risk_scorer._generate_recommendations(
        score=80,
        format_validation=None,
        structure_validation=None,
        content_validation=None,
        image_analysis=tampered_image_analysis,
    )

    assert any("fraud investigation" in rec.lower() for rec in recommendations)
    assert any("original document" in rec.lower() for rec in recommendations)


@pytest.mark.unit
def test_generate_recommendations_with_incomplete_structure(risk_scorer, incomplete_structure_validation):
    """Test recommendations include missing sections."""
    recommendations = risk_scorer._generate_recommendations(
        score=60,
        format_validation=None,
        structure_validation=incomplete_structure_validation,
        content_validation=None,
        image_analysis=None,
    )

    assert any("missing sections" in rec.lower() for rec in recommendations)


@pytest.mark.unit
def test_generate_recommendations_limit_to_ten(risk_scorer, ai_generated_image_analysis, incomplete_structure_validation):
    """Test recommendations are limited to 10 items."""
    recommendations = risk_scorer._generate_recommendations(
        score=85,
        format_validation=None,
        structure_validation=incomplete_structure_validation,
        content_validation=None,
        image_analysis=ai_generated_image_analysis,
    )

    assert len(recommendations) <= 10
