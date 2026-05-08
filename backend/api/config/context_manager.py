from contextlib import asynccontextmanager

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from api.llm.get_agent import get_agent
from api.config.logger import get_logger
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    This function is used to manage the lifespan of the application.

    Args:
        app: FastAPI app object
    """
    # startup
    logger.info("🚀 NL2SQL System API is starting up...")
    get_agent()  # warm up the agent on start
    yield
    # shutdown (add cleanup here if needed)
    logger.info("🛑 Server has been stopped...")
