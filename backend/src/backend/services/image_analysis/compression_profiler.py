"""
Compression profile detection service.

Single Responsibility: Detect which platform/source compressed an image.
"""

import asyncio
from typing import List, Tuple

from backend.schemas.image_analysis import CompressionProfile
from backend.logging import get_logger

logger = get_logger(__name__)


class CompressionProfileService:
    """
    Service for detecting compression profiles.

    Identifies which platform compressed the image (WhatsApp, Instagram, Facebook, etc.)
    based on ELA variance and image dimensions.
    """

    # Compression profile definitions
    PROFILES = {
        'whatsapp_low': {
            'range': (10, 50),
            'typical_size': (1280, 1280),
            'message': 'WhatsApp/Low Quality Compression',
            'description': 'Image compressed by WhatsApp or similar low-quality messenger'
        },
        'instagram': {
            'range': (80, 180),
            'typical_size': (1080, 1080),
            'message': 'Instagram Compression',
            'description': 'Image compressed by Instagram'
        },
        'facebook': {
            'range': (120, 280),
            'typical_size': (2048, 2048),
            'message': 'Facebook Compression',
            'description': 'Image compressed by Facebook'
        },
        'twitter': {
            'range': (60, 160),
            'typical_size': (1200, 675),
            'message': 'Twitter Compression',
            'description': 'Image compressed by Twitter'
        },
        'original_camera': {
            'range': (150, 450),
            'typical_size': (4000, 3000),
            'message': 'Original Camera JPEG',
            'description': 'Original image from digital camera with minimal processing'
        }
    }

    def __init__(self):
        """Initialize compression profile service."""
        logger.info("✨ Compression profile service initialized")

    async def detect_profile(
        self,
        ela_variance: float,
        image_size: Tuple[int, int]
    ) -> List[CompressionProfile]:
        """
        Detect compression profiles based on ELA variance and image dimensions.

        Args:
            ela_variance: ELA variance calculated from the image
            image_size: Image dimensions (width, height)

        Returns:
            List of matching CompressionProfile objects (sorted by confidence)
        """

        def _compute():
            matches = []

            for profile_name, profile in self.PROFILES.items():
                low, high = profile['range']

                # Check if ELA variance is within range
                if low <= ela_variance <= high:
                    typical_w, typical_h = profile['typical_size']
                    img_w, img_h = image_size

                    # Check size match (within 50% tolerance)
                    size_match = (
                        abs(img_w - typical_w) <= typical_w * 0.5
                        and abs(img_h - typical_h) <= typical_h * 0.5
                    )

                    # Calculate confidence
                    if size_match:
                        # Both ELA and size match -> HIGH confidence
                        confidence = 'HIGH'
                    else:
                        # Only ELA matches -> MEDIUM confidence
                        confidence = 'MEDIUM'

                    matches.append(
                        CompressionProfile(
                            profile=profile_name,
                            message=profile['message'],
                            confidence=confidence,
                            size_match=size_match,
                            ela_range=(low, high),
                            typical_size=(typical_w, typical_h)
                        )
                    )

            # Sort by confidence (HIGH first, then MEDIUM)
            matches.sort(key=lambda x: 0 if x.confidence == 'HIGH' else 1)

            return matches

        result = await asyncio.to_thread(_compute)

        if result:
            logger.info(
                f"📊 Detected {len(result)} compression profile(s): "
                f"{', '.join([f'{p.profile} ({p.confidence})' for p in result])}"
            )
        else:
            logger.info("📊 No matching compression profiles detected")

        return result

    async def is_social_media_compressed(self, profiles: List[CompressionProfile]) -> bool:
        """
        Check if image was compressed by social media platforms.

        Args:
            profiles: List of detected compression profiles

        Returns:
            True if any social media profile detected
        """
        social_media_profiles = {'whatsapp_low', 'instagram', 'facebook', 'twitter'}

        return any(
            p.profile in social_media_profiles
            for p in profiles
        )


__all__ = ["CompressionProfileService"]
