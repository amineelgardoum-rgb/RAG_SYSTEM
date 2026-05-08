# pyrefly: ignore [missing-import]
from fastapi import FastAPI

# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware


def configure_cors(app: FastAPI):
    """
    This function is used to configure CORS.

    Args:
        app: FastAPI app object
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify the exact domain
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
