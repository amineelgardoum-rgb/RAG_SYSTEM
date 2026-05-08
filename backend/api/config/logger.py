import logging
import sys
import os
from pathlib import Path


def get_logger(name: str) -> logging.Logger:
    if not hasattr(get_logger, "_configured"):
        LOG_DIR = Path(__file__).resolve().parents[3] / "logs"
        os.makedirs(LOG_DIR, exist_ok=True)

        # Detailed formatter for files
        file_formatter = logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d): %(message)s"
        )
        
        # Cleaner formatter for console
        console_formatter = logging.Formatter(
            "%(asctime)s [%(levelname)s] %(message)s"
        )

        # File Handler for all logs
        file_handler = logging.FileHandler(LOG_DIR / "backend.log", encoding="utf-8")
        file_handler.setFormatter(file_formatter)
        file_handler.setLevel(logging.INFO)

        # File Handler for error logs only
        error_handler = logging.FileHandler(LOG_DIR / "errors.log", encoding="utf-8")
        error_handler.setFormatter(file_formatter)
        error_handler.setLevel(logging.ERROR)

        # File Handler for frontend logs
        frontend_handler = logging.FileHandler(LOG_DIR / "frontend.log", encoding="utf-8")
        frontend_handler.setFormatter(file_formatter)
        frontend_handler.setLevel(logging.INFO)

        # File Handler for frontend error logs
        frontend_error_handler = logging.FileHandler(LOG_DIR / "frontend_errors.log", encoding="utf-8")
        frontend_error_handler.setFormatter(file_formatter)
        frontend_error_handler.setLevel(logging.ERROR)

        # Console Handler for real-time monitoring
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(console_formatter)
        console_handler.setLevel(logging.INFO)

        root = logging.getLogger()
        root.setLevel(logging.INFO)
        root.handlers = []
        root.addHandler(file_handler)
        root.addHandler(error_handler)
        root.addHandler(console_handler)

        # Frontend Logger Configuration (Isolated)
        frontend_logger = logging.getLogger("frontend")
        frontend_logger.propagate = False  # Prevent frontend logs from going to root (backend.log)
        frontend_logger.addHandler(frontend_handler)
        frontend_logger.addHandler(frontend_error_handler)
        frontend_logger.addHandler(console_handler)

        # Sync uvicorn loggers with root configuration
        for uvicorn_logger_name in ("uvicorn", "uvicorn.access", "uvicorn.error"):
            ul = logging.getLogger(uvicorn_logger_name)
            ul.handlers = [] 
            ul.addHandler(file_handler)
            ul.addHandler(console_handler)
            ul.propagate = False

        # Capture logs from important libraries
        for lib_logger_name in ("langchain", "sqlalchemy", "openai", "google.generativeai"):
            lib_logger = logging.getLogger(lib_logger_name)
            lib_logger.addHandler(file_handler)
            lib_logger.addHandler(console_handler)
            lib_logger.setLevel(logging.WARNING) 

        get_logger._configured = True

    return logging.getLogger(name)