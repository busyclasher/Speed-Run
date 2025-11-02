"""
Unit tests for CompressionProfileService.

Tests compression profile detection for various platforms (WhatsApp, Instagram, etc.).
"""

import pytest
from backend.services.image_analysis.compression_profiler import CompressionProfileService
from backend.schemas.image_analysis import CompressionProfile


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def profiler():
    """Create CompressionProfileService instance."""
    return CompressionProfileService()


# ============================================================================
# Initialization Tests
# ============================================================================


@pytest.mark.unit
def test_compression_profiler_initializes():
    """Test CompressionProfileService initializes correctly."""
    profiler = CompressionProfileService()
    assert profiler is not None
    assert hasattr(profiler, 'PROFILES')
    assert len(profiler.PROFILES) >= 5  # At least 5 profiles defined


@pytest.mark.unit
def test_compression_profiler_has_correct_profiles():
    """Test compression profiler has all expected profiles."""
    profiler = CompressionProfileService()
    expected_profiles = [
        'whatsapp_low',
        'instagram',
        'facebook',
        'twitter',
        'original_camera'
    ]
    for profile in expected_profiles:
        assert profile in profiler.PROFILES
        assert 'range' in profiler.PROFILES[profile]
        assert 'typical_size' in profiler.PROFILES[profile]
        assert 'message' in profiler.PROFILES[profile]
        assert 'description' in profiler.PROFILES[profile]


# ============================================================================
# WhatsApp Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_whatsapp_with_size_match(profiler):
    """Test WhatsApp detection with matching size - should be HIGH confidence."""
    # WhatsApp: ELA range (10, 50), typical size (1280, 1280)
    ela_variance = 30.0  # Within range
    image_size = (1280, 1280)  # Exact match

    profiles = await profiler.detect_profile(ela_variance, image_size)

    assert len(profiles) > 0
    whatsapp_profile = next((p for p in profiles if p.profile == 'whatsapp_low'), None)
    assert whatsapp_profile is not None
    assert whatsapp_profile.confidence == 'HIGH'
    assert whatsapp_profile.size_match is True
    assert 'WhatsApp' in whatsapp_profile.message


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_whatsapp_without_size_match(profiler):
    """Test WhatsApp detection without size match - should be MEDIUM confidence."""
    ela_variance = 30.0  # Within WhatsApp range (10, 50)
    image_size = (2000, 2000)  # Outside WhatsApp typical size

    profiles = await profiler.detect_profile(ela_variance, image_size)

    assert len(profiles) > 0
    whatsapp_profile = next((p for p in profiles if p.profile == 'whatsapp_low'), None)
    assert whatsapp_profile is not None
    assert whatsapp_profile.confidence == 'MEDIUM'
    assert whatsapp_profile.size_match is False


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_whatsapp_edge_of_range(profiler):
    """Test WhatsApp detection at edge of ELA range."""
    # Test lower bound
    profiles_low = await profiler.detect_profile(10.0, (1280, 1280))
    assert any(p.profile == 'whatsapp_low' for p in profiles_low)

    # Test upper bound
    profiles_high = await profiler.detect_profile(50.0, (1280, 1280))
    assert any(p.profile == 'whatsapp_low' for p in profiles_high)


# ============================================================================
# Instagram Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_instagram_with_size_match(profiler):
    """Test Instagram detection with matching size - should be HIGH confidence."""
    # Instagram: ELA range (80, 180), typical size (1080, 1080)
    ela_variance = 130.0  # Within range
    image_size = (1080, 1080)  # Exact match

    profiles = await profiler.detect_profile(ela_variance, image_size)

    assert len(profiles) > 0
    instagram_profile = next((p for p in profiles if p.profile == 'instagram'), None)
    assert instagram_profile is not None
    assert instagram_profile.confidence == 'HIGH'
    assert instagram_profile.size_match is True
    assert 'Instagram' in instagram_profile.message


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_instagram_with_tolerance(profiler):
    """Test Instagram detection with size within 50% tolerance."""
    ela_variance = 130.0
    # Size within 50% tolerance of 1080x1080
    image_size = (1000, 1000)  # Within tolerance

    profiles = await profiler.detect_profile(ela_variance, image_size)

    instagram_profile = next((p for p in profiles if p.profile == 'instagram'), None)
    assert instagram_profile is not None
    assert instagram_profile.confidence == 'HIGH'
    assert instagram_profile.size_match is True


