import os
from dotenv import load_dotenv
from api.llm.get_llm import get_llm
from fastapi.routing import APIRouter
from api.llm.get_agent import get_agent
from api.config.logger import get_logger
router=APIRouter()
logger=get_logger(__name__)
@router.post("/api/refresh")
async def refresh_credentials():
    """
    This function is used to refresh the credentials.
    
    Returns:
        None
    """
    try:
        load_dotenv(override=True)          # reload .env
        get_llm.cache_clear()               # clear LLM cache
        get_agent.cache_clear()             # clear agent cache
        logger.info("✅ Credentials refreshed!")
        logger.info("KEY VALID:", os.getenv("GOOGLE_API_KEY") is not None)
        return {"message":"Credentials refreshed successfully"}
    except Exception as e:
        logger.error("❌ Error refreshing credentials:", e)
        return {"message":"Credentials refreshed failed"}
