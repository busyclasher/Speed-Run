"""
Tampering detection service.

Single Responsibility: Detect image tampering using forensic techniques.
"""

import asyncio
import io
import hashlib
from pathlib import Path
from typing import List, Tuple

import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageStat

from backend.schemas.image_analysis import TamperingDetectionResult
from backend.schemas.validation import ValidationIssue, ValidationSeverity
from backend.logging import get_logger
from backend.config import settings

logger = get_logger(__name__)


class TamperingDetectionService:
    """
    Service for detecting image tampering.

    Responsibilities:
    - Error Level Analysis (ELA)
    - Detect cloned/copied regions
    - Check compression consistency
    - Identify manipulation indicators
    """

    def __init__(self):
        """Initialize tampering detection service with configuration from settings."""
        # ELA thresholds (loaded from config)
        self.ELA_ANOMALY_THRESHOLD = settings.TAMPERING_ELA_ANOMALY_THRESHOLD
        self.ELA_CONFIDENCE_MULTIPLIER = 3.0  # Fixed multiplier (not configurable)
        self.ELA_VERY_LOW = settings.TAMPERING_ELA_VERY_LOW
        self.ELA_LOW = settings.TAMPERING_ELA_LOW
        self.ELA_HIGH = settings.TAMPERING_ELA_HIGH
        self.ELA_VERY_HIGH = settings.TAMPERING_ELA_VERY_HIGH

        # Clone detection thresholds (loaded from config)
        self.CLONE_REGION_SIZE = settings.TAMPERING_CLONE_REGION_SIZE
        self.CLONE_DUPLICATE_RATIO_THRESHOLD = settings.TAMPERING_CLONE_DUPLICATE_RATIO_THRESHOLD
        self.CLONE_DISTANCE_MIN_BLOCKS = settings.TAMPERING_CLONE_DISTANCE_MIN_BLOCKS

        # Compression consistency threshold (loaded from config)
        self.COMPRESSION_VARIANCE_THRESHOLD = settings.TAMPERING_COMPRESSION_VARIANCE_THRESHOLD

        # Advanced forensic thresholds (loaded from config)
        self.NOISE_RATIO_MAX = settings.TAMPERING_NOISE_RATIO_MAX
        self.EDGE_CONSISTENCY_DIFF = settings.TAMPERING_EDGE_CONSISTENCY_DIFF
        self.RESAMPLING_FFT_PEAK_RATIO = settings.TAMPERING_RESAMPLING_FFT_PEAK_RATIO
        self.COLOR_CORR_LOW = settings.TAMPERING_COLOR_CORR_LOW
        self.MEDIAN_FILTER_THRESHOLD = settings.TAMPERING_MEDIAN_FILTER_THRESHOLD

        logger.info(
            "tampering_detection_service_initialized",
            ela_threshold=self.ELA_ANOMALY_THRESHOLD,
            clone_region_size=self.CLONE_REGION_SIZE,
            compression_threshold=self.COMPRESSION_VARIANCE_THRESHOLD,
        )

    async def detect(self, file_path: Path) -> TamperingDetectionResult:
        """
        Detect image tampering using multiple forensic techniques.

        Args:
            file_path: Path to the image file

        Returns:
            TamperingDetectionResult with comprehensive tampering analysis
        """
        logger.info(f"🔍 Starting comprehensive tampering detection: {file_path.name}")

        issues: List[ValidationIssue] = []

        # 1. Error Level Analysis (ELA)
        ela_result = await self._perform_ela(file_path)
        is_tampered_ela = ela_result["is_tampered"]
        ela_confidence = ela_result["confidence"]
        ela_anomaly_ratio = ela_result["anomaly_ratio"]
        issues.extend(ela_result["issues"])

        # 2. Load image for other checks
        image = await asyncio.to_thread(Image.open, file_path)
        if image.mode != "RGB":
            image = image.convert("RGB")
        img_array = await asyncio.to_thread(lambda: np.array(image))

        # 3. Clone detection
        has_clones = await self._detect_cloned_regions(img_array)
        if has_clones:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.HIGH,
                    description="Detected potentially cloned/copied regions in image",
                    details={"detection_method": "region_hashing"},
                )
            )

        # 4. Compression consistency
        compression_consistent = await self._check_compression_consistency(img_array)
        if not compression_consistent:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.MEDIUM,
                    description="Inconsistent compression levels detected across image",
                    details={"detection_method": "variance_analysis"},
                )
            )

        # 5. JPEG Quantization Analysis (NEW)
        quantization_result = await self._detect_jpeg_quantization(file_path)
        if quantization_result["has_anomaly"]:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.MEDIUM,
                    description=quantization_result["message"],
                    details=quantization_result["details"],
                )
            )

        # 6. FFT Resampling Detection (NEW)
        has_resampling = await self._detect_resampling_fft(img_array)
        if has_resampling:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.HIGH,
                    description="Resampling detected: Periodic patterns in frequency domain suggest image resizing",
                    details={"detection_method": "fft_analysis"},
                )
            )

        # 7. Median Filter Detection (NEW)
        has_median_filter = await self._detect_median_filter(image)
        if has_median_filter:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.MEDIUM,
                    description="Median filter detected: Strong smoothing/filtering applied to image",
                    details={"detection_method": "median_filter_analysis"},
                )
            )

        # 8. Color Channel Correlation (NEW)
        color_corr = await self._calc_color_correlation(img_array)
        if color_corr < self.COLOR_CORR_LOW:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.MEDIUM,
                    description=f"Low color channel correlation detected: {color_corr:.3f}",
                    details={"correlation": color_corr, "detection_method": "color_correlation"},
                )
            )

        # 9. Noise Ratio Analysis (NEW)
        noise_ratio = await self._calc_noise_ratio(image)
        if noise_ratio > self.NOISE_RATIO_MAX:
            issues.append(
                ValidationIssue(
                    category="forensic",
                    severity=ValidationSeverity.MEDIUM,
                    description=f"Inconsistent noise patterns detected: ratio={noise_ratio:.2f}",
                    details={"noise_ratio": noise_ratio, "detection_method": "noise_analysis"},
                )
            )

        # 10. Edge Consistency (NEW)
        edge_issues = await self._check_edge_consistency(image)
        issues.extend(edge_issues)

        # Overall tampering verdict
        is_tampered = (
            is_tampered_ela
            or has_clones
            or not compression_consistent
            or has_resampling
            or has_median_filter
            or color_corr < self.COLOR_CORR_LOW
            or noise_ratio > self.NOISE_RATIO_MAX
            or len(edge_issues) > 0
        )

        # Calculate overall confidence
        tampering_indicators = sum([
            is_tampered_ela,
            has_clones,
            not compression_consistent,
            has_resampling,
            has_median_filter,
            color_corr < self.COLOR_CORR_LOW,
            noise_ratio > self.NOISE_RATIO_MAX,
            len(edge_issues) > 0
        ])

        if is_tampered_ela:
            confidence = ela_confidence
        elif tampering_indicators >= 3:
            confidence = 0.85  # High confidence if multiple indicators
        elif tampering_indicators >= 2:
            confidence = 0.7  # Medium-high confidence
        elif tampering_indicators >= 1:
            confidence = 0.5  # Medium confidence
        else:
            confidence = 0.0

        result = TamperingDetectionResult(
            is_tampered=is_tampered,
            confidence=round(confidence, 3),
            ela_performed=ela_result["ela_performed"],
            ela_anomaly_ratio=ela_anomaly_ratio,
            ela_variance=ela_result.get("ela_variance"),
            has_cloned_regions=has_clones,
            compression_consistent=compression_consistent,
            issues=issues,
        )

        status_icon = "⚠️  TAMPERED" if is_tampered else "✅ AUTHENTIC"
        logger.info(
            f"🔬 Tampering detection complete: {status_icon} "
            f"(confidence: {confidence:.2f}, {len(issues)} issues, {tampering_indicators} indicators)"
        )

        return result

    async def _perform_ela(self, file_path: Path) -> dict:
        """
        Perform Error Level Analysis (ELA).

        ELA identifies areas with different compression levels, indicating manipulation.
        """

        def _compute_ela():
            try:
                # Load original image
                original = Image.open(file_path)

                # Convert to RGB
                if original.mode != "RGB":
                    original = original.convert("RGB")

                # Save at 90% quality
                temp_buffer = io.BytesIO()
                original.save(temp_buffer, format="JPEG", quality=90)
                temp_buffer.seek(0)

                # Reload compressed image
                compressed = Image.open(temp_buffer)

                # Calculate difference (ELA)
                ela_image = ImageChops.difference(original, compressed)

                # Enhance to make differences more visible
                extrema = ela_image.getextrema()
                max_diff = max([ex[1] for ex in extrema])

                if max_diff == 0:
                    # No differences found
                    return {
                        "ela_performed": True,
                        "is_tampered": False,
                        "confidence": 0.0,
                        "anomaly_ratio": None,
                        "issues": [],
                    }

                scale = 255.0 / max_diff
                ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)

                # Convert to numpy for analysis
                ela_array = np.array(ela_image)

                # Calculate statistics
                mean_error = np.mean(ela_array)
                std_error = np.std(ela_array)
                ela_variance = float(np.var(ela_array))  # For compression profiling

                # Detect anomalous regions (high error levels)
                threshold = mean_error + 2 * std_error
                anomalous_pixels = np.sum(ela_array > threshold)
                total_pixels = ela_array.size
                anomaly_ratio = anomalous_pixels / total_pixels

                # Determine tampering likelihood
                is_tampered = anomaly_ratio > self.ELA_ANOMALY_THRESHOLD

                # Calculate confidence
                confidence = min(anomaly_ratio * self.ELA_CONFIDENCE_MULTIPLIER, 1.0)

                issues = []
                if is_tampered:
                    issues.append(
                        ValidationIssue(
                            category="forensic",
                            severity=ValidationSeverity.CRITICAL,
                            description="Image shows signs of tampering (ELA analysis)",
                            details={
                                "anomaly_ratio": round(anomaly_ratio, 4),
                                "mean_error": round(float(mean_error), 2),
                                "detection_method": "error_level_analysis",
                            },
                        )
                    )

                return {
                    "ela_performed": True,
                    "is_tampered": is_tampered,
                    "confidence": confidence,
                    "anomaly_ratio": round(anomaly_ratio, 4) if anomaly_ratio else None,
                    "ela_variance": ela_variance,
                    "issues": issues,
                }

            except Exception as e:
                logger.warning("ela_analysis_failed", error=str(e))
                return {
                    "ela_performed": False,
                    "is_tampered": False,
                    "confidence": 0.0,
                    "anomaly_ratio": None,
                    "ela_variance": None,
                    "issues": [
                        ValidationIssue(
                            category="forensic",
                            severity=ValidationSeverity.LOW,
                            description=f"Could not perform ELA analysis: {str(e)}",
                        )
                    ],
                }

        return await asyncio.to_thread(_compute_ela)

    async def _detect_cloned_regions(self, img_array: np.ndarray) -> bool:
        """Detect cloned/copied regions using region hashing."""

        def _compute():
            height, width = img_array.shape[:2]
            region_size = self.CLONE_REGION_SIZE

            hashes = []
            for y in range(0, height - region_size, region_size):
                for x in range(0, width - region_size, region_size):
                    region = img_array[y : y + region_size, x : x + region_size]
                    region_hash = hashlib.md5(region.tobytes()).hexdigest()
                    hashes.append(region_hash)

            # Check for duplicate hashes
            unique_hashes = len(set(hashes))
            total_hashes = len(hashes)

            if total_hashes == 0:
                return False

            # Calculate duplicate ratio
            duplicate_ratio = 1 - (unique_hashes / total_hashes)

            # If more than threshold duplicates, might have cloned regions
            return duplicate_ratio > self.CLONE_DUPLICATE_RATIO_THRESHOLD

        return await asyncio.to_thread(_compute)

    async def _check_compression_consistency(self, img_array: np.ndarray) -> bool:
        """Check if compression is consistent across the image."""

        def _compute():
            height, width = img_array.shape[:2]

            # Divide image into quadrants
            quadrants = [
                img_array[: height // 2, : width // 2],
                img_array[: height // 2, width // 2 :],
                img_array[height // 2 :, : width // 2],
                img_array[height // 2 :, width // 2 :],
            ]

            # Calculate variance for each quadrant
            variances = [np.var(q) for q in quadrants]

            # Check if variances are similar
            variance_std = np.std(variances)

            # If standard deviation of variances is high, compression is inconsistent
            return variance_std < self.COMPRESSION_VARIANCE_THRESHOLD

        return await asyncio.to_thread(_compute)

    async def _detect_jpeg_quantization(self, file_path: Path) -> dict:
        """
        Analyze JPEG quantization tables to detect heavy recompression or social media processing.

        Returns:
            dict with 'has_anomaly', 'message', and 'details'
        """

        def _compute():
            try:
                img = Image.open(file_path)
                qtables = img.info.get('quantization', None)

                if not qtables:
                    return {"has_anomaly": False, "message": None, "details": {}}

                # Compute quantization statistics
                all_vals = []
                for q in qtables.values():
                    all_vals.extend(list(q))

                if not all_vals:
                    return {"has_anomaly": False, "message": None, "details": {}}

                avg_q = float(np.mean(all_vals))
                var_q = float(np.var(all_vals))

                # Heuristics for anomaly detection
                if avg_q > 40:
                    return {
                        "has_anomaly": True,
                        "message": f"HIGH_QUANTIZATION: avg={avg_q:.1f}, var={var_q:.1f}",
                        "details": {"avg_quantization": avg_q, "var_quantization": var_q}
                    }
                elif var_q < 20 and avg_q > 20:
                    return {
                        "has_anomaly": True,
                        "message": f"UNIFORM_QUANTIZATION_LOW_VAR: avg={avg_q:.1f}, var={var_q:.1f}",
                        "details": {"avg_quantization": avg_q, "var_quantization": var_q}
                    }

                return {"has_anomaly": False, "message": None, "details": {}}

            except Exception as e:
                logger.warning(f"jpeg_quantization_analysis_failed: {str(e)}")
                return {"has_anomaly": False, "message": None, "details": {}}

        return await asyncio.to_thread(_compute)

    async def _detect_resampling_fft(self, img_array: np.ndarray) -> bool:
        """
        Detect image resampling (resizing) using FFT analysis.

        Looks for periodic patterns in the frequency domain that indicate resampling.
        """

        def _compute():
            try:
                # Convert to grayscale for FFT
                if len(img_array.shape) == 3:
                    gray = np.mean(img_array, axis=2).astype(float)
                else:
                    gray = img_array.astype(float)

                # Reduce size for FFT performance
                h, w = gray.shape
                max_dim = 512
                if max(h, w) > max_dim:
                    from PIL import Image as PILImage
                    scale = max_dim / float(max(h, w))
                    new_h, new_w = int(h * scale), int(w * scale)
                    pil_img = PILImage.fromarray(gray.astype(np.uint8))
                    resized = pil_img.resize((new_w, new_h), PILImage.Resampling.LANCZOS)
                    gray = np.array(resized, dtype=float)

                # Compute 2D FFT
                f = np.fft.fft2(gray)
                fshift = np.fft.fftshift(f)
                magnitude = np.abs(fshift)

                # Analyze peaks away from DC (center)
                center = (magnitude.shape[0] // 2, magnitude.shape[1] // 2)
                r0 = 5

                # Zero out central region
                mag_no_dc = magnitude.copy()
                mag_no_dc[
                    center[0] - r0 : center[0] + r0 + 1,
                    center[1] - r0 : center[1] + r0 + 1
                ] = 0.0

                # Check for strong peaks
                flat = mag_no_dc.ravel()
                if flat.size < 50:
                    return False

                top_mean = float(np.mean(np.sort(flat)[-50:]))
                median_mag = float(np.median(flat))

                if median_mag <= 0:
                    return False

                ratio = top_mean / (median_mag + 1e-8)
                return ratio > self.RESAMPLING_FFT_PEAK_RATIO

            except Exception as e:
                logger.warning(f"fft_resampling_detection_failed: {str(e)}")
                return False

        return await asyncio.to_thread(_compute)

    async def _detect_median_filter(self, image: Image.Image) -> bool:
        """
        Detect if median filter was applied (common in image manipulation to remove noise/texture).
        """

        def _compute():
            try:
                gray = image.convert('L')
                # Apply median filter
                med = gray.filter(ImageFilter.MedianFilter(size=3))
                diff = ImageChops.difference(gray, med)
                stat = ImageStat.Stat(diff)
                mean_diff = stat.mean[0]
                # If very little difference, median filter likely applied
                return mean_diff < self.MEDIAN_FILTER_THRESHOLD
            except Exception as e:
                logger.warning(f"median_filter_detection_failed: {str(e)}")
                return False

        return await asyncio.to_thread(_compute)

    async def _calc_color_correlation(self, img_array: np.ndarray) -> float:
        """
        Calculate average correlation between R, G, B channels.

        Natural images have high color channel correlation. Low correlation indicates manipulation.
        """

        def _compute():
            try:
                if len(img_array.shape) != 3 or img_array.shape[2] != 3:
                    return 1.0  # Not RGB, skip

                r = img_array[..., 0].ravel().astype(float)
                g = img_array[..., 1].ravel().astype(float)
                b = img_array[..., 2].ravel().astype(float)

                def corr(a, b):
                    if np.std(a) < 1e-5 or np.std(b) < 1e-5:
                        return 1.0
                    return float(np.corrcoef(a, b)[0, 1])

                rg = corr(r, g)
                rb = corr(r, b)
                gb = corr(g, b)

                return float(np.mean([rg, rb, gb]))

            except Exception as e:
                logger.warning(f"color_correlation_calculation_failed: {str(e)}")
                return 1.0  # Default to no anomaly

        return await asyncio.to_thread(_compute)

    async def _calc_noise_ratio(self, image: Image.Image) -> float:
        """
        Calculate noise ratio across image regions.

        Tampering often creates inconsistent noise patterns. Returns max_noise / min_noise.
        """

        def _compute():
            try:
                width, height = image.size
                region_size = min(100, max(1, width // 4), max(1, height // 4))
                regions = []

                for y in range(0, max(1, height - region_size), region_size):
                    for x in range(0, max(1, width - region_size), region_size):
                        region = image.crop((x, y, x + region_size, y + region_size))
                        gray = region.convert('L')
                        blurred = gray.filter(ImageFilter.GaussianBlur(2))
                        noise = ImageChops.difference(gray, blurred)
                        stat = ImageStat.Stat(noise)
                        noise_level = stat.var[0] if stat.var else 0.0
                        regions.append(noise_level)

                if not regions:
                    return 0.0

                mx = max(regions)
                mn = min(regions) if min(regions) > 0 else 1e-5
                return mx / mn

            except Exception as e:
                logger.warning(f"noise_ratio_calculation_failed: {str(e)}")
                return 0.0

        return await asyncio.to_thread(_compute)

    async def _check_edge_consistency(self, image: Image.Image) -> List[ValidationIssue]:
        """
        Check edge consistency using multiple edge detectors.

        Inconsistencies indicate image splicing or manipulation.
        """

        def _compute():
            try:
                gray = image.convert('L')
                edges1 = gray.filter(ImageFilter.FIND_EDGES)
                edges2 = gray.filter(ImageFilter.EDGE_ENHANCE_MORE)

                stat1 = ImageStat.Stat(edges1)
                stat2 = ImageStat.Stat(edges2)

                edge_diff = abs(stat1.mean[0] - stat2.mean[0])

                if edge_diff > self.EDGE_CONSISTENCY_DIFF:
                    return [
                        ValidationIssue(
                            category="forensic",
                            severity=ValidationSeverity.MEDIUM,
                            description="Edge structures differ significantly between detectors",
                            details={"edge_difference": float(edge_diff)}
                        )
                    ]

                return []

            except Exception as e:
                logger.warning(f"edge_consistency_check_failed: {str(e)}")
                return []

        return await asyncio.to_thread(_compute)


__all__ = ["TamperingDetectionService"]