# ============================================================================
# Facebook Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_facebook_with_size_match(profiler):
    """Test Facebook detection with matching size."""
    # Facebook: ELA range (120, 280), typical size (2048, 2048)
    ela_variance = 200.0
    image_size = (2048, 2048)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    facebook_profile = next((p for p in profiles if p.profile == 'facebook'), None)
    assert facebook_profile is not None
    assert facebook_profile.confidence == 'HIGH'
    assert 'Facebook' in facebook_profile.message


# ============================================================================
# Twitter Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_twitter_with_size_match(profiler):
    """Test Twitter detection with matching size."""
    # Twitter: ELA range (60, 160), typical size (1200, 675)
    ela_variance = 110.0
    image_size = (1200, 675)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    twitter_profile = next((p for p in profiles if p.profile == 'twitter'), None)
    assert twitter_profile is not None
    assert twitter_profile.confidence == 'HIGH'
    assert 'Twitter' in twitter_profile.message


# ============================================================================
# Original Camera Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_original_camera(profiler):
    """Test original camera JPEG detection."""
    # Original Camera: ELA range (150, 450), typical size (4000, 3000)
    ela_variance = 300.0
    image_size = (4000, 3000)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    camera_profile = next((p for p in profiles if p.profile == 'original_camera'), None)
    assert camera_profile is not None
    assert camera_profile.confidence == 'HIGH'
    assert 'Original Camera' in camera_profile.message or 'Camera' in camera_profile.message


# ============================================================================
# Multiple Profile Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_multiple_profiles(profiler):
    """Test detection when ELA variance matches multiple profiles."""
    # ELA 150 matches: Instagram (80-180), Facebook (120-280), and Original Camera (150-450)
    ela_variance = 150.0
    image_size = (1500, 1500)  # Size doesn't match any perfectly

    profiles = await profiler.detect_profile(ela_variance, image_size)

    # Should detect multiple profiles
    assert len(profiles) >= 2
    profile_names = [p.profile for p in profiles]
    # At least 2 of these should match
    matching_count = sum(1 for name in profile_names if name in ['instagram', 'facebook', 'original_camera'])
    assert matching_count >= 2


@pytest.mark.unit
@pytest.mark.asyncio
async def test_confidence_sorting(profiler):
    """Test that profiles are sorted by confidence (HIGH before MEDIUM)."""
    # Create scenario where one profile has HIGH confidence and another has MEDIUM
    ela_variance = 30.0  # WhatsApp range
    image_size = (1280, 1280)  # WhatsApp size - HIGH confidence

    profiles = await profiler.detect_profile(ela_variance, image_size)

    if len(profiles) > 1:
        # First profile should have HIGH confidence (if any have HIGH)
        high_confidence_profiles = [p for p in profiles if p.confidence == 'HIGH']
        if high_confidence_profiles:
            assert profiles[0].confidence == 'HIGH'


# ============================================================================
# No Match Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_no_match(profiler):
    """Test detection when ELA variance doesn't match any profile."""
    # ELA variance outside all ranges
    ela_variance = 5.0  # Too low for any profile
    image_size = (800, 600)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    assert len(profiles) == 0


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_very_high_ela(profiler):
    """Test detection with very high ELA variance (no match)."""
    ela_variance = 1000.0  # Way outside all ranges
    image_size = (1920, 1080)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    assert len(profiles) == 0


