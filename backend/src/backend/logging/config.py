"""Logging configuration for Speed-Run backend."""

import logging
import sys
import json
from pathlib import Path
from datetime import datetime
from typing import Optional
import contextvars

from backend.config import settings

# Context variable for request ID tracking
request_id_ctx = contextvars.ContextVar('request_id', default=None)


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON."""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add request ID if available
        request_id = request_id_ctx.get()
        if request_id:
            log_data["request_id"] = request_id

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields from record.__dict__
        # Skip standard attributes and private attributes
        standard_attrs = {
            'name', 'msg', 'args', 'created', 'filename', 'funcName', 'levelname',
            'levelno', 'lineno', 'module', 'msecs', 'message', 'pathname', 'process',
            'processName', 'relativeCreated', 'thread', 'threadName', 'exc_info',
            'exc_text', 'stack_info', 'taskName'
        }
        extra_fields = {
            k: v for k, v in record.__dict__.items()
            if k not in standard_attrs and not k.startswith('_')
        }
        if extra_fields:
            log_data.update(extra_fields)

        return json.dumps(log_data)


class ColoredFormatter(logging.Formatter):
    """Colored formatter for console output."""

    # ANSI color codes
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[35m',   # Magenta
    }
    RESET = '\033[0m'
    BOLD = '\033[1m'

    def format(self, record: logging.LogRecord) -> str:
        """Format log record with colors."""
        # Get color for log level
        color = self.COLORS.get(record.levelname, self.RESET)

        # Format timestamp
        timestamp = datetime.fromtimestamp(record.created).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]

        # Get request ID if available
        request_id = request_id_ctx.get()
        request_id_str = f" [{request_id[:8]}]" if request_id else ""

        # Build log message
        log_msg = (
            f"{color}{self.BOLD}[{record.levelname}]{self.RESET} "
            f"{timestamp}{request_id_str} "
            f"{color}{record.name}{self.RESET} - "
            f"{record.getMessage()}"
        )

        # Add extra fields
        standard_attrs = {
            'name', 'msg', 'args', 'created', 'filename', 'funcName', 'levelname',
            'levelno', 'lineno', 'module', 'msecs', 'message', 'pathname', 'process',
            'processName', 'relativeCreated', 'thread', 'threadName', 'exc_info',
            'exc_text', 'stack_info', 'taskName'
        }
        extra_fields = {
            k: v for k, v in record.__dict__.items()
            if k not in standard_attrs and not k.startswith('_')
        }
        if extra_fields:
            extra_str = " ".join([f"{k}={v}" for k, v in extra_fields.items()])
            log_msg += f" [{extra_str}]"

        # Add location info for warnings and errors
        if record.levelno >= logging.WARNING:
            log_msg += f" ({record.filename}:{record.lineno})"

        # Add exception info if present
        if record.exc_info:
            log_msg += f"\n{self.formatException(record.exc_info)}"

        return log_msg


def setup_logging(
    log_level: Optional[str] = None,
    log_file: Optional[str] = None,
    enable_json_logs: bool = False,
) -> None:
    """
    Setup logging configuration for the application.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Path to log file (optional)
        enable_json_logs: Enable JSON structured logging (default: False for dev, True for prod)
    """
    # Get log level from settings or parameter
    log_level = log_level or settings.LOG_LEVEL
    log_file = log_file or settings.LOG_FILE

    # Convert string level to logging constant
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    # Create root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Remove existing handlers
    root_logger.handlers.clear()

    # Console handler (always enabled)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(numeric_level)

    if enable_json_logs:
        # Use JSON formatter for production
        console_handler.setFormatter(JSONFormatter())
    else:
        # Use colored formatter for development
        console_handler.setFormatter(ColoredFormatter())

    root_logger.addHandler(console_handler)

    # File handler (optional)
    if log_file:
        # Create log directory if it doesn't exist
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        # Create file handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(numeric_level)

        # Always use JSON format for file logs
        file_handler.setFormatter(JSONFormatter())

        root_logger.addHandler(file_handler)

        root_logger.info(f"Logging to file: {log_file}")

    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)

    root_logger.info(f"Logging initialized with level: {log_level}")


class StructuredLogger(logging.LoggerAdapter):
    """Logger adapter that supports structured logging with keyword arguments."""

    def process(self, msg, kwargs):
        """Process log message to handle keyword arguments as extra data."""
        # Extract keyword arguments that aren't standard logging parameters
        standard_params = {'exc_info', 'stack_info', 'stacklevel', 'extra'}
        extra_data = {k: v for k, v in kwargs.items() if k not in standard_params}

        if extra_data:
            # Move extra data to the 'extra' parameter
            existing_extra = kwargs.get('extra', {})
            existing_extra.update(extra_data)
            kwargs['extra'] = existing_extra

            # Remove the individual keyword arguments
            for k in list(extra_data.keys()):
                kwargs.pop(k, None)

        return msg, kwargs


def get_logger(name: str) -> StructuredLogger:
    """
    Get a structured logger instance that supports keyword arguments.

    Args:
        name: Logger name (typically __name__)

    Returns:
        Configured structured logger instance

    Example:
        logger = get_logger(__name__)
        logger.info("User logged in", user_id=123, ip_address="192.168.1.1")
    """
    base_logger = logging.getLogger(name)
    return StructuredLogger(base_logger, {})


def set_request_id(request_id: str) -> None:
    """Set request ID for the current context."""
    request_id_ctx.set(request_id)


def get_request_id() -> Optional[str]:
    """Get request ID from the current context."""
    return request_id_ctx.get()


def clear_request_id() -> None:
    """Clear request ID from the current context."""
    request_id_ctx.set(None)
