"""Logging middleware for FastAPI."""

import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from backend.logging import get_logger, set_request_id, clear_request_id

logger = get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests and responses."""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process each HTTP request and log details.

        Args:
            request: Incoming HTTP request
            call_next: Next middleware/handler in chain

        Returns:
            HTTP response
        """
        # Generate unique request ID
        request_id = str(uuid.uuid4())
        set_request_id(request_id)

        # Get client info
        client_host = request.client.host if request.client else "unknown"
        
        # Log request start
        start_time = time.time()
        logger.info(
            f"→ {request.method} {request.url.path}",
            extra={
                "extra_data": {
                    "method": request.method,
                    "path": request.url.path,
                    "query_params": dict(request.query_params),
                    "client_host": client_host,
                    "user_agent": request.headers.get("user-agent", "unknown"),
                }
            }
        )

        # Process request
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"← {request.method} {request.url.path} → {response.status_code} ({process_time:.3f}s)",
                extra={
                    "extra_data": {
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code,
                        "process_time": process_time,
                    }
                }
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except Exception as e:
            # Calculate processing time
            process_time = time.time() - start_time

            # Log error
            logger.error(
                f"✗ {request.method} {request.url.path} → ERROR ({process_time:.3f}s): {str(e)}",
                exc_info=True,
                extra={
                    "extra_data": {
                        "method": request.method,
                        "path": request.url.path,
                        "error": str(e),
                        "error_type": type(e).__name__,
                        "process_time": process_time,
                    }
                }
            )
            raise

        finally:
            # Clear request ID from context
            clear_request_id()