# ============================================================================
# Social Media Detection Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_whatsapp(profiler):
    """Test social media detection with WhatsApp profile."""
    profiles = [
        CompressionProfile(
            profile='whatsapp_low',
            message='WhatsApp Compression',
            confidence='HIGH',
            size_match=True,
            ela_range=(10, 50),
            typical_size=(1280, 1280)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is True


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_instagram(profiler):
    """Test social media detection with Instagram profile."""
    profiles = [
        CompressionProfile(
            profile='instagram',
            message='Instagram Compression',
            confidence='HIGH',
            size_match=True,
            ela_range=(80, 180),
            typical_size=(1080, 1080)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is True


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_facebook(profiler):
    """Test social media detection with Facebook profile."""
    profiles = [
        CompressionProfile(
            profile='facebook',
            message='Facebook Compression',
            confidence='HIGH',
            size_match=True,
            ela_range=(120, 280),
            typical_size=(2048, 2048)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is True


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_twitter(profiler):
    """Test social media detection with Twitter profile."""
    profiles = [
        CompressionProfile(
            profile='twitter',
            message='Twitter Compression',
            confidence='HIGH',
            size_match=True,
            ela_range=(60, 160),
            typical_size=(1200, 675)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is True


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_not_social_media_compressed_camera(profiler):
    """Test social media detection with camera profile (should be False)."""
    profiles = [
        CompressionProfile(
            profile='original_camera',
            message='Original Camera JPEG',
            confidence='HIGH',
            size_match=True,
            ela_range=(150, 450),
            typical_size=(4000, 3000)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is False


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_empty(profiler):
    """Test social media detection with empty profiles list."""
    profiles = []

    result = await profiler.is_social_media_compressed(profiles)
    assert result is False


@pytest.mark.unit
@pytest.mark.asyncio
async def test_is_social_media_compressed_mixed(profiler):
    """Test social media detection with mixed profiles (should be True if any social media)."""
    profiles = [
        CompressionProfile(
            profile='instagram',
            message='Instagram Compression',
            confidence='HIGH',
            size_match=True,
            ela_range=(80, 180),
            typical_size=(1080, 1080)
        ),
        CompressionProfile(
            profile='original_camera',
            message='Original Camera JPEG',
            confidence='MEDIUM',
            size_match=False,
            ela_range=(150, 450),
            typical_size=(4000, 3000)
        )
    ]

    result = await profiler.is_social_media_compressed(profiles)
    assert result is True


# ============================================================================
# Edge Cases and Error Handling Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_with_zero_ela(profiler):
    """Test detection with zero ELA variance."""
    ela_variance = 0.0
    image_size = (1280, 1280)

    profiles = await profiler.detect_profile(ela_variance, image_size)

    # Zero ELA is outside all ranges, should return empty
    assert len(profiles) == 0


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_with_very_small_image(profiler):
    """Test detection with very small image size."""
    ela_variance = 30.0  # WhatsApp range
    image_size = (100, 100)  # Very small

    profiles = await profiler.detect_profile(ela_variance, image_size)

    # Should detect WhatsApp ELA but size won't match
    whatsapp_profile = next((p for p in profiles if p.profile == 'whatsapp_low'), None)
    if whatsapp_profile:
        assert whatsapp_profile.confidence == 'MEDIUM'
        assert whatsapp_profile.size_match is False


@pytest.mark.unit
@pytest.mark.asyncio
async def test_detect_with_very_large_image(profiler):
    """Test detection with very large image size."""
    ela_variance = 300.0  # Camera range
    image_size = (8000, 6000)  # Very large

    profiles = await profiler.detect_profile(ela_variance, image_size)

    # Camera profile might match with size tolerance
    camera_profile = next((p for p in profiles if p.profile == 'original_camera'), None)
    assert camera_profile is not None


# ============================================================================
# Profile Information Tests
# ============================================================================


@pytest.mark.unit
def test_profile_information_completeness(profiler):
    """Test that all profiles have complete information."""
    for profile_name, profile_data in profiler.PROFILES.items():
        # Check required fields
        assert 'range' in profile_data
        assert 'typical_size' in profile_data
        assert 'message' in profile_data
        assert 'description' in profile_data

        # Check range format
        low, high = profile_data['range']
        assert isinstance(low, (int, float))
        assert isinstance(high, (int, float))
        assert low < high

        # Check typical_size format
        width, height = profile_data['typical_size']
        assert isinstance(width, int)
        assert isinstance(height, int)
        assert width > 0
        assert height > 0

        # Check message and description are non-empty strings
        assert isinstance(profile_data['message'], str)
        assert len(profile_data['message']) > 0
        assert isinstance(profile_data['description'], str)
        assert len(profile_data['description']) > 0
