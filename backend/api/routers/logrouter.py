from fastapi import APIRouter
from api.models.log_request import LogRequest
from api.config.logger import get_logger

router = APIRouter(prefix="/log", tags=["log"])

@router.post("")
async def receive_log(log_req: LogRequest):
    """
    Receive logs from the frontend and record them using the backend logger.
    """
    logger_name = f"frontend.{log_req.name}" if log_req.name != "frontend" else "frontend"
    logger = get_logger(logger_name)
    
    level = log_req.level.upper()
    message = log_req.message
    if log_req.metadata:
        message = f"{message} | Metadata: {log_req.metadata}"

    if level == "INFO":
        logger.info(message)
    elif level == "ERROR":
        logger.error(message)
    elif level == "WARNING" or level == "WARN":
        logger.warning(message)
    elif level == "DEBUG":
        logger.debug(message)
    else:
        logger.info(f"[{level}] {message}")
        
    return {"status": "success"}
