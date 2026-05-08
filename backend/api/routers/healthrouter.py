from fastapi.routing import APIRouter
from api.config.logger import get_logger
router=APIRouter()
logger=get_logger(__name__)
@router.get("/health")
async def health():
    """
    This function is used to check if the API is running.
    
    Returns:
        dict: Dictionary containing the message
    """
    logger.info("Health check")
    return {"message": "NL2SQL System API is running."}